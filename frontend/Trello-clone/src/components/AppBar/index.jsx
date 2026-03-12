import Box from '@mui/material/Box';
import AppBarLogo from './Logo';
import AppBarMenus from './Menus';
import AppBarSearch from './SearchBar';
import AppBarActions from './Actions';

function AppBar() {
  return (
    <Box
      sx={{
        height: (theme) => theme.trelloCustom.appBarHeight,
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: { xs: 1, sm: 2 },
        bgcolor: 'appBar.main',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, whiteSpace: 'nowrap' }}>
        <AppBarLogo />
        <AppBarMenus />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', px: 1 }}>
        <AppBarSearch />
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <AppBarActions />
      </Box>
    </Box>
  );
}

export default AppBar;
