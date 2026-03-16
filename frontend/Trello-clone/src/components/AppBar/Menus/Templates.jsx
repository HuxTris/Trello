import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuButton from './MenuButton';

const TEMPLATE_ITEMS = [
  { id: 'template-project', label: 'Project management', icon: RocketLaunchOutlinedIcon },
  { id: 'template-marketing', label: 'Marketing campaign', icon: LightbulbOutlinedIcon },
  { id: 'template-product', label: 'Product roadmap', icon: DashboardCustomizeOutlinedIcon },
  { id: 'template-sales', label: 'Sales pipeline', icon: ShoppingBagOutlinedIcon },
];

function TemplatesMenu() {
  return <MenuButton label="Templates" icon={DashboardCustomizeOutlinedIcon} items={TEMPLATE_ITEMS} />;
}

export default TemplatesMenu;
