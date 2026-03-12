import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ModeToggle from '../ToggleMode';
import { appBarActionButtonSx, appBarCreateButtonSx } from './styles';

function AppBarActions() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5 } }}>
      <Button size="small" startIcon={<AddToPhotosOutlinedIcon />} sx={appBarCreateButtonSx}>
        Create
      </Button>
      <Tooltip title="Recent activity">
        <IconButton size="small" sx={appBarActionButtonSx}>
          <AccessTimeOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Notifications">
        <IconButton size="small" sx={appBarActionButtonSx}>
          <NotificationsNoneOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Help">
        <IconButton size="small" sx={appBarActionButtonSx}>
          <HelpOutlineOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <ModeToggle />
      <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main', fontSize: 14 }}>H</Avatar>
    </Box>
  );
}

export default AppBarActions;
