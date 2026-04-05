import { useEffect, useMemo, useRef, useState } from 'react';
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  SortableContext,
} from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import boardApi from '../../../apis/boardApi';
import { mapOrder } from '../../../utils/sorts';
import CardDetailDialog from './CardDetailDialog';
import ConfirmDialog from './ConfirmDialog';
import RenameColumnDialog from './RenameColumnDialog';
import { LABEL_OPTIONS } from './constants';
import AddColumnComposer from './components/AddColumnComposer';
import BoardContentErrorBanner from './components/BoardContentErrorBanner';
import BoardContentLoading from './components/BoardContentLoading';
import CardDragOverlay from './components/CardDragOverlay';
import ColumnDragOverlay from './components/ColumnDragOverlay';
import SortableColumnItem from './components/SortableColumnItem';

const DRAG_ITEM_TYPE = {
  COLUMN: 'COLUMN',
  CARD: 'CARD',
  CARD_DROP_ZONE: 'CARD_DROP_ZONE',
};

const dragOverlayDropAnimation = {
  duration: 240,
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

// Chặn click "dư âm" ngay sau drag, tránh mở card detail ngoài ý muốn.
const BLOCK_CARD_CLICK_AFTER_DRAG_MS = 220;

const INITIAL_RENAME_DIALOG = {
  open: false,
  columnId: '',
  initialTitle: '',
};

const INITIAL_CONFIRM_DIALOG = {
  open: false,
  actionType: '',
  targetId: '',
  title: '',
  description: '',
  confirmLabel: 'Confirm',
};

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

/**
 * -------------------------
 * CARD DND FLOW (tổng quan)
 * -------------------------
 * 1) Drag source:
 *    - Card đăng ký draggable ở SortableCardItem (type: CARD).
 *    - Drop zone cuối cột/rỗng đăng ký ở CardDropZone (type: CARD_DROP_ZONE).
 *
 * 2) Trong lúc kéo:
 *    - DndContext gọi collisionDetectionStrategy(...) để chọn "over" hiện tại.
 *    - resolveCardDropTarget(...) chuyển "over" -> { targetColumnId, targetIndex }.
 *
 * 3) Kết thúc kéo:
 *    - handleCardDragEnd(...) tạo snapshot order mới bằng buildColumnsAfterCardMove(...).
 *    - setBoard optimistic trước để UI mượt.
 *    - gọi boardApi.moveCard(...) để đồng bộ server.
 */

// Tìm vị trí hiện tại của card trong toàn bộ columns (columnId + index).
const findCardLocation = (columns, cardId) => {
  for (const column of columns) {
    const cardIndex = column.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      return {
        columnId: column.id,
        cardIndex,
      };
    }
  }

  return null;
};

const findCardById = (columns, cardId) => {
  for (const column of columns) {
    const card = column.cards.find((item) => item.id === cardId);
    if (card) return card;
  }

  return null;
};

// So sánh order card giữa 2 snapshots để biết có thay đổi thật hay không.
const hasSameCardOrder = (prevColumns, nextColumns) =>
  prevColumns.every((column, index) => {
    const nextColumn = nextColumns[index];
    if (!nextColumn || nextColumn.id !== column.id) return false;

    const prevIds = column.cards.map((card) => card.id).join('|');
    const nextIds = nextColumn.cards.map((card) => card.id).join('|');
    return prevIds === nextIds;
  });

// Chuẩn hóa điểm drop của CARD thành { targetColumnId, targetIndex }.
// over có thể là CARD, CARD_DROP_ZONE hoặc COLUMN.
// Đây là hàm "then chốt" quyết định preview reorder có đúng cảm giác kéo hay không.
const resolveCardDropTarget = ({ active, over, columns }) => {
  if (!over) return null;

  const overData = over.data?.current;
  if (!overData) return null;

  if (overData.type === DRAG_ITEM_TYPE.CARD) {
    const targetColumn = columns.find((column) => column.id === overData.columnId);
    if (!targetColumn) return null;

    const overCardIndex = targetColumn.cards.findIndex((card) => card.id === overData.cardId);
    if (overCardIndex < 0) return null;

    // Nếu con trỏ đã qua nửa dưới card đang hover thì hiểu là drop "sau" card đó.
    const activeTop = active.rect.current.translated?.top;
    const overCardMiddleY = over.rect.top + over.rect.height / 2;
    const isBelowOverCard = typeof activeTop === 'number' && activeTop > overCardMiddleY;

    let targetIndex = overCardIndex;

    if (isBelowOverCard) {
      targetIndex += 1;

      // Cùng column + kéo từ trên xuống: index sau khi remove active sẽ giảm 1.
      const sourceColumnId = active.data?.current?.columnId;
      if (sourceColumnId === targetColumn.id) {
        const sourceIndex = targetColumn.cards.findIndex((card) => card.id === active.id);
        if (sourceIndex !== -1 && sourceIndex < overCardIndex) {
          targetIndex -= 1;
        }
      }
    }

    return {
      targetColumnId: targetColumn.id,
      targetIndex,
    };
  }

  if (overData.type === DRAG_ITEM_TYPE.CARD_DROP_ZONE) {
    return {
      targetColumnId: overData.columnId,
      targetIndex: overData.index,
    };
  }

  if (overData.type === DRAG_ITEM_TYPE.COLUMN) {
    const targetColumn = columns.find((column) => column.id === overData.columnId);
    if (!targetColumn) return null;

    return {
      targetColumnId: targetColumn.id,
      targetIndex: targetColumn.cards.length,
    };
  }

  return null;
};

