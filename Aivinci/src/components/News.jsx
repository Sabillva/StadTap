"use client";

import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

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
  {
    id: 4,
    title: "Yeni kredit şərtləri ilə tanış olun",
    description:
      "Daha aşağı faiz dərəcələri və daha uzun ödəmə müddəti ilə kredit təkliflərimiz yeniləndi.",
    date: "25.04.2025",
    image: "/placeholder.svg?height=400&width=600",
    views: 1532,
    category: "Kreditlər",
  },
  {
    id: 5,
    title: "Aivinci Bank beynəlxalq mükafata layiq görüldü",
    description:
      "Bankımız innovativ xidmətlərinə görə nüfuzlu beynəlxalq mükafata layiq görüldü.",
    date: "20.04.2025",
    image: "/placeholder.svg?height=400&width=600",
    views: 3241,
    category: "Mükafatlar",
  },
];

const News = ({ theme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Hamısı");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const categories = [
    "Hamısı",
    "Korporativ",
    "Texnologiya",
    "Kampaniyalar",
    "Kreditlər",
    "Mükafatlar",
  ];

  const filteredItems =
    activeCategory === "Hamısı"
      ? newsItems
      : newsItems.filter((item) => item.category === activeCategory);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Reset to first page when category changes
    setCurrentPage(0);
  }, [activeCategory]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-200"
      } transition-colors duration-500`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="h-1 w-20 bg-green-500 mb-4"
          ></motion.div>
          <motion.h2
            variants={itemVariants}
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Xəbərlər
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Aivinci Bank-ın ən son xəbərləri və yenilikləri ilə tanış olun
          </motion.p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-luxury from-green-500 to-green-600 text-green-50 shadow-md"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
                theme === "dark"
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-gray-100 border border-gray-300"
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
                  <span className="text-green-50 font-medium text-lg">
                    Daha ətraflı
                  </span>
                </div>
                <div className="absolute top-4 left-4 bg-gradient-luxury from-green-500 to-green-600 text-green-50 text-xs font-medium px-3 py-1 rounded-full shadow-md">
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <div
                  className={`flex items-center text-sm mb-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-4">{item.date}</span>
                  <Eye size={14} className="mr-1" />
                  <span>{item.views}</span>
                </div>

                <h3
                  className={`text-xl font-bold mb-3 leading-tight font-display ${
                    theme === "dark" ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mb-4 line-clamp-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.description}
                </p>

                <a
                  href="#"
                  className={`inline-flex items-center font-medium group ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  <span className="relative">
                    Ətraflı
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        theme === "dark" ? "bg-green-400" : "bg-green-600"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mb-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-full ${
                currentPage === 0
                  ? theme === "dark"
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-700 text-green-400 hover:bg-gray-600 border border-gray-600"
                  : "bg-gray-100 text-green-600 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Səhifə {currentPage + 1} / {totalPages}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-full ${
                currentPage === totalPages - 1
                  ? theme === "dark"
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-700 text-green-400 hover:bg-gray-600 border border-gray-600"
                  : "bg-gray-100 text-green-600 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <a
            href="#"
            className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all group shadow-xl ${
              theme === "dark"
                ? "bg-gray-700 border border-green-500 text-green-400 hover:bg-gray-600"
                : "bg-gray-100 border border-green-500 text-green-600 hover:bg-gray-200"
            }`}
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
