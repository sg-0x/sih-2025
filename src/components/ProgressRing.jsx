import React from 'react';
import { motion } from 'framer-motion';

function ProgressRing({ size = 120, stroke = 10, value = 0, color = '#0d6efd', label = '' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="d-inline-flex flex-column align-items-center">
      <svg width={size} height={size}>
        <circle
          stroke="#e9ecef"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fw-semibold" style={{ fontSize: 16 }}>{Math.round(value)}%</text>
      </svg>
      {label ? <div className="small text-muted mt-1">{label}</div> : null}
    </div>
  );
}

export default ProgressRing;




