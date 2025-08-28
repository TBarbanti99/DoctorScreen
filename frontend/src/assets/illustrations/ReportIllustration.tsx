
import React from "react";

const ReportIllustration: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="150" cy="150" r="120" fill="#E6F2FF" />
      <rect x="95" y="80" width="110" height="140" rx="8" fill="white" />
      <rect x="105" y="100" width="90" height="6" rx="3" fill="#CCE6FF" />
      <rect x="105" y="115" width="90" height="6" rx="3" fill="#CCE6FF" />
      <rect x="105" y="130" width="90" height="6" rx="3" fill="#CCE6FF" />
      <rect x="105" y="145" width="60" height="6" rx="3" fill="#CCE6FF" />
      <rect x="105" y="160" width="90" height="6" rx="3" fill="#CCE6FF" />
      <rect x="105" y="175" width="70" height="6" rx="3" fill="#CCE6FF" />
      <rect x="105" y="190" width="50" height="6" rx="3" fill="#CCE6FF" />
      <path
        d="M125 85L115 80H95C91.6863 80 89 82.6863 89 86V214C89 217.314 91.6863 220 95 220H205C208.314 220 211 217.314 211 214V86C211 82.6863 208.314 80 205 80H125Z"
        stroke="#005FFF"
        strokeWidth="2"
      />
      <path
        d="M105 80V65C105 62.7909 106.791 61 109 61H141C143.209 61 145 62.7909 145 65V80"
        stroke="#005FFF"
        strokeWidth="2"
      />
      <path
        d="M125 71H129"
        stroke="#005FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ReportIllustration;
