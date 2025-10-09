// src/components/SubtleDivider.jsx
import { motion } from "framer-motion";
import React from "react";

const AnimatedDivider = ({ color = "#d1d5db", height = "1px" }) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="mx-auto"
        style={{
          height,
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
};

export default AnimatedDivider;
