import Button from '@mui/material/Button';
import { useColorScheme } from '@mui/material/styles';

function ModeToggle() {
  const { mode, setMode } = useColorScheme();

  // mode chưa được xác định trên lần render đầu tiên (SSR-safe)
  // Nếu chưa có mode, không render gì cả để tránh hydration mismatch
  if (!mode) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
      sx={{
        color: 'text.primary',
        borderColor: 'text.primary',
        '&:hover': {
          borderColor: 'text.primary',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      {mode === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
    </Button>
  );
}

export default ModeToggle