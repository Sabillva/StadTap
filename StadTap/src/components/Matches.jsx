import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

import Stadium1 from "../assets/stadium1.png";
import Stadium2 from "../assets/stadium2.png";
import Stadium3 from "../assets/stadium3.png";
import CheckIcon from "../assets/checkicon.png";
import ArrowRight from "../assets/right-arrow.svg";

const popularStaduims = [
  {
    place: "Manchester, England",
    year: "2004",
    title: "Etihad Stadium",
    results: [
      { title: "Prime location in the city center" },
      { title: "Modern facilities and seating" },
      { title: "Excellent reputation for hosting major events" },
    ],
    link: "https://www.mancity.com/etihad-stadium",
    image: Stadium1,
  },
  {
    place: "Madrid, Spain",
    year: "1976",
    title: "Campo de Futbol de Vallecas",
    results: [
      { title: "Affordable booking rates" },
      { title: "High-quality turf for better performance" },
      { title: "Convenient parking and access" },
    ],
    link: "https://www.rayovallecano.es/estadio",
    image: Stadium2,
  },
  {
    place: "Sydney, Australia",
    year: "1996",
    title: "Stadium Australia",
    results: [
      { title: "Great fan experience with ample seating" },
      { title: "Enhanced lighting for evening matches" },
      { title: "Accessible public transport links" },
    ],
    link: "https://www.austadiums.com/stadiums/stadium-australia",
    image: Stadium3,
  },
];

function Matches() {
  return (
    <section id="matches" className="match-section">
      <div className="header-match">
        <div className="match-container">
          <div className="div-p">
            <p className="top-p">Popular Fields</p>
          </div>
          <div className="style-h2">
            <span>Explore the best stadiums</span>
          </div>
          <p className="description-p">
            Discover top-rated football stadiums, perfect for your next matchs
          </p>
        </div>

        <div className="cards-match">
          <div className="stadiums-cards">
            {popularStaduims.map((stadium, stadiumIndex) => (
              <div key={stadium.title} className="titles">
                <div className="cards-grid">
                  <div className="lg-cards">
                    <div className="spans">
                      <span>{stadium.place}</span>
                      <span>&bull;</span>
                      <span>{stadium.year}</span>
                    </div>
                    <h3 className="title-h3">{stadium.title}</h3>
                    <hr className="match-hr" />
                    <ul className="match-ul">
                      {stadium.results.map((result) => (
                        <li className="match-li">
                          <img
                            className="check-img"
                            src={CheckIcon}
                            alt="check"
                          />
                          <span>{result.title}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={stadium.link}>
                      <motion.button
                        whileHover={{ scale: 0.95 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="match-button"
                      >
                        <span>Visit Live Site</span>
                        <img
                          className="right-arrow-2"
                          src={ArrowRight}
                          alt="right arrow"
                        />
                      </motion.button>
                    </a>
                  </div>
                  <div className="image-div">
                    <img src={stadium.image} alt={stadium.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Matches;
