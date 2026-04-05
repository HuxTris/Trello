import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import MenuButton from './MenuButton';

const WORKSPACE_ITEMS = [
  { id: 'boards', label: 'Your boards', icon: SpaceDashboardOutlinedIcon },
  { id: 'members', label: 'Members', icon: Groups2OutlinedIcon },
  { id: 'settings', label: 'Workspace settings', icon: SettingsOutlinedIcon },
  { id: 'create', label: 'Create new board', icon: AddBoxOutlinedIcon },
];

function WorkspacesMenu() {
  return <MenuButton label="Workspaces" icon={SpaceDashboardOutlinedIcon} items={WORKSPACE_ITEMS} />;
}

export default WorkspacesMenu;
