import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { COLUMN_WIDTH } from '../constants';

function BoardContentLoading() {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        width: '100%',
        px: { xs: 1, md: 2 },
        py: 1.5,
        display: 'flex',
        gap: 1.5,
        height: (theme) => ({
          xs: `calc(100vh - ${theme.trelloCustom.appBarMobileHeight} - ${theme.trelloCustom.boardBarMobileHeight})`,
          md: `calc(100vh - ${theme.trelloCustom.appBarHeight} - ${theme.trelloCustom.boardBarHeight})`,
        }),
        overflowX: 'auto',
      }}
    >
      {[1, 2, 3].map((item) => (
        <Box key={item} sx={{ minWidth: COLUMN_WIDTH, bgcolor: 'column.main', borderRadius: 2, p: 1 }}>
          <Skeleton variant="text" height={36} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Skeleton variant="rounded" height={80} sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.25)' }} />
          <Skeleton variant="rounded" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
        </Box>
      ))}
    </Box>
  );
}

export default BoardContentLoading;
