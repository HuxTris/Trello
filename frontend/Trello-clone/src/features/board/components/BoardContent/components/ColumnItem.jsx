import AddIcon from '@mui/icons-material/Add';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiDropdownMenu from '@/shared/components/Dropdown/MuiDropdownMenu';
import {
  COLUMN_BOTTOM_GAP,
  COLUMN_FOOTER_HEIGHT,
  COLUMN_HEADER_HEIGHT,
  COLUMN_WIDTH,
} from '../constants';
import CardItem from './CardItem';
import CardDropZone from './CardDropZone';
import SortableCardItem from './SortableCardItem';

function ColumnItem({
  column,
  orderedColumns,
  isAddingCard,
  newCardTitle,
  processing,
  onOpenCardDetail,
  onMoveCard,
  onOpenRenameColumn,
  onOpenDeleteColumn,
  onOpenDeleteCard,
  onStartAddCard,
  onCancelAddCard,
  onNewCardTitleChange,
  onSubmitAddCard,
  dragHandleProps,
  isCardDragging,
  isColumnDragging,
  overlayMode = false,
}) {
  const columnMenuItems = [
    {
      id: `add-card-${column.id}`,
      label: 'Add card',
      icon: AddIcon,
      onClick: () => onStartAddCard(column.id),
    },
    {
      id: `rename-column-${column.id}`,
      label: 'Rename column',
      icon: EditOutlinedIcon,
      onClick: () => onOpenRenameColumn(column),
    },
    {
      id: `delete-column-${column.id}`,
      label: 'Delete column',
      icon: DeleteOutlineOutlinedIcon,
      onClick: () => onOpenDeleteColumn(column),
    },
  ];

  return (
    <Box
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              cursor: 'grab',
              touchAction: 'none',
              WebkitTapHighlightColor: 'transparent',
              '&:active': {
                cursor: 'grabbing',
              },
            }}
            {...dragHandleProps}
          >
            <DragIndicatorOutlinedIcon fontSize="small" />
          </IconButton>

          <MuiDropdownMenu
            items={columnMenuItems}
            minWidth={220}
            renderTrigger={({ triggerProps }) => (
              <IconButton size="small" sx={{ color: 'text.secondary' }} {...triggerProps}>
                <MoreHorizOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          />
        </Box>
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
        {/* overlayMode dùng cho DragOverlay: render UI tĩnh giống hệt cột thật, không gắn sortable/dropzone */}
        {overlayMode ? (
          column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              columnId={column.id}
              orderedColumns={orderedColumns}
              onOpenCardDetail={onOpenCardDetail}
              onMoveCard={onMoveCard}
              onOpenDeleteCard={onOpenDeleteCard}
            />
          ))
        ) : (
          <>
            {/* Normal mode: cards nằm trong SortableContext để kéo-thả giữa các vị trí */}
            {/* items phải là mảng id card theo đúng thứ tự render hiện tại.
                Nếu lệch thứ tự render, hiệu ứng sortable sẽ giật/nhảy vị trí. */}
            <SortableContext
              items={column.cards.map((card) => card.id)}
              strategy={verticalListSortingStrategy}
            >
              {column.cards.map((card) => (
                <SortableCardItem
                  key={card.id}
                  card={card}
                  columnId={column.id}
                  orderedColumns={orderedColumns}
                  onOpenCardDetail={onOpenCardDetail}
                  onMoveCard={onMoveCard}
                  onOpenDeleteCard={onOpenDeleteCard}
                  isDragDisabled={isColumnDragging}
                />
              ))}
            </SortableContext>

            <CardDropZone
              columnId={column.id}
              index={column.cards.length}
              isEmpty={!column.cards.length}
              isActive={isCardDragging}
            />
          </>
        )}
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
        {isAddingCard ? (
          <Stack spacing={1} sx={{ width: '100%' }}>
            <TextField
              size="small"
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(event) => onNewCardTitleChange(event.target.value)}
              autoFocus
            />
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                onClick={() => onSubmitAddCard(column.id)}
                disabled={!newCardTitle.trim() || processing}
              >
                Add card
              </Button>
              <Button size="small" onClick={onCancelAddCard}>
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
            onClick={() => onStartAddCard(column.id)}
          >
            Add a card
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ColumnItem;
