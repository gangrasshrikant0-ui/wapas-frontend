/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        canvas: '#f6f7f8',
        ink: '#1c2024',
        accent: {
          50: '#f0f4fa',
          100: '#dde7f4',
          200: '#bdd0e8',
          500: '#3c69a8',
          600: '#2b5593',
          700: '#224479',
        },
      },
    },
  },
  plugins: [],
};
