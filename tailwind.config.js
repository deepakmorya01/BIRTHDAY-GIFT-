/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          50: '#f5f5f8',
          100: '#e6e6ea',
          200: '#c4c4cc',
          300: '#9a9aa5',
          400: '#6b6b78',
          500: '#4a4a55',
          600: '#2e2e38',
          700: '#1c1c24',
          800: '#101018',
          900: '#0a0a0f',
          950: '#050508',
        },
        gold: {
          50: '#fdf8ec',
          100: '#f9ecca',
          200: '#f3d98e',
          300: '#ecc557',
          400: '#e9b13a',
          500: '#d49a2a',
          600: '#b87d1c',
          700: '#916018',
          800: '#6b4516',
          900: '#4a2f10',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['2.5rem', { lineHeight: '1.1' }],
        'display-md': ['3.5rem', { lineHeight: '1.05' }],
        'display-lg': ['4.5rem', { lineHeight: '1.0' }],
        'display-xl': ['6rem', { lineHeight: '0.95' }],
      },
      transitionTimingFunction: {
        cinematic: [0.16, 1, 0.3, 1],
      },
    },
  },
  plugins: [],
};
