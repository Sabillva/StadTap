"use client";

import { useRef, useEffect } from "react";
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

const MobileApp = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(".app-animate");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  const features = [
    {
      id: 1,
      title: "Kart idarəetməsi",
      description: "Bütün kartlarınızı bir tətbiqdə idarə edin",
    },
    {
      id: 2,
      title: "Ani köçürmələr",
      description: "Pul köçürmələrini saniyələr ərzində həyata keçirin",
    },
    {
      id: 3,
      title: "Bildirişlər",
      description: "Bütün əməliyyatlar haqqında dərhal məlumat alın",
    },
    {
      id: 4,
      title: "Təhlükəsizlik",
      description: "Biometrik giriş və şifrələmə ilə tam qorunma",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12 app-animate opacity-0 transform translate-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 display-font">
              Aivinci Bank mobil tətbiqi ilə bankçılıq cibinizdə
            </h2>
            <p className="text-lg mb-10">
              Müasir və istifadəçi dostu interfeys ilə bank əməliyyatlarınızı
              istənilən yerdə və istənilən vaxt həyata keçirin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex items-start app-animate opacity-0 transform translate-y-8 group"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="mr-4 p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all duration-300 transform group-hover:scale-110">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-lime-500"
                    >
                      <path
                        d="M12 16L16 12L12 8"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex flex-wrap gap-4 app-animate opacity-0 transform translate-y-8"
              style={{ transitionDelay: "600ms" }}
            >
              <a
                href="#"
                className="flex items-center bg-white/5 hover:bg-white/6 shadow-[0_0_20px_1px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-500 ease-in-out py-3 px-4 rounded-3xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="37"
                  height="37"
                  viewBox="0 0 512 512"
                  className="mr-3"
                  fill="currentColor"
                >
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div>
                  <div className="text-xs text-white/60">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center bg-white/5 hover:bg-white/6 shadow-[0_0_20px_1px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-500 ease-in-out py-3 px-4 rounded-3xl ml-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 384 512"
                  className="mr-3"
                  fill="currentColor"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <div>
                  <div className="text-xs text-white/60">DOWNLOAD ON THE</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center app-animate opacity-0 transform translate-x-2 mt-20"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative border-10 rounded-[52px] border-black shadow-2xl shadow-amber-50">
              {/* Modern iPhone Mockup */}
              <div className="w-[280px] h-[580px] bg-[#111611] rounded-[40px] py-1 shadow-2xl relative overflow-hidden">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[100px] h-[26px] bg-black rounded-[14px] z-20"></div>

                {/* Screen */}
                <div className="w-full h-full rounded-[32px] overflow-hidden relative bg-gradient-to-b from-primary/20 to-primary/5">
                  {/* Status Bar */}
                  <div className="h-12 px-4 flex justify-between items-center">
                    <div className="text-xs font-medium">9:41</div>
                    <div className="flex space-x-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                      </svg>
                      <div className="w-5.5 h-2.5 mt-0.5 bg-current rounded-[2px]"></div>
                    </div>
                  </div>

                  {/* App header */}
                  <div className="p-4 bg-[#0c110c]">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white text-lg font-bold">
                          Aivinci Bank
                        </h3>
                        <p className="text-white/80 text-xs">
                          Xoş gəlmisiniz, İstifadəçi
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <Bell size={18} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Balance card */}
                  <div className="mx-3 -mt-2 rounded-xl bg-gradient-to-r from-neutral-700 to-zinc-900 p-4 shadow-lg">
                    <p className="text-white/70 text-xs">Ümumi balans</p>
                    <p className="text-white text-2xl font-bold">12,458.90 ₼</p>
                    <div className="flex justify-between mt-4">
                      <div>
                        <p className="text-white/70 text-xs">Kart nömrəsi</p>
                        <p className="text-white text-sm">•••• 4242</p>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <CreditCard size={20} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {["Köçürmə", "Ödəniş", "Kredit", "Daha çox"].map(
                      (action, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
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
                  <div className="flex-1 bg-[#eff0e7] rounded-t-3xl p-4">
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
                          className="flex justify-between items-center p-2 rounded-lg bg-[#eff0e7]"
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
                                ? "text-red-800"
                                : "text-emerald-800"
                            }`}
                          >
                            {tx.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Download button floating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 1 }}
                className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-full
                  bg-amber-600 hover:bg-amber-700 text-white shadow-lg flex items-center gap-2 transition-all`}
              >
                <Download size={16} />
                <span className="font-medium">İndi yüklə</span>
              </motion.div>
            </div>
          </motion.div>
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
  );
};

export default MobileApp;
