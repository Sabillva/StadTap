"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Anar Məmmədov",
    position: "Sahibkar",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Aivinci Bank-ın biznes krediti sayəsində şirkətimi genişləndirə bildim. Sürətli təsdiq prosesi və əlverişli şərtlər mənim üçün çox önəmli idi.",
  },
  {
    id: 2,
    name: "Leyla Əliyeva",
    position: "Həkim",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Aivinci mobil tətbiqi ilə bank əməliyyatlarımı həyata keçirmək çox rahatdır. İstənilən vaxt və istənilən yerdə ödənişlərimi edə bilirəm.",
  },
  {
    id: 3,
    name: "Elşən Hüseynov",
    position: "Müəllim",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4,
    text: "Aivinci kartı ilə xarici səyahətlərim zamanı heç bir problem yaşamadım. Keşbek proqramı da əla işləyir.",
  },
  {
    id: 4,
    name: "Nigar Qasımova",
    position: "Dizayner",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Depozit hesabı açmaq qərarına gəldiyimdə Aivinci Bank ən yaxşı faiz dərəcələrini təklif edirdi. Prosedur çox sadə və sürətli oldu.",
  },
];

const Testimonials = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

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
            Müştərilərimiz nə deyir
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Aivinci Bank müştərilərinin təcrübələri
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Large quote icon */}
          <div className="absolute -top-10 left-0 opacity-10">
            <Quote
              size={80}
              className={
                theme === "dark" ? "text-emerald-500" : "text-emerald-600"
              }
            />
          </div>

          {/* Testimonial carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div
                    className={`p-8 rounded-2xl ${
                      theme === "dark" ? "bg-[#111111]" : "bg-white"
                    } shadow-xl border ${
                      theme === "dark"
                        ? "border-neutral-800"
                        : "border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold ${
                            theme === "dark"
                              ? "text-neutral-100"
                              : "text-neutral-800"
                          }`}
                        >
                          {testimonial.name}
                        </h3>
                        <p
                          className={
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-600"
                          }
                        >
                          {testimonial.position}
                        </p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : theme === "dark"
                                  ? "text-neutral-600"
                                  : "text-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-lg leading-relaxed ${
                        theme === "dark"
                          ? "text-neutral-300"
                          : "text-neutral-600"
                      }`}
                    >
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className={`p-3 rounded-full ${
                theme === "dark"
                  ? "bg-[#111111] text-neutral-300 hover:bg-neutral-800"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              } shadow-md transition-all`}
              data-cursor="button"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index
                      ? "bg-emerald-500 w-6"
                      : theme === "dark"
                      ? "bg-neutral-700"
                      : "bg-neutral-300"
                  }`}
                  data-cursor="button"
                ></button>
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className={`p-3 rounded-full ${
                theme === "dark"
                  ? "bg-[#111111] text-neutral-300 hover:bg-neutral-800"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              } shadow-md transition-all`}
              data-cursor="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
