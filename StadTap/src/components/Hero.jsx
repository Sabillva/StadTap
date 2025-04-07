import Search from "../assets/search.png";
import Message from "../assets/message.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const messageY = useTransform(scrollYProgress, [0, 1], ["0px", "100px"]);
  const searchY = useTransform(scrollYProgress, [0, 1], ["0px", "-100px"]);

  return (
    <section id="home" className="hero-section" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hero-container"
      >
        <h1 className="hero-h1">Find and Book Football Fields Easily</h1>

        <motion.img
          className="message"
          style={{ y: messageY }}
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15, borderRadius: "10%" }}
          transition={{ type: "spring", stiffness: 200 }}
          src={Message}
          alt="message"
        />
        <motion.img
          className="search"
          style={{ y: searchY }}
          whileHover={{ scale: 1.2, rotate: -15 }}
          whileTap={{ scale: 0.9, rotate: 15, borderRadius: "10%" }}
          transition={{ type: "spring", stiffness: 200 }}
          src={Search}
          alt="search"
        />

        <p className="hero-p">
          Search, compare, and reserve football pitches based on location,
          price, and availability.
        </p>
      </motion.div>
    </section>
  );
}

export default Hero;
