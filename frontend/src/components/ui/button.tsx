import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  let baseStyle =
    "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring transition";

  let variantStyle = "";
  switch (variant) {
    case "secondary":
      variantStyle =
        "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400";
      break;
    case "outline":
      variantStyle =
        "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300";
      break;
    default:
      variantStyle =
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300";
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}
