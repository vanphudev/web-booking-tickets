module.exports = {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      screens: {
         sm: "480px",
         md: "768px",
         lg: "976px",
         "2lg": "1100px",
         xl: "1440px",
      },
      colors: {
         "bg-orange": "#FFF7F5",
         "bg-white": "#ffffff",
         "bg-green": "#00613d",
         "bg-primary": "#ef5222",
         "bg-primary-2": "#FFF7F5",
         "text-primary-color": "#ef5222",
         "text-secondary-color": "#fff7f5",
         "text-error-color": "#e12424",
         "text-white-color": "#ffffff",
         "text-black-color": "#111111",
         "text-green-color": "#00613d",
         "text-green-color-2": "#50b55a",
         "text-gray-color-400": "#bdbdbd",
         "text-gray-color-600": "#637280",
         "text-blue-color-branch": "#273581",
      },
      fontFamily: {
         InterTight: ["Inter", "sans-serif"],
         NotoSans: ["Noto Sans", "sans-serif"],
         Exo2: ["Exo 2", "sans-serif"],
      },
      extend: {
         spacing: {
            128: "32rem",
            144: "36rem",
         },
         borderRadius: {
            "4xl": "2rem",
         },
      },
   },
   plugins: [],
};