// Khi kéo COLUMN, over có thể đang nằm trên CARD/CARD_DROP_ZONE.
// Hàm này map ngược về column đích để reorder cột ổn định.
const resolveColumnDropTarget = ({ over, columns }) => {
  if (!over) return null;

  const overData = over.data?.current;

  if (!overData) {
    return columns.some((column) => column.id === over.id) ? over.id : null;
  }

  if (overData.type === DRAG_ITEM_TYPE.COLUMN) {
    return overData.columnId || over.id;
  }

  if (overData.type === DRAG_ITEM_TYPE.CARD || overData.type === DRAG_ITEM_TYPE.CARD_DROP_ZONE) {
    return overData.columnId || null;
  }

  return columns.some((column) => column.id === over.id) ? over.id : null;
};

// Collision detection theo từng loại item đang kéo:
// - Kéo COLUMN: chỉ xét va chạm với COLUMN.
// - Kéo CARD: ưu tiên CARD, chỉ nhận DROP_ZONE của column rỗng (tránh "nhảy" preview).
// Lưu ý: hàm này ảnh hưởng trực tiếp tới giá trị "over" trong mọi event drag.
const collisionDetectionStrategy = (args, columns) => {
  const activeType = args.active.data?.current?.type;

  if (activeType === DRAG_ITEM_TYPE.COLUMN) {
    const columnDroppableContainers = args.droppableContainers.filter((container) => {
      const type = container.data?.current?.type;
      return type === DRAG_ITEM_TYPE.COLUMN;
    });

    if (!columnDroppableContainers.length) {
      return closestCenter(args);
    }

    return closestCenter({
      ...args,
      droppableContainers: columnDroppableContainers,
    });
  }

  if (activeType === DRAG_ITEM_TYPE.CARD) {
    const cardRelatedDroppableContainers = args.droppableContainers.filter((container) => {
      const type = container.data?.current?.type;
      if (type === DRAG_ITEM_TYPE.CARD) return true;
      if (type !== DRAG_ITEM_TYPE.CARD_DROP_ZONE) return false;

      const targetColumnId = container.data?.current?.columnId;
      const targetColumn = columns.find((column) => column.id === targetColumnId);

      // Chỉ giữ drop zone cho column rỗng để vẫn drop được vào list trống,
      // còn column có card thì dùng va chạm CARD để preview vị trí ổn định.
      return !targetColumn || !targetColumn.cards.length;
    });

    if (!cardRelatedDroppableContainers.length) {
      return closestCenter(args);
    }

    return closestCenter({
      ...args,
      droppableContainers: cardRelatedDroppableContainers,
    });
  }

  return closestCenter(args);
};

