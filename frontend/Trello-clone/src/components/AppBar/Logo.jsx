import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TrelloMark from '../../assets/trello-mark.svg?react';
import AppSvgIcon from '../SvgIcon';

function AppBarLogo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, height: 30 }}>
      <AppSvgIcon component={TrelloMark} sx={{ color: 'common.white', fontSize: 20 }} />
      <Typography
        variant="body2"
        sx={{
          color: 'common.white',
          fontWeight: 700,
          fontSize: '0.875rem',
          lineHeight: 1,
          letterSpacing: 0.3,
          whiteSpace: 'nowrap',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        Trello
      </Typography>
    </Box>
  );
}

export default AppBarLogo;
