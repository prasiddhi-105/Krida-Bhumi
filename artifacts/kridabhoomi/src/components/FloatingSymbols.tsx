import React from "react";
import { motion } from "framer-motion";

const symbols = [
  // Lotus
  <svg key="lotus" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16 opacity-30 text-primary">
    <path d="M50 80C50 80 20 60 20 40C20 20 40 20 50 35C60 20 80 20 80 40C80 60 50 80 50 80Z" />
    <path d="M50 80C50 80 30 65 30 45C30 30 45 30 50 40C55 30 70 30 70 45C70 65 50 80 50 80Z" />
  </svg>,
  // Om-like Swirl (Abstract)
  <svg key="swirl" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-20 h-20 opacity-20 text-secondary">
    <path d="M30 50C30 30 70 30 70 50C70 70 30 70 30 50C30 40 50 40 50 50" />
    <circle cx="50" cy="50" r="40" strokeDasharray="5 5" />
  </svg>,
  // Geometric Mandala
  <svg key="mandala" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-24 h-24 opacity-20 text-primary">
    <polygon points="50,10 90,50 50,90 10,50" />
    <polygon points="50,20 80,50 50,80 20,50" />
    <circle cx="50" cy="50" r="10" />
  </svg>,
  // Diya
  <svg key="diya" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-14 h-14 opacity-30 text-secondary">
    <path d="M20 60C20 80 80 80 80 60" />
    <path d="M50 60C50 60 40 40 50 30C60 40 50 60 50 60Z" fill="currentColor" className="opacity-50" />
  </svg>
];

export function FloatingSymbols() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {symbols.map((symbol, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          animate={{
            y: ["-5%", "5%"],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
          style={{
            left: `${20 + (i * 20)}%`,
            top: `${20 + (i % 2 === 0 ? 10 : 40)}%`,
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  );
}
