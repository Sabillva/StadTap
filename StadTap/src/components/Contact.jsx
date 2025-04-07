import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

import Call from "../assets/call.png";
import Mail from "../assets/mail.png";

function Contact() {
  const containerContactRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerContactRef,
    offset: ["start end", "end start"],
  });
  const callY = useTransform(scrollYProgress, [0, 1], ["0px", "100px"]);
  const mailY = useTransform(scrollYProgress, [0, 1], ["0px", "-100px"]);
  return (
    <section id="contact" className="contact-section" ref={containerContactRef}>
      <div className="contact-container">
        <h2 className="contact-h2">Sign up for free today</h2>
        <motion.img
          className="call"
          style={{ y: callY }}
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15, borderRadius: "10%" }}
          transition={{ type: "spring", stiffness: 200 }}
          src={Call}
          alt="call"
        />
        <motion.img
          className="mail"
          style={{ y: mailY }}
          whileHover={{ scale: 1.2, rotate: -15 }}
          whileTap={{ scale: 0.9, rotate: 15, borderRadius: "10%" }}
          transition={{ type: "spring", stiffness: 200 }}
          src={Mail}
          alt="mail"
        />
        <p className="contact-p">
          Join now and start booking your favorite football fields instantly!
        </p>

        <div className="contact-form-container">
          <form className="contact-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="contact-input"
            />
            <motion.button
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="contact-signup"
              type="submit"
            >
              Sign Up
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
