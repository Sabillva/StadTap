"use client"

import { useTheme } from "./ThemeContext"
import { useRef, useEffect } from "react"

const News = () => {
  const { darkMode } = useTheme()

  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const items = document.querySelectorAll(".news-animate")
    items.forEach((item) => observer.observe(item))

    return () => {
      items.forEach((item) => observer.unobserve(item))
    }
  }, [])

  // Custom SVG icons
  const icons = {
    arrow: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }

  const newsItems = [
    {
      id: 1,
      title: "Aivinci Bank yeni mobil tətbiqini təqdim etdi",
      date: "05 May 2025",
      category: "Yeniliklər",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt:
        "Aivinci Bank istifadəçi dostu interfeysi və geniş funksionallığı ilə seçilən yeni mobil tətbiqini istifadəyə verdi.",
    },
    {
      id: 2,
      title: "Aivinci Bank ilə taksit imkanları genişləndi",
      date: "28 Aprel 2025",
      category: "Kampaniyalar",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "Aivinci Bank taksit kartı ilə artıq 500-dən çox mağazada 24 aya qədər taksit imkanı təqdim edir.",
    },
    {
      id: 3,
      title: "Aivinci Bank yeni filialını açdı",
      date: "15 Aprel 2025",
      category: "Xəbərlər",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt:
        "Aivinci Bank Bakının mərkəzində müasir dizaynı ilə seçilən yeni filialını müştərilərin istifadəsinə verdi.",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-30"></div>

      <div className="container mx-auto px-16 relative z-10">
        <div className="flex justify-between items-center mb-12 news-animate opacity-0 transform translate-y-8">
          <h2 className={`text-3xl md:text-4xl font-bold display-font ${darkMode ? "text-white" : "text-black"}`}>
            Xəbərlər
          </h2>
          <a href="#" className={`flex items-center group ${darkMode ? "text-amber-50" : "text-black"}`}>
            <span className="relative">
              Bütün xəbərlər
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 ${
                  darkMode ? "bg-amber-50" : "bg-black"
                }`}
              ></span>
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
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=200&width=400"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      darkMode ? "text-amber-50 bg-primary/10" : "text-black bg-primary/5"
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className={`text-sm ${darkMode ? "text-white/60" : "text-gray-500"}`}>{item.date}</span>
                </div>
                <h3
                  className={`text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-primary ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p className={`mb-6 ${darkMode ? "text-white/70" : "text-gray-700"}`}>{item.excerpt}</p>
                <a
                  href="#"
                  className={`font-medium flex items-center transition-colors duration-300 group-hover:text-accent ${
                    darkMode ? "text-amber-50" : "text-black"
                  }`}
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
  )
}

export default News
