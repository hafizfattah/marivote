/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './layouts/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hfg: {
          black: '#18191F',
          orange: '#F95A2C',
          green: '#00C6AE',
          yellow: '#FFBD12',
          pink: '#FF89BB',
          blue: '#1947E5',
          'orange-medium': '#FF9692',
          'green-medium': '#61E4C5',
          'yellow-medium': '#FFD465',
          'pink-medium': '#FFC7DE',
          'blue-medium': '#8094FF',
          'orange-light': '#FFE8E8',
          'green-light': '#D6FCF7',
          'yellow-light': '#FFF4CC',
          'pink-light': '#FFF3F8',
          'blue-light': '#E9E7FC',
        },
      },
      container: {
        center: true,
        padding: '1.25rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
        },
      },
    },
  },
  plugins: [],
};
