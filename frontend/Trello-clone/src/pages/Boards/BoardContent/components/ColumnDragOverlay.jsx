import Box from '@mui/material/Box';
import ColumnItem from './ColumnItem';

const noop = () => {};

function ColumnDragOverlay({ column, orderedColumns }) {
  if (!column) return null;

  return (
    <Box
      sx={{
        pointerEvents: 'none',
        boxShadow: '0 6px 18px rgba(9, 30, 66, 0.24)',
      }}
    >
      <ColumnItem
        column={column}
        orderedColumns={orderedColumns}
        isAddingCard={false}
        newCardTitle=""
        processing={false}
        onOpenCardDetail={noop}
        onMoveCard={noop}
        onOpenRenameColumn={noop}
        onOpenDeleteColumn={noop}
        onOpenDeleteCard={noop}
        onStartAddCard={noop}
        onCancelAddCard={noop}
        onNewCardTitleChange={noop}
        onSubmitAddCard={noop}
        isCardDragging={false}
        isColumnDragging={false}
        overlayMode
      />
    </Box>
  );
}

export default ColumnDragOverlay;
