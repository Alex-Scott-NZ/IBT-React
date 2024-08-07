import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '#__next', // Add this line
  theme: {
    extend: {
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
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};

export default config;