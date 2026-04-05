import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ModeToggle from '../ToggleMode';
import MuiDropdownMenu from '../Dropdown/MuiDropdownMenu';

const CREATE_ITEMS = [
  { id: 'create-board', label: 'Create board', icon: ViewKanbanOutlinedIcon },
  { id: 'create-workspace', label: 'Create workspace', icon: DashboardCustomizeOutlinedIcon },
  { id: 'create-template', label: 'Create from template', icon: AssignmentOutlinedIcon },
];

const ACTIVITY_ITEMS = [
  { id: 'act-1', label: 'Phuong moved card "Navbar"', icon: AccessTimeOutlinedIcon },
  { id: 'act-2', label: 'You updated board settings', icon: AccessTimeOutlinedIcon },
  { id: 'act-3', label: 'View all activity', icon: ViewKanbanOutlinedIcon },
];

const NOTIFICATION_ITEMS = [
  { id: 'noti-1', label: '3 cards are due today', icon: NotificationsNoneOutlinedIcon },
  { id: 'noti-2', label: 'You were mentioned in a comment', icon: NotificationsNoneOutlinedIcon },
  { id: 'noti-3', label: 'Notification settings', icon: SettingsOutlinedIcon },
];

const HELP_ITEMS = [
  { id: 'help-1', label: 'Shortcuts', icon: HelpOutlineOutlinedIcon },
  { id: 'help-2', label: 'Getting started guide', icon: AssignmentOutlinedIcon },
  { id: 'help-3', label: 'Support', icon: AccountCircleOutlinedIcon },
];

const PROFILE_ITEMS = [
  { id: 'profile', label: 'Profile', icon: AccountCircleOutlinedIcon },
  { id: 'account-settings', label: 'Account settings', icon: SettingsOutlinedIcon },
  { id: 'logout', label: 'Log out', icon: LogoutOutlinedIcon },
];

const MOBILE_MENU_ITEMS = [
  { id: 'mobile-workspaces', label: 'Workspaces', icon: DashboardCustomizeOutlinedIcon },
  { id: 'mobile-recent', label: 'Recent boards', icon: AccessTimeOutlinedIcon },
  { id: 'mobile-templates', label: 'Templates', icon: AssignmentOutlinedIcon },
  { id: 'mobile-create', label: 'Create', icon: AddToPhotosOutlinedIcon },
  { id: 'mobile-filter', label: 'Filters', icon: FilterListOutlinedIcon },
  { id: 'mobile-account', label: 'Account', icon: AccountCircleOutlinedIcon },
];

const MOBILE_SEARCH_ITEMS = [
  { id: 'search-card', label: 'Search cards', icon: SearchOutlinedIcon },
  { id: 'search-members', label: 'Search members', icon: AccountCircleOutlinedIcon },
  { id: 'search-filters', label: 'Quick filters', icon: FilterListOutlinedIcon },
];

function AppBarActions() {
  return (
    <Box sx={(theme) => theme.trelloCustom.appBar.actionsContainer}>
      <MuiDropdownMenu
        items={CREATE_ITEMS}
        renderTrigger={({ triggerProps }) => (
          <Button size="small" variant="appBarCreate" startIcon={<AddToPhotosOutlinedIcon />} {...triggerProps}>
            Create
          </Button>
        )}
      />

      <MuiDropdownMenu
        items={MOBILE_SEARCH_ITEMS}
        minWidth={220}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        renderTrigger={({ triggerProps }) => (
          <IconButton size="small" sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.mobileOnly })} {...triggerProps}>
            <SearchOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      />

      <MuiDropdownMenu
        items={ACTIVITY_ITEMS}
        minWidth={280}
        renderTrigger={({ triggerProps }) => (
          <IconButton
            size="small"
            sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.desktopOnly })}
            {...triggerProps}
          >
            <AccessTimeOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      />

      <MuiDropdownMenu
        items={NOTIFICATION_ITEMS}
        minWidth={290}
        renderTrigger={({ triggerProps }) => (
          <IconButton size="small" sx={(theme) => theme.trelloCustom.appBar.iconButton} {...triggerProps}>
            <NotificationsNoneOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      />

      <MuiDropdownMenu
        items={HELP_ITEMS}
        minWidth={260}
        renderTrigger={({ triggerProps }) => (
          <IconButton
            size="small"
            sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.desktopOnly })}
            {...triggerProps}
          >
            <HelpOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      />

      <ModeToggle />

      <MuiDropdownMenu
        items={PROFILE_ITEMS}
        minWidth={220}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        renderTrigger={({ triggerProps }) => (
          <Avatar sx={(theme) => ({ ...theme.trelloCustom.appBar.avatar, cursor: 'pointer' })} {...triggerProps}>
            H
          </Avatar>
        )}
      />

      <MuiDropdownMenu
        items={MOBILE_MENU_ITEMS}
        minWidth={250}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        renderTrigger={({ triggerProps }) => (
          <IconButton
            size="small"
            sx={(theme) => ({ ...theme.trelloCustom.appBar.iconButton, ...theme.trelloCustom.appBar.mobileOnly })}
            {...triggerProps}
          >
            <MenuOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      />
    </Box>
  );
}

export default AppBarActions;
