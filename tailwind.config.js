// Brand colours. Muted and eyebrow text are darkened so they pass WCAG AA on every background.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#fcf5f5',       // page + header background
        surface: '#ffffff',    // cards, fields, drawer rows
        blush: '#f8e2e1',      // blush sections, selected chips, newsletter
        rose: '#f6c9c9',       // announcement bar
        hero: '#ede2dc',       // hero wash
        panel: '#fff9f7',      // mega-dropdown panel
        line: '#eadcdc',       // hairlines
        'line-strong': '#8a7b7b', // field/outline borders that must meet 3:1
        ink: '#171313',        // text + black button
        muted: '#5f5252',      // sampled #756767, darkened for AA on blush (>=6:1)
        eyebrow: '#4f4343',    // sampled #867a7a, darkened
        error: '#b3261e',
        success: '#2f6b3f',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        product: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'Segoe Script', 'cursive'], // handwriting-style letter preview
        label: ['Montserrat', 'Poppins', 'system-ui', 'sans-serif'], // uppercase labels and buttons
      },
      fontSize: {
        // min 12px everywhere
        xs: ['0.75rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.375rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '4xl': ['3rem', { lineHeight: '1.1' }],
        '5xl': ['4rem', { lineHeight: '1.05' }],
      },
      borderRadius: { sm: '4px', DEFAULT: '4px', md: '8px', lg: '16px', xl: '24px' },
      maxWidth: { page: '1440px' },
      boxShadow: { drawer: '0 0 48px rgba(23,19,19,.18)' },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideLeft: { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
        slideRight: { from: { transform: 'translateX(-100%)' }, to: { transform: 'none' } },
        slideUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'none' } },
        rise: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        fade: 'fadeIn .2s ease-out',
        'slide-left': 'slideLeft .28s ease-out',
        'slide-right': 'slideRight .28s ease-out',
        'slide-up': 'slideUp .28s ease-out',
        rise: 'rise .22s ease-out',
      },
    },
  },
  plugins: [],
}
