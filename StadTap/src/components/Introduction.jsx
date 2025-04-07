import { motion, useScroll, useTransform } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

const text =
  " A fast selection for football enthusiasts, efficient management for field owners";

const words = text.split(" ");

function Introduction() {
  const scrollTarget = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end end"],
  });
  const [currentWord, setCurrentWord] = useState(0);
  const wordIndex = useTransform(scrollYProgress, [0, 1], [0, words.length]);

  useEffect(() => {
    wordIndex.on("change", (latest) => {
      setCurrentWord(latest);
    });
  }, [wordIndex]);

  return (
    <section id="about" className="intro-section">
      <div className="intro-container">
        <div className="intro-design">
          <div className="main-intro-layer">
            <div className="intro-layer">Introducing Layers</div>
          </div>

          <div className="intro-span">
            <span>
              We are making it digital and easy to find and book football fields
              in Azerbaijan.
            </span>
            <span className="span-text">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className={wordIndex < currentWord ? "span-design" : ""}
                >
                  {`${word} `}
                </span>
              ))}
            </span>
            <span className="span-other-text">
              {" "}
              – providing a convenient solution for both sides!
            </span>
          </div>
        </div>
        <div className="scroll-height" ref={scrollTarget}></div>
      </div>
    </section>
  );
}

export default Introduction;
