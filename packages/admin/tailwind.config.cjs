/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html"
  ],
  corePlugins: {
    //  这里将会对antd的样式造成影响
    preflight: false
  },
}

