import React, { useState, useEffect } from "react";
import ArrowRight from "../assets/right-arrow.svg";
import Logo from "../assets/logo.svg";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "home" },
  { label: "About", to: "about" },
  { label: "Features", to: "features" },
  { label: "Matches", to: "matches" },
  { label: "FAQs", to: "faqs" },
  { label: "Contact", to: "contact" },
];

const boxVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("close-btn")) {
    event.preventDefault();
    const header = document.querySelector(".header-text");
    header.style.transform = "translateY(-100%)";
    header.style.transition = "transform 0.5s ease";
  }
});

function Header() {
  useEffect(() => {
    const links = document.querySelectorAll("a[href^='#']");

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

    links.forEach((link) => link.addEventListener("click", handleClick));

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="headerr">
      <div className="header-text">
        <p className="top-text">
          Streamline your booking experience and enjoy hassle-free football
          matches
        </p>
        <div className="header">
          <p>Get started for free</p>
          <img className="right-arrow" src={ArrowRight} alt="right arrow" />
        </div>
        <div className="svg-x">
          <svg
            className="close-btn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M19.071 4.929a1 1 0 0 0-1.414 0L12 10.586 5.343 3.929a1 1 0 0 0-1.414 1.414L10.586 12l-6.657 6.657a1 1 0 0 0 1.414 1.414L12 13.414l6.657 6.657a1 1 0 0 0 1.414-1.414L13.414 12l6.657-6.657a1 1 0 0 0 0-1.414z" />
          </svg>
        </div>
      </div>

      <div className="container">
        <div className={`nav-section ${isOpen ? "open" : ""}`}>
          <div variants={boxVariants} className="navbarr">
            <div className="nav-item">
              <Link to="home" smooth={true} duration={500}>
                <img className="logo" src={Logo} alt="logo" />
              </Link>
            </div>

            <div className="div-navlink">
              <nav className="navlink">
                {navLinks.map((link) => (
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={700}
                    key={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="nav-item-2">
              <div className="menu" onClick={() => setIsOpen(!isOpen)}>
                <motion.div
                  className="line"
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 10 : 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
                <motion.div
                  className="line"
                  animate={{ opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="line"
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -10 : 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              </div>
              <motion.button
                to="/login"
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="login"
              >
                Log In
              </motion.button>
              <motion.button
                to="/signup"
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="signup"
              >
                Sign Up
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="menu-section"
              >
                <div className="menu-2-section">
                  {navLinks.map((link) => (
                    <Link
                      to={link.to}
                      smooth={true}
                      duration={500}
                      key={link.label}
                      className="navlink-menu"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <motion.button
                    to="/login"
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="login-menu"
                  >
                    Log In
                  </motion.button>
                  <motion.button
                    to="/signup"
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="signup-menu"
                  >
                    Sign Up
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default Header;
