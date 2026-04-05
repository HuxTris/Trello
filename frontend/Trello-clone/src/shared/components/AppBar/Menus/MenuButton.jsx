import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MuiDropdownMenu from '../../Dropdown/MuiDropdownMenu';

function MenuButton({ label, icon: IconComponent, items = [] }) {
  return (
    <MuiDropdownMenu
      items={items}
      renderTrigger={({ triggerProps }) => (
        <Button
          size="small"
          variant="appBarMenu"
          startIcon={IconComponent ? <IconComponent sx={{ fontSize: 16 }} /> : null}
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
          {...triggerProps}
        >
          {label}
        </Button>
      )}
    />
  );
}

export default MenuButton;
