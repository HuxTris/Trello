import { createTheme } from '@mui/material/styles'

// Trello-inspired colors
const TRELLO_COLORS = {
  // Primary Blue (Trello brand blue)
  primaryLight: '#0079BF',
  primaryDark: '#579DFF',

  // App Bar / Header
  appBarLight: '#1565C0',
  appBarDark: '#1D2125',

  // Board Bar (sub-header below appbar)
  boardBarLight: '#1976D2',
  boardBarDark: '#1D2125',

  // Board Content (main area)
  boardContentLight: '#ffffffff',
  boardContentDark: '#1D2125',

  // Column (list)
  columnLight: '#EBECF0',
  columnDark: '#22272B',
  columnHeaderLight: '#091E42',
  columnHeaderDark: '#B6C2CF',

  // Card
  cardLight: '#FFFFFF',
  cardDark: '#282E33',

  // Text colors
  textPrimaryLight: '#000206ff',
  textPrimaryDark: '#f5f5f5ff',
  textSecondaryLight: '#44546F',
  textSecondaryDark: '#8C9BAB',
}

// Create a theme instance.
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
          fontSize: 12,
          border: '2px solid',
          borderColor: 'boardBar.main',
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
    colorSchemeSelector: 'class'
  },
  defaultColorScheme: 'light',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: TRELLO_COLORS.primaryLight,        // #0079BF - Trello blue
          light: '#4FC3F7',
          dark: '#01579B',
        },
        secondary: {
          main: '#FF9800',
        },
        error: {
          main: '#EB5A46',     // Trello red
        },
        warning: {
          main: '#F2D600',     // Trello yellow
        },
        success: {
          main: '#61BD4F',     // Trello green
        },
        info: {
          main: '#00C2E0',     // Trello teal
        },
        background: {
          default: TRELLO_COLORS.boardContentLight,
          paper: TRELLO_COLORS.cardLight,
        },
        text: {
          primary: TRELLO_COLORS.textPrimaryLight,
          secondary: TRELLO_COLORS.textSecondaryLight,
        },
        // -- Custom colors (access via theme.palette.xxx) --
        appBar: {
          main: TRELLO_COLORS.appBarLight,
        },
        boardBar: {
          main: TRELLO_COLORS.boardBarLight,
        },
        boardContent: {
          main: TRELLO_COLORS.boardContentLight,
        },
        column: {
          main: TRELLO_COLORS.columnLight,
          header: TRELLO_COLORS.columnHeaderLight,
        },
        card: {
          main: TRELLO_COLORS.cardLight,
        },
      }
    },
    dark: {
      palette: {
        primary: {
          main: TRELLO_COLORS.primaryDark,         // #579DFF
          light: '#85B8FF',
          dark: '#388BFD',
        },
        secondary: {
          main: '#FFA726',
        },
        error: {
          main: '#EF5350',
        },
        warning: {
          main: '#FDD835',
        },
        success: {
          main: '#66BB6A',
        },
        info: {
          main: '#29B6F6',
        },
        background: {
          default: '#1D2125',
          paper: TRELLO_COLORS.cardDark,
        },
        text: {
          primary: TRELLO_COLORS.textPrimaryDark,
          secondary: TRELLO_COLORS.textSecondaryDark,
        },
        // -- Custom colors (access via theme.palette.xxx) --
        appBar: {
          main: TRELLO_COLORS.appBarDark,
        },
        boardBar: {
          main: TRELLO_COLORS.boardBarDark,
        },
        boardContent: {
          main: TRELLO_COLORS.boardContentDark,
        },
        column: {
          main: TRELLO_COLORS.columnDark,
          header: TRELLO_COLORS.columnHeaderDark,
        },
        card: {
          main: TRELLO_COLORS.cardDark,
        },
      }
    }
  },
  // -- Shared component overrides & typography --
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Tạo variant nhỏ hơn cho labels, badges
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Scrollbar custom cho cả trang
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
          textTransform: 'none', // Trello không dùng uppercase cho button
          fontWeight: 500,
        },
      },
      variants: [
        {
          props: { variant: 'appBarMenu' },
          style: {
            color: '#FFFFFF',
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
          },
        },
        {
          props: { variant: 'appBarCreate' },
          style: {
            color: '#FFFFFF',
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
          },
        },
        {
          props: { variant: 'boardBarAction' },
          style: {
            color: '#FFFFFF',
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
          },
        },
        {
          props: { variant: 'boardBarInvite' },
          style: {
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
          },
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
    MuiTypography: {
      styleOverrides: {
        root: {
          // Để chống overflow text ngoài box
          '&.MuiTypography-body1': {
            fontSize: '0.875rem',
          },
        },
      },
    },
  },
})

export default theme
