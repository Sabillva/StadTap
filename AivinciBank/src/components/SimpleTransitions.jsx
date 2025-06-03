"use client";

import { useTheme } from "./ThemeContext";
import { useRef, useEffect } from "react";

const SimpleTransitions = () => {
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

    const items = document.querySelectorAll(".transition-item");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: darkMode
              ? `
          linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)
        `
              : `
          linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)
        `,
            backgroundSize: "4rem 4rem",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-16 relative z-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-16 display-font transition-item opacity-0 transform translate-y-8"
          style={{ transitionDelay: "0ms" }}
        >
          <span className="relative">
            Sadə keçidlər
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full transform scale-x-0 origin-left transition-transform duration-700 group-hover:scale-x-100"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column with 2 small cards */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className="transition-item opacity-0 transform translate-y-8 modern-card"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="p-8 h-full flex flex-col group">
                <div className="mb-6 p-4 inline-block rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  {/* <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-teal-500"
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
                  </svg> */}
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                  Aivinci Star kartı
                </h3>
                <p className="mb-6 text-foreground/70">
                  Üstünlüklərlə dolu bu kartla ürəyincə xərclə, məbləği ay sonu
                  geri qaytardıqda əlavə heç nə ödəmə.
                </p>
                <div className="mt-auto">
                  <button className="text-teal-500 font-medium group-hover:text-teal-500 transition-colors duration-300 flex items-center overflow-hidden">
                    <span className="relative inline-block">
                      Ətraflı
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </span>
                    <svg
                      className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
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
                  </button>
                </div>
              </div>
            </div>

            <div
              className="transition-item opacity-0 transform translate-y-8 modern-card"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="p-8 h-full flex flex-col group">
                <div className="mb-6 p-4 inline-block rounded-2xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
                  {/* <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-lime-500"
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
                      d="M17 15H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg> */}
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-secondary transition-colors duration-300">
                  Nağd pul krediti
                </h3>
                <p className="mb-6 text-foreground/70">
                  50 000 AZN-dək krediti sərfəli şərtlərlə, asanlıqla və çox
                  qısa zamanda əldə et.
                </p>
                <div className="mt-auto">
                  <button className="text-lime-500 font-medium group-hover:text-lime-500 transition-colors duration-300 flex items-center overflow-hidden">
                    <span className="relative inline-block">
                      Ətraflı
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </span>
                    <svg
                      className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
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
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column with 1 tall card */}
          <div className="lg:col-span-7">
            <div
              className="transition-item opacity-0 transform translate-y-8 modern-card h-full"
              style={{ transitionDelay: "300ms" }}
            >
              <div className="p-8 h-full flex flex-col group">
                <div className="mb-6 p-4 inline-block rounded-2xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  {/* <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-amber-500"
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
                  </svg> */}
                </div>
                <h3 className="text-xl font-semibold mb-4 transition-colors duration-300">
                  Depozit yerləşdir
                </h3>
                <p className="mb-6 text-foreground/70">
                  Yüksək faiz dərəcələri ilə pulunuzu artırın və gələcəyinizi
                  təmin edin. Aivinci Bank-da depozit yerləşdirərək, sərfəli
                  şərtlərlə əmanətinizi artıra bilərsiniz.
                </p>

                <div className="bg-white/2 rounded-xl p-6 mb-6">
                  <h4 className="font-medium mb-4">Depozit növləri</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      <span>Müddətli əmanətlər - 6% illik faiz</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      <span>Müddətsiz əmanətlər - 3% illik faiz</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      <span>Valyuta əmanətləri - USD, EUR, GBP</span>
                    </li>
                  </ul>
                </div>

                <p className="mb-6 text-foreground/70">
                  İstər filialda, istərsə də onlayn depozit yerləşdir, qazancını
                  çoxalt. Minimum məbləğ 500 AZN-dən başlayır.
                </p>

                <div className="mt-auto">
                  <button className="text-amber-500 font-medium group-hover:text-amber-500 transition-colors duration-300 flex items-center overflow-hidden">
                    <span className="relative inline-block">
                      Ətraflı
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </span>
                    <svg
                      className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
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
                  </button>
                </div>
              </div>
            </div>
          </div>
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

export default SimpleTransitions;
