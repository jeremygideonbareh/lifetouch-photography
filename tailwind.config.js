/** @type {import('tailwindcss').Config} */
const display = ['"Cormorant Garamond"', 'Georgia', 'serif'];

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sampled from Lifetouch's albums: misty paper, sage mats, pine forests, warm dune light
        mist: '#eeeae2',
        fern: '#33402f',
        sage: '#6f7d67',
        pine: '#151b17',
        dune: '#c2a27a',
      },
      fontFamily: {
        sans: ['Manrope', 'Helvetica', 'Arial', 'sans-serif'],
        display,
        poem: display,
      },
    },
  },
  plugins: [],
};
