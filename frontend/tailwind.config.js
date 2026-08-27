/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Vivid blue
          hover: '#4f46e5', // Electric indigo
          light: 'rgba(59, 130, 246, 0.1)',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.65)', // Glass
          dark: 'rgba(255, 255, 255, 0.08)',
          secondary: 'rgba(255, 255, 255, 0.4)', // More translucent
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.4)',
          focus: '#06b6d4', // Neon cyan
        },
        text: {
          primary: '#1e293b',
          secondary: '#334155',
          muted: '#64748b',
        },
        status: {
          success: '#10b981',
          successBg: 'rgba(16, 185, 129, 0.15)',
          warning: '#f59e0b',
          warningBg: 'rgba(245, 158, 11, 0.15)',
          danger: '#ef4444',
          dangerBg: 'rgba(239, 68, 68, 0.15)',
          info: '#3b82f6',
          infoBg: 'rgba(59, 130, 246, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 20px 40px rgba(0, 0, 0, 0.08)',
        glow: '0 10px 25px rgba(37, 99, 235, 0.4)',
        successGlow: '0 0 15px rgba(16, 185, 129, 0.4)',
        inner: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
        input: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
}
