"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail, ChevronUp } from "lucide-react";

const FloatingButton = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contactOptions = [
    { icon: <Phone size={16} />, label: "Zəng et", action: "tel:+994196" },
    {
      icon: <Mail size={16} />,
      label: "E-poçt",
      action: "mailto:info@aivincibank.az",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              theme === "dark"
                ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            } transition-colors`}
            data-cursor="button"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contact options */}
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 mb-2 flex flex-col space-y-2"
            >
              {contactOptions.map((option, index) => (
                <motion.a
                  key={index}
                  href={option.action}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-2 px-5 py-2 w-30 rounded-lg shadow-lg ${
                    theme === "dark"
                      ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                      : "bg-white text-neutral-700 hover:bg-neutral-100"
                  } transition-colors`}
                  data-cursor="link"
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={toggleOpen}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
            isOpen
              ? theme === "dark"
                ? "bg-neutral-700 text-neutral-200"
                : "bg-neutral-200 text-neutral-700"
              : theme === "dark"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-500 text-white"
          } transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-cursor="button"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingButton;
