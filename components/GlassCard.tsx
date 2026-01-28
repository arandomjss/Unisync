"use client";

import { motion } from 'framer-motion';
import React from 'react';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 4px 32px rgba(0,0,0,0.25)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}
