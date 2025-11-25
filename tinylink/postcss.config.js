// postcss.config.js
module.exports = {
  plugins: [
    // Use the Tailwind -> PostCSS adapter package (required for recent Tailwind builds)
    require('@tailwindcss/postcss'),
    // Keep autoprefixer as usual
    require('autoprefixer'),
  ],
};
