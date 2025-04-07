import { motion, useScroll, useTransform } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

function Words() {
  const titleRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: titleRef,
    offset: ["start end", "end start"],
  });

  const transformTop = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const transformBottom = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  return (
    <section className="words-section">
      <h2 className="words-h2" ref={titleRef}>
        <motion.span
          className="words-span-1"
          style={{
            x: transformTop,
          }}
        >
          Some nice feedbacks from our dear users
        </motion.span>
        <motion.span
          className="words-span-2"
          style={{
            x: transformBottom,
          }}
        >
          Some nice feedbacks from our dear users
        </motion.span>
      </h2>
    </section>
  );
}

export default Words;
