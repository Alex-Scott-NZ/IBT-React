// src/app/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {    // Add this section
    values: {
      xs: 0,
      sm: 600,
      md: 1075,     // This is the breakpoint we want for the navigation
      lg: 1200,
      xl: 1536,
    },
  },
  shadows: Array(25).fill('none') as [
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
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
          letterSpacing: '0.05em', // Add some spacing between buttons
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
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1.2rem', // Adjust the font size of menu items
          letterSpacing: '0.05em', // Add some spacing between menu items
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            fontSize: '1.2rem', // Adjust font size for the text in the drawer
            letterSpacing: '0.05em', // Add some spacing between text in the drawer
          },
        },
      },
    },
    // MuiListItemButton: {
    //   styleOverrides: {
    //     root: {
    //       '@media (max-width:600px)': {

    //         fontSize: '1rem', // Font size for buttons in mobile view
    //       },
    //     },
    //   },
    // },
  },
});

export default theme;
