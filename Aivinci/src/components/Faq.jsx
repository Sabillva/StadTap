"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X, Filter, HelpCircle } from "lucide-react";

const faqItems = [
  {
    id: 1,
    question: "Aivinci Bank-da hesab necə açmaq olar?",
    answer:
      "Aivinci Bank-da hesab açmaq üçün şəxsiyyət vəsiqənizlə birlikdə istənilən filialımıza müraciət edə və ya rəsmi veb saytımız üzərindən onlayn müraciət edə bilərsiniz. Mobil tətbiqimiz vasitəsilə də qeydiyyatdan keçmək mümkündür.",
    category: "Hesablar",
  },
  {
    id: 2,
    question: "Kredit almaq üçün hansı sənədlər tələb olunur?",
    answer:
      "Kredit almaq üçün şəxsiyyət vəsiqəsi, iş yerindən arayış və son 6 aylıq maaş kartından çıxarış tələb olunur. Kredit məbləği 10,000 AZN-dən çox olduqda əlavə təminat tələb oluna bilər.",
    category: "Kreditlər",
  },
  {
    id: 3,
    question: "Xaricdə kartımdan istifadə edə bilərəmmi?",
    answer:
      "Bəli, Aivinci Bank kartları beynəlxalq ödəniş sistemləri ilə inteqrasiya olunub və dünyanın istənilən yerində istifadə edilə bilər. Xaricə səyahətdən əvvəl kartınızı aktivləşdirmək üçün mobil tətbiq və ya müştəri xidmətləri vasitəsilə bizə məlumat verməyiniz tövsiyə olunur.",
    category: "Kartlar",
  },
  {
    id: 4,
    question: "Mobil tətbiqi necə yükləyə bilərəm?",
    answer:
      "Aivinci Bank mobil tətbiqini App Store və ya Google Play mağazalarından pulsuz yükləyə bilərsiniz. Tətbiqi yüklədikdən sonra qeydiyyat prosesini tamamlayaraq bank hesablarınıza çıxış əldə edəcəksiniz.",
    category: "Mobil Bank",
  },
  {
    id: 5,
    question: "Valyuta məzənnələri nə tezliklə yenilənir?",
    answer:
      "Aivinci Bank-da valyuta məzənnələri hər gün səhər saat 10:00-da yenilənir. Böyük bazar dəyişiklikləri zamanı gün ərzində də məzənnələr yenilənə bilər. Cari məzənnələri veb saytımızdan, mobil tətbiqdən və ya filiallarımızdan öyrənə bilərsiniz.",
    category: "Valyuta",
  },
  {
    id: 6,
    question: "Depozit hesabını vaxtından əvvəl bağlamaq mümkündürmü?",
    answer:
      "Bəli, depozit hesabını vaxtından əvvəl bağlamaq mümkündür, lakin bu halda faiz gəliri müqavilədə göstərilən şərtlərə uyğun olaraq yenidən hesablanacaq. Adətən, vaxtından əvvəl bağlama zamanı daha aşağı faiz dərəcəsi tətbiq olunur.",
    category: "Əmanətlər",
  },
];

