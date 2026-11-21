/** @type {import('tailwindcss').Config} */
export default {
  content: { relative: true, files: ['./index.html', './src/**/*.{ts,tsx}'] },
  theme: {
    extend: {
      colors: {
        cream: '#F4E8D5',
        beige: '#E8D7BD',
        kraft: '#A98462',
        ink: '#49372B',
        rose: '#D9A6A0',
        sage: '#9CA98E',
        dusty: '#9CB5C8',
        mustard: '#D6B56C',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        hand: ['Caveat', '"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
};
