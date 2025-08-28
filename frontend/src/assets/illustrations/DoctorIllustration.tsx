
import React from "react";

const DoctorIllustration: React.FC<{ className?: string }> = ({ className = "" }) => {
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
      <path
        d="M150 90C138.954 90 130 98.9543 130 110V130C130 141.046 138.954 150 150 150C161.046 150 170 141.046 170 130V110C170 98.9543 161.046 90 150 90Z"
        fill="#99C4FF"
      />
      <path
        d="M190 200C190 178.909 172.091 160 150 160C127.909 160 110 178.909 110 200V210H190V200Z"
        fill="#99C4FF"
      />
      <rect x="130" y="130" width="40" height="10" fill="white" />
      <rect x="140" y="120" width="20" height="30" fill="white" />
      <circle cx="140" cy="110" r="5" fill="#3381FF" />
      <circle cx="160" cy="110" r="5" fill="#3381FF" />
      <path
        d="M150 132.5C146.5 132.5 143.5 131 143.5 128H156.5C156.5 131 153.5 132.5 150 132.5Z"
        fill="#3381FF"
      />
      <path
        d="M110 190V180C110 158.909 127.909 141 150 141C172.091 141 190 158.909 190 180V190"
        stroke="#005FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M140 170H160M135 180H165"
        stroke="#005FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DoctorIllustration;
