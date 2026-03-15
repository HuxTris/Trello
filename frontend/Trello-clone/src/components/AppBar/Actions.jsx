import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ModeToggle from '../ToggleMode';

function AppBarActions() {
  return (
    <Box sx={(theme) => theme.trelloCustom.appBar.actionsContainer}>
      <Button size="small" variant="appBarCreate" startIcon={<AddToPhotosOutlinedIcon />}>
        Create
      </Button>

      <Tooltip title="Search">
        <IconButton size="small" sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.mobileOnly })}>
          <SearchOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Recent activity">
        <IconButton size="small" sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.desktopOnly })}>
          <AccessTimeOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton size="small" sx={(theme) => theme.trelloCustom.appBar.iconButton}>
          <NotificationsNoneOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Help">
        <IconButton size="small" sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.desktopOnly })}>
          <HelpOutlineOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <ModeToggle />

      <Avatar sx={(theme) => theme.trelloCustom.appBar.avatar}>H</Avatar>

      <Tooltip title="Menu">
        <IconButton size="small" sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.mobileOnly })}>
          <MenuOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default AppBarActions;
