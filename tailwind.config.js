module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this covers all your source files
  ],
  theme: {
    extend: {},
    colors: {
      // Keep essential colors
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      // Add any other *very specific* Tailwind color names you might still want to generate utilities for
      // For example, if you used `text-special-blue` and defined `special-blue` here.
      // But the goal is to keep this minimal if you're relying on your theme.css.
    },
  },
  plugins: [],
}