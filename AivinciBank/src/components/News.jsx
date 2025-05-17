"use client"

import { useRef, useEffect } from "react"

const News = () => {
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

  // Banking-related illustrations for news items
  const bankingIllustrations = {
    mobileApp: (
      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden relative">
        {/* Phone frame */}
        <div className="relative w-32 h-64 bg-slate-800 rounded-[24px] border-4 border-slate-700 shadow-lg transform rotate-12">
          {/* Phone screen */}
          <div className="absolute inset-0 m-1 rounded-[20px] bg-gradient-to-br from-primary/40 to-primary/20 overflow-hidden">
            {/* App UI elements */}
            <div className="absolute top-6 left-0 right-0 flex justify-center">
              <div className="w-16 h-6 bg-white/20 rounded-full"></div>
            </div>

            {/* Balance card */}
            <div className="absolute top-16 left-2 right-2 h-16 bg-white/20 rounded-xl p-2">
              <div className="w-12 h-2 bg-white/30 rounded-full mb-2"></div>
              <div className="w-20 h-4 bg-white/40 rounded-full mb-2"></div>
              <div className="w-8 h-2 bg-white/30 rounded-full"></div>
            </div>

            {/* Transaction list */}
            <div className="absolute top-36 left-2 right-2 flex flex-col space-y-2">
              <div className="h-6 bg-white/10 rounded-md flex items-center px-2">
                <div className="w-4 h-4 bg-teal-400/50 rounded-full mr-2"></div>
                <div className="w-12 h-2 bg-white/30 rounded-full"></div>
                <div className="w-8 h-2 bg-white/20 rounded-full ml-auto"></div>
              </div>
              <div className="h-6 bg-white/10 rounded-md flex items-center px-2">
                <div className="w-4 h-4 bg-amber-400/50 rounded-full mr-2"></div>
                <div className="w-10 h-2 bg-white/30 rounded-full"></div>
                <div className="w-6 h-2 bg-white/20 rounded-full ml-auto"></div>
              </div>
              <div className="h-6 bg-white/10 rounded-md flex items-center px-2">
                <div className="w-4 h-4 bg-rose-400/50 rounded-full mr-2"></div>
                <div className="w-14 h-2 bg-white/30 rounded-full"></div>
                <div className="w-8 h-2 bg-white/20 rounded-full ml-auto"></div>
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="absolute bottom-2 left-2 right-2 h-8 bg-white/10 rounded-full flex justify-around items-center">
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              <div className="w-4 h-4 bg-primary/60 rounded-full"></div>
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-6 left-10 w-12 h-12 bg-teal-400/30 rounded-full blur-md animate-pulse-slow"></div>
        <div className="absolute bottom-8 right-12 w-16 h-16 bg-primary/30 rounded-full blur-md animate-float"></div>

        {/* Abstract lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-100,200 C50,100 150,300 300,200 S450,100 600,200"
            stroke="rgba(30,157,110,0.2)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100,250 C50,150 150,350 300,250 S450,150 600,250"
            stroke="rgba(30,157,110,0.1)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    ),

    installmentCard: (
      <div className="w-full h-48 bg-gradient-to-br from-lime-500/20 to-lime-600/5 flex items-center justify-center overflow-hidden relative">
        {/* Main credit card */}
        <div className="relative w-64 h-40 bg-gradient-to-br from-lime-500/80 to-lime-700/80 rounded-2xl shadow-lg transform -rotate-6 z-20">
          {/* Card pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 256 160" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path
                    d="M0,0 L16,0 L16,16 L0,16 L0,0"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                  />
                </pattern>
              </defs>
              <rect width="256" height="160" fill="url(#grid)" />
            </svg>
          </div>

          {/* Card content */}
          <div className="absolute inset-0 p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="text-white font-bold">Aivinci</div>
              <div className="text-white/80 text-xs">Taksit</div>
            </div>

            <div className="mt-4 flex items-center">
              <div className="w-10 h-7 bg-yellow-300/90 rounded-md"></div>
            </div>

            <div className="mt-6 text-white/90 font-mono tracking-widest text-sm">•••• •••• •••• 3842</div>

            <div className="mt-auto flex justify-between items-end">
              <div>
                <div className="text-white/60 text-xs">Card Holder</div>
                <div className="text-white/90 text-sm">S. Allahverdiyeva</div>
              </div>
              <div>
                <div className="text-white/60 text-xs">Expires</div>
                <div className="text-white/90 text-sm">05/28</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary cards (stacked) */}
        <div className="absolute w-64 h-40 bg-gradient-to-br from-lime-600/60 to-lime-800/60 rounded-2xl shadow-lg transform -rotate-12 translate-x-4 translate-y-4 z-10"></div>
        <div className="absolute w-64 h-40 bg-gradient-to-br from-lime-700/40 to-lime-900/40 rounded-2xl shadow-lg transform -rotate-18 translate-x-8 translate-y-8 z-0"></div>

        {/* Installment text */}
        <div className="absolute top-4 right-4 bg-white/90 text-lime-700 font-bold px-3 py-1 rounded-full text-sm shadow-lg z-30">
          24 ay taksit
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-6 left-10 w-12 h-12 bg-lime-400/30 rounded-full blur-md animate-pulse-slow"></div>

        {/* Abstract shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="100" r="50" fill="rgba(132,204,22,0.1)" />
          <circle cx="50" cy="300" r="40" fill="rgba(132,204,22,0.1)" />
        </svg>
      </div>
    ),

    bankBranch: (
      <div className="w-full h-48 bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center overflow-hidden relative">
        {/* Modern bank building */}
        <div className="relative z-20">
          {/* Building base */}
          <div className="w-64 h-32 bg-gradient-to-b from-slate-200/90 to-slate-300/90 rounded-lg shadow-lg flex flex-col overflow-hidden">
            {/* Building top */}
            <div className="h-6 bg-amber-500/90 w-full"></div>

            {/* Windows grid */}
            <div className="flex-1 grid grid-cols-5 grid-rows-3 gap-2 p-2">
              {Array(15)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-slate-800/80 rounded-sm"></div>
                ))}
            </div>

            {/* Entrance */}
            <div className="h-8 flex justify-center">
              <div className="w-16 h-full bg-slate-800/80 rounded-t-lg"></div>
            </div>
          </div>

          {/* Bank sign */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-amber-500/90">
            <div className="text-amber-500 font-bold text-xl">A</div>
          </div>

          {/* Steps */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-slate-400/90 rounded-md"></div>
        </div>

        {/* People silhouettes */}
        <div className="absolute bottom-6 left-1/4 w-4 h-8 bg-slate-700/80 rounded-full"></div>
        <div className="absolute bottom-6 right-1/4 w-4 h-8 bg-slate-700/80 rounded-full"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-amber-400/30 rounded-full blur-md animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-10 h-10 bg-amber-500/20 rounded-full blur-md animate-pulse-slow"></div>

        {/* Abstract shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,300 C100,250 200,350 300,300 S400,250 500,300 S600,350 700,300"
            stroke="rgba(245,158,11,0.1)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M-100,320 C0,270 100,370 200,320 S300,270 400,320 S500,370 600,320"
            stroke="rgba(245,158,11,0.1)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    ),
  }

  const newsItems = [
    {
      id: 1,
      title: "Aivinci Bank yeni mobil tətbiqini təqdim etdi",
      date: "05 May 2025",
      category: "Yeniliklər",
      illustration: "mobileApp",
      excerpt:
        "Aivinci Bank istifadəçi dostu interfeysi və geniş funksionallığı ilə seçilən yeni mobil tətbiqini istifadəyə verdi.",
    },
    {
      id: 2,
      title: "Aivinci Bank ilə taksit imkanları genişləndi",
      date: "28 Aprel 2025",
      category: "Kampaniyalar",
      illustration: "installmentCard",
      excerpt: "Aivinci Bank taksit kartı ilə artıq 500-dən çox mağazada 24 aya qədər taksit imkanı təqdim edir.",
    },
    {
      id: 3,
      title: "Aivinci Bank yeni filialını açdı",
      date: "15 Aprel 2025",
      category: "Xəbərlər",
      illustration: "bankBranch",
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-12 news-animate opacity-0 transform translate-y-8">
          <h2 className="text-3xl md:text-4xl font-bold display-font">Xəbərlər</h2>
          <a href="#" className="flex items-center text-amber-50 group">
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
                {/* Banking illustration instead of image */}
                {bankingIllustrations[item.illustration]}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-amber-50 font-medium px-3 py-1 bg-primary/10 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-sm text-foreground/60">{item.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-foreground/70 mb-6">{item.excerpt}</p>
                <a
                  href="#"
                  className="text-amber-50 font-medium group-hover:text-accent transition-colors duration-300 flex items-center"
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
