import React from "react";
import { motion } from "framer-motion";

import Logo1 from "../assets/logo-1.png";
import Logo2 from "../assets/logo-2.png";
import Logo3 from "../assets/logo-3.png";
import Logo4 from "../assets/logo-4.png";
import Logo5 from "../assets/logo-5.png";
import Logo6 from "../assets/logo-6.png";
import Logo7 from "../assets/logo-7.png";
import Logo8 from "../assets/logo-8.png";

const logos = [
  { name: "logo1", image: Logo1 },
  { name: "logo2", image: Logo2 },
  { name: "logo3", image: Logo3 },
  { name: "logo4", image: Logo4 },
  { name: "logo5", image: Logo5 },
  { name: "logo6", image: Logo6 },
  { name: "logo7", image: Logo7 },
  { name: "logo8", image: Logo8 },
];

function LogoTicker() {
  return (
    <section className="logo-section">
      <div className="logo-container">
        <h3 className="logo-h3">Already chosen by these football teams</h3>
        <div className="hero-logo">
          <motion.div
            animate={{
              x: "-50%",
            }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            className="logos"
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <React.Fragment key={i}>
                {logos.map((logo) => (
                  <img src={logo.image} key={logo.name} alt={logo.name} />
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default LogoTicker;