// Tạo columns mới sau thao tác kéo CARD (không mutate state cũ).
// Hàm thuần (pure) để dễ test/tách biệt khỏi side-effect API.
const buildColumnsAfterCardMove = ({ columns, cardId, sourceColumnId, targetColumnId, targetIndex }) => {
  const nextColumns = columns.map((column) => ({
    ...column,
    cards: [...column.cards],
  }));

  const sourceColumn = nextColumns.find((column) => column.id === sourceColumnId);
  const targetColumn = nextColumns.find((column) => column.id === targetColumnId);
  if (!sourceColumn || !targetColumn) return null;

  const sourceIndex = sourceColumn.cards.findIndex((card) => card.id === cardId);
  if (sourceIndex < 0) return null;

  if (sourceColumn.id === targetColumn.id) {
    const safeIndex = clamp(targetIndex, 0, sourceColumn.cards.length);
    sourceColumn.cards = arrayMove(sourceColumn.cards, sourceIndex, safeIndex);
    sourceColumn.cardOrderIds = sourceColumn.cards.map((card) => card.id);
    return {
      nextColumns,
      sourceIndex,
      appliedTargetIndex: safeIndex,
    };
  }

  const [movedCard] = sourceColumn.cards.splice(sourceIndex, 1);
  const safeIndex = clamp(targetIndex, 0, targetColumn.cards.length);
  targetColumn.cards.splice(safeIndex, 0, movedCard);

  sourceColumn.cardOrderIds = sourceColumn.cards.map((card) => card.id);
  targetColumn.cardOrderIds = targetColumn.cards.map((card) => card.id);

  return {
    nextColumns,
    sourceIndex,
    appliedTargetIndex: safeIndex,
  };
};

