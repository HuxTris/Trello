import { useEffect, useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
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
import SortableColumnItem from './components/SortableColumnItem';

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

function BoardContent({ boardId, onBoardLoaded }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const [activeCardId, setActiveCardId] = useState('');

  const [addingCardColumnId, setAddingCardColumnId] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [renameDialog, setRenameDialog] = useState(INITIAL_RENAME_DIALOG);
  const [confirmDialog, setConfirmDialog] = useState(INITIAL_CONFIRM_DIALOG);
  // sử dụng useSensors để kết hợp nhiều loại sensor khác nhau (mouse, touch, keyboard) 
  // cho tính năng drag & drop, giúp trải nghiệm người dùng tốt hơn trên cả desktop và thiết bị di động.
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Thêm activationConstraint để tránh việc kích hoạt drag quá nhạy 
      // khi người dùng chỉ muốn click hoặc chọn một phần tử.
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

    for (const column of orderedColumns) {
      const card = column.cards.find((item) => item.id === activeCardId);
      if (card) return card;
    }

    return null;
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

  const handleColumnDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    if (processing || !board) return;

    const currentOrderIds = orderedColumns.map((column) => column.id);
    const oldIndex = currentOrderIds.indexOf(active.id);
    const newIndex = currentOrderIds.indexOf(over.id);

    if (oldIndex < 0 || newIndex < 0) return;
    if (oldIndex === newIndex) return;

    // Dùng arrayMove để tính toán thứ tự mới sau khi drag & drop, nhưng không cập nhật state ngay mà sẽ gọi 
    // API để cập nhật thứ tự mới lên server, sau đó mới cập nhật state với dữ liệu trả về từ server.
    // Việc này giúp tránh tình trạng dữ liệu bị lệch khi có nhiều người dùng cùng thao tác trên một board.
    const nextOrderIds = arrayMove(currentOrderIds, oldIndex, newIndex);
    const previousBoard = board;

    // Optimistic update: render new column order immediately.
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
      // Rollback when API fails.
      setBoard(previousBoard);
      setError(apiError.message || 'Cannot reorder columns right now');
    } finally {
      setProcessing(false);
    }
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
        // Using multiple sensors to support mouse, touch and keyboard interactions for drag & drop.
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleColumnDragEnd}
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
                  onOpenCardDetail={setActiveCardId}
                  onMoveCard={handleMoveCard}
                  onOpenRenameColumn={handleOpenRenameDialog}
                  onOpenDeleteColumn={handleOpenDeleteColumnDialog}
                  onOpenDeleteCard={handleOpenDeleteCardDialog}
                  onStartAddCard={setAddingCardColumnId}
                  onCancelAddCard={handleCancelAddCard}
                  onNewCardTitleChange={setNewCardTitle}
                  onSubmitAddCard={handleAddCard}
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
