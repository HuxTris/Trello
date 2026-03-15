import Box from '@mui/material/Box';
import AppBarLogo from './Logo';
import AppBarMenus from './Menus';
import AppBarSearch from './SearchBar';
import AppBarActions from './Actions';

function AppBar() {
  return (
    <Box sx={(theme) => theme.trelloCustom.appBar.root}>
      <Box sx={(theme) => theme.trelloCustom.appBar.leftSection}>
        <AppBarLogo />
        <AppBarMenus />
      </Box>

      <Box sx={(theme) => theme.trelloCustom.appBar.searchContainer}>
        <AppBarSearch />
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <AppBarActions />
      </Box>
    </Box>
  );
}

export default AppBar;
