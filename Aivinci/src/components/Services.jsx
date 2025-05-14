"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const exchangeRates = [
  {
    currency: "USD",
    buy: "1.6970",
    sell: "1.7020",
    change: "+0.0010",
    trend: "up",
  },
  {
    currency: "EUR",
    buy: "1.8967",
    sell: "1.9585",
    change: "-0.0023",
    trend: "down",
  },
  {
    currency: "GBP",
    buy: "2.2014",
    sell: "2.2999",
    change: "+0.0105",
    trend: "up",
  },
  {
    currency: "100 RUB",
    buy: "1.9100",
    sell: "2.2700",
    change: "-0.0150",
    trend: "down",
  },
  {
    currency: "TRY",
    buy: "0.0520",
    sell: "0.0540",
    change: "+0.0005",
    trend: "up",
  },
];

const serviceItems = [
  {
    id: 1,
    title: "Xidmət şəbəkəsi",
    description: "Sənə ən yaxın filial və bankomatı tap",
    icon: <MapPin className="h-8 w-8 text-white" />,
    color: "from-emerald-400 to-teal-600",
  },
  {
    id: 2,
    title: "Necə etməli",
    description:
      "Məhsul və xidmətlərimizdən daha rahat istifadə üçün təlimatlar burada",
    icon: <HelpCircle className="h-8 w-8 text-white" />,
    color: "from-teal-400 to-emerald-600",
  },
  {
    id: 3,
    title: "Tez-tez verilən suallar",
    description:
      "Ən çox verilən sualların cavablarını sənin üçün bir araya gətirdik.",
    icon: <MessageSquare className="h-8 w-8 text-white" />,
    color: "from-emerald-500 to-teal-600",
  },
];

const Services = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
            Xidmətlərimiz
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Aivinci Bank-ın təqdim etdiyi xidmətlərlə tanış olun
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exchange rates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-[#111111] border border-neutral-800"
                : "bg-white border border-neutral-200"
            } shadow-xl`}
          >
            <h3
              className={`text-xl font-bold mb-6 font-display ${
                theme === "dark" ? "text-neutral-100" : "text-neutral-800"
              }`}
            >
              Valyuta məzənnələri
            </h3>

            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr
                    className={
                      theme === "dark"
                        ? "border-b border-neutral-800"
                        : "border-b border-neutral-200"
                    }
                  >
                    <th
                      className={`text-left py-3 text-sm font-medium ${
                        theme === "dark"
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      Valyuta
                    </th>
                    <th
                      className={`text-right py-3 text-sm font-medium ${
                        theme === "dark"
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      Alış
                    </th>
                    <th
                      className={`text-right py-3 text-sm font-medium ${
                        theme === "dark"
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      Satış
                    </th>
                    <th
                      className={`text-right py-3 text-sm font-medium ${
                        theme === "dark"
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      Dəyişim
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeRates.map((rate, index) => (
                    <motion.tr
                      key={rate.currency}
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                      className={
                        index !== exchangeRates.length - 1
                          ? theme === "dark"
                            ? "border-b border-neutral-800"
                            : "border-b border-neutral-200"
                          : ""
                      }
                    >
                      <td
                        className={`py-3 font-medium ${
                          theme === "dark"
                            ? "text-neutral-200"
                            : "text-neutral-700"
                        }`}
                      >
                        {rate.currency}
                      </td>
                      <td
                        className={`text-right py-3 ${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-600"
                        }`}
                      >
                        {rate.buy}
                      </td>
                      <td
                        className={`text-right py-3 ${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-600"
                        }`}
                      >
                        {rate.sell}
                      </td>
                      <td
                        className={`text-right py-3 flex items-center justify-end ${
                          rate.trend === "up"
                            ? "text-emerald-500"
                            : rate.trend === "down"
                            ? "text-red-500"
                            : theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-600"
                        }`}
                      >
                        {rate.trend === "up" ? (
                          <TrendingUp size={14} className="mr-1" />
                        ) : rate.trend === "down" ? (
                          <TrendingDown size={14} className="mr-1" />
                        ) : null}
                        {rate.change}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <a
                href="#"
                className={`inline-flex items-center text-sm font-medium ${
                  theme === "dark"
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-emerald-600 hover:text-emerald-700"
                } transition-colors group`}
                data-cursor="link"
              >
                Bütün məzənnələr
                <ArrowRight
                  size={14}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </motion.div>

          {/* Service items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {serviceItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="rounded-2xl overflow-hidden shadow-xl h-full flex flex-col"
              >
                <div className={`p-6 bg-gradient-to-r ${item.color}`}>
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-white text-opacity-90">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`p-6 flex-grow flex items-end ${
                    theme === "dark" ? "bg-[#111111]" : "bg-white"
                  }`}
                >
                  <a
                    href="#"
                    className={`w-full text-white px-6 py-4 rounded-xl font-medium transition-all bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 relative overflow-hidden group flex items-center justify-center`}
                    data-cursor="button"
                  >
                    <span className="relative z-10">Daha ətraflı</span>
                    <ArrowRight
                      size={18}
                      className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform"
                    />
                    <span className="absolute inset-0 h-full w-0 bg-white bg-opacity-20 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
