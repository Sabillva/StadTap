"use client";
import { useTheme } from "./ThemeContext";

import { useState, useRef, useEffect } from "react";

const Faq = () => {
  const { darkMode } = useTheme();

  const [openIndex, setOpenIndex] = useState(0);
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

    const items = document.querySelectorAll(".faq-animate");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // Custom SVG icons
  const icons = {
    chevronDown: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const faqItems = [
    {
      question: "Aivinci Bank kartını necə sifariş edə bilərəm?",
      answer:
        "Aivinci Bank kartını onlayn olaraq veb saytımız və ya mobil tətbiqimiz vasitəsilə sifariş edə bilərsiniz. Həmçinin, istənilən filialımıza yaxınlaşaraq kart sifarişi verə bilərsiniz.",
    },
    {
      question: "Kredit almaq üçün hansı sənədlər tələb olunur?",
      answer:
        "Kredit almaq üçün şəxsiyyət vəsiqəsi, iş yerindən arayış və ya pensiya kartı, son 6 aylıq bank hesabından çıxarış tələb olunur. Kredit məbləğindən asılı olaraq əlavə sənədlər tələb oluna bilər.",
    },
    {
      question: "Xaricdə olarkən kartımı necə istifadə edə bilərəm?",
      answer:
        "Xaricdə olarkən kartınızı istənilən ATM-də və ya POS terminalda istifadə edə bilərsiniz. Səyahətdən əvvəl kartınızın beynəlxalq əməliyyatlar üçün aktivləşdirildiyindən əmin olun və təhlükəsizlik məqsədilə bankımıza səyahət barədə məlumat verin.",
    },
    {
      question: "Mobil tətbiqdə şifrəmi unutmuşam. Nə etməliyəm?",
      answer:
        "Mobil tətbiqdə şifrənizi unutduğunuz halda, tətbiqin giriş səhifəsində 'Şifrəni unutmusunuz?' düyməsinə klikləyərək bərpa prosesini başlada bilərsiniz. Alternativ olaraq, müştəri xidmətləri ilə əlaqə saxlaya bilərsiniz.",
    },
    {
      question: "Depozit yerləşdirmək üçün minimum məbləğ nə qədərdir?",
      answer:
        "Depozit yerləşdirmək üçün minimum məbləğ 500 AZN və ya 300 USD təşkil edir. Depozit məbləği və müddətindən asılı olaraq faiz dərəcələri dəyişir.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 faq-animate opacity-0 transform translate-y-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 display-font">
              Tez-tez verilən suallar
            </h2>
            <p className="text-lg">
              Ən çox verilən sualların cavablarını sənin üçün bir araya
              gətirdik.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="modern-card faq-animate opacity-0 transform translate-y-8 overflow-hidden"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  className="flex justify-between items-center w-full p-5 text-left font-medium focus:outline-none group"
                  onClick={() => toggleFaq(index)}
                >
                  {item.question}
                  <span
                    className={`text-lime-500 transition-transform duration-300 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                  >
                    {icons.chevronDown}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-60 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="px-5 text-foreground/70">{item.answer}</p>
                </div>
              </div>
            ))}
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

export default Faq;
