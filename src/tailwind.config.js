/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["content/**/**/*.md", "layouts/**/**/*.html"],
  safelist: [
    "bg-blue-50",
    "bg-gray-500",
    "border",
    "border-blue-500",
    "border-border-transparent",
    "hover:bg-blue-50",
    "opacity-20",
    "opacity-50",
    "outline-none",
    "text-gray-200",
    "text-orange-300",
    "text-blue-400"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
