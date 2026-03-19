import { useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import boardApi from '../../../apis/boardApi';
import MuiDropdownMenu from '../../../components/Dropdown/MuiDropdownMenu';
import CardDetailDialog from './CardDetailDialog';
import ConfirmDialog from './ConfirmDialog';
import RenameColumnDialog from './RenameColumnDialog';

const BOARD_ID = 'board-1';
const COLUMN_HEADER_HEIGHT = 52;
const COLUMN_FOOTER_HEIGHT = 52;
const COLUMN_WIDTH = 300;
const COLUMN_BOTTOM_GAP = 5;

const LABEL_OPTIONS = [
  { id: 'secondary', label: 'Feature' },
  { id: 'error', label: 'High Priority' },
  { id: 'warning', label: 'Needs Review' },
  { id: 'success', label: 'Done' },
  { id: 'info', label: 'Info' },
];

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

function BoardContent() {
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

  const activeCard = useMemo(() => {
    if (!board || !activeCardId) return null;

    for (const column of board.columns) {
      const card = column.cards.find((item) => item.id === activeCardId);
      if (card) return card;
    }

    return null;
  }, [board, activeCardId]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await boardApi.getBoardDetail(BOARD_ID);
      setBoard(response);
    } catch (apiError) {
      setError(apiError.message || 'Cannot load board data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, []);

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
        boardId: BOARD_ID,
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
        boardId: BOARD_ID,
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
        boardId: BOARD_ID,
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
        boardId: BOARD_ID,
        cardId,
        targetColumnId,
      }),
    );
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
          boardId: BOARD_ID,
          columnId: confirmDialog.targetId,
        }),
      );
    }

    if (confirmDialog.actionType === 'delete-card') {
      await runMutation(() =>
        boardApi.deleteCard({
          boardId: BOARD_ID,
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
        boardId: BOARD_ID,
        cardId: activeCardId,
        patch: payload,
      }),
    );

    if (saved) {
      setActiveCardId('');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: 'primary.main',
          width: '100%',
          px: { xs: 1, md: 2 },
          py: 1.5,
          display: 'flex',
          gap: 1.5,
          height: (theme) => ({
            xs: `calc(100vh - ${theme.trelloCustom.appBarMobileHeight} - ${theme.trelloCustom.boardBarMobileHeight})`,
            md: `calc(100vh - ${theme.trelloCustom.appBarHeight} - ${theme.trelloCustom.boardBarHeight})`,
          }),
          overflowX: 'auto',
        }}
      >
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ minWidth: COLUMN_WIDTH, bgcolor: 'column.main', borderRadius: 2, p: 1 }}>
            <Skeleton variant="text" height={36} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Skeleton variant="rounded" height={80} sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.25)' }} />
            <Skeleton variant="rounded" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
          </Box>
        ))}
      </Box>
    );
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
      {error ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            mb: 1.5,
            p: 1,
            borderRadius: 1.5,
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            color: 'common.white',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ flex: 1 }}>
            {error}
          </Typography>
          <Button size="small" variant="contained" onClick={loadBoard}>
            Retry
          </Button>
        </Stack>
      ) : null}

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
        {board?.columns?.map((column) => {
          const columnMenuItems = [
            {
              id: `add-card-${column.id}`,
              label: 'Add card',
              icon: AddIcon,
              onClick: () => setAddingCardColumnId(column.id),
            },
            {
              id: `rename-column-${column.id}`,
              label: 'Rename column',
              icon: EditOutlinedIcon,
              onClick: () => handleOpenRenameDialog(column),
            },
            {
              id: `delete-column-${column.id}`,
              label: 'Delete column',
              icon: DeleteOutlineOutlinedIcon,
              onClick: () => handleOpenDeleteColumnDialog(column),
            },
          ];

          return (
            <Box
              key={column.id}
              sx={{
                minWidth: COLUMN_WIDTH,
                maxWidth: COLUMN_WIDTH,
                height: 'fit-content',
                maxHeight: `calc(100% - ${COLUMN_BOTTOM_GAP}px)`,
                alignSelf: 'flex-start',
                minHeight: 0,
                borderRadius: 2,
                bgcolor: 'column.main',
                color: 'text.primary',
                boxShadow: '0 1px 0 rgba(9, 30, 66, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: COLUMN_HEADER_HEIGHT,
                  minHeight: COLUMN_HEADER_HEIGHT,
                  flexShrink: 0,
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'rgba(9, 30, 66, 0.12)',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'column.header',
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    pr: 1,
                  }}
                >
                  {column.title} ({column.cards.length})
                </Typography>

                <MuiDropdownMenu
                  items={columnMenuItems}
                  minWidth={220}
                  renderTrigger={({ triggerProps }) => (
                    <IconButton
                      size="small"
                      sx={{ color: 'text.secondary' }}
                      {...triggerProps}
                    >
                      <MoreHorizOutlinedIcon fontSize="small" />
                    </IconButton>
                  )}
                />
              </Box>

              <Box
                sx={{
                  p: 1,
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  '&::-webkit-scrollbar': {
                    width: 8,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(9, 30, 66, 0.25)',
                    borderRadius: 8,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {column.cards.map((card) => {
                  const moveItems = (board.columns || [])
                    .filter((item) => item.id !== column.id)
                    .map((targetColumn) => ({
                      id: `move-${card.id}-${targetColumn.id}`,
                      label: `Move to ${targetColumn.title}`,
                      icon: DriveFileMoveOutlinedIcon,
                      onClick: () => handleMoveCard(card.id, targetColumn.id),
                    }));

                  const cardMenuItems = [
                    {
                      id: `detail-${card.id}`,
                      label: 'Open detail',
                      icon: ViewKanbanOutlinedIcon,
                      onClick: () => setActiveCardId(card.id),
                    },
                    ...moveItems,
                    {
                      id: `delete-${card.id}`,
                      label: 'Delete card',
                      icon: DeleteOutlineOutlinedIcon,
                      onClick: () =>
                        handleOpenDeleteCardDialog({
                          cardId: card.id,
                          cardTitle: card.title,
                        }),
                    },
                  ];

                  return (
                    <Card
                      key={card.id}
                      variant="outlined"
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveCardId(card.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setActiveCardId(card.id);
                        }
                      }}
                      sx={{
                        borderRadius: 1.5,
                        bgcolor: 'card.main',
                        borderColor: 'rgba(9, 30, 66, 0.12)',
                        boxShadow: '0 1px 0 rgba(9, 30, 66, 0.14)',
                        flexShrink: 0,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 1.25,
                          '&:last-child': { pb: 1.25 },
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: 0,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 0.75, flexWrap: 'wrap' }}>
                            {(card.labels || []).map((label) => (
                              <Box
                                key={`${card.id}-${label}`}
                                sx={{
                                  width: 36,
                                  height: 8,
                                  borderRadius: 99,
                                  bgcolor: `${label}.main`,
                                }}
                              />
                            ))}
                          </Box>

                          <MuiDropdownMenu
                            items={cardMenuItems}
                            minWidth={240}
                            renderTrigger={({ triggerProps }) => (
                              <IconButton
                                size="small"
                                {...triggerProps}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  triggerProps.onClick(event);
                                }}
                                sx={{
                                  color: 'text.secondary',
                                  mt: -0.5,
                                  mr: -0.5,
                                }}
                              >
                                <MoreHorizOutlinedIcon fontSize="small" />
                              </IconButton>
                            )}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 500,
                            lineHeight: 1.35,
                            mb: 1,
                          }}
                        >
                          {card.title}
                        </Typography>

                        {card.description ? (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              mb: 1,
                              lineHeight: 1.4,
                            }}
                          >
                            {card.description}
                          </Typography>
                        ) : null}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: 'text.secondary', flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}>
                            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 500 }}>
                              {card.comments}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}>
                            <AttachmentOutlinedIcon sx={{ fontSize: 15 }} />
                            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 500 }}>
                              {card.attachments}
                            </Typography>
                          </Box>
                          {card.dueDate ? (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Due: {card.dueDate}
                            </Typography>
                          ) : null}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>

              <Box
                sx={{
                  minHeight: COLUMN_FOOTER_HEIGHT,
                  flexShrink: 0,
                  px: 0.75,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {addingCardColumnId === column.id ? (
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <TextField
                      size="small"
                      placeholder="Enter card title..."
                      value={newCardTitle}
                      onChange={(event) => setNewCardTitle(event.target.value)}
                      autoFocus
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAddCard(column.id)}
                        disabled={!newCardTitle.trim() || processing}
                      >
                        Add card
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setAddingCardColumnId('');
                          setNewCardTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Button
                    startIcon={<AddIcon />}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      color: 'text.secondary',
                      borderRadius: 1,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(9, 30, 66, 0.08)',
                      },
                    }}
                    onClick={() => setAddingCardColumnId(column.id)}
                  >
                    Add a card
                  </Button>
                )}
              </Box>
            </Box>
          );
        })}

        <Box
          sx={{
            minWidth: COLUMN_WIDTH,
            maxWidth: COLUMN_WIDTH,
            alignSelf: 'flex-start',
            height: 'fit-content',
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.24)',
            p: 0.75,
          }}
        >
          {isAddingColumn ? (
            <Stack spacing={1}>
              <TextField
                size="small"
                placeholder="Enter list title..."
                value={newColumnTitle}
                onChange={(event) => setNewColumnTitle(event.target.value)}
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'common.white',
                  },
                }}
              />
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddColumn}
                  disabled={!newColumnTitle.trim() || processing}
                >
                  Add list
                </Button>
                <Button
                  size="small"
                  sx={{ color: 'common.white' }}
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnTitle('');
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Button
              startIcon={<AddIcon />}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                color: 'common.white',
                textTransform: 'none',
                borderRadius: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.22)',
                },
              }}
              onClick={() => setIsAddingColumn(true)}
            >
              Add another list
            </Button>
          )}
        </Box>
        </Box>
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
