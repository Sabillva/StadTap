"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  CreditCard,
  DollarSign,
  Landmark,
} from "lucide-react";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const quickLinks = [
    {
      icon: <CreditCard size={16} />,
      text: "Kart sifariş et",
      color: "bg-green-500",
    },
    {
      icon: <DollarSign size={16} />,
      text: "Kredit əldə et",
      color: "bg-emerald-500",
    },
    {
      icon: <Landmark size={16} />,
      text: "Depozit yerləşdir",
      color: "bg-green-600",
    },
  ];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        showButton ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-luxury p-6 w-72 mb-2 border border-gray-100 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Bizimlə əlaqə</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <a
              href="tel:196"
              className="flex items-center p-3 rounded-xl hover:bg-green-50 text-gray-700 transition"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Phone size={18} className="text-green-600" />
              </div>
              <div>
                <span className="font-medium block">196</span>
                <span className="text-xs text-gray-500">
                  Müştəri xidmətləri
                </span>
              </div>
            </a>
            <a
              href="mailto:info@aivinci.az"
              className="flex items-center p-3 rounded-xl hover:bg-green-50 text-gray-700 transition"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Mail size={18} className="text-green-600" />
              </div>
              <div>
                <span className="font-medium block">info@aivinci.az</span>
                <span className="text-xs text-gray-500">E-poçt ünvanımız</span>
              </div>
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Sürətli keçidlər
            </p>
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
              >
                <div
                  className={`w-8 h-8 rounded-full ${link.color} flex items-center justify-center mr-3 text-white`}
                >
                  {link.icon}
                </div>
                <span className="font-medium">{link.text}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full p-4 shadow-luxury flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-red-500 rotate-90"
            : "bg-gradient-luxury from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>
    </div>
  );
};

export default FloatingButton;