function BoardContent({ boardId, onBoardLoaded }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const [activeCardId, setActiveCardId] = useState('');
  const [activeDragType, setActiveDragType] = useState('');
  const [activeDragCardId, setActiveDragCardId] = useState('');
  const [activeDragCardData, setActiveDragCardData] = useState(null);
  const [activeDragColumnData, setActiveDragColumnData] = useState(null);
  // Preview tạm trong lúc kéo CARD qua container khác (không commit server).
  const [cardDragPreviewColumns, setCardDragPreviewColumns] = useState(null);

  const [addingCardColumnId, setAddingCardColumnId] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [renameDialog, setRenameDialog] = useState(INITIAL_RENAME_DIALOG);
  const [confirmDialog, setConfirmDialog] = useState(INITIAL_CONFIRM_DIALOG);

  const cardClickBlockUntilRef = useRef(0);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const orderedColumns = useMemo(() => {
    if (!board?.columns?.length) return [];

    const columnOrderIds = board.columnOrderIds?.length
      ? board.columnOrderIds
      : board.columns.map((column) => column.id);

    return mapOrder(board.columns, columnOrderIds, 'id').map((column) => {
      const cardOrderIds = column.cardOrderIds?.length
        ? column.cardOrderIds
        : (column.cards || []).map((card) => card.id);

      return {
        ...column,
        cards: mapOrder(column.cards || [], cardOrderIds, 'id'),
      };
    });
  }, [board]);
  const columnsForDnd = cardDragPreviewColumns || orderedColumns;

  const activeCard = useMemo(() => {
    if (!orderedColumns.length || !activeCardId) return null;

    return findCardById(orderedColumns, activeCardId);
  }, [orderedColumns, activeCardId]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await boardApi.getBoardDetail(boardId);
      setBoard(response);
      onBoardLoaded?.(response.title);
    } catch (apiError) {
      setError(apiError.message || 'Cannot load board data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!boardId) return;
    setActiveCardId('');
    setActiveDragType('');
    setActiveDragCardId('');
    setActiveDragCardData(null);
    setActiveDragColumnData(null);
    setCardDragPreviewColumns(null);
    setAddingCardColumnId('');
    setNewCardTitle('');
    setIsAddingColumn(false);
    setNewColumnTitle('');
    loadBoard();
  }, [boardId]);

  const runMutation = async (executor) => {
    try {
      setProcessing(true);
      setError('');
      const updatedBoard = await executor();
      setBoard(updatedBoard);

      if (activeCardId) {
        const cardStillExists = updatedBoard.columns.some((column) =>
          column.cards.some((card) => card.id === activeCardId),
        );
        if (!cardStillExists) setActiveCardId('');
      }
      return true;
    } catch (apiError) {
      setError(apiError.message || 'Unexpected API error');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const handleAddColumn = async () => {
    const trimmedTitle = newColumnTitle.trim();
    if (!trimmedTitle) return;

    await runMutation(() =>
      boardApi.createColumn({
        boardId,
        title: trimmedTitle,
      }),
    );

    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const handleAddCard = async (columnId) => {
    const trimmedTitle = newCardTitle.trim();
    if (!trimmedTitle) return;

    await runMutation(() =>
      boardApi.createCard({
        boardId,
        columnId,
        payload: {
          title: trimmedTitle,
          description: '',
          labels: ['info'],
        },
      }),
    );

    setNewCardTitle('');
    setAddingCardColumnId('');
  };

  const handleOpenRenameDialog = (column) => {
    setRenameDialog({
      open: true,
      columnId: column.id,
      initialTitle: column.title,
    });
  };

  const handleCloseRenameDialog = () => {
    setRenameDialog(INITIAL_RENAME_DIALOG);
  };

  const handleSubmitRenameColumn = async (nextTitle) => {
    const trimmedTitle = nextTitle.trim();
    if (!trimmedTitle) return;

    const currentColumn = board?.columns?.find((column) => column.id === renameDialog.columnId);
    if (!currentColumn) {
      handleCloseRenameDialog();
      return;
    }

    if (trimmedTitle === currentColumn.title) {
      handleCloseRenameDialog();
      return;
    }

    await runMutation(() =>
      boardApi.updateColumn({
        boardId,
        columnId: renameDialog.columnId,
        patch: { title: trimmedTitle },
      }),
    );

    handleCloseRenameDialog();
  };

  const handleOpenDeleteColumnDialog = (column) => {
    setConfirmDialog({
      open: true,
      actionType: 'delete-column',
      targetId: column.id,
      title: `Delete list "${column.title}"?`,
      description: `All ${column.cards.length} card(s) in this list will be removed.`,
      confirmLabel: 'Delete list',
    });
  };

  const handleMoveCard = async (cardId, targetColumnId) => {
    await runMutation(() =>
      boardApi.moveCard({
        boardId,
        cardId,
        targetColumnId,
      }),
    );
  };

  const handleCardOpenDetail = (cardId) => {
    // Nếu vừa drag xong thì tạm thời bỏ qua click mở detail.
    if (Date.now() < cardClickBlockUntilRef.current) return;
    setActiveCardId(cardId);
  };

  // B1: bắt đầu kéo -> xác định đang kéo CARD hay COLUMN và chuẩn bị overlay data.
  const handleDragStart = ({ active }) => {
    const activeData = active.data?.current;
    if (!activeData?.type) return;

    setActiveDragType(activeData.type);

    if (activeData.type === DRAG_ITEM_TYPE.COLUMN) {
      // Lưu snapshot column hiện tại để render overlay kéo cột.
      const column = orderedColumns.find((item) => item.id === active.id);
      if (column) setActiveDragColumnData(column);
      return;
    }

    if (activeData.type !== DRAG_ITEM_TYPE.CARD) return;

    const card = findCardById(orderedColumns, active.id);
    if (!card) return;

    setCardDragPreviewColumns(null);
    setActiveDragCardId(active.id);
    setActiveDragCardData(card);
  };

  // Preview live khi kéo CARD: giúp thấy vị trí dự kiến ở column mới trước khi thả.
  const handleCardDragOver = ({ active, over }) => {
    if (!over) return;

    const activeData = active.data?.current;
    if (activeData?.type !== DRAG_ITEM_TYPE.CARD) return;

    const currentColumns = cardDragPreviewColumns || orderedColumns;
    const currentLocation = findCardLocation(currentColumns, active.id);
    if (!currentLocation) return;

    const target = resolveCardDropTarget({
      active,
      over,
      columns: currentColumns,
    });
    if (!target) return;

    const moveResult = buildColumnsAfterCardMove({
      columns: currentColumns,
      cardId: active.id,
      sourceColumnId: currentLocation.columnId,
      targetColumnId: target.targetColumnId,
      targetIndex: target.targetIndex,
    });
    if (!moveResult) return;

    const { nextColumns } = moveResult;
    if (hasSameCardOrder(currentColumns, nextColumns)) return;

    // Nếu preview quay lại đúng order gốc của board thì dọn preview state.
    if (hasSameCardOrder(orderedColumns, nextColumns)) {
      setCardDragPreviewColumns(null);
      return;
    }

    setCardDragPreviewColumns(nextColumns);
  };

  const handleColumnDragEnd = async ({ active, over }) => {
    if (!over) return;

    const currentOrderIds = orderedColumns.map((column) => column.id);
    const targetColumnId = resolveColumnDropTarget({ over, columns: orderedColumns });
    if (!targetColumnId || active.id === targetColumnId) return;

    const oldIndex = currentOrderIds.indexOf(active.id);
    const newIndex = currentOrderIds.indexOf(targetColumnId);

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    const nextOrderIds = arrayMove(currentOrderIds, oldIndex, newIndex);
    const previousBoard = board;

    // Optimistic update cho column: đổi thứ tự ngay để cảm giác mượt.
    setBoard((prevBoard) =>
      prevBoard
        ? {
            ...prevBoard,
            columnOrderIds: nextOrderIds,
          }
        : prevBoard,
    );

    try {
      setProcessing(true);
      setError('');

      const updatedBoard = await boardApi.moveColumn({
        boardId,
        columnId: active.id,
        targetIndex: newIndex,
      });

      setBoard(updatedBoard);
    } catch (apiError) {
      setBoard(previousBoard);
      setError(apiError.message || 'Cannot reorder columns right now');
    } finally {
      setProcessing(false);
    }
  };

  // B2+B3 (cho CARD): từ "over" suy ra target index -> optimistic update -> gọi API moveCard.
  const handleCardDragEnd = async ({ active, over }, baseColumns) => {
    if (!over || !board) return;

    const activeData = active.data?.current;
    if (activeData?.type !== DRAG_ITEM_TYPE.CARD) return;

    const workingColumns = baseColumns || orderedColumns;
    const sourceLocation = findCardLocation(workingColumns, active.id);
    if (!sourceLocation) return;

    const target = resolveCardDropTarget({
      active,
      over,
      columns: workingColumns,
    });
    if (!target) return;

    const { targetColumnId, targetIndex } = target;

    const moveResult = buildColumnsAfterCardMove({
      columns: workingColumns,
      cardId: active.id,
      sourceColumnId: sourceLocation.columnId,
      targetColumnId,
      targetIndex,
    });

    const nextColumns =
      moveResult && !hasSameCardOrder(workingColumns, moveResult.nextColumns)
        ? moveResult.nextColumns
        : workingColumns;
    if (hasSameCardOrder(orderedColumns, nextColumns)) return;

    const finalLocation = findCardLocation(nextColumns, active.id);
    if (!finalLocation) return;

    const previousBoard = board;

    // Optimistic update cho card: UI đổi trước, API xác nhận sau.
    setBoard((prevBoard) =>
      prevBoard
        ? {
            ...prevBoard,
            columns: nextColumns,
          }
        : prevBoard,
    );

    try {
      setProcessing(true);
      setError('');

      const updatedBoard = await boardApi.moveCard({
        boardId,
        cardId: active.id,
        targetColumnId: finalLocation.columnId,
        targetIndex: finalLocation.cardIndex,
      });

      setBoard(updatedBoard);
    } catch (apiError) {
      // API lỗi thì rollback về snapshot trước drag.
      setBoard(previousBoard);
      setError(apiError.message || 'Cannot reorder cards right now');
    } finally {
      setProcessing(false);
    }
  };

  // Điểm điều phối drag end cho cả COLUMN và CARD.
  const handleDragEnd = async (event) => {
    const activeData = event.active?.data?.current;
    const previewColumns = columnsForDnd;

    setActiveDragType('');
    setActiveDragCardId('');
    setActiveDragCardData(null);
    setActiveDragColumnData(null);
    setCardDragPreviewColumns(null);

    if (!activeData || processing) return;

    if (activeData.type === DRAG_ITEM_TYPE.COLUMN) {
      await handleColumnDragEnd(event);
      return;
    }

    if (activeData.type === DRAG_ITEM_TYPE.CARD) {
      // Đặt mốc chặn click trước khi xử lý để tránh ghost click.
      cardClickBlockUntilRef.current = Date.now() + BLOCK_CARD_CLICK_AFTER_DRAG_MS;
      await handleCardDragEnd(event, previewColumns);
    }
  };

  const handleDragCancel = () => {
    setActiveDragType('');
    setActiveDragCardId('');
    setActiveDragCardData(null);
    setActiveDragColumnData(null);
    setCardDragPreviewColumns(null);
    cardClickBlockUntilRef.current = Date.now() + BLOCK_CARD_CLICK_AFTER_DRAG_MS;
  };

  const handleOpenDeleteCardDialog = ({ cardId, cardTitle }) => {
    setConfirmDialog({
      open: true,
      actionType: 'delete-card',
      targetId: cardId,
      title: 'Delete card?',
      description: `"${cardTitle}" will be permanently removed.`,
      confirmLabel: 'Delete card',
    });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog(INITIAL_CONFIRM_DIALOG);
  };

  const handleConfirmDialogAction = async () => {
    if (confirmDialog.actionType === 'delete-column') {
      await runMutation(() =>
        boardApi.deleteColumn({
          boardId,
          columnId: confirmDialog.targetId,
        }),
      );
    }

    if (confirmDialog.actionType === 'delete-card') {
      await runMutation(() =>
        boardApi.deleteCard({
          boardId,
          cardId: confirmDialog.targetId,
        }),
      );
    }

    handleCloseConfirmDialog();
  };

  const handleSaveCardDetail = async (payload) => {
    if (!activeCardId) return;

    const saved = await runMutation(() =>
      boardApi.updateCard({
        boardId,
        cardId: activeCardId,
        patch: payload,
      }),
    );

    if (saved) {
      setActiveCardId('');
    }
  };

  const handleCancelAddCard = () => {
    setAddingCardColumnId('');
    setNewCardTitle('');
  };

  const handleCancelAddColumn = () => {
    setIsAddingColumn(false);
    setNewColumnTitle('');
  };

  if (loading) {
    return <BoardContentLoading />;
  }

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        width: '100%',
        px: { xs: 1, md: 2 },
        py: 1.5,
        height: (theme) => ({
          xs: `calc(100vh - ${theme.trelloCustom.appBarMobileHeight} - ${theme.trelloCustom.boardBarMobileHeight})`,
          md: `calc(100vh - ${theme.trelloCustom.appBarHeight} - ${theme.trelloCustom.boardBarHeight})`,
        }),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {error ? <BoardContentErrorBanner errorMessage={error} onRetry={loadBoard} /> : null}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar': {
            height: 10,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
            borderRadius: 8,
          },
        }}
      >
        <DndContext
          sensors={sensors}
          // orderedColumns được truyền vào để collision cho CARD biết cột nào rỗng/không rỗng.
          collisionDetection={(args) => collisionDetectionStrategy(args, columnsForDnd)}
          onDragStart={handleDragStart}
          onDragOver={handleCardDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'flex-start',
              gap: 1.5,
              height: '100%',
              minHeight: 0,
              pb: 0,
            }}
          >
            <SortableContext
              items={columnsForDnd.map((column) => column.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columnsForDnd.map((column) => (
                <SortableColumnItem
                  key={column.id}
                  column={column}
                  orderedColumns={orderedColumns}
                  isAddingCard={addingCardColumnId === column.id}
                  newCardTitle={newCardTitle}
                  processing={processing}
                  onOpenCardDetail={handleCardOpenDetail}
                  onMoveCard={handleMoveCard}
                  onOpenRenameColumn={handleOpenRenameDialog}
                  onOpenDeleteColumn={handleOpenDeleteColumnDialog}
                  onOpenDeleteCard={handleOpenDeleteCardDialog}
                  onStartAddCard={setAddingCardColumnId}
                  onCancelAddCard={handleCancelAddCard}
                  onNewCardTitleChange={setNewCardTitle}
                  onSubmitAddCard={handleAddCard}
                  isCardDragging={activeDragType === DRAG_ITEM_TYPE.CARD}
                  isColumnDragging={activeDragType === DRAG_ITEM_TYPE.COLUMN}
                />
              ))}
            </SortableContext>

            <AddColumnComposer
              isAddingColumn={isAddingColumn}
              newColumnTitle={newColumnTitle}
              processing={processing}
              onStartAddingColumn={() => setIsAddingColumn(true)}
              onCancelAddingColumn={handleCancelAddColumn}
              onSubmitColumn={handleAddColumn}
              onNewColumnTitleChange={setNewColumnTitle}
            />
          </Box>

          <DragOverlay adjustScale={false} dropAnimation={dragOverlayDropAnimation}>
            {activeDragType === DRAG_ITEM_TYPE.CARD ? <CardDragOverlay card={activeDragCardData} /> : null}
            {activeDragType === DRAG_ITEM_TYPE.COLUMN ? (
              <ColumnDragOverlay column={activeDragColumnData} orderedColumns={orderedColumns} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>

      <CardDetailDialog
        open={Boolean(activeCardId)}
        card={activeCard}
        labelOptions={LABEL_OPTIONS}
        onClose={() => setActiveCardId('')}
        onSave={handleSaveCardDetail}
        onDelete={() =>
          activeCard
            ? handleOpenDeleteCardDialog({
                cardId: activeCard.id,
                cardTitle: activeCard.title,
              })
            : null
        }
        isSaving={processing}
      />

      <RenameColumnDialog
        open={renameDialog.open}
        initialTitle={renameDialog.initialTitle}
        onClose={handleCloseRenameDialog}
        onSubmit={handleSubmitRenameColumn}
        isSubmitting={processing}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        onCancel={handleCloseConfirmDialog}
        onConfirm={handleConfirmDialogAction}
        isProcessing={processing}
      />
    </Box>
  );
}

export default BoardContent;
