/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-600': 'rgb(var(--color-primary-600) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        card: 'rgb(var(--color-card-bg) / <alpha-value>)',
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 6px 18px rgba(16,24,40,0.06)',
        hover: '0 12px 30px rgba(16,24,40,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
