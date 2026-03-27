import { useEffect, useMemo, useRef, useState } from 'react';
import {
  closestCenter,
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
import SortableColumnItem from './components/SortableColumnItem';

const DRAG_ITEM_TYPE = {
  COLUMN: 'COLUMN',
  CARD: 'CARD',
  CARD_DROP_ZONE: 'CARD_DROP_ZONE',
};

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

const hasSameCardOrder = (prevColumns, nextColumns) =>
  prevColumns.every((column, index) => {
    const nextColumn = nextColumns[index];
    if (!nextColumn || nextColumn.id !== column.id) return false;

    const prevIds = column.cards.map((card) => card.id).join('|');
    const nextIds = nextColumn.cards.map((card) => card.id).join('|');
    return prevIds === nextIds;
  });

const resolveCardDropTarget = ({ over, columns }) => {
  if (!over) return null;

  const overData = over.data?.current;
  if (!overData) return null;

  if (overData.type === DRAG_ITEM_TYPE.CARD) {
    const targetColumn = columns.find((column) => column.id === overData.columnId);
    if (!targetColumn) return null;

    const targetIndex = targetColumn.cards.findIndex((card) => card.id === overData.cardId);
    if (targetIndex < 0) return null;

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

const collisionDetectionStrategy = (args) => {
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
      return (
        type === DRAG_ITEM_TYPE.CARD ||
        type === DRAG_ITEM_TYPE.CARD_DROP_ZONE ||
        type === DRAG_ITEM_TYPE.COLUMN
      );
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
  const [activeDragCardId, setActiveDragCardId] = useState('');
  const [activeDragCardData, setActiveDragCardData] = useState(null);

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
    setActiveDragCardId('');
    setActiveDragCardData(null);
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
    if (Date.now() < cardClickBlockUntilRef.current) return;
    setActiveCardId(cardId);
  };

  const handleDragStart = ({ active }) => {
    const activeData = active.data?.current;
    if (activeData?.type !== DRAG_ITEM_TYPE.CARD) return;

    const card = findCardById(orderedColumns, active.id);
    if (!card) return;

    setActiveDragCardId(active.id);
    setActiveDragCardData(card);
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

  const handleCardDragEnd = async ({ active, over }) => {
    if (!over || !board) return;

    const activeData = active.data?.current;
    if (activeData?.type !== DRAG_ITEM_TYPE.CARD) return;

    const sourceColumnId = activeData.columnId;
    const sourceLocation = findCardLocation(orderedColumns, active.id);
    if (!sourceLocation) return;

    const target = resolveCardDropTarget({ over, columns: orderedColumns });
    if (!target) return;

    const { targetColumnId, targetIndex } = target;

    const moveResult = buildColumnsAfterCardMove({
      columns: orderedColumns,
      cardId: active.id,
      sourceColumnId,
      targetColumnId,
      targetIndex,
    });

    if (!moveResult) return;

    const { nextColumns, appliedTargetIndex } = moveResult;
    if (hasSameCardOrder(orderedColumns, nextColumns)) return;

    const previousBoard = board;

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
        targetColumnId,
        targetIndex: appliedTargetIndex,
      });

      setBoard(updatedBoard);
    } catch (apiError) {
      setBoard(previousBoard);
      setError(apiError.message || 'Cannot reorder cards right now');
    } finally {
      setProcessing(false);
    }
  };

  const handleDragEnd = async (event) => {
    const activeData = event.active?.data?.current;

    setActiveDragCardId('');
    setActiveDragCardData(null);

    if (!activeData || processing) return;

    if (activeData.type === DRAG_ITEM_TYPE.COLUMN) {
      await handleColumnDragEnd(event);
      return;
    }

    if (activeData.type === DRAG_ITEM_TYPE.CARD) {
      cardClickBlockUntilRef.current = Date.now() + BLOCK_CARD_CLICK_AFTER_DRAG_MS;
      await handleCardDragEnd(event);
    }
  };

  const handleDragCancel = () => {
    setActiveDragCardId('');
    setActiveDragCardData(null);
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
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
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
              items={orderedColumns.map((column) => column.id)}
              strategy={horizontalListSortingStrategy}
            >
              {orderedColumns.map((column) => (
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
                  isCardDragging={Boolean(activeDragCardId)}
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

          <DragOverlay>
            {activeDragCardId ? <CardDragOverlay card={activeDragCardData} /> : null}
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
