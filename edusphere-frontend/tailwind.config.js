/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /**
       * Custom primary color palette for EduSphere
       * Base color: #0DF20D (Vibrant primary)
       * Generated shades for comprehensive usage across the application
       */
      colors: {
        primary: {
          50: '#ECFDF2',   // Very light primary
          100: '#D1FAE5',  // Light primary
          200: '#A7F3D0',  // Lighter primary
          300: '#6EE7B7',  // Light-medium primary
          400: '#34D399',  // Medium primary
          500: '#0DF20D',  // Main primary color
          600: '#0BC20B',  // Darker primary
          700: '#099209',  // Much darker primary
          800: '#076207',  // Very dark primary
          900: '#054205',  // Darkest primary
          950: '#032203'   // Ultra dark primary
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}