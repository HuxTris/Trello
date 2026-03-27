import Box from '@mui/material/Box';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardItem from './CardItem';

function SortableCardItem(props) {
  const { card, columnId } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'CARD',
      cardId: card.id,
      columnId,
    },
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
