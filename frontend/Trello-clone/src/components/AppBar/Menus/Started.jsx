import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MenuButton from './MenuButton';

const STARTED_ITEMS = [
  { id: 'starred-1', label: 'Frontend Sprint Board', icon: StarBorderOutlinedIcon },
  { id: 'starred-2', label: 'Marketing Roadmap', icon: StarBorderOutlinedIcon },
  { id: 'pinned', label: 'Pinned boards', icon: PushPinOutlinedIcon },
  { id: 'recent-starred', label: 'Recently opened', icon: AccessTimeOutlinedIcon },
];

function StartedMenu() {
  return <MenuButton label="Started" icon={StarBorderOutlinedIcon} items={STARTED_ITEMS} />;
}

export default StartedMenu;
