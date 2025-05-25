"use client";

import { useTheme } from "./ThemeContext";

import { useRef, useEffect } from "react";

const OtherServices = () => {
  const { darkMode } = useTheme();

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(".service-animate");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // Custom SVG icons
  const icons = {
    "credit-card": (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6 15H10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    trending: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 17L9 11L13 15L21 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 7H21V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    wallet: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z"
          fill="currentColor"
        />
        <path
          d="M2 9H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    arrow: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const services = [
    {
      id: 1,
      title: "Onlayn kredit",
      description: "Krediti banka gəlmədən və növbə gözləmədən əldə et",
      icon: "credit-card",
      bgColor: "from-primary to-primary/80",
      buttonText: "Sifariş et",
    },
    {
      id: 2,
      title: "Kampaniyalar",
      description:
        "Sərfəli təklif və endirimlərimizi vaxt itirmədən dəyərləndir",
      icon: "trending",
      bgColor: "from-secondary to-secondary/80",
      buttonText: "Daha ətraflı",
    },
    {
      id: 3,
      title: "Depozit",
      description:
        "İstər filialda, istərsə də onlayn depozit yerləşdir, qazancını çoxalt",
      icon: "wallet",
      bgColor: "from-accent to-accent/80",
      buttonText: "Sifariş et",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: darkMode
            ? "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.05), transparent)"
            : "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.05), transparent)",
        }}
      ></div>

      {/* Decorative elements */}
      <div
        className="absolute top-20 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-30"
        style={{
          backgroundColor: darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      ></div>

      <div
        className="absolute bottom-20 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-30"
        style={{
          backgroundColor: darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      ></div>

      <div className="container mx-auto px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="modern-card service-animate opacity-0 transform translate-y-8 group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`bg-gradient-to-br ${service.bgColor} p-8 rounded-t-2xl relative overflow-hidden`}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern
                        id={`grid-${service.id}`}
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 10 0 L 0 0 0 10"
                          fill="none"
                          stroke={darkMode ? "white" : "black"}
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#grid-${service.id})`}
                    />
                  </svg>
                </div>

                <div
                  className="relative z-10"
                  style={{ color: darkMode ? "#ffffff" : "#111827" }} // text color for heading
                >
                  <h3 className="text-2xl font-bold mt-4 mb-2">
                    {service.title}
                  </h3>
                  <p
                    style={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.8)"
                        : "rgba(17, 24, 39, 0.8)", // paragraph color
                    }}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Decorative circle */}
                <div
                  className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full"
                  style={{
                    backgroundColor: darkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.05)",
                  }}
                ></div>
              </div>

              <div className="p-6 flex justify-center">
                <button className="btn bg-lime-500 group relative overflow-hidden flex text-white">
                  <span className="relative z-10">{service.buttonText}</span>
                  <span className="ml-2 relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">
                    {icons.arrow}
                  </span>
                  <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default OtherServices;
