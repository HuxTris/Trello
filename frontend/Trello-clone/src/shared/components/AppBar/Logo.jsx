import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TrelloMark from '../../assets/trello-mark.svg?react';
import AppSvgIcon from '../SvgIcon';

function AppBarLogo() {
  return (
    <Box sx={(theme) => theme.trelloCustom.appBar.logo}>
      <AppSvgIcon component={TrelloMark} sx={{ color: 'common.white', fontSize: 20 }} />
      <Typography variant="body2" sx={(theme) => theme.trelloCustom.appBar.logoText}>
        Trello
      </Typography>
    </Box>
  );
}

export default AppBarLogo;
