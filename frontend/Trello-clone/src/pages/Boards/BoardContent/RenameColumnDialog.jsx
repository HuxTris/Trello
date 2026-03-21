import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

function RenameColumnDialog({ open, initialTitle, onClose, onSubmit, isSubmitting }) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initialTitle || '');
  }, [open, initialTitle]);

  const handleSubmit = () => {
    onSubmit(title);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Rename list</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="List name"
          fullWidth
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!title.trim() || isSubmitting}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RenameColumnDialog;
