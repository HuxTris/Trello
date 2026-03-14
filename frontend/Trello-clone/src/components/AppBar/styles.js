export const appBarActionButtonSx = {
  color: 'common.white',
  width: 30,
  height: 30,
  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
};

export const appBarMenuButtonSx = {
  color: 'common.white',
  px: 0.75,
  height: 30,
  minWidth: 'auto',
  fontSize: '0.8125rem',
  lineHeight: 1,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  textTransform: 'none',
  display: { xs: 'none', md: 'inline-flex' },
  '& .MuiButton-startIcon': {
    ml: 0,
    mr: 0.5,
  },
  '& .MuiButton-endIcon': {
    ml: 0.25,
    mr: 0,
  },
  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
};

export const appBarSearchInputSx = {
  width: '100%',
  maxWidth: 420,
  height: 32,
  color: 'common.white',
  bgcolor: 'rgba(255, 255, 255, 0.08)',
  '& .MuiOutlinedInput-input': {
    py: '7px',
    fontSize: '0.8125rem',
    lineHeight: 1.2,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  '& input::placeholder': {
    color: 'rgba(255, 255, 255, 0.85)',
    opacity: 1,
  },
};

export const appBarCreateButtonSx = {
  color: 'common.white',
  px: 1,
  height: 30,
  fontSize: '0.8125rem',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  textTransform: 'none',
  bgcolor: 'rgba(255, 255, 255, 0.15)',
  display: { xs: 'none', sm: 'inline-flex' },
  '& .MuiButton-startIcon': {
    ml: 0,
    mr: 0.5,
  },
  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
};
