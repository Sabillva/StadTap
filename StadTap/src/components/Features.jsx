import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Calendar from "../assets/calendar.png";
import Clock from "../assets/clock.png";
import NoteBook from "../assets/notebook.png";
import Hash from "../assets/hash.png";

import AnimationGif from "../assets/animation.gif";

import Person1 from "../assets/person-1.png";
import Person2 from "../assets/person-2.png";
import Person3 from "../assets/person-3.png";
import Person4 from "../assets/person-4.png";

const features = [
  "User Registration and Login",
  "Stadium Search and Filtering",
  "Reservation System",
  "Secure Payment System",
  "Check-in with Email Token",
  "Match Creation and Participation",
  "Chat and Communication System",
  "User Profile and Booking History",
  "Reviews and Ratings",
  "Mobile-Friendly and Responsive Design",
];

function Features() {
  const offsetX = useMotionValue(-100);
  const offsetY = useMotionValue(-100);
  const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;
  const border = useRef(null);

  useEffect(() => {
    const updateMousePosition = (e) => {
      if (!border.current) return;
      const borderRect = border.current.getBoundingClientRect();
      offsetX.set(e.x - borderRect?.x);
      offsetY.set(e.y - borderRect?.y);
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return (
    <section id="features" className="fea-section">
      <div className="features-container">
        <div className="features-main-layer">
          <div className="features-layer">Features</div>
        </div>
        <div className="span-h2">
          <span>Streamlined solutions for your</span>
          <span className="span-other-h2">convenience.</span>
        </div>

        <div className="components">
          <div className="component">
            <div className="children">
              <div className="avatars">
                <div className="avatar1">
                  <img className="person-image" src={Person1} alt="Person 1" />
                </div>
                <div className="avatar2">
                  <img className="person-image" src={Person2} alt="Person 2" />
                </div>
                <div className="avatar3">
                  <img className="person-image" src={Person3} alt="Person 3" />
                </div>
                <div className="avatar4">
                  <div className="ava-class">
                    <img
                      className="person4-image"
                      src={Person4}
                      alt="Person 4"
                    />
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span className="fea-span" key={i}></span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <h3 className="fea-h3">Team Up and Chat</h3>
              <p className="fea-p">
                Connect with other players, create teams, and chat in real-time
                to organize matches effortlessly
              </p>
            </div>
          </div>

          <div className="component">
            <div className="children">
              <div className="second">
                <p className="fea-paragraph">
                  We're achieving{" "}
                  <span className="fea-span-incredible">
                    <span className="incredible-gif">incredible</span>
                    <img
                      className="text-gif"
                      src={AnimationGif}
                      alt="animation gif"
                    />
                  </span>{" "}
                  <span className="other">engagement</span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="fea-h3">Create and Share Posts</h3>
              <p className="fea-p">
                Post match invites, updates, or announcements and engage with
                the football community
              </p>
            </div>
          </div>

          <div className="component cols">
            <div className="children">
              <div className="track-div">
                <div className="calendar-div">
                  <motion.img
                    className="calendar"
                    whileHover={{ scale: 1.2, rotate: -10 }}
                    whileTap={{ scale: 0.9, rotate: 15, borderRadius: "10%" }}
                    transition={{ type: "spring", stiffness: 100 }}
                    src={Calendar}
                    alt="calendar"
                  />
                </div>
                <div className="clock-div">
                  <motion.img
                    className="clock"
                    whileHover={{ scale: 1.2, rotate: 0 }}
                    whileTap={{ scale: 0.9, rotate: -15, borderRadius: "10%" }}
                    transition={{ type: "spring", stiffness: 100 }}
                    src={Clock}
                    alt="clock"
                  />
                </div>
                <div className="notebook-div">
                  <motion.img
                    className="notebook"
                    whileHover={{ scale: 1.23, rotate: 15 }}
                    whileTap={{ scale: 0.9, rotate: -15, borderRadius: "10%" }}
                    transition={{ type: "spring", stiffness: 100 }}
                    src={NoteBook}
                    alt="notebook"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="fea-h3">Track Your Games</h3>
              <p className="fea-p">
                Keep a record of your past and upcoming matches, and stay
                updated on game schedules
              </p>
            </div>
          </div>
        </div>

        <div className="features-map">
          {features.map((feature) => (
            <div key={feature} className="div-key">
              <motion.div
                className="div-design"
                ref={border}
                style={{
                  WebkitMaskImage: maskImage,
                  maskImage,
                }}
              ></motion.div>
              <span className="star-span">
                <img className="hash" src={Hash} alt="hash" />
              </span>
              <span className="f-span">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
