import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function MenuButton({ label, icon: IconComponent }) {
  return (
    <Button
      size="small"
      variant="appBarMenu"
      startIcon={IconComponent ? <IconComponent sx={{ fontSize: 16 }} /> : null}
      endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
    >
      {label}
    </Button>
  );
}

export default MenuButton;
