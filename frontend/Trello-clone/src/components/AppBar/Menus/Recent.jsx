import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import MenuButton from './MenuButton';

const RECENT_ITEMS = [
  { id: 'recent-1', label: 'UI Refactor Board', icon: HistoryOutlinedIcon },
  { id: 'recent-2', label: 'Design System Tasks', icon: HistoryOutlinedIcon },
  { id: 'recent-3', label: 'Mobile QA Checklist', icon: CheckCircleOutlineOutlinedIcon },
  { id: 'recent-4', label: 'Recently viewed boards', icon: AccessTimeOutlinedIcon },
];

function RecentMenu() {
  return <MenuButton label="Recent" icon={AccessTimeOutlinedIcon} items={RECENT_ITEMS} />;
}

export default RecentMenu;
