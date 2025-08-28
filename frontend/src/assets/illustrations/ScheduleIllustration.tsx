
import React from "react";

const ScheduleIllustration: React.FC<{ className?: string }> = ({ className = "" }) => {
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
      <rect x="90" y="90" width="120" height="120" rx="8" fill="white" />
      <path
        d="M90 110H210"
        stroke="#005FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="105" y="120" width="25" height="25" rx="4" fill="#CCE6FF" />
      <rect x="137.5" y="120" width="25" height="25" rx="4" fill="#CCE6FF" />
      <rect x="170" y="120" width="25" height="25" rx="4" fill="#3381FF" />
      <rect x="105" y="152.5" width="25" height="25" rx="4" fill="#CCE6FF" />
      <rect x="137.5" y="152.5" width="25" height="25" rx="4" fill="#CCE6FF" />
      <rect x="170" y="152.5" width="25" height="25" rx="4" fill="#CCE6FF" />
      <path
        d="M115 95V85"
        stroke="#005FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M185 95V85"
        stroke="#005FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M180 132.5L185 137.5L195 127.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ScheduleIllustration;
