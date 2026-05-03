/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#F8FAFF',
          100: '#EEF3FF',
          200: '#DDE7FF',
          300: '#C7D5FF',
        },
        amber: {
          warm: '#7C3AED',
          deep: '#2563EB',
        },
        sky: {
          soft: '#38BDF8',
          muted: '#A5B4FC',
        },
        sage: {
          soft: '#22D3EE',
          muted: '#C084FC',
        },
        brown: {
          muted: '#7C89B8',
          light: '#9EA9E9',
          dark: '#111A3B',
        },
        memory: {
          bg: '#EEF3FF',
          card: '#FFFFFF',
          border: '#CAD7FF',
          text: '#101632',
          muted: '#6573A4',
          accent: '#7C3AED',
          danger: '#F43F5E',
          sky: '#38BDF8',
          sage: '#22D3EE',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #F8FAFF 0%, #DDE7FF 45%, #EDE9FE 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(238,243,255,0.9) 100%)',
        'amber-gradient': 'linear-gradient(135deg, #7C3AED 0%, #2563EB 58%, #06B6D4 100%)',
        'sky-gradient': 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
        'sage-gradient': 'linear-gradient(135deg, #22D3EE 0%, #C084FC 100%)',
        'confession-gradient': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 55%, #38BDF8 100%)',
      },
      boxShadow: {
        warm: '0 10px 34px rgba(124, 58, 237, 0.28)',
        card: '0 10px 34px rgba(37, 99, 235, 0.12)',
        'card-hover': '0 18px 60px rgba(124, 58, 237, 0.22)',
        memory: '0 10px 38px rgba(34, 211, 238, 0.28)',
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
