"use client";

import { useRef, useEffect } from "react";

const News = () => {
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

    const items = document.querySelectorAll(".news-animate");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // Custom SVG icons
  const icons = {
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

  const newsItems = [
    {
      id: 1,
      title: "Aivinci Bank yeni mobil tətbiqini təqdim etdi",
      date: "05 May 2025",
      category: "Yeniliklər",
      image: "/placeholder.svg?height=400&width=600",
      excerpt:
        "Aivinci Bank istifadəçi dostu interfeysi və geniş funksionallığı ilə seçilən yeni mobil tətbiqini istifadəyə verdi.",
    },
    {
      id: 2,
      title: "Aivinci Bank ilə taksit imkanları genişləndi",
      date: "28 Aprel 2025",
      category: "Kampaniyalar",
      image: "/placeholder.svg?height=400&width=600",
      excerpt:
        "Aivinci Bank taksit kartı ilə artıq 500-dən çox mağazada 24 aya qədər taksit imkanı təqdim edir.",
    },
    {
      id: 3,
      title: "Aivinci Bank yeni filialını açdı",
      date: "15 Aprel 2025",
      category: "Xəbərlər",
      image: "/placeholder.svg?height=400&width=600",
      excerpt:
        "Aivinci Bank Bakının mərkəzində müasir dizaynı ilə seçilən yeni filialını müştərilərin istifadəsinə verdi.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-12 news-animate opacity-0 transform translate-y-8">
          <h2 className="text-3xl md:text-4xl font-bold display-font">
            Xəbərlər
          </h2>
          <a
            href="#"
            className="flex items-center text-amber-50 group"
          >
            <span className="relative">
              Bütün xəbərlər
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-50 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
              {icons.arrow}
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className="modern-card news-animate opacity-0 transform translate-y-8 group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-amber-500 font-medium px-3 py-1 bg-primary/10 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-sm text-foreground/60">
                    {item.date}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-foreground/70 mb-6">{item.excerpt}</p>
                <a
                  href="#"
                  className="text-amber-500 font-medium group-hover:text-accent transition-colors duration-300 flex items-center"
                >
                  <span className="relative inline-block">
                    Ətraflı oxu
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                  <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                    {icons.arrow}
                  </span>
                </a>
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

export default News;
