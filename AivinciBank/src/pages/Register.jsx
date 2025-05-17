"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "Ad tələb olunur";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Soyad tələb olunur";
    }

    if (!formData.email) {
      newErrors.email = "E-poçt ünvanı tələb olunur";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Düzgün e-poçt ünvanı daxil edin";
    }

    if (!formData.phone) {
      newErrors.phone = "Telefon nömrəsi tələb olunur";
    } else if (!/^\+?[0-9]{10,13}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Düzgün telefon nömrəsi daxil edin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Şifrə tələb olunur";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifrə ən azı 6 simvol olmalıdır";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifrəni təsdiqləyin";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifrələr uyğun gəlmir";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "İstifadə şərtləri ilə razılaşmalısınız";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      nextStep();
      return;
    }

    if (validateStep2()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);

        // Save username to localStorage
        localStorage.setItem("username", formData.firstName);

        // Navigate to home page
        navigate("/");
      }, 1500);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const passwordStrength = getPasswordStrength();

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Çox zəif";
      case 1:
        return "Zəif";
      case 2:
        return "Orta";
      case 3:
        return "Güclü";
      case 4:
        return "Çox güclü";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-primary";
      case 4:
        return "bg-primary";
      default:
        return "";
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-32 px-4 relative overflow-hidden animated-bg">
      {/* Creative elements */}
      <div className="creative-circle creative-circle-1"></div>
      <div className="creative-circle creative-circle-2"></div>
      <div className="creative-shape creative-shape-1 floating"></div>
      <div className="creative-shape creative-shape-2 floating-delay-1"></div>

      <div className="w-full max-w-2xl relative z-10">
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
              Aivinci Bank-da hesab yaradın
            </h1>
            <p className="text-muted">
              Qeydiyyatdan keçərək xidmətlərimizdən yararlanın
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex justify-between mb-10 relative">
            <div className="w-full absolute top-1/2 h-1 -translate-y-1/2">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: currentStep === 1 ? "50%" : "100%" }}
              ></div>
            </div>

            <div className="z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= 1
                    ? "bg-primary text-white"
                    : "bg-surface-hover text-muted"
                }`}
              >
                {currentStep > 1 ? <Check size={18} /> : 1}
              </div>
              <span className="text-sm">Şəxsi məlumatlar</span>
            </div>

            <div className="z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= 2
                    ? "bg-primary text-white"
                    : "bg-surface-hover text-muted"
                }`}
              >
                2
              </div>
              <span className="text-sm">Təhlükəsizlik</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-2"
                    >
                      Ad
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                          errors.firstName
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                        placeholder="Adınız"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-2"
                    >
                      Soyad
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full pl-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                          errors.lastName
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                        placeholder="Soyadınız"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      E-poçt ünvanı
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                        placeholder="sizin@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      Telefon nömrəsi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-muted" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                          errors.phone
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                        placeholder="+994 50 123 45 67"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
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
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : ""
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
                    <p className="mt-2 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}

                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">
                          Şifrə gücü: {getStrengthText()}
                        </span>
                        <span className="text-xs">{passwordStrength}/4</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStrengthColor()} transition-all duration-300`}
                          style={{ width: `${passwordStrength * 25}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Şifrəni təsdiqləyin
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 px-4 rounded-md bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-muted" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-start">
                    <div className="relative">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={() => setAgreeTerms(!agreeTerms)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-md border ${
                          agreeTerms
                            ? "bg-primary border-primary"
                            : "border-muted bg-surface-hover"
                        } flex items-center justify-center transition-all cursor-pointer`}
                        onClick={() => setAgreeTerms(!agreeTerms)}
                      >
                        {agreeTerms && (
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
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className={errors.agreeTerms ? "text-red-500" : ""}
                      >
                        Mən{" "}
                        <a href="#" className="text-primary hover:underline">
                          İstifadə şərtləri
                        </a>{" "}
                        və{" "}
                        <a href="#" className="text-primary hover:underline">
                          Məxfilik siyasəti
                        </a>{" "}
                        ilə razıyam
                      </label>
                    </div>
                  </div>
                  {errors.agreeTerms && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-between">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-3 px-6 rounded-md flex items-center justify-center transition-all border border-surface-hover hover:bg-surface-hover"
                >
                  <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                  <span>Geri</span>
                </button>
              )}

              <button
                type={currentStep === 1 ? "button" : "submit"}
                onClick={currentStep === 1 ? nextStep : undefined}
                className={`py-3 px-6 rounded-md flex items-center justify-center transition-all bg-primary text-white hover-lift ${
                  currentStep === 1 ? "ml-auto" : "ml-auto"
                }`}
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
                    <span className="text-white font-medium">
                      {currentStep === 1 ? "Növbəti" : "Qeydiyyatdan keç"}
                    </span>
                    <ArrowRight className="ml-2 h-5 w-5 text-white" />
                  </div>
                )}
              </button>
            </div>

            {currentStep === 2 && (
              <div className="mt-8 text-center">
                <p className="text-sm">
                  Artıq hesabınız var?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Daxil olun
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
