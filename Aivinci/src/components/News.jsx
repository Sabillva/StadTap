"use client";

import { useState } from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Calendar, Eye } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Aivinci Bank yeni filialını açdı",
    description:
      "Bakının mərkəzində yerləşən yeni filialımız müştərilərimizə xidmət göstərməyə başladı.",
    date: "05.05.2025",
    image: "/placeholder.svg?height=400&width=600",
    views: 1243,
    category: "Korporativ",
  },
  {
    id: 2,
    title: "Yeni mobil tətbiqimiz artıq əlçatandır",
    description:
      "Tamamilə yenilənmiş mobil tətbiqimizlə bank əməliyyatlarınızı daha rahat idarə edin.",
    date: "01.05.2025",
    image: "/placeholder.svg?height=400&width=600",
    views: 2567,
    category: "Texnologiya",
  },
  {
    id: 3,
    title: "Aivinci Bank ilə taksit imkanları genişlənir",
    description:
      "İndi daha çox mağazada Aivinci Bank kartları ilə taksit imkanından yararlana bilərsiniz.",
    date: "28.04.2025",
    image: "/placeholder.svg?height=400&width=600",
    views: 1876,
    category: "Kampaniyalar",
  },
];

const News = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-[#0F0F0F]" : "bg-[#F0F0F0]"
      } transition-colors duration-500`}
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"></div>
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            Xəbərlər
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Aivinci Bank-ın ən son xəbərləri və yenilikləri ilə tanış olun
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
                theme === "dark"
                  ? "bg-[#111111] border border-neutral-800"
                  : "bg-white border border-neutral-200"
              }`}
              style={{
                transform:
                  hoveredCard === item.id
                    ? "translateY(-10px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredCard === item.id
                    ? theme === "dark"
                      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                      : "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                    : theme === "dark"
                    ? "0 10px 30px -5px rgba(0, 0, 0, 0.3)"
                    : "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              data-cursor="link"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform:
                      hoveredCard === item.id ? "scale(1.1)" : "scale(1)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white font-medium text-lg">
                    Daha ətraflı
                  </span>
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <div
                  className={`flex items-center text-sm mb-3 ${
                    theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-4">{item.date}</span>
                  <Eye size={14} className="mr-1" />
                  <span>{item.views}</span>
                </div>

                <h3
                  className={`text-xl font-bold mb-3 leading-tight font-display ${
                    theme === "dark" ? "text-neutral-100" : "text-neutral-800"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mb-4 line-clamp-2 ${
                    theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  {item.description}
                </p>

                <a
                  href="#"
                  className={`inline-flex items-center font-medium group ${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  <span className="relative">
                    Ətraflı
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        theme === "dark" ? "bg-emerald-400" : "bg-emerald-600"
                      }`}
                    ></span>
                  </span>
                  <ArrowRight
                    size={16}
                    className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <a
            href="#"
            className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all group shadow-xl ${
              theme === "dark"
                ? "bg-[#111111] border border-emerald-500 text-emerald-400 hover:bg-neutral-800"
                : "bg-white border border-emerald-500 text-emerald-600 hover:bg-neutral-100"
            }`}
            data-cursor="button"
          >
            <span>Bütün xəbərlər</span>
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default News;
