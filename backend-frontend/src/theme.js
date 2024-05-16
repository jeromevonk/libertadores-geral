import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#0b2d39',
    },
    secondary: {
      main: '#0e609e',
    },
    error: {
      main: red.A400,
    },
    action: {
      hover: '#2187ab'
    }
  },
});

export default theme;
