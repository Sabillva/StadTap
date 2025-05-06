"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowRight, MapPin, HelpCircle, MessageSquare, TrendingUp, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"

const exchangeRates = [
  { currency: "USD", buy: "1.6970", sell: "1.7020", change: "+0.0010", trend: "up" },
  { currency: "EUR", buy: "1.8967", sell: "1.9585", change: "-0.0023", trend: "down" },
  { currency: "GBP", buy: "2.2014", sell: "2.2999", change: "+0.0105", trend: "up" },
  { currency: "100 RUB", buy: "1.9100", sell: "2.2700", change: "-0.0150", trend: "down" },
  { currency: "TRY", buy: "0.0520", sell: "0.0540", change: "+0.0005", trend: "up" },
]

const serviceItems = [
  {
    id: 1,
    title: "Xidmət şəbəkəsi",
    description: "Sənə ən yaxın filial və bankomatı tap",
    icon: <MapPin className="h-8 w-8 text-white" />,
    color: "from-green-400 to-green-600",
  },
  {
    id: 2,
    title: "Necə etməli",
    description: "Məhsul və xidmətlərimizdən daha rahat istifadə üçün təlimatlar burada",
    icon: <HelpCircle className="h-8 w-8 text-white" />,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: 3,
    title: "Tez-tez verilən suallar",
    description: "Ən çox verilən sualların cavablarını sənin üçün bir araya gətirdik.",
    icon: <MessageSquare className="h-8 w-8 text-white" />,
    color: "from-green-500 to-emerald-600",
  },
]

const Services = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const [hoveredService, setHoveredService] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect()
      }
    }
  }, [])

  const handleMouseMove = (e, id) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  const getCardStyle = (id) => {
    if (hoveredService !== id) return {}

    const x = mousePosition.x * 5
    const y = mousePosition.y * 5
    return {
      transform: `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`,
    }
  }

  return (
    <section className="py-24 bg-gray-200" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className={`h-1 w-20 bg-green-500 mb-4 ${isVisible ? "scale-in" : "opacity-0"}`}></div>
          <h2
            className={`text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4 text-center ${isVisible ? "blur-in" : "opacity-0"}`}
          >
            Xidmətlər
          </h2>
          <p className={`text-gray-600 max-w-2xl text-center text-lg ${isVisible ? "blur-in delay-200" : "opacity-0"}`}>
            Aivinci Bank-ın müştəriləri üçün təqdim etdiyi xidmətlər
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exchange rates */}
          <div
            className={`bg-white p-8 rounded-2xl shadow-luxury border border-gray-300 ${
              isVisible ? "scale-in" : "opacity-0"
            }`}
          >
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 rounded-full bg-gradient-luxury from-green-400 to-green-600 flex items-center justify-center mr-4 shadow-md">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-display">Valyuta məzənnələri</h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <th className="text-left py-4 px-4 text-gray-700 font-medium">Valyuta</th>
                    <th className="text-right py-4 px-4 text-gray-700 font-medium">Alış</th>
                    <th className="text-right py-4 px-4 text-gray-700 font-medium">Satış</th>
                    <th className="text-right py-4 px-4 text-gray-700 font-medium">Dəyişiklik</th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeRates.map((rate, index) => (
                    <tr
                      key={rate.currency}
                      className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-4 px-4 font-medium">
                        <div className="flex items-center">
                          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-xs font-bold">
                            {rate.currency.substring(0, 2)}
                          </span>
                          {rate.currency}
                        </div>
                      </td>
                      <td className="text-right py-4 px-4">{rate.buy}</td>
                      <td className="text-right py-4 px-4">{rate.sell}</td>
                      <td
                        className={`text-right py-4 px-4 font-medium ${
                          rate.trend === "up" ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        <div className="flex items-center justify-end">
                          {rate.change}
                          {rate.trend === "up" ? (
                            <ArrowUp size={14} className="ml-1" />
                          ) : (
                            <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500 flex items-center">
                <RefreshCw size={14} className="mr-2" />
                Son yenilənmə: 06.05.2025, 14:30
              </p>
              <a href="#" className="inline-flex items-center text-green-600 font-medium hover:underline group">
                Bütün məzənnələr
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Service items */}
          <div className="grid grid-cols-1 gap-4">
            {serviceItems.map((item, index) => (
              <div
                key={item.id}
                className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                  isVisible ? "scale-in" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  transformStyle: "preserve-3d",
                  ...getCardStyle(item.id),
                }}
                onMouseEnter={() => setHoveredService(item.id)}
                onMouseLeave={() => setHoveredService(null)}
                onMouseMove={(e) => handleMouseMove(e, item.id)}
              >
                <div
                  className="bg-gradient-luxury p-6 flex items-start group relative overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    "--tw-gradient-from": item.color.split(" ")[0].replace("from-", ""),
                    "--tw-gradient-to": item.color.split(" ")[1].replace("to-", ""),
                  }}
                >
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

                  <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-xl shadow-md">{item.icon}</div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 font-display">{item.title}</h3>
                    <p className="text-white text-opacity-90 mb-3">{item.description}</p>
                    <a href="#" className="inline-flex items-center text-white font-medium group-hover:underline">
                      <span>Daha ətraflı</span>
                      <ArrowRight
                        size={16}
                        className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
