"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  DollarSign,
  Bell,
  Lock,
  Smartphone,
  Download,
  User,
} from "lucide-react";

const MobileApp = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Kart idarəetməsi",
      description: "Bütün kartlarınızı bir tətbiqdə idarə edin",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Ani köçürmələr",
      description: "Pul köçürmələrini saniyələr ərzində həyata keçirin",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Bildirişlər",
      description: "Bütün əməliyyatlar haqqında dərhal məlumat alın",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Təhlükəsizlik",
      description: "Biometrik giriş və şifrələmə ilə tam qorunma",
    },
  ];

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-[#0F0F0F]" : "bg-[#F0F0F0]"
      } transition-colors duration-500`}
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"></div>
            <h2
              className={`text-3xl md:text-5xl font-bold mb-6 font-display leading-tight ${
                theme === "dark" ? "text-neutral-100" : "text-neutral-800"
              }`}
            >
              Aivinci Bank mobil tətbiqi ilə bankçılıq cibinizdə
            </h2>
            <p
              className={`text-lg mb-8 max-w-xl ${
                theme === "dark" ? "text-neutral-300" : "text-neutral-600"
              }`}
            >
              Müasir və istifadəçi dostu interfeys ilə bank əməliyyatlarınızı
              istənilən yerdə və istənilən vaxt həyata keçirin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`flex items-start p-4 rounded-xl ${
                    theme === "dark" ? "bg-[#111111]" : "bg-white"
                  } shadow-md`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      theme === "dark"
                        ? "bg-emerald-900/50 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-bold mb-1 ${
                        theme === "dark"
                          ? "text-neutral-100"
                          : "text-neutral-800"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-neutral-400"
                          : "text-neutral-600"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.7 }}
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-xl ${
                  theme === "dark"
                    ? "bg-[#111111] hover:bg-neutral-800"
                    : "bg-white hover:bg-neutral-100"
                } shadow-lg transition-all`}
                data-cursor="link"
              >
                <div className="w-8 h-8">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5227 7.39601V8.92935C17.5227 9.31491 17.2468 9.59601 16.8727 9.59601H15.3393C14.9538 9.59601 14.6727 9.32012 14.6727 8.92935V7.39601C14.6727 7.01044 14.9486 6.72935 15.3393 6.72935H16.8727C17.2582 6.72935 17.5227 7.00524 17.5227 7.39601Z"
                      fill="#3DDC84"
                    />
                    <path
                      d="M8.65152 7.39601V8.92935C8.65152 9.31491 8.37563 9.59601 7.98485 9.59601H6.45152C6.06595 9.59601 5.78485 9.32012 5.78485 8.92935V7.39601C5.78485 7.01044 6.06074 6.72935 6.45152 6.72935H7.98485C8.37042 6.72935 8.65152 7.00524 8.65152 7.39601Z"
                      fill="#3DDC84"
                    />
                    <path
                      d="M17.5227 16.2667V17.8C17.5227 18.1856 17.2468 18.4667 16.8727 18.4667H15.3393C14.9538 18.4667 14.6727 18.1908 14.6727 17.8V16.2667C14.6727 15.8811 14.9486 15.6 15.3393 15.6H16.8727C17.2582 15.6 17.5227 15.8759 17.5227 16.2667Z"
                      fill="#3DDC84"
                    />
                    <path
                      d="M8.65152 16.2667V17.8C8.65152 18.1856 8.37563 18.4667 7.98485 18.4667H6.45152C6.06595 18.4667 5.78485 18.1908 5.78485 17.8V16.2667C5.78485 15.8811 6.06074 15.6 6.45152 15.6H7.98485C8.37042 15.6 8.65152 15.8759 8.65152 16.2667Z"
                      fill="#3DDC84"
                    />
                    <path
                      d="M12.0871 3.2C6.79147 3.2 2.48711 7.50436 2.48711 12.8C2.48711 18.0956 6.79147 22.4 12.0871 22.4C17.3827 22.4 21.6871 18.0956 21.6871 12.8C21.6871 7.50436 17.3827 3.2 12.0871 3.2ZM12.0871 20.4C7.89776 20.4 4.48711 17.0044 4.48711 12.8C4.48711 8.59563 7.88255 5.2 12.0871 5.2C16.2916 5.2 19.6871 8.59563 19.6871 12.8C19.6871 17.0044 16.2916 20.4 12.0871 20.4Z"
                      fill={theme === "dark" ? "#3DDC84" : "#3DDC84"}
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    GET IT ON
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                    }`}
                  >
                    Google Play
                  </span>
                </div>
              </motion.a>

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.8 }}
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-xl ${
                  theme === "dark"
                    ? "bg-[#111111] hover:bg-neutral-800"
                    : "bg-white hover:bg-neutral-100"
                } shadow-lg transition-all`}
                data-cursor="link"
              >
                <div className="w-8 h-8">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.0635 12.7084C16.0366 9.5384 18.8235 8.1384 18.9215 8.0834C17.5366 6.0634 15.4016 5.7884 14.6466 5.7634C12.8816 5.5834 11.1766 6.8384 10.2816 6.8384C9.36654 6.8384 7.99154 5.7884 6.51654 5.8134C4.58654 5.8384 2.81154 6.9134 1.83654 8.5884C-0.163461 11.9884 1.31654 17.0334 3.21654 19.7584C4.16654 21.0834 5.28654 22.5834 6.76154 22.5334C8.19654 22.4834 8.73654 21.6334 10.4615 21.6334C12.1615 21.6334 12.6766 22.5334 14.1715 22.5084C15.7115 22.4834 16.6865 21.1584 17.6115 19.8334C18.7115 18.3084 19.1615 16.8084 19.1865 16.7334C19.1365 16.7084 16.0915 15.6084 16.0635 12.7084Z"
                      fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                    />
                    <path
                      d="M13.2516 4.2384C14.0316 3.2884 14.5716 1.9884 14.4216 0.663403C13.3216 0.713403 11.9466 1.4134 11.1416 2.3384C10.4166 3.1634 9.76655 4.5134 9.94155 5.7884C11.1666 5.8884 12.4466 5.1884 13.2516 4.2384Z"
                      fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    DOWNLOAD ON THE
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                    }`}
                  >
                    App Store
                  </span>
                </div>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              {/* Phone mockup */}
              <div
                className={`w-[280px] h-[580px] rounded-[40px] overflow-hidden relative ${
                  theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"
                } shadow-2xl`}
              >
                {/* Screen */}
                <div className="absolute inset-2 rounded-[32px] overflow-hidden bg-gradient-to-b from-emerald-500 to-teal-600">
                  {/* App content */}
                  <div className="h-full flex flex-col">
                    {/* Status bar */}
                    <div className="h-8 bg-black/20 flex items-center justify-between px-4">
                      <span className="text-white text-xs">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                    </div>

                    {/* App header */}
                    <div className="p-4 bg-emerald-600">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white text-lg font-bold">
                            Aivinci Bank
                          </h3>
                          <p className="text-white/80 text-xs">
                            Xoş gəlmisiniz, İstifadəçi
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Bell size={18} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Balance card */}
                    <div className="mx-4 -mt-2 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 p-4 shadow-lg">
                      <p className="text-white/70 text-xs">Ümumi balans</p>
                      <p className="text-white text-2xl font-bold">
                        12,458.90 ₼
                      </p>
                      <div className="flex justify-between mt-4">
                        <div>
                          <p className="text-white/70 text-xs">Kart nömrəsi</p>
                          <p className="text-white text-sm">•••• 4242</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <CreditCard size={16} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="p-4 grid grid-cols-4 gap-2">
                      {["Köçürmə", "Ödəniş", "Kredit", "Daha çox"].map(
                        (action, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1">
                              {i === 0 && (
                                <DollarSign size={18} className="text-white" />
                              )}
                              {i === 1 && (
                                <CreditCard size={18} className="text-white" />
                              )}
                              {i === 2 && (
                                <DollarSign size={18} className="text-white" />
                              )}
                              {i === 3 && (
                                <ArrowRight size={18} className="text-white" />
                              )}
                            </div>
                            <span className="text-white text-xs">{action}</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Transactions */}
                    <div className="flex-1 bg-white rounded-t-3xl p-4">
                      <h3 className="text-neutral-800 font-bold mb-4">
                        Son əməliyyatlar
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            name: "Supermarket",
                            amount: "-45.20 ₼",
                            date: "Bu gün",
                          },
                          {
                            name: "Maaş",
                            amount: "+1,200.00 ₼",
                            date: "Dünən",
                          },
                          {
                            name: "Restoran",
                            amount: "-78.50 ₼",
                            date: "15.05.2025",
                          },
                        ].map((tx, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-2 rounded-lg bg-neutral-100"
                          >
                            <div>
                              <p className="text-neutral-800 text-sm font-medium">
                                {tx.name}
                              </p>
                              <p className="text-neutral-500 text-xs">
                                {tx.date}
                              </p>
                            </div>
                            <p
                              className={`text-sm font-medium ${
                                tx.amount.startsWith("-")
                                  ? "text-red-500"
                                  : "text-emerald-500"
                              }`}
                            >
                              {tx.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom navigation */}
                    <div className="h-16 bg-white border-t border-neutral-200 flex justify-around items-center px-4">
                      {["Ana səhifə", "Kartlar", "Ödənişlər", "Profil"].map(
                        (item, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 flex items-center justify-center ${
                                i === 0
                                  ? "text-emerald-500"
                                  : "text-neutral-400"
                              }`}
                            >
                              {i === 0 && <Smartphone size={20} />}
                              {i === 1 && <CreditCard size={20} />}
                              {i === 2 && <DollarSign size={20} />}
                              {i === 3 && <User size={20} />}
                            </div>
                            <span
                              className={`text-xs ${
                                i === 0
                                  ? "text-emerald-500 font-medium"
                                  : "text-neutral-400"
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl"></div>
              </div>

              {/* Download button floating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 1 }}
                className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full ${
                  theme === "dark"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                } text-white shadow-lg flex items-center gap-2 transition-all`}
              >
                <Download size={16} />
                <span className="font-medium">İndi yüklə</span>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/20 blur-2xl"></div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-500/20 blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
