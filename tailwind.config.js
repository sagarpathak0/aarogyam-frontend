/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...existing code...
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        myapple: {
          "primary": "#a2a2a2",
          "secondary": "#d4d4d4",
          "accent": "#4b5563",
          "neutral": "#f5f5f5",
          "base-100": "#ffffff",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      "light",
      "dark"
    ],
  },
};