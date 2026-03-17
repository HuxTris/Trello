import { createTheme } from '@mui/material/styles';

const WHITE_TEXT = '#FFFFFF';

const COLORS = {
  light: {
    primary: { main: '#0079BF', light: '#4FC3F7', dark: '#01579B' },
    appBar: '#1565C0',
    boardBar: '#1976D2',
    boardContent: '#FFFFFF',
    column: '#EBECF0',
    columnHeader: '#091E42',
    card: '#FFFFFF',
  },
  dark: {
    primary: { main: '#579DFF', light: '#85B8FF', dark: '#388BFD' },
    appBar: '#1D2125',
    boardBar: '#1D2125',
    boardContent: '#1D2125',
    column: '#22272B',
    columnHeader: '#B6C2CF',
    card: '#282E33',
  },
};

const STATUS_COLORS = {
  secondary: { main: '#FF9800' },
  error: { main: '#EB5A46' },
  warning: { main: '#F2D600' },
  success: { main: '#61BD4F' },
  info: { main: '#00C2E0' },
};

const APP_BAR_MENU_BUTTON = {
  color: WHITE_TEXT,
  paddingInline: '6px',
  minWidth: 'auto',
  height: 30,
  fontSize: '0.8125rem',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  display: 'none',
  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: 4,
  },
  '& .MuiButton-endIcon': {
    marginLeft: 2,
    marginRight: 0,
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  '@media (min-width:900px)': {
    display: 'inline-flex',
  },
};

const APP_BAR_CREATE_BUTTON = {
  color: WHITE_TEXT,
  paddingInline: '8px',
  minWidth: 'auto',
  height: 30,
  fontSize: '0.8125rem',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  display: 'none',
  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: 4,
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  '@media (min-width:600px)': {
    display: 'inline-flex',
  },
};

const BOARD_BAR_ACTION_BUTTON = {
  color: WHITE_TEXT,
  paddingInline: '8px',
  minWidth: 'auto',
  height: 32,
  borderRadius: 8,
  fontSize: '0.8125rem',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: 4,
  },
  '& .MuiButton-endIcon': {
    marginLeft: 2,
    marginRight: 0,
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
};

const BOARD_BAR_INVITE_BUTTON = {
  color: '#172B4D',
  paddingInline: '10px',
  minWidth: 'auto',
  height: 32,
  borderRadius: 8,
  fontSize: '0.8125rem',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  backgroundColor: '#FFFFFF',
  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: 4,
  },
  '& .MuiButton-endIcon': {
    marginLeft: 2,
    marginRight: 0,
  },
  '&:hover': {
    backgroundColor: '#E9F2FF',
  },
};

const buildColorScheme = (mode) => ({
  palette: {
    primary: COLORS[mode].primary,
    ...STATUS_COLORS,
    background: {
      default: COLORS[mode].boardContent,
      paper: COLORS[mode].card,
    },
    text: {
      primary: WHITE_TEXT,
      secondary: WHITE_TEXT,
    },
    appBar: {
      main: COLORS[mode].appBar,
    },
    boardBar: {
      main: COLORS[mode].boardBar,
    },
    boardContent: {
      main: COLORS[mode].boardContent,
    },
    column: {
      main: COLORS[mode].column,
      header: COLORS[mode].columnHeader,
    },
    card: {
      main: COLORS[mode].card,
    },
  },
});

const theme = createTheme({
  trelloCustom: {
    appBarHeight: '45px',
    appBarMobileHeight: '52px',
    boardBarHeight: '60px',
    boardBarMobileHeight: '56px',
    appBar: {
      root: {
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: { xs: 1, sm: 2 },
        height: { xs: '52px', md: '45px' },
        bgcolor: 'appBar.main',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
        whiteSpace: 'nowrap',
      },
      menusContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 0.25,
      },
      searchContainer: {
        flex: 1,
        minWidth: 0,
        display: { xs: 'none', sm: 'flex' },
        justifyContent: 'center',
        px: 1,
      },
      actionsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.25, sm: 0.5 },
        flexShrink: 0,
      },
      logo: {
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        height: 30,
      },
      logoText: {
        color: 'common.white',
        fontWeight: 700,
        fontSize: '0.875rem',
        lineHeight: 1,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
        display: { xs: 'none', sm: 'block' },
      },
      iconButton: {
        color: 'common.white',
        width: 30,
        height: 30,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
      },
      searchInput: {
        width: '100%',
        maxWidth: { sm: 360, md: 420 },
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
      },
      avatar: {
        width: 30,
        height: 30,
        bgcolor: 'secondary.main',
        fontSize: 14,
      },
      desktopOnly: {
        display: { xs: 'none', md: 'inline-flex' },
      },
      smUpOnly: {
        display: { xs: 'none', sm: 'inline-flex' },
      },
      mobileOnly: {
        display: { xs: 'inline-flex', md: 'none' },
      },
    },
    boardBar: {
      root: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: { xs: 1, sm: 2 },
        height: { xs: '56px', md: '60px' },
        bgcolor: 'boardBar.main',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        minWidth: 0,
      },
      rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.25, sm: 0.5 },
        flexShrink: 0,
      },
      title: {
        color: 'common.white',
        fontWeight: 700,
        fontSize: { xs: '0.9rem', md: '1rem' },
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: { xs: '42vw', sm: '54vw', md: '100%' },
      },
      iconButton: {
        color: 'common.white',
        width: 30,
        height: 30,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
      },
      members: {
        '& .MuiAvatar-root': {
          width: 28,
          height: 28,
          border: '2px solid',
          borderColor: 'boardBar.main',
        },
        '& .MuiSvgIcon-root': {
          fontSize: 16,
        },
      },
      desktopOnly: {
        display: { xs: 'none', md: 'inline-flex' },
      },
      smUpOnly: {
        display: { xs: 'none', sm: 'inline-flex' },
      },
      mobileOnly: {
        display: { xs: 'inline-flex', md: 'none' },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  defaultColorScheme: 'light',
  colorSchemes: {
    light: buildColorScheme('light'),
    dark: buildColorScheme('dark'),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#BFC6D0',
          borderRadius: '8px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#A0AAB4',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
      variants: [
        {
          props: { variant: 'appBarMenu' },
          style: APP_BAR_MENU_BUTTON,
        },
        {
          props: { variant: 'appBarCreate' },
          style: APP_BAR_CREATE_BUTTON,
        },
        {
          props: { variant: 'boardBarAction' },
          style: BOARD_BAR_ACTION_BUTTON,
        },
        {
          props: { variant: 'boardBarInvite' },
          style: BOARD_BAR_INVITE_BUTTON,
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1D2125',
          color: WHITE_TEXT,
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: WHITE_TEXT,
          '& .MuiListItemIcon-root': {
            color: WHITE_TEXT,
          },
        },
      },
    },
  },
});

export default theme;
