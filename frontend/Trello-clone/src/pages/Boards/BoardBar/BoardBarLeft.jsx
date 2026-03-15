import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

function BoardBarLeft() {
  return (
    <Box sx={(theme) => theme.trelloCustom.boardBar.leftSection}>
      <Typography sx={(theme) => theme.trelloCustom.boardBar.title}>Frontend Sprint Board</Typography>

      <Tooltip title="Star this board">
        <IconButton size="small" sx={(theme) => theme.trelloCustom.boardBar.iconButton}>
          <StarBorderOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Button
        size="small"
        variant="boardBarAction"
        startIcon={<LockOutlinedIcon fontSize="small" />}
        sx={(theme) => theme.trelloCustom.boardBar.smUpOnly}
      >
        Private
      </Button>

      <Button
        size="small"
        variant="boardBarAction"
        startIcon={<Groups2OutlinedIcon fontSize="small" />}
        endIcon={<KeyboardArrowDownOutlinedIcon fontSize="small" />}
        sx={(theme) => theme.trelloCustom.boardBar.desktopOnly}
      >
        Workspace visible
      </Button>
    </Box>
  );
}

export default BoardBarLeft;
