// src/app/theme.ts
import { createTheme } from '@mui/material/styles';


const theme = createTheme({
    shadows: Array(25).fill("none") as [
        "none", "none", "none", "none", "none", 
        "none", "none", "none", "none", "none", 
        "none", "none", "none", "none", "none", 
        "none", "none", "none", "none", "none", 
        "none", "none", "none", "none", "none"
      ],
  palette: {
    primary: {
      main: '#B00909',
    },
    text: {
      primary: '#B00909',
    },
  },
  typography: {
    fontFamily: 'var(--font-cambay), sans-serif',
    button: {
      textTransform: 'none',
      fontSize: '1.4rem', // Make the button font slightly smaller
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#B00909',
          fontFamily: 'var(--font-cambay), sans-serif',

          fontSize: '1.4rem', // Adjust font size to make buttons smaller
          fontWeight: 'bold',
          lineHeight: 1.0, // Ensure proper line-height to vertically center the text

        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: '#B00909',
          fontFamily: 'var(--font-cambay), sans-serif',
          backgroundColor: '#EAEAE2', 
          
        },
      },
    },
  },
});

export default theme;
