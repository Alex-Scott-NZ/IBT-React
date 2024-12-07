import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/article/**/*.{js,ts,jsx,tsx,mdx}',
    './src/book/**/*.{js,ts,jsx,tsx,mdx}',
    './src/journal/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '#__next', // Add this line
  theme: {
    extend: {
      screens: {        // Add this section
        'nav': '1075px',
      },
      lineHeight: {
        tight: '1.2',
        tighter: '0.9',
      },
      colors: {
        'custom-bg': '#EAEAE2',
        'communist-red': '#B00909',
      },
      fontFamily: {
        helvetica: ['var(--font-helvetica-neue)', 'Helvetica', 'Arial', 'sans-serif'],
        telegrafico: ['var(--font-telegrafico)', 'sans-serif'],
        cambay: ['var(--font-cambay)', 'sans-serif'],
      },
      width: {
        '360px': '360px',
        '720px': '720px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            'nav ul': {
              listStyle: 'none',
              margin: '0',
              padding: '0',
            },
            'nav li': {
              margin: '0',
              padding: '0',
            },
            'nav > ul > li > ul': {
              marginTop: '0 !important',
              marginBottom: '0 !important'
            },
            'nav > ul > li > ul > li': {
              marginTop: '0 !important',
              marginBottom: '0 !important'
            },
            a: {
              color: '#B00909',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              textDecorationThickness: '1.75px',
              '&:hover': {
                color: '#B00909',
                opacity: 0.8,
              },
            },
            // Try these variations:
            '.source': {
              marginTop: '0 !important',
              marginBottom: '0 !important'
            },
            // or'0 !important'
            // 'p.source, .source': {
            //   marginTop: '0 !important',
            // },
            // // or
            // '.prose p.source': {
            //   marginTop: '0 !important',
            // }
          },
        },
      }
      
    },
  },
  
  variants: {
    extend: {
      display: ['print'], // Enables `print:block` and `print:hidden`
      padding: ['print'], // Enables `print:py-4` etc.
      margin: ['print'],  // Enables `print:mt-4` etc.
    },
  },

  plugins: [
    require('@tailwindcss/typography')
  ],
  corePlugins: {
    preflight: false
  }
};

export default config;