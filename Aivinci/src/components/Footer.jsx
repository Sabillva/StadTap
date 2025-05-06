"use client";

import { useState, useEffect, useRef } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed with email:", email);
    setEmail("");
    // Show success message or toast notification
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10" ref={footerRef}>
      <div className="container mx-auto px-4">
        {/* Top section with newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 pb-16 border-b border-gray-800">
          <div className={isVisible ? "fade-in-up" : "opacity-0"}>
            <h3 className="text-3xl font-bold mb-6 font-display">
              Yeniliklərdən xəbərdar olun
            </h3>
            <p className="text-gray-400 mb-8 max-w-md">
              Aivinci Bank-ın ən son xəbərləri, kampaniyaları və xüsusi
              təklifləri haqqında məlumat almaq üçün abunə olun.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-grow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-poçt ünvanınız"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-luxury from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center whitespace-nowrap"
              >
                Abunə ol
                <ArrowRight size={18} className="ml-2" />
              </button>
            </form>
          </div>

          <div
            className={`flex flex-col md:flex-row md:justify-end gap-10 ${
              isVisible ? "fade-in-up delay-200" : "opacity-0"
            }`}
          >
            <div>
              <h4 className="text-lg font-bold mb-4">Əlaqə</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Phone
                    size={18}
                    className="mr-3 text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xl font-bold">196</p>
                    <p className="text-gray-400 text-sm">Müştəri xidmətləri</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail
                    size={18}
                    className="mr-3 text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p>info@aivinci.az</p>
                    <p className="text-gray-400 text-sm">E-poçt ünvanımız</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-3 text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p>Bakı şəh., Nəsimi r-nu, Azadlıq pr. 234</p>
                    <p className="text-gray-400 text-sm">Baş ofis</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Mobil tətbiq</h4>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center bg-gray-800 rounded-xl px-4 py-3 hover:bg-gray-700 transition border border-gray-700"
                >
                  <img
                    src="/placeholder.svg?height=24&width=24"
                    alt="App Store"
                    className="h-8 w-8 mr-3"
                  />
                  <div>
                    <div className="text-xs text-gray-400">App Store</div>
                    <div className="text-sm font-medium">
                      mobil tətbiqi yüklə
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center bg-gray-800 rounded-xl px-4 py-3 hover:bg-gray-700 transition border border-gray-700"
                >
                  <img
                    src="/placeholder.svg?height=24&width=24"
                    alt="Google Play"
                    className="h-8 w-8 mr-3"
                  />
                  <div>
                    <div className="text-xs text-gray-400">Google Play</div>
                    <div className="text-sm font-medium">
                      mobil tətbiqi yüklə
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Logo and social */}
          <div className={isVisible ? "fade-in-up delay-300" : "opacity-0"}>
            <div className="flex items-center mb-6">
              <img
                src="/placeholder.svg?height=40&width=150"
                alt="Aivinci Bank Logo"
                className="h-10"
              />
            </div>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links - Column 1 */}
          <div className={isVisible ? "fade-in-up delay-400" : "opacity-0"}>
            <h4 className="text-lg font-bold mb-4">Məhsullar</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Kartlar
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Kreditlər
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Əmanətlər
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Avtomobil krediti
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Sığortalar
                </a>
              </li>
            </ul>
          </div>

          {/* Links - Column 2 */}
          <div className={isVisible ? "fade-in-up delay-500" : "opacity-0"}>
            <h4 className="text-lg font-bold mb-4">Haqqımızda</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Bankın tarixi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Xəbərlər
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Tariflər
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Karyera
                </a>
              </li>
            </ul>
          </div>

          {/* Links - Column 3 */}
          <div className={isVisible ? "fade-in-up delay-600" : "opacity-0"}>
            <h4 className="text-lg font-bold mb-4">Digər</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Partnyorlar
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Kampaniyalar
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Ninja
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-green-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Aivinci profilini sil
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>© 2025 «Aivinci Bank» ASC. Bütün hüquqlar qorunur.</p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Məxfilik siyasəti
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                İstifadə şərtləri
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Təhlükəsizlik
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            "Aivinci Bank" ASC (Bakı şəh., Nəsimi r-nu, Azadlıq pr. 234) 05 May
            2025-ci il tarixli 234 nömrəli Bank Lisenziyası əsasında fəaliyyət
            göstərir.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
