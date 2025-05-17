"use client";

import { useRef, useEffect } from "react";

const Services = () => {
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

  const exchangeRates = [
    { currency: "USD", buy: "1.6970", sell: "1.7020" },
    { currency: "EUR", buy: "1.8967", sell: "1.9585" },
    { currency: "GBP", buy: "2.2014", sell: "2.2999" },
    { currency: "100 RUB", buy: "1.9100", sell: "2.2700" },
  ];

  // Custom SVG icons
  const icons = {
    map: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75V9.75Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    help: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.09 9.00001C9.3251 8.33167 9.78915 7.76811 10.4 7.40914C11.0108 7.05016 11.7289 6.91894 12.4272 7.03872C13.1255 7.15849 13.7588 7.52153 14.2151 8.06353C14.6713 8.60554 14.9211 9.29153 14.92 10C14.92 12 11.92 13 11.92 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17H12.01"
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

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 display-font service-animate opacity-0 transform translate-y-8">
          Xidmətlər
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className="modern-card service-animate opacity-0 transform translate-y-8"
            style={{ transitionDelay: "100ms" }}
          >
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-6 text-primary/10">
                Valyuta məzənnələri
              </h3>

              <div className="mb-6">
                <div className="grid grid-cols-3 font-medium text-foreground/60 mb-3">
                  <div>Valyuta</div>
                  <div>Alış</div>
                  <div>Satış</div>
                </div>

                {exchangeRates.map((rate, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 py-3 border-primary/10 hover:bg-primary/5 rounded-md transition-colors"
                  >
                    <div className="font-medium">{rate.currency}</div>
                    <div>{rate.buy}</div>
                    <div>{rate.sell}</div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-foreground/60 mb-6">
                Kurslar 6-5-2025 tarixinə təyin edilmişdir
              </div>

              <div className="mt-auto">
                <a
                  href="#"
                  className="flex items-center text-teal-500 group"
                >
                  <span className="relative">
                    Bütün məzənnələr
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                  <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                    {icons.arrow}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div
            className="modern-card service-animate opacity-0 transform translate-y-8"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <h3 className="text-xl font-semibold">Xidmət şəbəkəsi</h3>
              </div>

              <p className="text-foreground/70 mb-8">
                Sənə ən yaxın filial və bankomatı tap
              </p>

              <div className="aspect-video bg-primary/5 rounded-2xl mb-6 overflow-hidden">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=49.7900390625%2C40.2651179793752%2C50.0823974609375%2C40.43022363450862&amp;layer=mapnik"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="OpenStreetMap"
                  className="w-full h-full"
                ></iframe>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button className="btn bg-teal-500 group relative overflow-hidden">
                  <span className="relative z-10">Filiallar</span>
                  <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </button>
                <button className="btn bg-teal-500 group relative overflow-hidden">
                  <span className="relative z-10">Bankomatlar</span>
                  <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="modern-card service-animate opacity-0 transform translate-y-8"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <h3 className="text-xl font-semibold">Necə etməli</h3>
              </div>

              <p className="text-foreground/70 mb-8">
                Məhsul və xidmətlərimizdən daha rahat istifadə üçün təlimatlar
                burada
              </p>

              <div className="space-y-4">
                <a
                  href="#"
                  className="block p-5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl hover:from-primary/20 hover:to-primary/10 transition-all transform hover:translate-y-[-4px] hover:shadow-lg"
                >
                  <h4 className="font-medium mb-2">Onlayn kredit sifarişi</h4>
                  <p className="text-sm text-foreground/60">
                    Onlayn kredit sifarişini necə vermək olar?
                  </p>
                </a>

                <a
                  href="#"
                  className="block p-5 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-2xl hover:from-secondary/20 hover:to-secondary/10 transition-all transform hover:translate-y-[-4px] hover:shadow-lg"
                >
                  <h4 className="font-medium mb-2">
                    Mobil tətbiq quraşdırılması
                  </h4>
                  <p className="text-sm text-foreground/60">
                    Mobil tətbiqi necə quraşdırmaq və istifadə etmək olar?
                  </p>
                </a>

                <a
                  href="#"
                  className="block p-5 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl hover:from-accent/20 hover:to-accent/10 transition-all transform hover:translate-y-[-4px] hover:shadow-lg"
                >
                  <h4 className="font-medium mb-2">Kart aktivləşdirilməsi</h4>
                  <p className="text-sm text-foreground/60">
                    Yeni kartı necə aktivləşdirmək olar?
                  </p>
                </a>
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

export default Services;
