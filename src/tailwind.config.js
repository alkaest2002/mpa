/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["content/**/**/*.md", "layouts/**/**/*.html"],
  safelist: [
    "bg-blue-50",
    "bg-blue-300",
    "bg-blue-500",
    "text-blue-400",
    "text-gray-200",
    "text-orange-300",
    "hover:bg-blue-50",
    "hover:bg-blue-500",
    "bg-gray-200",
    "bg-gray-500",
    "hover:bg-gray-200",
    "hover:bg-gray-500",
    "cursor-not-allowed",
    "opacity-20",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
