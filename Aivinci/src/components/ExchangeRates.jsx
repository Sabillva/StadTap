"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

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

const ExchangeRates = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      className={`py-16 ${
        theme === "dark" ? "bg-[#0F0F0F]" : "bg-[#F0F0F0]"
      } transition-colors duration-500`}
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"></div>
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            Valyuta məzənnələri
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Günlük yenilənən valyuta məzənnələri ilə tanış olun
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-2xl p-8 ${
            theme === "dark"
              ? "bg-[#111111] border border-neutral-800"
              : "bg-white border border-neutral-200"
          } shadow-xl max-w-4xl mx-auto`}
        >
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
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    Valyuta
                  </th>
                  <th
                    className={`text-right py-3 text-sm font-medium ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    Alış
                  </th>
                  <th
                    className={`text-right py-3 text-sm font-medium ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    Satış
                  </th>
                  <th
                    className={`text-right py-3 text-sm font-medium ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
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
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className={
                      index !== exchangeRates.length - 1
                        ? theme === "dark"
                          ? "border-b border-neutral-800"
                          : "border-b border-neutral-200"
                        : ""
                    }
                  >
                    <td
                      className={`py-4 font-medium ${
                        theme === "dark"
                          ? "text-neutral-200"
                          : "text-neutral-700"
                      }`}
                    >
                      {rate.currency}
                    </td>
                    <td
                      className={`text-right py-4 ${
                        theme === "dark"
                          ? "text-neutral-300"
                          : "text-neutral-600"
                      }`}
                    >
                      {rate.buy}
                    </td>
                    <td
                      className={`text-right py-4 ${
                        theme === "dark"
                          ? "text-neutral-300"
                          : "text-neutral-600"
                      }`}
                    >
                      {rate.sell}
                    </td>
                    <td
                      className={`text-right py-4 flex items-center justify-end ${
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

          <div className="mt-8 text-center">
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
      </div>
    </section>
  );
};

export default ExchangeRates;
