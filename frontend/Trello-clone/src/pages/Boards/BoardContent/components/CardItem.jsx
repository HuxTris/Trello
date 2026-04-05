import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MuiDropdownMenu from '../../../../components/Dropdown/MuiDropdownMenu';

function CardItem({
  card,
  columnId,
  orderedColumns,
  onOpenCardDetail,
  onMoveCard,
  onOpenDeleteCard,
  dragProps,
  isDragging,
}) {
  // Tách onKeyDown để không bị ghi đè logic mở detail bằng Enter.
  const { onKeyDown: onDragKeyDown, ...restDragProps } = dragProps || {};
  const moveItems = (orderedColumns || [])
    .filter((item) => item.id !== columnId)
    .map((targetColumn) => ({
      id: `move-${card.id}-${targetColumn.id}`,
      label: `Move to ${targetColumn.title}`,
      icon: DriveFileMoveOutlinedIcon,
      onClick: () => onMoveCard(card.id, targetColumn.id),
    }));

  const cardMenuItems = [
    {
      id: `detail-${card.id}`,
      label: 'Open detail',
      icon: ViewKanbanOutlinedIcon,
      onClick: () => onOpenCardDetail(card.id),
    },
    ...moveItems,
    {
      id: `delete-${card.id}`,
      label: 'Delete card',
      icon: DeleteOutlineOutlinedIcon,
      onClick: () =>
        onOpenDeleteCard({
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
      onClick={() => onOpenCardDetail(card.id)}
      onKeyDown={(event) => {
        onDragKeyDown?.(event);
        if (event.defaultPrevented) return;

        if (event.key === 'Enter') {
          event.preventDefault();
          onOpenCardDetail(card.id);
        }
      }}
      {...restDragProps}
      sx={{
        borderRadius: 1.5,
        bgcolor: 'card.main',
        borderColor: 'rgba(9, 30, 66, 0.12)',
        boxShadow: '0 1px 0 rgba(9, 30, 66, 0.14)',
        flexShrink: 0,
        cursor: 'pointer',
        opacity: isDragging ? 0.55 : 1,
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
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
                onTouchStart={(event) => {
                  event.stopPropagation();
                }}
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
}

export default CardItem;
