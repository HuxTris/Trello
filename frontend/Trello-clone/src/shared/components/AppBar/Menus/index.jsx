import Box from '@mui/material/Box';
import WorkspacesMenu from './Workspaces';
import StartedMenu from './Started';
import RecentMenu from './Recent';
import TemplatesMenu from './Templates';

function AppBarMenus() {
  return (
    <Box sx={(theme) => theme.trelloCustom.appBar.menusContainer}>
      <WorkspacesMenu />
      <StartedMenu />
      <RecentMenu />
      <TemplatesMenu />
    </Box>
  );
}

export default AppBarMenus;
