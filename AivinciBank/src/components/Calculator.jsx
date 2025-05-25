"use client";

import { useTheme } from "./ThemeContext";
import { useState, useRef, useEffect } from "react";

const Calculator = () => {
  const { darkMode } = useTheme();

  const [activeTab, setActiveTab] = useState("credit");
  const [creditAmount, setCreditAmount] = useState(15000);
  const [creditRate, setCreditRate] = useState(15);
  const [creditTerm, setCreditTerm] = useState(24);

  const [cardType, setCardType] = useState("cash");
  const [cardAmount, setCardAmount] = useState(5000);
  const [cardTerm, setCardTerm] = useState(12);

  const [depositCurrency, setDepositCurrency] = useState("AZN");
  const [depositInterestType, setDepositInterestType] = useState("monthly");
  const [depositAmount, setDepositAmount] = useState(10000);
  const [depositTerm, setDepositTerm] = useState(12);

  const sectionRef = useRef(null);

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

    const items = document.querySelectorAll(".calc-animate");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // Calculate monthly payment for credit
  const calculateCreditPayment = () => {
    const monthlyRate = creditRate / 100 / 12;
    const payment =
      (creditAmount * monthlyRate * Math.pow(1 + monthlyRate, creditTerm)) /
      (Math.pow(1 + monthlyRate, creditTerm) - 1);
    return payment.toFixed(2);
  };

  // Calculate total payment for card
  const calculateCardPayment = () => {
    const monthlyPayment = cardAmount / cardTerm;
    return monthlyPayment.toFixed(2);
  };

  // Calculate deposit interest
  const calculateDepositInterest = () => {
    const rate = depositCurrency === "AZN" ? 6 : 3;
    const annualInterest = depositAmount * (rate / 100);

    if (depositInterestType === "monthly") {
      return (annualInterest / 12).toFixed(2);
    } else {
      return (annualInterest * (depositTerm / 12)).toFixed(2);
    }
  };

  // Custom SVG icons
  const icons = {
    calculator: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="3"
          width="16"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 7H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 11.5H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 16.5H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    "credit-card": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6 15H10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    wallet: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z"
          fill="currentColor"
        />
        <path
          d="M2 9H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: darkMode
            ? "linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)"
            : "linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent)",
        }}
      ></div>

      {/* Decorative elements */}
      <div
        className="absolute top-20 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-30"
        style={{
          backgroundColor: darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      ></div>

      <div
        className="absolute bottom-20 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-30"
        style={{
          backgroundColor: darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 calc-animate opacity-0 transform translate-y-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 display-font">
              Faydasını hesabla
            </h2>
            <p className="text-lg">
              Kredit, kart və ya depozit şərtlərini hesablayın və sizə ən uyğun
              məhsulu seçin
            </p>
          </div>

          <div
            className="modern-card calc-animate opacity-0 transform translate-y-8"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex border-b border-primary/10 overflow-hidden rounded-t-2xl">
              <button
                className={`flex-1 py-5 px-4 text-center font-medium transition-all ${
                  activeTab === "credit"
                    ? "bg-primary/10 text-amber-500 border-b-2 border-amber-500"
                    : "hover:bg-primary/5"
                }`}
                onClick={() => setActiveTab("credit")}
              >
                <div className="flex items-center justify-center">
                  Nağd kredit
                </div>
              </button>

              <button
                className={`flex-1 py-5 px-4 text-center font-medium transition-all ${
                  activeTab === "card"
                    ? "bg-primary/10 text-amber-500 border-b-2 border-amber-500"
                    : "hover:bg-primary/5"
                }`}
                onClick={() => setActiveTab("card")}
              >
                <div className="flex items-center justify-center">
                  Aivinci kartı
                </div>
              </button>

              <button
                className={`flex-1 py-5 px-4 text-center font-medium transition-all ${
                  activeTab === "deposit"
                    ? "bg-primary/10 text-amber-500 border-b-2 border-amber-500"
                    : "hover:bg-primary/5"
                }`}
                onClick={() => setActiveTab("deposit")}
              >
                <div className="flex items-center justify-center">Depozit</div>
              </button>
            </div>

            <div className="p-8">
              {activeTab === "credit" && (
                <div>
                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Məbləğ ({creditAmount} AZN)
                    </label>
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
                      <div className="flex justify-between text-xs mt-2 text-foreground/70">
                        <span>300 AZN</span>
                        <span>30,000 AZN</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Faiz ({creditRate}%)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="11"
                        max="20"
                        value={creditRate}
                        onChange={(e) => setCreditRate(Number(e.target.value))}
                        className="modern-range w-full"
                      />
                      <div className="flex justify-between text-xs mt-2 text-foreground/70">
                        <span>11%</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Müddət ({creditTerm} ay)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="3"
                        max="59"
                        value={creditTerm}
                        onChange={(e) => setCreditTerm(Number(e.target.value))}
                        className="modern-range w-full"
                      />
                      <div className="flex justify-between text-xs mt-2 text-foreground/70">
                        <span>3 ay</span>
                        <span>59 ay</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-2xl mb-8 backdrop-blur-md border ${
                      darkMode
                        ? "bg-[rgba(0,0,0,0.2)] border-white/5"
                        : "bg-[rgba(255,255,255,0.4)] border-black/5"
                    }`}
                  >
                    <div className="flex justify-between mb-3">
                      <span className="font-medium">Aylıq ödəniş:</span>
                      <span className="font-bold">
                        {calculateCreditPayment()} AZN
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ümumi məbləğ:</span>
                      <span className="font-bold">
                        {(calculateCreditPayment() * creditTerm).toFixed(2)} AZN
                      </span>
                    </div>
                  </div>

                  <button className="btn bg-lime-500 w-full group relative overflow-hidden text-white">
                    <span className="relative z-10">Nağd krediti hesabla</span>
                    <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </button>
                </div>
              )}

              {activeTab === "card" && (
                <div>
                  <div className="mb-8">
                    <div className="flex space-x-4 mb-6">
                      <button
                        className={`flex-1 py-3 px-4 rounded-2xl transition-all ${
                          cardType === "cash"
                            ? "bg-lime-500 text-white"
                            : darkMode
                            ? "bg-white/10 hover:bg-white/20 text-white/80"
                            : "bg-black/5 hover:bg-black/10 text-black/80"
                        }`}
                        onClick={() => setCardType("cash")}
                      >
                        Nağdlaşdırma
                      </button>

                      <button
                        className={`flex-1 py-3 px-4 rounded-2xl transition-all ${
                          cardType === "installment"
                            ? "bg-lime-500 text-white"
                            : darkMode
                            ? "bg-white/10 hover:bg-white/20 text-white/80"
                            : "bg-black/5 hover:bg-black/10 text-black/80"
                        }`}
                        onClick={() => setCardType("installment")}
                      >
                        Taksit
                      </button>
                    </div>

                    <label className="block text-sm font-medium mb-3">
                      Məbləğ ({cardAmount} AZN)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="500"
                        max="10000"
                        value={cardAmount}
                        onChange={(e) => setCardAmount(Number(e.target.value))}
                        className="modern-range w-full"
                      />
                      <div className="flex justify-between text-xs mt-2 text-foreground/70">
                        <span>500 AZN</span>
                        <span>10,000 AZN</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Müddət ({cardTerm} ay)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="3"
                        max="24"
                        value={cardTerm}
                        onChange={(e) => setCardTerm(Number(e.target.value))}
                        className="modern-range w-full"
                      />
                      <div className="flex justify-between text-xs mt-2 text-foreground/70">
                        <span>3 ay</span>
                        <span>24 ay</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-2xl mb-8 backdrop-blur-md border ${
                      darkMode
                        ? "bg-[rgba(0,0,0,0.2)] border-white/5"
                        : "bg-[rgba(255,255,255,0.4)] border-black/5"
                    }`}
                  >
                    <div className="flex justify-between mb-3">
                      <span className="font-medium">Aylıq ödəniş:</span>
                      <span className="font-bold">
                        {calculateCardPayment()} AZN
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ümumi məbləğ:</span>
                      <span className="font-bold">
                        {cardAmount.toFixed(2)} AZN
                      </span>
                    </div>
                  </div>

                  <button className="btn bg-lime-500 w-full group relative overflow-hidden text-white">
                    <span className="relative z-10">Aivinci kartı hesabla</span>
                    <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </button>
                </div>
              )}

              {activeTab === "deposit" && (
                <div>
                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Depoziti hansı valyutada yerləşdirəcəksən?
                    </label>
                    <div className="flex space-x-4">
                      <button
                        className={`flex-1 py-3 px-4 rounded-2xl transition-all ${
                          depositCurrency === "AZN"
                            ? "bg-lime-500 text-white"
                            : darkMode
                            ? "bg-white/10 hover:bg-white/20 text-white/80"
                            : "bg-black/5 hover:bg-black/10 text-black/80"
                        }`}
                        onClick={() => setDepositCurrency("AZN")}
                      >
                        AZN
                      </button>
                      <button
                        className={`flex-1 py-3 px-4 rounded-2xl transition-all ${
                          depositCurrency === "USD"
                            ? "bg-lime-500 text-white"
                            : darkMode
                            ? "bg-white/10 hover:bg-white/20 text-white/80"
                            : "bg-black/5 hover:bg-black/10 text-black/80"
                        }`}
                        onClick={() => setDepositCurrency("USD")}
                      >
                        USD
                      </button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Faizləri necə götürmək istərdin?
                    </label>
                    <div className="flex space-x-4">
                      <button
                        className={`flex-1 py-3 px-4 rounded-2xl transition-all ${
                          depositInterestType === "monthly"
                            ? "bg-lime-500 text-white"
                            : darkMode
                            ? "bg-white/10 hover:bg-white/20 text-white/80"
                            : "bg-black/5 hover:bg-black/10 text-black/80"
                        }`}
                        onClick={() => setDepositInterestType("monthly")}
                      >
                        Aylıq
                      </button>
                      <button
                        className={`flex-1 py-3 px-4 rounded-2xl transition-all ${
                          depositInterestType === "end"
                            ? "bg-lime-500 text-white"
                            : darkMode
                            ? "bg-white/10 hover:bg-white/20 text-white/80"
                            : "bg-black/5 hover:bg-black/10 text-black/80"
                        }`}
                        onClick={() => setDepositInterestType("end")}
                      >
                        Müddətin sonunda
                      </button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Məbləğ ({depositAmount} {depositCurrency})
                    </label>
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
                      <div className="flex justify-between text-xs mt-2 text-foreground/70">
                        <span>500 {depositCurrency}</span>
                        <span>100,000 {depositCurrency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">
                      Müddət ({depositTerm} ay)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="3"
                        max="36"
                        value={depositTerm}
                        onChange={(e) => setDepositTerm(Number(e.target.value))}
                        className="modern-range w-full"
                      />
                      <div className="flex justify-between text-xs mt-2 text-foreground/70">
                        <span>3 ay</span>
                        <span>36 ay</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-2xl mb-8 backdrop-blur-md border ${
                      darkMode
                        ? "bg-[rgba(0,0,0,0.2)] border-white/5"
                        : "bg-[rgba(255,255,255,0.4)] border-black/5"
                    }`}
                  >
                    <div className="flex justify-between mb-3">
                      <span className="font-medium">
                        {depositInterestType === "monthly"
                          ? "Aylıq faiz gəliri:"
                          : "Müddət sonunda faiz gəliri:"}
                      </span>
                      <span className="font-bold">
                        {calculateDepositInterest()} {depositCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">İllik faiz dərəcəsi:</span>
                      <span className="font-bold">
                        {depositCurrency === "AZN" ? "6%" : "3%"}
                      </span>
                    </div>
                  </div>

                  <button className="btn bg-lime-500 w-full group relative overflow-hidden text-white">
                    <span className="relative z-10">Depoziti hesabla</span>
                    <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </button>
                </div>
              )}
            </div>
          </div>
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

export default Calculator;
