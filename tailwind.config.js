/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Include all relevant files
  ],
  theme: {
    extend: {
      colors: {
        // Earth tones
        soil: {
          50: '#f5f1ec',
          100: '#e6dfd5',
          200: '#d2c2af',
          300: '#bea489',
          400: '#a98768',
          500: '#8B6D4F',  // Rich medium brown
          600: '#75573a',
          700: '#5F442E',  // Deep brown
          800: '#48341F', 
          900: '#2E2014',  // Almost black-brown
        },
        forest: {
          50: '#ecf6ee',
          100: '#d1e9d4',
          200: '#aad5b0',
          300: '#7dbd88',
          400: '#56a967',
          500: '#2E8B57',  // Sea green
          600: '#246c45',
          700: '#1a5536',
          800: '#113a24',
          900: '#081f14',
        },
        leaf: {
          50: '#edf9f0',
          100: '#d4f0db',
          200: '#a9e1b8',
          300: '#7dce93',
          400: '#52bd71',
          500: '#3CB371',  // Medium sea green
          600: '#2d8f5a',
          700: '#237147',
          800: '#195432',
          900: '#0d361f',
        },
        bark: {
          50: '#f6f2ed',
          100: '#e8dfd2',
          200: '#d2bea4',
          300: '#b99e79',
          400: '#A0522D',  // Sienna
          500: '#8B4513',  // Saddle brown
          600: '#753a10',
          700: '#5f2e0c',
          800: '#452109',
          900: '#2e1605',
        },
      },
      backgroundImage: {
        'tree-pattern': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B4513' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'leaf-pattern': "url('data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232E8B57' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zM10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      boxShadow: {
        'inner-highlight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
      },
    },
  },
  plugins: [],
};
