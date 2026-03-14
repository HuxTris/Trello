import SvgIcon from '@mui/material/SvgIcon';

function AppSvgIcon({ component, ...props }) {
  return <SvgIcon component={component} inheritViewBox {...props} />;
}

export default AppSvgIcon;
