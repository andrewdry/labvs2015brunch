module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },
  conventions: {
    ignore: (path) => /(^chai*)/ 
  },

  plugins: {
    babel: {presets: ['es2015', 'react']}
  }
};
