import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function CardDetailDialog({
  open,
  card,
  labelOptions,
  onClose,
  onSave,
  onDelete,
  isSaving,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    comments: 0,
    attachments: 0,
    labels: [],
  });

  useEffect(() => {
    if (!card) return;

    setFormData({
      title: card.title || '',
      description: card.description || '',
      dueDate: card.dueDate || '',
      assignee: card.assignee || '',
      comments: card.comments || 0,
      attachments: card.attachments || 0,
      labels: card.labels || [],
    });
  }, [card]);

  const labelMap = useMemo(
    () => Object.fromEntries(labelOptions.map((item) => [item.id, item])),
    [labelOptions],
  );

  const toggleLabel = (labelId) => {
    setFormData((prev) => {
      const isSelected = prev.labels.includes(labelId);
      if (isSelected) {
        return { ...prev, labels: prev.labels.filter((item) => item !== labelId) };
      }
      return { ...prev, labels: [...prev.labels, labelId] };
    });
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee: formData.assignee.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>Card Detail</DialogTitle>
      <DialogContent>
        {!card ? null : (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
              autoFocus
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              multiline
              minRows={4}
              fullWidth
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Due date"
                type="date"
                value={formData.dueDate}
                onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Assignee"
                value={formData.assignee}
                onChange={(event) => setFormData((prev) => ({ ...prev, assignee: event.target.value }))}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Comments"
                type="number"
                value={formData.comments}
                onChange={(event) => setFormData((prev) => ({ ...prev, comments: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Attachments"
                type="number"
                value={formData.attachments}
                onChange={(event) => setFormData((prev) => ({ ...prev, attachments: event.target.value }))}
                fullWidth
              />
            </Stack>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Labels
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                {labelOptions.map((option) => {
                  const selected = formData.labels.includes(option.id);
                  return (
                    <Chip
                      key={option.id}
                      label={option.label}
                      onClick={() => toggleLabel(option.id)}
                      variant={selected ? 'filled' : 'outlined'}
                      sx={{
                        bgcolor: selected ? `${option.id}.main` : 'transparent',
                        color: selected ? '#FFFFFF' : 'text.secondary',
                        borderColor: `${option.id}.main`,
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Current labels: {formData.labels.map((item) => labelMap[item]?.label || item).join(', ') || 'None'}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Button color="error" onClick={onDelete} disabled={!card || isSaving}>
          Delete card
        </Button>
        <Box sx={{ display: 'inline-flex', gap: 1 }}>
          <Button onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!formData.title.trim() || isSaving}>
            Save changes
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default CardDetailDialog;
