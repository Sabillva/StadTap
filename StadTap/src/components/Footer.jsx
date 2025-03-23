import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
  AnimatePresence,
  keyframes,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import ArrowRight from "../assets/right-arrow.svg";
import { Link } from "react-scroll";

const navItems = [
  { label: "Home", to: "home" },
  { label: "About", to: "about" },
  { label: "Features", to: "features" },
  { label: "Matches", to: "matches" },
  { label: "FAQs", to: "faqs" },
  { label: "Contact", to: "contact" },
];

function Footer() {
  useEffect(() => {
    const linkss = document.querySelectorAll("a[href^='#']");

    const handleClick = (event) => {
      event.preventDefault();
      const targetId = event.currentTarget.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50,
          behavior: "smooth",
        });
      }
    };

    linkss.forEach((link) => link.addEventListener("click", handleClick));

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      linkss.forEach((link) => link.removeEventListener("click", handleClick));
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-main-div">
            <div className="footer-div"></div>
            <span className="footer-span">
              Booking football field is easy and digital
            </span>
          </div>
          <div className="footer-divs">
            <div className="footer-divs-2">
              <h2 className="footer-h2">
                Find and book football fields easily. Your game, your rules!
              </h2>

              <div className="footer-button-div">
                <motion.button
                  to="/login"
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="footer-button"
                >
                  Get for free
                  <span className="arrow-wrapper">
                    <img
                      className="right-arrow-footer"
                      src={ArrowRight}
                      alt="right arrow"
                    />
                  </span>
                </motion.button>
              </div>
            </div>
            <div>
              <nav className="footer-nav">
                {navItems.map((link) => (
                  <Link
                    className="footer-a"
                    to={link.to}
                    smooth={true}
                    duration={700}
                    key={link.label}
                  >
                    <button className="footer-a-button">{link.label}</button>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <p className="footer-p-2">
          Copyright &copy; StadTap &bull; All rights reserved
        </p>
      </div>
    </section>
  );
}

export default Footer;
