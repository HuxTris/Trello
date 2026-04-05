import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import MuiDropdownMenu from '@/shared/components/Dropdown/MuiDropdownMenu';

const PRIVATE_ITEMS = [
  { id: 'private', label: 'Private', icon: LockOutlinedIcon },
  { id: 'workspace-visible', label: 'Workspace visible', icon: VisibilityOutlinedIcon },
  { id: 'edit-permissions', label: 'Edit permissions', icon: EditOutlinedIcon },
];

const VISIBILITY_ITEMS = [
  { id: 'visible-members', label: 'Visible to workspace members', icon: Groups2OutlinedIcon },
  { id: 'copy-link', label: 'Copy board link', icon: ContentCopyOutlinedIcon },
  { id: 'change-visibility', label: 'Change visibility', icon: EditOutlinedIcon },
];

function BoardBarLeft({ boardTitle, boardList = [], boardId, onChangeBoard }) {
  const boardSwitchItems = (boardList || []).map((board) => ({
    id: `switch-${board.id}`,
    label: board.id === boardId ? `${board.title} (Current)` : board.title,
    icon: ViewKanbanOutlinedIcon,
    onClick: () => onChangeBoard(board.id),
  }));

  return (
    <Box sx={(theme) => theme.trelloCustom.boardBar.leftSection}>
      <MuiDropdownMenu
        items={boardSwitchItems}
        minWidth={260}
        renderTrigger={({ triggerProps }) => (
          <Button
            size="small"
            sx={{
              minWidth: 'auto',
              px: 0.5,
              color: 'common.white',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' },
            }}
            startIcon={<ViewKanbanOutlinedIcon fontSize="small" />}
            endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
            {...triggerProps}
          >
            <Typography sx={(theme) => theme.trelloCustom.boardBar.title}>
              {boardTitle || 'Loading board...'}
            </Typography>
          </Button>
        )}
      />

      <Tooltip title="Star this board">
        <IconButton size="small" sx={(theme) => theme.trelloCustom.boardBar.iconButton}>
          <StarBorderOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <MuiDropdownMenu
        items={PRIVATE_ITEMS}
        minWidth={240}
        renderTrigger={({ triggerProps }) => (
          <Button
            size="small"
            variant="boardBarAction"
            startIcon={<LockOutlinedIcon fontSize="small" />}
            endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
            sx={(theme) => theme.trelloCustom.boardBar.smUpOnly}
            {...triggerProps}
          >
            Private
          </Button>
        )}
      />

      <MuiDropdownMenu
        items={VISIBILITY_ITEMS}
        minWidth={270}
        renderTrigger={({ triggerProps }) => (
          <Button
            size="small"
            variant="boardBarAction"
            startIcon={<Groups2OutlinedIcon fontSize="small" />}
            endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
            sx={(theme) => theme.trelloCustom.boardBar.desktopOnly}
            {...triggerProps}
          >
            Workspace visible
          </Button>
        )}
      />
    </Box>
  );
}

export default BoardBarLeft;
