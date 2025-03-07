/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E5E7EB", // Light gray for subtle borders
        input: "#F3F4F6", // Soft gray background for inputs
        ring: "#3B82F6", // Blue for focus rings
        background: "#F9FAFB", // Light background for contrast
        foreground: "#111827", // Dark gray text for readability
        primary: {
          DEFAULT: "#2563EB", // Vibrant blue for primary actions
          foreground: "#FFFFFF", // White text for contrast
        },
        secondary: {
          DEFAULT: "#6B7280", // Muted gray for secondary elements
          foreground: "#FFFFFF", // White text for contrast
        },
        destructive: {
          DEFAULT: "#DC2626", // Strong red for destructive actions
          foreground: "#FFFFFF", // White text for contrast
        },
        muted: {
          DEFAULT: "#9CA3AF", // Neutral gray for disabled or subtle elements
          foreground: "#1F2937", // Darker gray text for visibility
        },
        accent: {
          DEFAULT: "#10B981", // Green for accents
          foreground: "#FFFFFF", // White text for contrast
        },
        popover: {
          DEFAULT: "#FFFFFF", // White popover background
          foreground: "#111827", // Dark text for readability
        },
        card: {
          DEFAULT: "#FFFFFF", // White background for cards
          foreground: "#111827", // Dark text for readability
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
          },
        },
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
