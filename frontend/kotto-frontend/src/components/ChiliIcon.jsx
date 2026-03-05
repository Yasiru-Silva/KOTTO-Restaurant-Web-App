import React from "react";

export default function ChiliIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      {/* stem */}
      <path
        d="M40 10c-6 0-10 3-13 8"
        stroke="#2E7D32"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* chili body */}
      <path
        d="M22 22c10-8 26-6 30 6 3 10-4 22-18 29-12 6-21 2-24-5-4-10 2-22 12-30z"
        fill="#E53935"
      />
      {/* highlight */}
      <path
        d="M42 25c4 2 6 6 5 10"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}