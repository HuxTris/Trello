import { useEffect, useRef, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function HoverDropdownMenu({
  items,
  renderTrigger,
  openOnHover = true,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  minWidth = 220,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const closeTimerRef = useRef(null);

  const open = Boolean(anchorEl);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleOpen = (event) => {
    clearCloseTimer();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    clearCloseTimer();
    setAnchorEl(null);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 120);
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  return (
    <>
      {renderTrigger({
        open,
        triggerProps: {
          onClick: handleOpen,
          onMouseEnter: openOnHover ? handleOpen : undefined,
          onMouseLeave: openOnHover ? scheduleClose : undefined,
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
            onMouseEnter: openOnHover ? clearCloseTimer : undefined,
            onMouseLeave: openOnHover ? scheduleClose : undefined,
            sx: {
              minWidth,
              mt: 0.5,
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

export default HoverDropdownMenu;
