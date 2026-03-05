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
  boardContentLight: '#0079BF',
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
    boardBarHeight: '60px',
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