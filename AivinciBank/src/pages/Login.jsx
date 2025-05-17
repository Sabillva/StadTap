"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "E-poçt ünvanı tələb olunur";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Düzgün e-poçt ünvanı daxil edin";
    }

    if (!password) {
      newErrors.password = "Şifrə tələb olunur";
    } else if (password.length < 6) {
      newErrors.password = "Şifrə ən azı 6 simvol olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);

        // Extract username from email (for demo purposes)
        const username = email.split("@")[0];

        // Save username to localStorage
        localStorage.setItem("username", username);

        // Navigate to home page
        navigate("/");
      }, 1500);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-32 px-4 relative overflow-hidden animated-bg">
      {/* Creative elements */}
      <div className="creative-circle creative-circle-1"></div>
      <div className="creative-circle creative-circle-2"></div>
      <div className="creative-shape creative-shape-1 floating"></div>
      <div className="creative-shape creative-shape-2 floating-delay-1"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface rounded-md p-8 shadow-lg border border-surface-hover">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-md bg-primary flex items-center justify-center floating">
                <span className="text-white text-2xl font-bold display-font">
                  A
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3 display-font gradient-text">
              Aivinci Bank-a xoş gəlmisiniz
            </h1>
            <p className="text-muted">Hesabınıza daxil olun</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-poçt ünvanı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="sizin@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Şifrə
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="relative">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border ${
                      rememberMe
                        ? "bg-primary border-primary"
                        : "border-muted bg-surface-hover"
                    } flex items-center justify-center transition-all cursor-pointer`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm cursor-pointer"
                >
                  Məni xatırla
                </label>
              </div>

              <a href="#" className="text-sm text-primary hover:underline">
                Şifrəni unutmusunuz?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-md flex items-center justify-center transition-all bg-primary text-white hover-lift"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-white font-medium">Yüklənir...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-white font-medium">Daxil ol</span>
                  <ArrowRight className="ml-2 h-5 w-5 text-white" />
                </div>
              )}
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm">
                Hesabınız yoxdur?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Qeydiyyatdan keçin
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
