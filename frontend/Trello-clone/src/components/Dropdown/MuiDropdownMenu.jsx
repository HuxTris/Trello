import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function MuiDropdownMenu({
  items = [],
  renderTrigger,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  minWidth = 220,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleTriggerClick = (event) => {
    if (open && anchorEl === event.currentTarget) {
      setAnchorEl(null);
      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {renderTrigger({
        open,
        triggerProps: {
          onClick: handleTriggerClick,
          'aria-expanded': open ? 'true' : undefined,
          'aria-haspopup': 'menu',
        },
      })}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{
          paper: {
            sx: {
              minWidth,
              mt: 0,
              borderRadius: 2,
            },
          },
        }}
      >
        {items.map((item) => {
          const IconComponent = item.icon;

          return (
            <MenuItem
              key={item.id}
              onClick={() => {
                if (item.onClick) item.onClick(item);
                handleClose();
              }}
              disabled={item.disabled}
            >
              {IconComponent ? (
                <ListItemIcon>
                  <IconComponent fontSize="small" />
                </ListItemIcon>
              ) : null}
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

export default MuiDropdownMenu;
