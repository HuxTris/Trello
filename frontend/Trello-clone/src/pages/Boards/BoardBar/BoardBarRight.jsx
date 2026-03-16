import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import HoverDropdownMenu from '../../../components/Dropdown/HoverDropdownMenu';

const BOARD_MEMBERS = ['AL', 'HN', 'MK', 'PT', 'QH'];

const INVITE_ITEMS = [
  { id: 'invite-email', label: 'Invite by email', icon: PersonAddAlt1OutlinedIcon },
  { id: 'share-link', label: 'Copy invite link', icon: ViewKanbanOutlinedIcon },
  { id: 'manage-members', label: 'Manage members', icon: TuneOutlinedIcon },
];

const AUTOMATION_ITEMS = [
  { id: 'rules', label: 'Rules', icon: AutoFixHighOutlinedIcon },
  { id: 'buttons', label: 'Buttons', icon: BoltOutlinedIcon },
  { id: 'calendar', label: 'Calendar commands', icon: TuneOutlinedIcon },
];

const FILTER_ITEMS = [
  { id: 'filter-member', label: 'By member', icon: PersonAddAlt1OutlinedIcon },
  { id: 'filter-label', label: 'By label', icon: TuneOutlinedIcon },
  { id: 'clear-filter', label: 'Clear filters', icon: FilterListOutlinedIcon },
];

const MORE_ITEMS = [
  { id: 'change-background', label: 'Change background', icon: ViewKanbanOutlinedIcon },
  { id: 'board-settings', label: 'Board settings', icon: TuneOutlinedIcon },
  { id: 'archive-board', label: 'Archive board', icon: ArchiveOutlinedIcon },
];

function BoardBarRight() {
  return (
    <Box sx={(theme) => theme.trelloCustom.boardBar.rightSection}>
      <AvatarGroup max={4} sx={(theme) => ({ ...theme.trelloCustom.boardBar.members, ...theme.trelloCustom.boardBar.smUpOnly })}>
        {BOARD_MEMBERS.map((member) => (
          <Avatar key={member}>{member}</Avatar>
        ))}
      </AvatarGroup>

      <HoverDropdownMenu
        items={INVITE_ITEMS}
        minWidth={240}
        renderTrigger={({ triggerProps }) => (
          <Button
            size="small"
            variant="boardBarInvite"
            startIcon={<PersonAddAlt1OutlinedIcon fontSize="small" />}
            endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
            sx={(theme) => theme.trelloCustom.boardBar.smUpOnly}
            {...triggerProps}
          >
            Invite
          </Button>
        )}
      />

      <HoverDropdownMenu
        items={INVITE_ITEMS}
        openOnHover={false}
        minWidth={240}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        renderTrigger={({ triggerProps }) => (
          <IconButton size="small" sx={(theme) => ({ ...theme.trelloCustom.boardBar.iconButton, ...theme.trelloCustom.boardBar.mobileOnly })} {...triggerProps}>
            <PersonAddAlt1OutlinedIcon fontSize="small" />
          </IconButton>
        )}
      />

      <HoverDropdownMenu
        items={AUTOMATION_ITEMS}
        minWidth={240}
        renderTrigger={({ triggerProps }) => (
          <Button
            size="small"
            variant="boardBarAction"
            startIcon={<BoltOutlinedIcon fontSize="small" />}
            endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
            sx={(theme) => theme.trelloCustom.boardBar.desktopOnly}
            {...triggerProps}
          >
            Automation
          </Button>
        )}
      />

      <HoverDropdownMenu
        items={FILTER_ITEMS}
        minWidth={220}
        renderTrigger={({ triggerProps }) => (
          <Button
            size="small"
            variant="boardBarAction"
            startIcon={<FilterListOutlinedIcon fontSize="small" />}
            endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
            sx={(theme) => theme.trelloCustom.boardBar.smUpOnly}
            {...triggerProps}
          >
            Filter
          </Button>
        )}
      />

      <HoverDropdownMenu
        items={MORE_ITEMS}
        minWidth={230}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        renderTrigger={({ triggerProps }) => (
          <IconButton size="small" sx={(theme) => theme.trelloCustom.boardBar.iconButton} {...triggerProps}>
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      />
    </Box>
  );
}

export default BoardBarRight;
