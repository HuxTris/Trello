import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class'
  },
  defaultColorScheme: 'light',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#556cd6',
        },
        secondary: {
          main: '#19857b',
        },
        error: {
          main: red.A400,
        },
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9', // primary color for dark mode
        },
        secondary: {
          main: '#f48fb1',
        },
        error: {
          main: red.A400,
        },
      }
    }
  },
});

export default theme;