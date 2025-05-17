"use client";

import { useRef, useEffect } from "react";

const Footer = () => {
  const footerRef = useRef(null);

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

    const items = document.querySelectorAll(".footer-animate");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // Custom SVG icons
  const icons = {
    phone: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27097 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    mail: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 6L12 13L2 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    map: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75V9.75Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    facebook: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    instagram: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.9079 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80977 15.3801 9.21485 14.7852C8.61993 14.1902 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09208 10.9099 8.47034 10.1584C8.8486 9.40685 9.4542 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 6.5H17.51"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    youtube: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 22.9965 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    android: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.523 7.89245C17.2203 7.62622 16.7993 7.5 16.3783 7.5C15.9573 7.5 15.5363 7.62622 15.2336 7.89245L12.0001 10.7149L8.76656 7.89245C8.15115 7.35 7.22574 7.35 6.61033 7.89245C6.29763 8.15868 6.14128 8.5149 6.14128 8.9149C6.14128 9.3149 6.29763 9.67113 6.61033 9.93736L11.4219 14.1074C11.7346 14.3736 12.1556 14.4999 12.5766 14.4999C12.9976 14.4999 13.4186 14.3736 13.7313 14.1074L18.5429 9.93736C19.1583 9.39491 19.1583 8.43491 17.523 7.89245Z" />
        <path d="M5.11539 13.8676C4.73077 13.8676 4.34616 14.0001 4.03846 14.2676C3.73077 14.5351 3.5 14.9026 3.5 15.3026C3.5 15.7026 3.65385 16.0701 3.96154 16.3376L11.4231 22.8376C11.7308 23.1051 12.1154 23.2376 12.5 23.2376C12.8846 23.2376 13.2692 23.1051 13.5769 22.8376L21.0385 16.3376C21.3462 16.0701 21.5 15.7026 21.5 15.3026C21.5 14.9026 21.3462 14.5351 21.0385 14.2676C20.7308 14.0001 20.3462 13.8676 19.9615 13.8676C19.5769 13.8676 19.1923 14.0001 18.8846 14.2676L12.5 19.7676L6.11539 14.2676C5.80769 14.0001 5.5 13.8676 5.11539 13.8676Z" />
        <path d="M5.11539 1.76245C4.73077 1.76245 4.34616 1.89491 4.03846 2.16245C3.73077 2.42998 3.5 2.79751 3.5 3.19751C3.5 3.59751 3.65385 3.96505 3.96154 4.23258L11.4231 10.7326C11.7308 11.0001 12.1154 11.1326 12.5 11.1326C12.8846 11.1326 13.2692 11.0001 13.5769 10.7326L21.0385 4.23258C21.3462 3.96505 21.5 3.59751 21.5 3.19751C21.5 2.79751 21.3462 2.42998 21.0385 2.16245C20.7308 1.89491 20.3462 1.76245 19.9615 1.76245C19.5769 1.76245 19.1923 1.89491 18.8846 2.16245L12.5 7.66245L6.11539 2.16245C5.80769 1.89491 5.5 1.76245 5.11539 1.76245Z" />
      </svg>
    ),
    apple: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.665 16.811a10.316 10.316 0 0 1-1.021 1.837c-.537.767-.978 1.297-1.316 1.592-.525.482-1.089.73-1.692.744-.432 0-.954-.123-1.562-.373-.61-.249-1.17-.371-1.683-.371-.537 0-1.113.122-1.73.371-.616.25-1.114.381-1.495.393-.577.019-1.154-.242-1.729-.781-.367-.32-.83-.87-1.389-1.652-.594-.82-1.083-1.772-1.462-2.858-.407-1.15-.611-2.265-.611-3.343 0-1.235.264-2.3.794-3.193.417-.717.97-1.285 1.665-1.702a4.478 4.478 0 0 1 2.264-.645c.444 0 1.026.134 1.748.403.721.268 1.184.402 1.388.402.152 0 .668-.156 1.548-.466.829-.28 1.529-.398 2.103-.352 1.553.122 2.719.683 3.494 1.689-1.39.839-2.077 2.016-2.062 3.53.014 1.177.44 2.158 1.276 2.94.38.39.806.692 1.28.902-.103.298-.22.582-.349.85zM15.998 2.38c0 .92-.338 1.779-1.011 2.573-.813.951-1.796 1.5-2.86 1.411a2.833 2.833 0 0 1-.021-.335c0-.876.376-1.812 1.043-2.583.332-.39.754-.705 1.264-.948.51-.24.992-.374 1.445-.401.013.112.02.224.02.335z" />
      </svg>
    ),
    arrow: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    heart: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  };

  const footerLinks = [
    {
      title: "Məhsullar",
      links: [
        { name: "Kartlar", href: "#" },
        { name: "Partnyorlar", href: "#" },
        { name: "Kampaniyalar", href: "#" },
        { name: "Avtomobil krediti", href: "#" },
        { name: "Sığortalar", href: "#" },
      ],
    },
    {
      title: "Şirkət",
      links: [
        { name: "Haqqımızda", href: "#" },
        { name: "Xəbərlər", href: "#" },
        { name: "Tariflər", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Ninja", href: "#" },
        { name: "Aivinci profilini sil", href: "#" },
      ],
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="footer-modern relative overflow-hidden pt-20 pb-10"
    >
      {/* Creative elements */}
      <div className="creative-circle creative-circle-1"></div>
      <div className="creative-circle creative-circle-2"></div>
      <div className="creative-circle creative-circle-3"></div>
      <div className="creative-shape creative-shape-1"></div>
      <div className="creative-shape creative-shape-2"></div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="modern-card footer-animate opacity-0 transform translate-y-8">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center mb-6">
                {/* <div className="w-10 h-10 rounded-md bg-lime-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">A</span>
                </div> */}
                <div className="text-2xl font-bold display-font">
                  Aivinci Bank
                </div>
              </div>

              <p className="mb-6 text-foreground/70">
                Aivinci Bank - müasir bankçılıq xidmətləri ilə həyatınızı
                asanlaşdırır. Biz sizin maliyyə ehtiyaclarınızı qarşılamaq üçün
                buradayıq.
              </p>

              <div className="flex items-center mb-6 group p-4 bg-surface/50 rounded-xl">
                <div className="w-10 h-10 flex items-center justify-center mr-3 hover-scale text-white">
                  {icons.phone}
                </div>
                <div>
                  <p className="text-xs text-foreground/70">
                    Müştəri xidmətləri
                  </p>
                  <p className="text-lg font-bold">196</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-auto">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover-scale text-white"
                  aria-label="Facebook"
                >
                  {icons.facebook}
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover-scale text-white"
                  aria-label="Instagram"
                >
                  {icons.instagram}
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover-scale text-white"
                  aria-label="Youtube"
                >
                  {icons.youtube}
                </a>
              </div>
            </div>
          </div>

          {footerLinks.map((column, index) => (
            <div
              key={index}
              className="modern-card footer-animate opacity-0 transform translate-y-8"
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-6 display-font">
                  {column.title}
                </h3>
                <ul className="space-y-4">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.href} className="flex items-center group">
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {icons.arrow}
                        </span>
                        <span className="link-hover">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div
            className="modern-card footer-animate opacity-0 transform translate-y-8"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-6 display-font">Əlaqə</h3>

              <div className="space-y-2 mb-8">
                <div className="flex items-start p-3 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <span className="mt-1 mr-3">{icons.map}</span>
                  <p>Bakı şəh., Nəsimi r-nu, Azadlıq pr. 234</p>
                </div>

                <div className="flex items-start p-3 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <span className="mt-1 mr-3">{icons.mail}</span>
                  <p>info@aivincibank.az</p>
                </div>

                <div className="flex items-start p-3 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <span className="mt-1 mr-3">{icons.phone}</span>
                  <p>+994 (12) 123 45 67</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 display-font">
                Mobil tətbiqi yüklə
              </h3>
              <div className="space-y-4">
                <a
                  href="#"
                  className="flex items-center bg-surface/50 px-4 py-3 rounded-md hover-lift"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 512 512"
                    className="mr-4"
                    fill="currentColor"
                  >
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div>
                    <div className="text-xs text-foreground/70">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>

                <a
                  href="#"
                  className="flex items-center bg-surface/50 px-4 py-3 rounded-md hover-lift"
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
                    <div className="text-xs text-foreground/70">
                      DOWNLOAD ON THE
                    </div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modern-card footer-animate opacity-0 transform translate-y-8 mb-4"
          style={{ transitionDelay: "400ms" }}
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm mb-4 md:mb-0 text-foreground/70">
                © 2025 «Aivinci Bank» ASC. Bütün hüquqlar qorunur.
              </div>
              <div className="text-sm text-foreground/70 flex items-center">
                <span>Made with</span>
                <span className="mx-1 text-amber-500">{icons.heart}</span>
                <span>by Aivinci Creative Team</span>
              </div>
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
    </footer>
  );
};

export default Footer;
