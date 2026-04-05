import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { COLUMN_WIDTH } from '../constants';

function AddColumnComposer({
  isAddingColumn,
  newColumnTitle,
  processing,
  onStartAddingColumn,
  onCancelAddingColumn,
  onSubmitColumn,
  onNewColumnTitleChange,
}) {
  return (
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
            onChange={(event) => onNewColumnTitleChange(event.target.value)}
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
              onClick={onSubmitColumn}
              disabled={!newColumnTitle.trim() || processing}
            >
              Add list
            </Button>
            <Button size="small" sx={{ color: 'common.white' }} onClick={onCancelAddingColumn}>
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
          onClick={onStartAddingColumn}
        >
          Add another list
        </Button>
      )}
    </Box>
  );
}

export default AddColumnComposer;
