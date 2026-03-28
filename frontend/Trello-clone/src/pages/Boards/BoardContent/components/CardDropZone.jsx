import Box from '@mui/material/Box';
import { useDroppable } from '@dnd-kit/core';

function CardDropZone({ columnId, index, isEmpty, isActive }) {
  // Drop zone là vùng thả bổ sung để:
  // 1) thả vào cuối list, 2) thả vào list rỗng.
  const { isOver, setNodeRef } = useDroppable({
    id: `card-drop-zone-${columnId}-${index}`,
    data: {
      type: 'CARD_DROP_ZONE',
      columnId,
      index,
    },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: isEmpty ? 58 : 14,
        borderRadius: 1.5,
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'rgba(9, 30, 66, 0.16)',
        bgcolor: isOver ? 'rgba(9, 30, 66, 0.08)' : 'transparent',
        display: isEmpty || isActive ? 'block' : 'none',
        transition: 'all 120ms ease',
      }}
    />
  );
}

export default CardDropZone;
