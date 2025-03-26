"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AuthContext } from "../App"
import { getStadiumByName } from "../utils/stadiumUtils"

const MyStadium = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stadium, setStadium] = useState(null)
  const [loading, setLoading] = useState(true)

  // Add a new state for the add post modal and posts
  const [showAddPostModal, setShowAddPostModal] = useState(false)
  const [postCaption, setPostCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [posts, setPosts] = useState([])
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)

  // Add these new states for edit functionality
  const [showEditPostModal, setShowEditPostModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [editCaption, setEditCaption] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [isEditingPost, setIsEditingPost] = useState(false)

  // Add state for gallery modal
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Add state for active tab
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    // Check if user is a stadium owner
    if (!user || user.userType !== "owner") {
      navigate("/")
      return
    }

    // Find the stadium owned by this user
    const foundStadium = getStadiumByName(user.stadiumName)

    if (!foundStadium) {
      // If stadium not found, create a default one
      const newStadium = {
        id: `custom-${Date.now()}`,
        name: user.stadiumName,
        city: "Unknown",
        address: "Unknown",
        description: "No description available",
        hourlyRate: 100,
        image: `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Date.now()}`,
        amenities: {
          recording: false,
          buffet: false,
          parking: true,
          shower: true,
          lockerRoom: true,
        },
        features: ["Basic Facilities"],
        rating: 4.0,
        reviews: 0,
        ownerId: user.id,
      }

      // Save to localStorage
      const storedStadiums = JSON.parse(localStorage.getItem("customStadiums") || "[]")
      storedStadiums.push(newStadium)
      localStorage.setItem("customStadiums", JSON.stringify(storedStadiums))

      setStadium(newStadium)
    } else {
      setStadium(foundStadium)
    }

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [user, navigate])

  // Add this useEffect to load posts
  useEffect(() => {
    if (stadium) {
      // Load posts for this stadium
      const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]")
      const stadiumPosts = allPosts.filter((post) => post.stadiumId === stadium.id)
      setPosts(stadiumPosts)
    }
  }, [stadium])

  // Add these functions for handling posts
  const handleAddPost = () => {
    setShowAddPostModal(true)
    setPostCaption("")
    setSelectedImage(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPost = () => {
    if (!selectedImage) {
      alert("Please select an image")
      return
    }

    setIsSubmittingPost(true)

    // Create a new post
    const newPost = {
      id: Date.now().toString(),
      stadiumId: stadium.id,
      imageUrl: selectedImage,
      caption: postCaption.trim(),
      createdAt: new Date().toISOString(),
      ownerId: user.id,
    }

    // Save to localStorage
    const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]")
    allPosts.push(newPost)
    localStorage.setItem("stadiumPosts", JSON.stringify(allPosts))

    // Update local state
    setPosts([...posts, newPost])

    // Close modal and reset form
    setShowAddPostModal(false)
    setPostCaption("")
    setSelectedImage(null)
    setIsSubmittingPost(false)
  }

  // Add these functions for handling post editing and deletion
  const handleEditPost = (post) => {
    setEditingPost(post)
    setEditCaption(post.caption || "")
    setShowEditPostModal(true)
  }

  const handleUpdatePost = () => {
    if (!editingPost) return

    setIsEditingPost(true)

    // Update the post
    const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]")
    const updatedPosts = allPosts.map((post) => {
      if (post.id === editingPost.id) {
        return {
          ...post,
          caption: editCaption.trim(),
          updatedAt: new Date().toISOString(),
        }
      }
      return post
    })

    localStorage.setItem("stadiumPosts", JSON.stringify(updatedPosts))

    // Update local state
    setPosts(
      posts.map((post) => {
        if (post.id === editingPost.id) {
          return {
            ...post,
            caption: editCaption.trim(),
            updatedAt: new Date().toISOString(),
          }
        }
        return post
      }),
    )
    // Close modal and reset form
    setShowEditPostModal(false)
    setEditingPost(null)
    setEditCaption("")
    setIsEditingPost(false)
  }

  const handleDeleteClick = (post) => {
    setPostToDelete(post)
    setShowDeleteConfirm(true)
  }

  const handleDeletePost = () => {
    if (!postToDelete) return

    // Delete the post
    const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]")
    const updatedPosts = allPosts.filter((post) => post.id !== postToDelete.id)
    localStorage.setItem("stadiumPosts", JSON.stringify(updatedPosts))

    // Update local state
    setPosts(posts.filter((post) => post.id !== postToDelete.id))

    // Close modal
    setShowDeleteConfirm(false)
    setPostToDelete(null)
  }

  // Gallery functions
  const openGallery = (index) => {
    setSelectedImageIndex(index)
    setShowGalleryModal(true)
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeGallery = () => {
    setShowGalleryModal(false)
    // Re-enable body scrolling
    document.body.style.overflow = "auto"
  }

  const navigateGallery = (direction) => {
    let newIndex = selectedImageIndex + direction
    if (newIndex < 0) newIndex = posts.length - 1
    if (newIndex >= posts.length) newIndex = 0
    setSelectedImageIndex(newIndex)
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

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  // Star rating animation
  const StarRating = ({ rating }) => {
    const totalStars = 5
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex">
        {[...Array(totalStars)].map((_, i) => {
          const starValue = i + 1
          const isFullStar = starValue <= fullStars
          const isHalfStar = !isFullStar && hasHalfStar && starValue === fullStars + 1

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
              className="relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isFullStar || isHalfStar ? "text-yellow-400" : "text-gray-400"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              {isHalfStar && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    )
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
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back to dashboard"
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

      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative rounded-[30px] overflow-hidden mb-8 shadow-xl">
        <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={stadium.image || `https://source.unsplash.com/random/1600x900/?football,stadium&sig=${stadium.id}`}
            alt={stadium.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e100f] via-[#0e100f]/60 to-transparent"></div>

          {/* Price badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-6 right-6"
          >
            <div className="bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] px-4 py-2 rounded-full text-lg font-bold shadow-lg">
              {stadium.hourlyRate} AZN/hour
            </div>
          </motion.div>

          {/* Stadium info overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#fffce1] mb-4 drop-shadow-lg">{stadium.name}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#4de840] mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[#fffce1]">{stadium.city || "Unknown"}</span>
              </div>

              <div className="flex items-center">
                <div className="mr-2">
                  <StarRating rating={stadium.rating} />
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[#fffce1]"
                >
                  {stadium.rating}
                </motion.span>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#4de840] mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  className="text-[#fffce1]/70 flex items-center"
                >
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                      transition: { duration: 1, delay: 0.7 },
                    }}
                    className="inline-block overflow-hidden"
                  >
                    <motion.span
                      initial={{ number: 0 }}
                      animate={{ number: stadium.reviews }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                    >
                      {Math.round(stadium.reviews)}
                    </motion.span>
                  </motion.span>
                  <span className="ml-1">views</span>
                </motion.span>
              </div>
            </div>

            {/* Edit button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                to="/my-stadium/edit"
                className="px-8 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full text-lg font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center relative overflow-hidden group"
              >
                <span className="relative z-10">Edit Stadium</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Tabs */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2 pt-1 pl-1">
          <motion.button
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("details")}
            className={`px-5 py-3 rounded-full text-[#fffce1] whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === "details"
                ? "bg-[#4de840]/20 border-2 border-[#4de840]/30 text-[#4de840] font-medium"
                : "bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 hover:border-[#4de840]/30"
            }`}
          >
            Stadium Details
          </motion.button>

          <motion.button
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("amenities")}
            className={`px-5 py-3 rounded-full text-[#fffce1] whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === "amenities"
                ? "bg-[#4de840]/20 border-2 border-[#4de840]/30 text-[#4de840] font-medium"
                : "bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 hover:border-[#4de840]/30"
            }`}
          >
            Amenities
          </motion.button>

          <motion.button
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("gallery")}
            className={`px-5 py-3 rounded-full text-[#fffce1] whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === "gallery"
                ? "bg-[#4de840]/20 border-2 border-[#4de840]/30 text-[#4de840] font-medium"
                : "bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 hover:border-[#4de840]/30"
            }`}
          >
            Gallery
          </motion.button>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About This Stadium
              </h2>
              <p className="text-[#fffce1]/80 leading-relaxed text-lg">
                {stadium.description || "No description available for this stadium."}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Location
              </h2>
              <div className="bg-[#171717]/90 rounded-2xl p-4 border border-white/10">
                <p className="text-[#fffce1]/80 mb-4">
                  {stadium.address || `${stadium.city || "Unknown"}, Azerbaijan`}
                </p>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#171717]/20 flex items-center justify-center">
                  <div className="text-[#fffce1]/50 text-center p-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p>Map view is not available in this preview</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h2 className="text-2xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
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
                Pricing Information
              </h2>
              <div className="bg-[#171717]/90 rounded-2xl p-4 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-[#fffce1]/80 mb-1">Hourly Rate:</p>
                    <p className="text-[#4de840] text-2xl font-bold">{stadium.hourlyRate} AZN</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/my-stadium/edit"
                      className="inline-block px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300"
                    >
                      Update Pricing
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "amenities" && (
          <motion.div
            key="amenities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Amenities Section */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-bold mb-6 text-[#fffce1] flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  Amenities
                  <span className="text-sm text-[#fffce1]/50 font-normal ml-2">(Facilities & Services)</span>
                </h2>

                <div className="bg-[#171717]/90 rounded-2xl p-5 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stadium.amenities && Object.entries(stadium.amenities).length > 0 ? (
                      Object.entries(stadium.amenities).map(
                        ([key, value], index) =>
                          value && (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="flex bg-[rgb(28,28,28)] items-center p-3 rounded-xl border border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
                            >
                              <div className="w-10 h-10 rounded-full bg-[#4de840]/10 flex items-center justify-center mr-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-[#4de840]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span className="text-[#fffce1]/90 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                            </motion.div>
                          ),
                      )
                    ) : (
                      <p className="text-[#fffce1]/50 col-span-2 text-center py-4">
                        No amenities information available
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Features Section */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-2xl font-bold mb-6 text-[#fffce1] flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Features
                  <span className="text-sm text-[#fffce1]/50 font-normal ml-2">(Field Characteristics)</span>
                </h2>

                <div className="bg-[#171717]/90 rounded-2xl p-5 border border-white/10">
                  {stadium.features && stadium.features.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {stadium.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * index }}
                          className="px-4 py-2 bg-[rgb(28,28,28)] border border-white/10 text-[#fffce1]/90 rounded-full text-sm hover:border-[#4de840]/20 hover:bg-[#4de840]/5 transition-colors duration-300"
                        >
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#fffce1]/50 text-center py-4">No features information available</p>
                  )}
                </div>

                {/* Update button */}
                <div className="mt-6 text-center">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                    <Link
                      to="/my-stadium/edit"
                      className="px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 inline-flex items-center"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Update Amenities & Features
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex justify-between items-center"
            >
              <h2 className="text-2xl font-bold text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Stadium Gallery
              </h2>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPost}
                className="text-[#fffce1] bg-[#4de840] hover:bg-[#3bc731] px-4 py-2 rounded-full flex items-center text-sm font-medium transition-colors duration-300 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Photo
              </motion.button>
            </motion.div>

            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#171717]/90 p-8 rounded-2xl text-center border border-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-[#fffce1]/30 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-[#fffce1]">No Gallery Photos</h3>
                <p className="text-[#fffce1]/60 max-w-md mx-auto mb-6">
                  Add photos to showcase your stadium to potential customers. High-quality images can help attract more
                  bookings.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddPost}
                  className="px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 inline-flex items-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add First Photo
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-[#171717]/90 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={post.imageUrl || "/placeholder.svg"}
                        alt="Stadium post"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditPost(post)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
                            title="Edit post"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(post)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                            title="Delete post"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openGallery(index)}
                            className="p-2 bg-[#4de840] text-white rounded-full hover:bg-[#3bc731] transition-colors cursor-pointer"
                            title="View full size"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-gray-300 line-clamp-2">{post.caption || "No caption"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.updatedAt
                          ? `Updated: ${new Date(post.updatedAt).toLocaleDateString()}`
                          : `Posted: ${new Date(post.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Post Modal */}
      <AnimatePresence>
        {showAddPostModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowAddPostModal(false)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#171717]/90 backdrop-blur-[10px] border-2 border-white/15 rounded-2xl shadow-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-[#fffce1] mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Add New Photo
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#fffce1] mb-2">Select Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-[#fffce1]/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4de840] file:text-[#0e100f] hover:file:bg-[#3bc731] file:cursor-pointer cursor-pointer"
                  />
                  {selectedImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-xl overflow-hidden bg-[#0e100f]/50 border border-white/10"
                    >
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected"
                        className="h-48 object-contain mx-auto"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="caption" className="block text-sm font-medium text-[#fffce1] mb-2">
                    Caption (Optional)
                  </label>
                  <textarea
                    id="caption"
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e100f]/50 border border-white/10 rounded-xl text-[#fffce1] focus:outline-none focus:ring-2 focus:ring-[#4de840]/50 focus:border-transparent transition-all duration-300"
                    rows="3"
                    placeholder="Add a caption to your photo..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddPostModal(false)}
                    className="px-4 py-2 bg-[#171717] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitPost}
                    disabled={isSubmittingPost || !selectedImage}
                    className={`px-4 py-2 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 cursor-pointer ${
                      isSubmittingPost || !selectedImage ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmittingPost ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0e100f]"
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
                        Uploading...
                      </span>
                    ) : (
                      "Upload Photo"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {showEditPostModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowEditPostModal(false)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#171717]/90 backdrop-blur-[10px] border-2 border-white/15 rounded-2xl shadow-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-[#fffce1] mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Photo
                </h2>

                <div className="mb-4">
                  <div className="rounded-xl overflow-hidden bg-[#0e100f]/50 border border-white/10">
                    <img
                      src={editingPost?.imageUrl || "/placeholder.svg"}
                      alt="Post"
                      className="h-48 object-contain mx-auto"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="editCaption" className="block text-sm font-medium text-[#fffce1] mb-2">
                    Caption
                  </label>
                  <textarea
                    id="editCaption"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e100f]/50 border border-white/10 rounded-xl text-[#fffce1] focus:outline-none focus:ring-2 focus:ring-[#4de840]/50 focus:border-transparent transition-all duration-300"
                    rows="3"
                    placeholder="Add a caption to your photo..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditPostModal(false)}
                    className="px-4 py-2 bg-[#171717] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdatePost}
                    disabled={isEditingPost}
                    className={`px-4 py-2 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 cursor-pointer ${
                      isEditingPost ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isEditingPost ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0e100f]"
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
                        Updating...
                      </span>
                    ) : (
                      "Update Photo"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteConfirm(false)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#171717]/90 backdrop-blur-[10px] border-2 border-white/15 rounded-2xl shadow-lg p-6 max-w-md w-full">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#fffce1] mb-2">Delete Photo</h2>
                  <p className="text-[#fffce1]/70 mb-6">
                    Are you sure you want to delete this photo? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-[#171717] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeletePost}
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
            onClick={closeGallery}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation()
                closeGallery()
              }}
              className="absolute top-4 right-4 text-[#fffce1] hover:text-red-500/90 p-2 bg-black/30 rounded-full transition-colors z-50 cursor-pointer"
              aria-label="Close gallery"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation()
                navigateGallery(-1)
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fffce1] hover:text-[#4de840] p-3 bg-black/30 rounded-full transition-colors z-50 cursor-pointer"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[90vh] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={posts[selectedImageIndex].imageUrl || "/placeholder.svg"}
                alt="Stadium gallery"
                className="max-w-full max-h-[75vh] object-contain mx-auto rounded-lg shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 bg-black/50 p-4 rounded-xl backdrop-blur-sm"
              >
                {posts[selectedImageIndex].caption ? (
                  <p className="text-[#fffce1] text-center">{posts[selectedImageIndex].caption}</p>
                ) : (
                  <p className="text-[#fffce1]/50 text-center italic">No caption</p>
                )}
                <div className="mt-3 text-center flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-[#4de840]/20 border border-[#4de840]/30 rounded-full text-sm text-[#4de840]">
                    {selectedImageIndex + 1} / {posts.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation()
                navigateGallery(1)
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#fffce1] hover:text-[#4de840] p-3 bg-black/30 rounded-full transition-colors z-50 cursor-pointer"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MyStadium

