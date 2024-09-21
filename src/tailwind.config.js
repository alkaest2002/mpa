/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["content/**/**/*.md", "layouts/**/**/*.html"],
  safelist: [
    "bg-blue-50",
    "bg-blue-300",
    "bg-blue-500",
    "bg-gray-200",
    "bg-gray-500",
    "block",
    "cursor-not-allowed",
    "hover:bg-blue-50",
    "hover:bg-blue-500",
    "hover:bg-gray-200",
    "hover:bg-gray-500",
    "hidden",
    "inline",
    "inline-block",
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
