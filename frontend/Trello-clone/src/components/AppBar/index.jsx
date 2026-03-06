import Box from '@mui/material/Box';
import ModeToggle from '../ToggleMode';
import AppsIcon from '@mui/icons-material/Apps';

function AppBar() {
  return (
    <Box sx={{  
        height: (theme) => theme.trelloCustom.appBarHeight, 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        }}>
       
        <Box >
          <AppsIcon sx={{ color: 'primary.main' }}/>
        </Box>

        <Box>
           <ModeToggle />
        </Box>
    </Box>
  )
}

export default AppBar