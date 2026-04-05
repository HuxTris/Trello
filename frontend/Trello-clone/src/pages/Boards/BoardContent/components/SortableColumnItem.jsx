import Box from '@mui/material/Box';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ColumnItem from './ColumnItem';

function SortableColumnItem(props) {
  const { column } = props;

  // useSortable đăng ký COLUMN là item có thể sắp xếp ngang trong board.
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: 'COLUMN', columnId: column.id },
  });

  return (
    <Box
      ref={setNodeRef}
      aria-hidden={isDragging}
      sx={{
        transform: CSS.Translate.toString(transform),
        transition,
        // Giữ cột gốc ở vị trí cũ như 1 "placeholder" mờ khi đang kéo.
        opacity: isDragging ? 0.4 : 1,
        filter: isDragging ? 'saturate(0.92)' : 'none',
        pointerEvents: isDragging ? 'none' : 'auto',
      }}
    >
      <ColumnItem
        {...props}
        // Chỉ truyền listeners vào drag handle, không kéo toàn bộ cột bằng mọi click.
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </Box>
  );
}

export default SortableColumnItem;
