/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBg: '#131514',
        themeSurface: '#1d1f1e',
        themeRaised: '#232625',
        themeSubtle: '#191b1a',
        themeBorder: '#303332',
        themeText: '#f1f2ef',
        themeMuted: '#999e9a',
        themeSubtleText: '#686e6a',
        themeAccent: '#dedfdc',
        themeGreen: '#9db5a3',
        themeRed: '#d7a09a',
        themeAmber: '#d9c49a',
      },
      borderRadius: {
        theme: '14px',
      },
      maxWidth: {
        content: '1180px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
