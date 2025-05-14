"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Building, CreditCard, Landmark } from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Müştərilər",
    value: "1.2M+",
    icon: <Users className="w-8 h-8" />,
    description: "Aktiv müştəri",
    color: "from-emerald-400 to-teal-600",
  },
  {
    id: 2,
    title: "Filiallar",
    value: "120+",
    icon: <Building className="w-8 h-8" />,
    description: "Ölkə üzrə",
    color: "from-teal-400 to-emerald-600",
  },
  {
    id: 3,
    title: "Kartlar",
    value: "2.5M+",
    icon: <CreditCard className="w-8 h-8" />,
    description: "Buraxılmış kart",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "Aktivlər",
    value: "₼5B+",
    icon: <Landmark className="w-8 h-8" />,
    description: "Ümumi aktivlər",
    color: "from-teal-500 to-emerald-600",
  },
];

const Statistics = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
      } transition-colors duration-500`}
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"></div>
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            Rəqəmlərlə Aivinci
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Aivinci Bank-ın uğur göstəriciləri
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl p-8 transition-all duration-500 ${
                theme === "dark"
                  ? "bg-[#111111] border border-neutral-800"
                  : "bg-white border border-neutral-200"
              } shadow-xl hover:shadow-2xl`}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                  stat.color
                } flex items-center justify-center mb-6 transition-transform duration-500 ${
                  hoveredCard === stat.id ? "scale-110" : ""
                }`}
              >
                <div className="text-white">{stat.icon}</div>
              </div>

              <h3
                className={`text-4xl font-bold mb-2 font-display ${
                  theme === "dark" ? "text-neutral-100" : "text-neutral-800"
                }`}
              >
                {stat.value}
              </h3>
              <p
                className={`text-xl font-medium mb-1 ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                {stat.title}
              </p>
              <p
                className={
                  theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                }
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
