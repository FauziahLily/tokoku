import React from 'react';
import { motion } from 'framer-motion';

const TokokuIcon = () => (
  <motion.div 
    className="relative"
    animate={{ 
      rotate: [0, 5, -5, 0],
      y: [0, -5, 0]
    }}
    transition={{ 
      repeat: Infinity, 
      repeatType: "reverse", 
      duration: 2 
    }}
  >
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      <path d="M24 24H8V10H24V24Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
      <path d="M10 10L8 6H4" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="16" r="1.5" fill="#1D4ED8" />
      <circle cx="12" cy="16" r="1.5" fill="#1D4ED8" />
      <path d="M14 20C14 20 15.5 21 16 21C16.5 21 18 20 18 20" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="18" cy="12" r="2" fill="#EF4444" />
      <circle cx="14" cy="12" r="1.5" fill="#10B981" />
      <rect x="11" y="11" width="2" height="2" rx="1" fill="#F59E0B" />
    </svg>
  </motion.div>
);

export default TokokuIcon;
