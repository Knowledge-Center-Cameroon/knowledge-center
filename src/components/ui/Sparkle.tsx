import React from 'react';

interface SparkleProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

export const Sparkle: React.FC<SparkleProps> = ({ 
  color = "#FFD700", // Default to a golden/yellow color, or use currentColor
  className = "",
  ...props 
}) => {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      {...props}
    >
      <path 
        d="M20 0C20 9.2 27.8 17 37 17C27.8 17 20 24.8 20 34C20 24.8 12.2 17 3 17C12.2 17 20 9.2 20 0Z" 
        fill={color} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkle;
