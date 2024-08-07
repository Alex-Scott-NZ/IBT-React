import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-helvetica-neue), Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: 'var(--font-telegrafico), sans-serif',
    },
    h2: {
      fontFamily: 'var(--font-cambay), sans-serif',
    },
    // You can customize other typography variants as needed
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationLine: 'none',
          '&:hover': {
            textDecorationLine: 'none',
          },
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        container: () => document.getElementById('__next'),
      },
    },
    MuiPopper: {
      defaultProps: {
        container: () => document.getElementById('__next'),
      },
    },
    MuiDialog: {
      defaultProps: {
        container: () => document.getElementById('__next'),
      },
    },
    MuiModal: {
      defaultProps: {
        container: () => document.getElementById('__next'),
      },
    },
  },
  // Add more customizations as needed
});

export default theme;