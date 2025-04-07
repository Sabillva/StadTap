import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

import User1 from "../assets/user-1.png";
import User2 from "../assets/user-2.png";
import User3 from "../assets/user-3.png";
import User4 from "../assets/user-4.png";
import User5 from "../assets/user-5.png";
import User6 from "../assets/user-6.png";
import User7 from "../assets/user-7.png";
import User8 from "../assets/user-8.png";
import User9 from "../assets/user-9.png";
import { div } from "framer-motion/client";

const testimonials = [
  {
    text: "Amazing experience! The interface is smooth, and the support team is fantastic. I’ve never used anything this efficient before.",
    image: User5,
    name: "Sarah Smith",
    username: "@sarahsmith",
  },
  {
    text: "This platform has completely transformed my workflow. Highly recommended!",
    image: User2,
    name: "John Doe",
    username: "@johndoe",
  },
  {
    text: "I’ve been using this for months now, and I can’t imagine my work without it. Every update makes it even better!",
    image: User6,
    name: "Michael Johnson",
    username: "@michaelj",
  },
  {
    text: "Super intuitive and efficient. This has saved me so much time!",
    image: User4,
    name: "Emily Brown",
    username: "@emilyb",
  },
  {
    text: "Great value for the price. I love how user-friendly and reliable it is. Definitely worth every penny! From the moment I started using it, I noticed a huge difference in my productivity. I’ve recommended it to my colleagues, and they all love it too!",
    image: User1,
    name: "David Wilson",
    username: "@davidw",
  },
  {
    text: "Excellent customer service and a fantastic product overall. Whenever I had an issue, the team responded super quickly!",
    image: User3,
    name: "Sophia Anderson",
    username: "@sophiaa",
  },
  {
    text: "A must-have for professionals! Everything works flawlessly, and the attention to detail is impressive.",
    image: User7,
    name: "Jessica Lee",
    username: "@jessicalee",
  },
  {
    text: "The best tool I've used in years. Makes my job so much easier!",
    image: User8,
    name: "Chris Martinez",
    username: "@chrism",
  },

  {
    text: "I can't recommend this enough. If you're hesitating, just go for it! You won’t regret it! The quality and performance exceeded my expectations, and the ease of use makes it stand out from the rest.",
    image: User9,
    name: "Daniel Robinson",
    username: "@danielr",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = ({ testimonials, duration }) => (
  <div>
    <motion.div
      animate={{
        translateY: "-50%",
      }}
      transition={{
        duration: duration || 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="column"
    >
      {[...new Array(2)].fill(0).map((__, index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, image, name, username }) => (
            <div className="user-card">
              <div>{text}</div>
              <div className="detail-wrap">
                <img className="user-img" src={image} alt={name} />
                <div className="details">
                  <div className="name-style">{name}</div>
                  <div className="username-style">{username}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

function Testimonials() {
  return (
    <section className="user-section">
      <div className="user-container">
        <div className="test-container">
          <div className="div-p-user">
            <p className="top-p-user">Testimonials</p>
          </div>
          <div className="style-h2-user">
            <span>What our users are saying</span>
          </div>
          <p className="description-p-user">
            Our users love the experience, and we're proud to share their
            thoughts. Check out the reviews and see why so many people trust our
            platform for their needs
          </p>
        </div>
        <div className="essential"></div>

        <div className="user-cards">
          <div className="flex-cards">
            <div>
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
            </div>
            <div className="style-columns">
              <TestimonialsColumn testimonials={secondColumn} duration={24} />
            </div>
            <div className="style-columnss">
              <TestimonialsColumn testimonials={thirdColumn} duration={17} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
