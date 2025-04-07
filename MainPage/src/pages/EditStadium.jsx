"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AuthContext } from "../App"
import { getStadiumByName } from "../utils/stadiumUtils"

const EditStadium = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stadium, setStadium] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    hourlyRate: 0,
    description: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    // Check if user is a stadium owner
    if (!user || user.userType !== "owner") {
      navigate("/")
      return
    }

    // Find the stadium owned by this user
    const foundStadium = getStadiumByName(user.stadiumName)

    if (!foundStadium) {
      navigate("/my-stadium")
      return
    }

    setStadium(foundStadium)
    setFormData({
      name: foundStadium.name,
      hourlyRate: foundStadium.hourlyRate,
      description: foundStadium.description || "",
    })

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target

    // For hourlyRate, ensure it's a number and not less than 1
    if (name === "hourlyRate") {
      const numValue = Number.parseFloat(value)
      if (isNaN(numValue) || numValue < 1) {
        setErrors({ ...errors, hourlyRate: "Price must be at least 1 AZN" })
        return
      } else {
        setErrors({ ...errors, hourlyRate: null })
      }
    }

    setFormData({
      ...formData,
      [name]: name === "hourlyRate" ? Number.parseFloat(value) : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = "Stadium name is required"
    }

    if (!formData.hourlyRate || formData.hourlyRate < 1) {
      newErrors.hourlyRate = "Price must be at least 1 AZN"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    // Update stadium data
    const updatedStadium = {
      ...stadium,
      name: formData.name,
      hourlyRate: formData.hourlyRate,
      description: formData.description,
    }

    // Update in localStorage
    const storedStadiums = JSON.parse(localStorage.getItem("customStadiums") || "[]")

    // Check if we already have a custom entry for this stadium
    const existingIndex = storedStadiums.findIndex((s) => s.id === stadium.id || s.name === stadium.name)

    if (existingIndex >= 0) {
      storedStadiums[existingIndex] = {
        ...storedStadiums[existingIndex],
        name: formData.name,
        hourlyRate: formData.hourlyRate,
        description: formData.description,
      }
    } else {
      storedStadiums.push({
        id: `custom-${Date.now()}`,
        name: formData.name,
        hourlyRate: formData.hourlyRate,
        description: formData.description,
        originalId: stadium.id,
        originalName: stadium.name,
        city: stadium.city,
        address: stadium.address,
        image: stadium.image,
        amenities: stadium.amenities,
        features: stadium.features,
        rating: stadium.rating,
        reviews: stadium.reviews,
        ownerId: user.id,
      })
    }

    localStorage.setItem("customStadiums", JSON.stringify(storedStadiums))

    // Update user's stadium name if it changed
    if (formData.name !== user.stadiumName) {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = storedUsers.map((u) => {
        if (u.id === user.id) {
          return { ...u, stadiumName: formData.name }
        }
        return u
      })

      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update current user in localStorage
      const updatedUser = { ...user, stadiumName: formData.name }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    // Show success message
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessMessage(true)

      // Navigate back after showing success message
      setTimeout(() => {
        navigate("/my-stadium")
      }, 2000)
    }, 1000)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Success message variants
  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
            className="w-16 h-16 border-4 border-[#4de840] border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-[#fffce1]/70 text-lg"
          >
            Loading stadium details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container mx-auto px-4 py-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate("/my-stadium")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back to my stadium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Success message overlay */}
      <AnimatePresence>
        {showSuccessMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowSuccessMessage(false)}
            ></motion.div>
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#171717]/90 backdrop-blur-[10px] border border-[#4de840]/30 rounded-xl shadow-lg p-6 max-w-md w-full z-50 text-center"
            >
              <div className="w-16 h-16 bg-[#4de840]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#fffce1] mb-2">Stadium Updated Successfully!</h2>
              <p className="text-[#fffce1]/70 mb-4">
                Your stadium information has been updated. Redirecting you back to your stadium page...
              </p>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="h-1 bg-[#4de840] rounded-full"
              ></motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        variants={itemVariants}
        className="max-w-4xl mx-auto bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
      >
        <div className="relative h-64">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={stadium.image || `https://source.unsplash.com/random/800x600/?football,stadium&sig=${stadium.id}`}
            alt={stadium.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e100f] via-[#0e100f]/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-[#fffce1] mb-2">Edit Stadium</h1>
            <p className="text-[#fffce1]/70">Update your stadium details and pricing</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <motion.div variants={itemVariants} className=" pt-2 p-1">
                <label htmlFor="name" className="text-sm font-medium text-[#fffce1] mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  Stadium Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#0e100f]/50 border ${
                    errors.name ? "border-red-500" : "border-white/10"
                  } text-[#fffce1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4de840]/50 focus:border-transparent transition-all duration-300`}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="pt-1 p-1">
                <label htmlFor="hourlyRate" className="text-sm font-medium text-[#fffce1] mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hourly Rate (AZN)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={`w-full px-4 py-3 bg-[#0e100f]/50 border ${
                    errors.hourlyRate ? "border-red-500" : "border-white/10"
                  } text-[#fffce1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4de840]/50 focus:border-transparent transition-all duration-300`}
                />
                {errors.hourlyRate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.hourlyRate}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="pt-1 p-1">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-[#fffce1] mb-2 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-[#0e100f]/50 border border-white/10 text-[#fffce1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4de840]/50 focus:border-transparent transition-all duration-300"
                  placeholder="Describe your stadium facilities, location advantages, etc."
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-between pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => navigate("/my-stadium")}
                  className="px-6 py-3 bg-[rgb(25,25,25)] border-2 border-white/15 text-[#fffce1] rounded-full hover:border-white/30 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-[rgb(26,26,26)]"
                >
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 cursor-pointer ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#0e100f]"
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
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </motion.div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EditStadium

