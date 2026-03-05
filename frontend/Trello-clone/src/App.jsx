import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
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

function App() {

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh'}}>
      <Box sx={{ 
        backgroundColor: 'primary.light', 
        height: (theme) => theme.trelloCustom.appBarHeight, 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        }}>
        <ModeToggle />
      </Box>
      <Box sx={{
        bgcolor: 'primary.dark',
        height: (theme) => theme.trelloCustom.boardBarHeight, 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
        Board Bar
      </Box>
      <Box sx={{
        bgcolor: 'primary.main',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        height: (theme) => `calc(100vh - ${theme.trelloCustom.appBarHeight} - ${theme.trelloCustom.boardBarHeight})`,
      }}>
        Board Content
      </Box>
    </Container>
  )
}

export default App
