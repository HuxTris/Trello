import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function BoardContentErrorBanner({ errorMessage, onRetry }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{
        mb: 1.5,
        p: 1,
        borderRadius: 1.5,
        bgcolor: 'rgba(0, 0, 0, 0.2)',
        color: 'common.white',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        {errorMessage}
      </Typography>
      <Button size="small" variant="contained" onClick={onRetry}>
        Retry
      </Button>
    </Stack>
  );
}

export default BoardContentErrorBanner;
