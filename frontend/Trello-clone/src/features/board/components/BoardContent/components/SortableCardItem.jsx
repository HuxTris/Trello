import Box from '@mui/material/Box';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardItem from './CardItem';

function SortableCardItem(props) {
  const { card, columnId, isDragDisabled } = props;

  // useSortable đăng ký CARD là draggable + sortable item trong column hiện tại.
  // id/data ở đây sẽ đi xuyên suốt lifecycle drag và được đọc lại trong:
  // - collisionDetectionStrategy (BoardContent/index.jsx)
  // - resolveCardDropTarget (BoardContent/index.jsx)
  // - handleCardDragEnd (BoardContent/index.jsx)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'CARD',
      cardId: card.id,
      columnId,
    },
    // Khi đang kéo COLUMN thì tắt drag CARD để tránh xung đột gesture.
    disabled: isDragDisabled,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 'auto',
      }}
    >
      <CardItem
        {...props}
        isDragging={isDragging}
        dragProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </Box>
  );
}

export default SortableCardItem;
