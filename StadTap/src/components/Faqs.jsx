import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

const faqs = [
  {
    question: "How can I use the platform?",
    answer:
      "Simply sign up, search for nearby football fields, and make a reservation.",
  },
  {
    question: "How can I confirm my reservation?",
    answer:
      "After making a reservation, you will receive a confirmation message via email or SMS.",
  },
  {
    question: "How can I make a payment?",
    answer:
      "You can pay online via card or in cash when you arrive at the field.",
  },
  {
    question: "Can I cancel my reservation?",
    answer:
      "Yes, you can cancel your reservation, but cancellation policies may vary depending on the field.",
  },
  {
    question: "How are field prices determined?",
    answer:
      "Prices vary based on the field's location, time slot, and other factors.",
  },
];

function Faqs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <section id="faqs" className="faqs-section">
      <div className="faqs-container">
        <div className="features-main-layer">
          <div className="features-layer">FAQS</div>
        </div>
        <div className="span-h2">
          <span>Frequently Asked</span>
          <span className="span-other-h2">Questions</span>
        </div>
        <div className="faqs-cards">
          {faqs.map((faq, faqIndex) => (
            <div key={faq.question} className={`faq-item ${selectedIndex === faqIndex ? "active" : ""}`}>
              <div
                className="faq-h3"
                onClick={() => setSelectedIndex(faqIndex)}
              >
                <h3 className="f-h3">{faq.question}</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`select-class ${
                    selectedIndex === faqIndex ? "rotate" : ""
                  }`}
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <AnimatePresence>
                {selectedIndex === faqIndex && (
                  <motion.div
                    className="faq-p-main"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="faq-p">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faqs;
