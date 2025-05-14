"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CalculatorIcon,
  CreditCard,
  Landmark,
  ArrowRight,
  Percent,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  Award,
  Zap,
  TrendingUp,
} from "lucide-react";

const Calculator = ({ theme }) => {
  const [activeTab, setActiveTab] = useState("Nağd kredit");
  const [creditAmount, setCreditAmount] = useState(5000);
  const [creditInterest, setCreditInterest] = useState(15);
  const [creditTerm, setCreditTerm] = useState(12);

  const [cardTab, setCardTab] = useState("Nağdlaşdırma");
  const [cardAmount, setCardAmount] = useState(2000);
  const [cardTerm, setCardTerm] = useState(6);

  const [depositCurrency, setDepositCurrency] = useState("AZN");
  const [depositInterestType, setDepositInterestType] = useState("Aylıq");
  const [depositAmount, setDepositAmount] = useState(5000);
  const [depositTerm, setDepositTerm] = useState(12);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Simple calculation functions
  const calculateCreditMonthlyPayment = () => {
    const monthlyInterest = creditInterest / 100 / 12;
    const payment =
      (creditAmount *
        monthlyInterest *
        Math.pow(1 + monthlyInterest, creditTerm)) /
      (Math.pow(1 + monthlyInterest, creditTerm) - 1);
    return payment.toFixed(2);
  };

  const calculateCardPayment = () => {
    if (cardTab === "Nağdlaşdırma") {
      const monthlyInterest = 0.019; // 1.9% monthly for cash withdrawal
      return (cardAmount / cardTerm + cardAmount * monthlyInterest).toFixed(2);
    } else {
      // Taksit - installment
      return (cardAmount / cardTerm).toFixed(2);
    }
  };

  const calculateDepositInterest = () => {
    const annualRate = depositCurrency === "AZN" ? 0.12 : 0.03; // 12% for AZN, 3% for USD
    const totalInterest = depositAmount * annualRate * (depositTerm / 12);

    if (depositInterestType === "Aylıq") {
      return (totalInterest / depositTerm).toFixed(2);
    } else {
      return totalInterest.toFixed(2);
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tabIcons = {
    "Nağd kredit": <CalculatorIcon className="w-5 h-5" />,
    "Aivinci kartı": <CreditCard className="w-5 h-5" />,
    Depozit: <Landmark className="w-5 h-5" />,
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      className={`py-24 rounded-3xl my-16 overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-b from-neutral-800 to-neutral-900"
          : "bg-gradient-to-b from-neutral-300 to-neutral-200"
      }`}
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"
          ></motion.div>
          <motion.h2
            variants={itemVariants}
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            Faydasını hesabla
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Maliyyə məqsədlərinizə uyğun ən sərfəli təklifləri hesablayın
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row">
          {/* Tabs */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
              {["Nağd kredit", "Aivinci kartı", "Depozit"].map((tab, index) => (
                <motion.button
                  key={tab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl"
                      : theme === "dark"
                      ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600 border border-neutral-600"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300"
                  } whitespace-nowrap lg:whitespace-normal`}
                  data-cursor="button"
                >
                  <span
                    className={`mr-2 ${
                      activeTab === tab
                        ? "text-white"
                        : theme === "dark"
                        ? "text-emerald-400"
                        : "text-emerald-500"
                    }`}
                  >
                    {tabIcons[tab]}
                  </span>
                  {tab}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4 lg:pl-8">
            {/* Nağd kredit */}
            {activeTab === "Nağd kredit" && (
              <motion.div
                key="credit"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={tabVariants}
                className={`p-8 rounded-2xl shadow-xl ${
                  theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700"
                    : "bg-neutral-100 border border-neutral-300"
                }`}
              >
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 flex items-center justify-center mr-4 shadow-md">
                    <CalculatorIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className={`text-2xl font-bold font-display ${
                      theme === "dark" ? "text-neutral-100" : "text-neutral-800"
                    }`}
                  >
                    Nağd krediti hesabla
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-10">
                    <div>
                      <div className="flex justify-between mb-3">
                        <label
                          className={`block text-sm font-medium flex items-center ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-700"
                          }`}
                        >
                          <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />{" "}
                          Məbləğ (AZN)
                        </label>
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {creditAmount.toLocaleString()} ₼
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="300"
                          max="30000"
                          value={creditAmount}
                          onChange={(e) =>
                            setCreditAmount(Number(e.target.value))
                          }
                          className="modern-range w-full"
                        />
                        <div
                          className={`absolute -bottom-6 left-0 w-full flex justify-between text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          <span>300 ₼</span>
                          <span>30,000 ₼</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                      <div className="flex justify-between mb-3">
                        <label
                          className={`block text-sm font-medium flex items-center ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-700"
                          }`}
                        >
                          <Percent className="w-4 h-4 mr-1 text-emerald-500" />{" "}
                          Faiz
                        </label>
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {creditInterest}%
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="11"
                          max="20"
                          value={creditInterest}
                          onChange={(e) =>
                            setCreditInterest(Number(e.target.value))
                          }
                          className="modern-range w-full"
                        />
                        <div
                          className={`absolute -bottom-6 left-0 w-full flex justify-between text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          <span>11%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                      <div className="flex justify-between mb-3">
                        <label
                          className={`block text-sm font-medium flex items-center ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-700"
                          }`}
                        >
                          <Calendar className="w-4 h-4 mr-1 text-emerald-500" />{" "}
                          Müddət
                        </label>
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {creditTerm} ay
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="3"
                          max="59"
                          value={creditTerm}
                          onChange={(e) =>
                            setCreditTerm(Number(e.target.value))
                          }
                          className="modern-range w-full"
                        />
                        <div
                          className={`absolute -bottom-6 left-0 w-full flex justify-between text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          <span>3 ay</span>
                          <span>59 ay</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div
                      className={`p-8 rounded-xl border relative overflow-hidden ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-800"
                          : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200 opacity-20 rounded-full -mr-20 -mt-20"></div>
                      <div className="relative z-10">
                        <p
                          className={`text-sm mb-1 ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-600"
                          }`}
                        >
                          Aylıq ödəniş:
                        </p>
                        <p
                          className={`text-4xl font-bold font-display ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {calculateCreditMonthlyPayment()} ₼
                        </p>
                        <p
                          className={`text-sm mt-2 ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          Ümumi ödəniş:{" "}
                          {(
                            calculateCreditMonthlyPayment() * creditTerm
                          ).toFixed(2)}{" "}
                          ₼
                        </p>

                        <div className="mt-6 space-y-2">
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Zap size={14} />
                            </div>
                            <span>Sürətli təsdiq prosesi</span>
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Shield size={14} />
                            </div>
                            <span>Minimum sənəd tələbi</span>
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Clock size={14} />
                            </div>
                            <span>24/7 onlayn müraciət</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Award
                            size={18}
                            className={
                              theme === "dark"
                                ? "text-emerald-400 mr-2"
                                : "text-emerald-500 mr-2"
                            }
                          />
                          <span
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-700"
                            }`}
                          >
                            Kredit reytinqi
                          </span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                star <= 4
                                  ? "bg-emerald-500"
                                  : theme === "dark"
                                  ? "bg-neutral-700"
                                  : "bg-neutral-200"
                              } ${star !== 1 ? "-ml-1" : ""}`}
                            >
                              <span className="text-white text-xs font-bold">
                                {star}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-xl flex items-center justify-center group"
                        data-cursor="button"
                      >
                        <span>Sifariş et</span>
                        <ArrowRight
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                          size={18}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-10 pt-8 border-t ${
                    theme === "dark"
                      ? "border-neutral-700"
                      : "border-neutral-300"
                  }`}
                >
                  <h4
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-neutral-100" : "text-neutral-800"
                    }`}
                  >
                    Kredit şərtləri
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      className={`p-4 rounded-xl ${
                        theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <TrendingUp
                          size={18}
                          className={
                            theme === "dark"
                              ? "text-emerald-400 mr-2"
                              : "text-emerald-500 mr-2"
                          }
                        />
                        <span
                          className={`font-medium ${
                            theme === "dark"
                              ? "text-neutral-100"
                              : "text-neutral-800"
                          }`}
                        >
                          Faiz dərəcəsi
                        </span>
                      </div>
                      <p
                        className={
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-600"
                        }
                      >
                        İllik {creditInterest}% ilə başlayan faiz dərəcələri
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-xl ${
                        theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Calendar
                          size={18}
                          className={
                            theme === "dark"
                              ? "text-emerald-400 mr-2"
                              : "text-emerald-500 mr-2"
                          }
                        />
                        <span
                          className={`font-medium ${
                            theme === "dark"
                              ? "text-neutral-100"
                              : "text-neutral-800"
                          }`}
                        >
                          Kredit müddəti
                        </span>
                      </div>
                      <p
                        className={
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-600"
                        }
                      >
                        3 aydan 59 aya qədər
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-xl ${
                        theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <DollarSign
                          size={18}
                          className={
                            theme === "dark"
                              ? "text-emerald-400 mr-2"
                              : "text-emerald-500 mr-2"
                          }
                        />
                        <span
                          className={`font-medium ${
                            theme === "dark"
                              ? "text-neutral-100"
                              : "text-neutral-800"
                          }`}
                        >
                          Kredit məbləği
                        </span>
                      </div>
                      <p
                        className={
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-600"
                        }
                      >
                        300 AZN-dən 30,000 AZN-ə qədər
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Aivinci kartı */}
            {activeTab === "Aivinci kartı" && (
              <motion.div
                key="card"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={tabVariants}
                className={`p-8 rounded-2xl shadow-xl ${
                  theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700"
                    : "bg-neutral-100 border border-neutral-300"
                }`}
              >
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 flex items-center justify-center mr-4 shadow-md">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className={`text-2xl font-bold font-display ${
                      theme === "dark" ? "text-neutral-100" : "text-neutral-800"
                    }`}
                  >
                    Aivinci kartı
                  </h3>
                </div>

                <div className="flex space-x-3 mb-10">
                  <button
                    onClick={() => setCardTab("Nağdlaşdırma")}
                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 ${
                      cardTab === "Nağdlaşdırma"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                        : theme === "dark"
                        ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    }`}
                    data-cursor="button"
                  >
                    Nağdlaşdırma
                  </button>
                  <button
                    onClick={() => setCardTab("Taksit")}
                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 ${
                      cardTab === "Taksit"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                        : theme === "dark"
                        ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    }`}
                    data-cursor="button"
                  >
                    Taksit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-10">
                    <div>
                      <div className="flex justify-between mb-3">
                        <label
                          className={`block text-sm font-medium flex items-center ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-700"
                          }`}
                        >
                          <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />{" "}
                          Məbləğ (AZN)
                        </label>
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {cardAmount.toLocaleString()} ₼
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="500"
                          max="10000"
                          value={cardAmount}
                          onChange={(e) =>
                            setCardAmount(Number(e.target.value))
                          }
                          className="modern-range w-full"
                        />
                        <div
                          className={`absolute -bottom-6 left-0 w-full flex justify-between text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          <span>500 ₼</span>
                          <span>10,000 ₼</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                      <div className="flex justify-between mb-3">
                        <label
                          className={`block text-sm font-medium flex items-center ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-700"
                          }`}
                        >
                          <Calendar className="w-4 h-4 mr-1 text-emerald-500" />{" "}
                          Müddət
                        </label>
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {cardTerm} ay
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="3"
                          max="24"
                          value={cardTerm}
                          onChange={(e) => setCardTerm(Number(e.target.value))}
                          className="modern-range w-full"
                        />
                        <div
                          className={`absolute -bottom-6 left-0 w-full flex justify-between text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          <span>3 ay</span>
                          <span>24 ay</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div
                      className={`p-8 rounded-xl border relative overflow-hidden ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-800"
                          : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200 opacity-20 rounded-full -mr-20 -mt-20"></div>
                      <div className="relative z-10">
                        <p
                          className={`text-sm mb-1 ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-600"
                          }`}
                        >
                          Aylıq ödəniş:
                        </p>
                        <p
                          className={`text-4xl font-bold font-display ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {calculateCardPayment()} ₼
                        </p>
                        <p
                          className={`text-sm mt-2 ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          Ümumi ödəniş:{" "}
                          {(calculateCardPayment() * cardTerm).toFixed(2)} ₼
                        </p>

                        <div className="mt-6 space-y-2">
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Zap size={14} />
                            </div>
                            <span>Pulsuz kart çatdırılması</span>
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Shield size={14} />
                            </div>
                            <span>24/7 onlayn idarəetmə</span>
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Award size={14} />
                            </div>
                            <span>Keşbek proqramı</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-xl flex items-center justify-center group"
                        data-cursor="button"
                      >
                        <span>Sifariş et</span>
                        <ArrowRight
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                          size={18}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Depozit */}
            {activeTab === "Depozit" && (
              <motion.div
                key="deposit"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={tabVariants}
                className={`p-8 rounded-2xl shadow-xl ${
                  theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700"
                    : "bg-neutral-100 border border-neutral-300"
                }`}
              >
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 flex items-center justify-center mr-4 shadow-md">
                    <Landmark className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className={`text-2xl font-bold font-display ${
                      theme === "dark" ? "text-neutral-100" : "text-neutral-800"
                    }`}
                  >
                    Depoziti hesabla
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div>
                      <p
                        className={`block text-sm font-medium mb-3 ${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-700"
                        }`}
                      >
                        Depoziti hansı valyutada yerləşdirəcəksən?
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setDepositCurrency("AZN")}
                          className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 ${
                            depositCurrency === "AZN"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                              : theme === "dark"
                              ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          }`}
                          data-cursor="button"
                        >
                          AZN
                        </button>
                        <button
                          onClick={() => setDepositCurrency("USD")}
                          className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 ${
                            depositCurrency === "USD"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                              : theme === "dark"
                              ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          }`}
                          data-cursor="button"
                        >
                          USD
                        </button>
                      </div>
                    </div>

                    <div>
                      <p
                        className={`block text-sm font-medium mb-3 ${
                          theme === "dark"
                            ? "text-neutral-300"
                            : "text-neutral-700"
                        }`}
                      >
                        Faizləri necə götürmək istərdin?
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setDepositInterestType("Aylıq")}
                          className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 ${
                            depositInterestType === "Aylıq"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                              : theme === "dark"
                              ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          }`}
                          data-cursor="button"
                        >
                          Aylıq
                        </button>
                        <button
                          onClick={() =>
                            setDepositInterestType("Müddətin sonunda")
                          }
                          className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 ${
                            depositInterestType === "Müddətin sonunda"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                              : theme === "dark"
                              ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          }`}
                          data-cursor="button"
                        >
                          Müddətin sonunda
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-3">
                        <label
                          className={`block text-sm font-medium flex items-center ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-700"
                          }`}
                        >
                          <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />{" "}
                          Məbləğ
                        </label>
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {depositAmount.toLocaleString()} {depositCurrency}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="500"
                          max="100000"
                          value={depositAmount}
                          onChange={(e) =>
                            setDepositAmount(Number(e.target.value))
                          }
                          className="modern-range w-full"
                        />
                        <div
                          className={`absolute -bottom-6 left-0 w-full flex justify-between text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          <span>500 {depositCurrency}</span>
                          <span>100,000 {depositCurrency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                      <div className="flex justify-between mb-3">
                        <label
                          className={`block text-sm font-medium flex items-center ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-700"
                          }`}
                        >
                          <Calendar className="w-4 h-4 mr-1 text-emerald-500" />{" "}
                          Müddət
                        </label>
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {depositTerm} ay
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="3"
                          max="36"
                          value={depositTerm}
                          onChange={(e) =>
                            setDepositTerm(Number(e.target.value))
                          }
                          className="modern-range w-full"
                        />
                        <div
                          className={`absolute -bottom-6 left-0 w-full flex justify-between text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          <span>3 ay</span>
                          <span>36 ay</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div
                      className={`p-8 rounded-xl border relative overflow-hidden ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-800"
                          : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200 opacity-20 rounded-full -mr-20 -mt-20"></div>
                      <div className="relative z-10">
                        <p
                          className={`text-sm mb-1 ${
                            theme === "dark"
                              ? "text-neutral-300"
                              : "text-neutral-600"
                          }`}
                        >
                          {depositInterestType === "Aylıq"
                            ? "Aylıq faiz gəliri:"
                            : "Müddətin sonunda faiz gəliri:"}
                        </p>
                        <p
                          className={`text-4xl font-bold font-display ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                          }`}
                        >
                          {calculateDepositInterest()} {depositCurrency}
                        </p>
                        <p
                          className={`text-sm mt-2 ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          {depositInterestType === "Aylıq"
                            ? `İllik faiz gəliri: ${(
                                calculateDepositInterest() * 12
                              ).toFixed(2)} ${depositCurrency}`
                            : `Depozit məbləği: ${depositAmount.toLocaleString()} ${depositCurrency}`}
                        </p>

                        <div className="mt-6 space-y-2">
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <TrendingUp size={14} />
                            </div>
                            <span>Yüksək faiz dərəcəsi</span>
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Shield size={14} />
                            </div>
                            <span>Tam təhlükəsizlik</span>
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              theme === "dark"
                                ? "text-neutral-300"
                                : "text-neutral-600"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                theme === "dark"
                                  ? "bg-emerald-800 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-500"
                              }`}
                            >
                              <Clock size={14} />
                            </div>
                            <span>Vaxtından əvvəl çıxarma imkanı</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-xl flex items-center justify-center group"
                        data-cursor="button"
                      >
                        <span>Sifariş et</span>
                        <ArrowRight
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                          size={18}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
