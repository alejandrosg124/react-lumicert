/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#2c6d67',
          400: '#2c6d67',
          500: '#2c6d67',
        },
        secondary: {
          200: '#ffffff',
        },
        gray: {
          100: "#15232c",
          200: "#11232f",
          300: "rgba(0, 0, 0, 0.25)",
          400: "rgba(255, 255, 255, 0.07)",
          500: "rgba(0, 0, 0, 0.08)"
        },
        darkslategray: "#273b48",
        slategray: "#6a7881",
        dimgray: "#4d4d4d",
      },
      spacing: {
        "num-38_3": "38.3px",
        "num-59": "59px",
        "num-46": "46px"
      },
      fontFamily: {
        roboto: "Roboto",
        "sf-pro": "'SF Pro', sans-serif",
        inter: "Inter"
      },
      borderRadius: {
        "num-20": "20px",
        "num-24": "24px",
        "num-15": "15px"
      },
      padding: {
        "num-15": "15px",
        "num-13": "13px",
        "num-25": "25px"
      },
      fontSize: {
        "num-24": "24px",
        "num-14": "14px",
        "num-11": "11px"
      },
      lineHeight: {
        "num-17": "17px",
        "num-18": "18px"
      },
      letterSpacing: {
        "num--0_23": "-0.23px"
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
      }
    },
  },
  plugins: [],
} 