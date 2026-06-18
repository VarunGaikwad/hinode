/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        hinode: {
          surface: 'var(--surface-1)',
          'surface-2': 'var(--surface-2)',
          'surface-3': 'var(--surface-3)',
          border: 'var(--border-1)',
          'border-2': 'var(--border-2)',
          accent: 'var(--accent)',
          'accent-soft': 'var(--accent-soft)',
          'accent-glow': 'var(--accent-glow)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-tertiary': 'var(--text-tertiary)',
          error: 'var(--error)',
          success: 'var(--success)',
          warning: 'var(--warning)',
        },
      },
      fontFamily: {
        display: ['Inter', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        shayari: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      borderRadius: {
        'hinode-sm': 'var(--radius-sm)',
        'hinode-md': 'var(--radius-md)',
        'hinode-lg': 'var(--radius-lg)',
        'hinode-xl': 'var(--radius-xl)',
      },
      spacing: {
        'hinode-1': 'var(--space-1)',
        'hinode-2': 'var(--space-2)',
        'hinode-3': 'var(--space-3)',
        'hinode-4': 'var(--space-4)',
        'hinode-5': 'var(--space-5)',
        'hinode-6': 'var(--space-6)',
        'hinode-8': 'var(--space-8)',
        'hinode-10': 'var(--space-10)',
        'hinode-12': 'var(--space-12)',
      },
      fontSize: {
        'hinode-xs': 'var(--text-xs)',
        'hinode-sm': 'var(--text-sm)',
        'hinode-base': 'var(--text-base)',
        'hinode-lg': 'var(--text-lg)',
        'hinode-xl': 'var(--text-xl)',
        'hinode-2xl': 'var(--text-2xl)',
        'hinode-3xl': 'var(--text-3xl)',
        'hinode-4xl': 'var(--text-4xl)',
        'hinode-5xl': 'var(--text-5xl)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
