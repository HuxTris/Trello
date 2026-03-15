import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

const BOARD_MEMBERS = ['AL', 'HN', 'MK', 'PT', 'QH'];

function BoardBarRight() {
  return (
    <Box sx={(theme) => theme.trelloCustom.boardBar.rightSection}>
      <AvatarGroup max={4} sx={(theme) => ({ ...theme.trelloCustom.boardBar.members, ...theme.trelloCustom.boardBar.smUpOnly })}>
        {BOARD_MEMBERS.map((member) => (
          <Avatar key={member}>{member}</Avatar>
        ))}
      </AvatarGroup>

      <Button
        size="small"
        variant="boardBarInvite"
        startIcon={<PersonAddAlt1OutlinedIcon fontSize="small" />}
        sx={(theme) => theme.trelloCustom.boardBar.smUpOnly}
      >
        Invite
      </Button>

      <Tooltip title="Invite">
        <IconButton size="small" sx={(theme) => ({ ...theme.trelloCustom.boardBar.iconButton, ...theme.trelloCustom.boardBar.mobileOnly })}>
          <PersonAddAlt1OutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Button
        size="small"
        variant="boardBarAction"
        startIcon={<BoltOutlinedIcon fontSize="small" />}
        sx={(theme) => theme.trelloCustom.boardBar.desktopOnly}
      >
        Automation
      </Button>

      <Button
        size="small"
        variant="boardBarAction"
        startIcon={<FilterListOutlinedIcon fontSize="small" />}
        sx={(theme) => theme.trelloCustom.boardBar.smUpOnly}
      >
        Filter
      </Button>

      <Tooltip title="More options">
        <IconButton size="small" sx={(theme) => theme.trelloCustom.boardBar.iconButton}>
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default BoardBarRight;