const Faq = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeItem, setActiveItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Bütün");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);

  const categories = [
    "Bütün",
    ...Array.from(new Set(faqItems.map((item) => item.category))),
  ];

  const toggleItem = (id) => {
    setActiveItem(activeItem === id ? null : id);
  };

  const filteredItems = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "Bütün" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && !event.target.closest(".filter-container")) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-[#0A0A0A]" : "bg-[#F8F8F8]"
      } transition-colors duration-500 overflow-hidden`}
      ref={ref}
    >
      <div className="container mx-auto px-4 relative">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-16 relative z-10"
        >
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4 rounded-full"></div>
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center bg-clip-text ${
              theme === "dark"
                ? "text-transparent bg-gradient-to-r from-white to-neutral-300"
                : "text-transparent bg-gradient-to-r from-neutral-800 to-neutral-600"
            }`}
          >
            Tez-tez verilən suallar
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Aivinci Bank haqqında ən çox soruşulan suallar və cavablar
          </p>
        </motion.div>

        {/* Search and filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto mb-12 relative z-10"
        >
          <div
            className={`relative mb-6 rounded-2xl transition-all duration-300 ${
              isSearchFocused
                ? theme === "dark"
                  ? "shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : ""
            }`}
          >
            <input
              ref={searchRef}
              type="text"
              placeholder="Sual axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full pl-12 pr-12 py-5 rounded-2xl focus:outline-none transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[#111111]/80 backdrop-blur-xl border-[#222222] text-neutral-100 placeholder-neutral-500"
                  : "bg-white/80 backdrop-blur-xl border-neutral-200 text-neutral-800 placeholder-neutral-400"
              } border shadow-lg`}
            />
            <Search
              size={20}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                  theme === "dark"
                    ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-600"
                } transition-all duration-300`}
                data-cursor="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* <div className="flex items-center justify-between mb-8">
            <div className="relative filter-container">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  theme === "dark"
                    ? "bg-[#111111]/80 backdrop-blur-xl text-neutral-300 hover:bg-[#1A1A1A] border-[#222222]"
                    : "bg-white/80 backdrop-blur-xl text-neutral-700 hover:bg-neutral-50 border-neutral-200"
                } border shadow-md transition-all duration-300`}
                data-cursor="button"
              >
                <Filter size={16} />
                <span>Kateqoriyalar</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 top-full mt-2 p-3 rounded-xl z-30 min-w-[200px] shadow-xl ${
                      theme === "dark"
                        ? "bg-[#111111]/90 backdrop-blur-xl border border-[#222222]"
                        : "bg-white/90 backdrop-blur-xl border border-neutral-200"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setActiveCategory(category);
                            setShowFilters(false);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-all duration-300 ${
                            activeCategory === category
                              ? theme === "dark"
                                ? "bg-emerald-900/30 text-emerald-400"
                                : "bg-emerald-50 text-emerald-700"
                              : theme === "dark"
                              ? "text-neutral-300 hover:bg-[#1A1A1A]"
                              : "text-neutral-700 hover:bg-neutral-50"
                          }`}
                          data-cursor="button"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {filteredItems.length} sual tapıldı
            </div>
          </div> */}

          {/* Active category pills */}
          {activeCategory !== "Bütün" && (
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                Aktiv filter:
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  theme === "dark"
                    ? "bg-emerald-900/30 text-emerald-400"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {activeCategory}
                <button
                  onClick={() => setActiveCategory("Bütün")}
                  className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  data-cursor="button"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* FAQ items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto relative z-10"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`mb-5 rounded-2xl overflow-hidden border ${
                  theme === "dark"
                    ? "bg-[#111111]/80 backdrop-blur-xl border-[#222222]"
                    : "bg-white/80 backdrop-blur-xl border-neutral-200"
                } shadow-lg transition-all duration-300 hover:shadow-xl ${
                  activeItem === item.id
                    ? theme === "dark"
                      ? "shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : ""
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-full flex justify-between items-center p-6 text-left font-medium transition-all duration-300 ${
                    theme === "dark" ? "text-neutral-100" : "text-neutral-800"
                  } ${
                    activeItem === item.id
                      ? theme === "dark"
                        ? "bg-[#151515]"
                        : "bg-neutral-50"
                      : ""
                  }`}
                  data-cursor="button"
                >
                  <span className="text-lg">{item.question}</span>
                  <div
                    className={`ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeItem === item.id
                        ? theme === "dark"
                          ? "bg-emerald-900/30 text-emerald-400 rotate-180"
                          : "bg-emerald-50 text-emerald-700 rotate-180"
                        : theme === "dark"
                        ? "bg-[#1A1A1A] text-neutral-400"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={`px-6 pb-6 ${
                        theme === "dark"
                          ? "text-neutral-300"
                          : "text-neutral-600"
                      }`}
                    >
                      <div className="border-t pt-4 mt-1 border-neutral-200 dark:border-neutral-800">
                        <p className="leading-relaxed">{item.answer}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              theme === "dark"
                                ? "bg-emerald-900/30 text-emerald-400"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {item.category}
                          </span>
                          <button
                            className={`text-xs flex items-center gap-1 ${
                              theme === "dark"
                                ? "text-emerald-400"
                                : "text-emerald-600"
                            } hover:underline`}
                            data-cursor="link"
                          >
                            Bu cavab faydalı oldu?
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className={`text-center py-16 px-6 rounded-2xl border ${
                theme === "dark"
                  ? "bg-[#111111]/80 backdrop-blur-xl border-[#222222] text-neutral-400"
                  : "bg-white/80 backdrop-blur-xl border-neutral-200 text-neutral-500"
              } shadow-lg`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    theme === "dark" ? "bg-neutral-900" : "bg-neutral-100"
                  }`}
                >
                  <HelpCircle
                    size={32}
                    className={
                      theme === "dark" ? "text-neutral-600" : "text-neutral-400"
                    }
                  />
                </div>
                <p className="text-lg font-medium mb-2">
                  Axtarışınıza uyğun sual tapılmadı.
                </p>
                <p className="mb-6">
                  Zəhmət olmasa başqa açar sözlər ilə axtarış edin və ya filtri
                  dəyişin.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("Bütün");
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    } transition-all duration-300`}
                    data-cursor="button"
                  >
                    Filtri sıfırla
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Contact support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-16 p-8 rounded-2xl max-w-3xl mx-auto text-center relative z-10 ${
            theme === "dark"
              ? "bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-800/30 backdrop-blur-xl"
              : "bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-100/80 backdrop-blur-xl"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-100"
            }`}
          >
            <HelpCircle
              size={28}
              className={
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }
            />
          </div>
          <h3
            className={`text-2xl font-bold mb-2 ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            Sualınıza cavab tapa bilmədiniz?
          </h3>
          <p
            className={`mb-6 max-w-md mx-auto ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Müştəri xidmətlərimiz sizə kömək etməyə hazırdır. Bizimlə əlaqə
            saxlayın və suallarınıza tez bir zamanda cavab alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2"
              data-cursor="button"
            >
              Əlaqə saxlayın
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                theme === "dark"
                  ? "bg-[#111111] text-neutral-300 hover:bg-[#1A1A1A] border-[#222222]"
                  : "bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200"
              } border shadow-md hover:shadow-lg`}
              data-cursor="button"
            >
              Tez-tez verilən suallar
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
