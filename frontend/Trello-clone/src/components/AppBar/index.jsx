import Box from '@mui/material/Box';
import ModeToggle from '../ToggleMode';

function AppBar() {
  return (
    <Box sx={{ 
        backgroundColor: 'primary.light', 
        height: (theme) => theme.trelloCustom.appBarHeight, 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        }}>
        <ModeToggle />
      </Box>
  )
}

export default AppBar