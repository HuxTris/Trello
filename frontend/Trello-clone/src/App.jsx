import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';
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
    >
      {mode === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
    </Button>
  );
}

function App() {

  return (
    <>
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      <div>Phan Huu Tri</div>
      <ModeToggle />
    </Stack>
    <Button variant='text'>Text</Button>
    <Button variant='contained'>Contained</Button>
    <Button variant='outlined'>Outlined</Button>
    <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
      <Icon>add_circle</Icon>
      <Icon color="primary">add_circle</Icon>
      <Icon sx={{ color: green[500] }}>add_circle</Icon>
      <Icon fontSize="small">add_circle</Icon>
      <Icon sx={{ fontSize: 30 }}>add_circle</Icon>
    </Stack>
    </>
  )
}

export default App
