/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFCF8',
          100: '#FEF9F0',
          200: '#FDF0DC',
          300: '#FAE5C3',
        },
        amber: {
          warm: '#F4A261',
          deep: '#E76F51',
        },
        sky: {
          soft: '#8ECAE6',
          muted: '#A8DADC',
        },
        sage: {
          soft: '#95D5B2',
          muted: '#B7E4C7',
        },
        brown: {
          muted: '#8B7355',
          light: '#B5956A',
          dark: '#5C4A32',
        },
        memory: {
          bg: '#FEF9F0',
          card: '#FFFFFF',
          border: '#F0E6D3',
          text: '#3D2B1F',
          muted: '#8B7355',
          accent: '#F4A261',
          danger: '#E76F51',
          sky: '#8ECAE6',
          sage: '#95D5B2',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #FEF9F0 0%, #FAE5C3 50%, #F4D5A8 100%)',
        'card-gradient': 'linear-gradient(145deg, #ffffff 0%, #FEF9F0 100%)',
        'amber-gradient': 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
        'sky-gradient': 'linear-gradient(135deg, #8ECAE6 0%, #A8DADC 100%)',
        'sage-gradient': 'linear-gradient(135deg, #95D5B2 0%, #B7E4C7 100%)',
        'confession-gradient': 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
      },
      boxShadow: {
        warm: '0 4px 24px rgba(244, 162, 97, 0.15)',
        card: '0 2px 16px rgba(61, 43, 31, 0.08)',
        'card-hover': '0 8px 32px rgba(61, 43, 31, 0.14)',
        memory: '0 4px 20px rgba(244, 162, 97, 0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        heartbeat: 'heartbeat 1.5s ease-in-out',
        fadeUp: 'fadeUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
