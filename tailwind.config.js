/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './App.tsx'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#302E2B',
        backgroundTransparent: 'rgba(84, 80, 75, 0.9)',
        headerBackGroundColor: '#312F2C',
        cardBackgroundColor: '#54504B',
        iconGrey: '#B5B6B5',
        darkGrey: '#262522',
        standardGrey: '#C7C7C7',
        buttonBlueFontColor: '#007AFF',
        buttonDisabledFontColor: '#808080',
        appGreen: '#6B9C41',
        appYellow: '#F4C300',
        appBlue: '#597FD1',
        appRed: '#C24542',

        primaryColor: '#283618',
        secondaryColor: '#fefae0',
        tertiaryColor: '#bc6c25',
      },
    },
  },
  plugins: [],
};
