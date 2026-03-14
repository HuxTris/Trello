import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme } from '@mui/material/styles';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

function ModeToggle() {
  const { mode, setMode } = useColorScheme();

  // mode chưa được xác định trên lần render đầu tiên (SSR-safe)
  // Nếu chưa có mode, không render gì cả để tránh hydration mismatch
  if (!mode) {
    return null;
  }

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton
        size="small"
        onClick={() => {
          setMode(mode === 'light' ? 'dark' : 'light');
        }}
        sx={{
          color: 'common.white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        {mode === 'light' ? (
          <DarkModeOutlinedIcon fontSize="small" />
        ) : (
          <LightModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default ModeToggle
