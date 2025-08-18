/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-in': 'bounce-in 0.6s ease-out',
        'pulse-winner': 'pulse-winner 2s ease-in-out infinite',
        'shimmer': 'shimmer 1s linear infinite',
        'shine': 'shine 2s infinite',
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'pulse-winner': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' }
        },
        'shimmer': {
          '0%': { 'background-position': '-468px 0' },
          '100%': { 'background-position': '468px 0' }
        },
        'shine': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      colors: {
        pokemon: {
          electric: '#F7D02C',
          grass: '#7AC74C',
          fire: '#EE8130',
          water: '#6390F0',
          psychic: '#F95587',
          ice: '#96D9D6',
          dragon: '#6F35FC',
          fairy: '#D685AD',
        }
      }
    },
  },
  plugins: [],
}
