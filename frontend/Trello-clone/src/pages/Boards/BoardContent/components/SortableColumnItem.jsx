import Box from '@mui/material/Box';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ColumnItem from './ColumnItem';

function SortableColumnItem(props) {
  const { column } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: 'COLUMN', columnId: column.id },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
    >
      <ColumnItem
        {...props}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </Box>
  );
}

export default SortableColumnItem;
