"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import stadiumsData from "../utils/stadiumsData";
import { incrementStadiumViews, getStadiumById } from "../utils/stadiumUtils";

const StadiumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stadiumPosts, setStadiumPosts] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    try {
      // Find the stadium with the matching ID using our utility function
      const foundStadium = getStadiumById(id);

      if (!foundStadium) {
        navigate("/stadiums");
        return;
      }

      // Increment view count every time the stadium detail page is viewed
      const viewCount = incrementStadiumViews(id);

      // Update stadium with dynamic data
      setStadium({
        ...foundStadium,
        reviews: viewCount,
      });

      // Load posts for this stadium
      const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]");
      const stadiumPosts = allPosts.filter((post) => post.stadiumId === id);
      setStadiumPosts(stadiumPosts);
    } catch (error) {
      console.error("Error loading stadium details:", error);
      // Fallback to original data if there's an error
      const foundStadium = stadiumsData.find((s) => s.id === id);
      if (foundStadium) {
        setStadium(foundStadium);
      } else {
        navigate("/stadiums");
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Gallery functions
  const openGallery = (index) => {
    setSelectedImageIndex(index);
    setShowGalleryModal(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setShowGalleryModal(false);
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
  };

  const navigateGallery = (direction) => {
    let newIndex = selectedImageIndex + direction;
    if (newIndex < 0) newIndex = stadiumPosts.length - 1;
    if (newIndex >= stadiumPosts.length) newIndex = 0;
    setSelectedImageIndex(newIndex);
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Math.random()}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-20 h-20"
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
            className="absolute inset-0"
          >
            <svg
              className="w-full h-full text-[#4de840]"
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
          </motion.div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-[#fffce1] text-lg"
        >
          Loading stadium details...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      {/* Back button - Floating */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[30px] overflow-hidden mb-8 shadow-xl"
      >
        <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={
              stadium.image ||
              `https://source.unsplash.com/random/1600x900/?football,stadium&sig=${stadium.id}`
            }
            alt={stadium.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
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
            <h1 className="text-4xl md:text-5xl font-bold text-[#fffce1] mb-4 drop-shadow-lg">
              {stadium.name}
            </h1>

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
                <span className="text-[#fffce1]">{stadium.city}</span>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[#fffce1]">
                  {stadium.rating}{" "}
                  {/* <span className="text-[#fffce1]/70">
                    ({stadium.reviews} reviews)
                  </span> */}
                </span>
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
                <span className="text-[#fffce1]/70">
                  {stadium.reviews} views
                </span>
              </div>
            </div>

            {/* Reserve button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to={`/reserve/${stadium.id}`}
                className="px-8 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full text-lg font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center relative overflow-hidden group"
              >
                <span className="relative z-10">Reserve Now</span>
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                {/* Soccer ball pattern animation */}
                <span
                  className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNjAiPjxwYXRoIGQ9Ik0wLDYwIEwwLDAgTDI0MCwwIEwyNDAsNjAgTDAsNjAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHBvbHlnb24gcG9pbnRzPSIwLDAgMjAsMCAxMCwxNSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjIwLDAgNDAsMCAzMCwxNSAxMCwxNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjQwLDAgNjAsMCA1MCwxNSAzMCwxNSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjYwLDAgODAsMCA3MCwxNSA1MCwxNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjgwLDAgMTAwLDAgOTAsMTUgNzAsMTUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMDAsMCAxMjAsMCAxMTAsMTUgOTAsMTUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsMCAxNDAsMCAxMzAsMTUgMTEwLDE1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTQwLDAgMTYwLDAgMTUwLDE1IDEzMCwxNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjE2MCwwIDE4MCwwIDE3MCwxNSAxNTAsMTUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxODAsMCAyMDAsMCAxOTAsMTUgMTcwLDE1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjAwLDAgMjIwLDAgMjEwLDE1IDE5MCwxNSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjIyMCwwIDI0MCwwIDIzMCwxNSAyMTAsMTUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMCwxNSAzMCwxNSAyMCwzMCAwLDMwIDAsMTUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIzMCwxNSA1MCwxNSA0MCwzMCAyMCwzMCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjUwLDE1IDcwLDE1IDYwLDMwIDQwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iNzAsMTUgOTAsMTUgODAsMzAgNjAsMzAiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSI5MCwxNSAxMTAsMTUgMTAwLDMwIDgwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTEwLDE1IDEzMCwxNSAxMjAsMzAgMTAwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTMwLDE1IDE1MCwxNSAxNDAsMzAgMTIwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTUwLDE1IDE3MCwxNSAxNjAsMzAgMTQwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTcwLDE1IDE5MCwxNSAxODAsMzAgMTYwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTkwLDE1IDIxMCwxNSAyMDAsMzAgMTgwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjEwLDE1IDIzMCwxNSAyMjAsMzAgMjAwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjMwLDE1IDI0MCwxNSAyNDAsMzAgMjIwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMCwzMCAwLDQ1IDEwLDQ1IDIwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjAsMzAgNDAsMzAgMzAsNDUgMTAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSI0MCwzMCA2MCwzMCA1MCw0NSAzMCw0NSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjYwLDMwIDgwLDMwIDcwLDQ1IDUwLDQ1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iODAsMzAgMTAwLDMwIDkwLDQ1IDcwLDQ1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTAwLDMwIDEyMCwzMCAxMTAsNDUgOTAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsMzAgMTQwLDMwIDEzMCw0NSAxMTAsNDUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxNDAsMzAgMTYwLDMwIDE1MCw0NSAxMzAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxNjAsMzAgMTgwLDMwIDE3MCw0NSAxNTAsNDUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxODAsMzAgMjAwLDMwIDE5MCw0NSAxNzAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIyMDAsMzAgMjIwLDMwIDIxMCw0NSAxOTAsNDUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIyMjAsMzAgMjQwLDMwIDI0MCw0NSAyMzAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMCw0NSAzMCw0NSAyMCw2MCAwLDYwIDAuNDUsIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMzAsNDUgNTAsNDUgNDAsNjAgMjAsNjAiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSI1MCw0NSA3MCw0NSA2MCw2MCA0MCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjcwLDQ1IDkwLDQ1IDgwLDYwIDYwLDYwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iOTAsNDUgMTEwLDQ1IDEwMCw2MCA4MCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjExMCw0NSAxMzAsNDUgMTIwLDYwIDEwMCw2MCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjEzMCw0NSAxNTAsNDUgMTQwLDYwIDEyMCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjE1MCw0NSAxNzAsNDUgMTYwLDYwIDE0MCw2MCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjE3MCw0NSAxO
')] bg-repeat-x bg-size-contain -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100"
                ></span>
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
            Amenities and Features
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
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
                {stadium.description ||
                  "No description available for this stadium."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
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
                  {stadium.address || `${stadium.city}, Azerbaijan`}
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Availability
              </h2>
              <div className="bg-[#171717]/90 rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-[#fffce1]/80 mb-4">
                  Check availability and reserve your preferred time slot.
                </p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to={`/reserve/${stadium.id}`}
                    className="inline-block px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300"
                  >
                    Check Available Times
                  </Link>
                </motion.div>
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
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-[#fffce1 flex items-center">
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
                  <span className="text-sm text-[#fffce1]/50 font-normal ml-2">
                    (Facilities & Services)
                  </span>
                </h2>

                <div className="bg-[#171717]/90 rounded-2xl p-5 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stadium.amenities &&
                    Object.entries(stadium.amenities).length > 0 ? (
                      Object.entries(stadium.amenities).map(
                        ([key, value]) =>
                          value && (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * Math.random() }}
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
                          )
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
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Features
                  <span className="text-sm text-[#fffce1]/50 font-normal ml-2">
                    (Field Characteristics)
                  </span>
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
                    <p className="text-[#fffce1]/50 text-center py-4">
                      No features information available
                    </p>
                  )}
                </div>

                {/* Additional Info */}
                <div className="mt-6 bg-[#4de840]/10 rounded-2xl p-5 border border-[#4de840]/20">
                  <h3 className="text-lg font-semibold mb-3 text-[#4de840]">
                    Stadium Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#4de840]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#fffce1]/50 text-xs">Field Size</p>
                        <p className="text-[#fffce1]">Standard</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#4de840]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#fffce1]/50 text-xs">Lighting</p>
                        <p className="text-[#fffce1]">Available</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#4de840]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#fffce1]/50 text-xs">Weather</p>
                        <p className="text-[#fffce1]">Outdoor</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#4de840]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#fffce1]/50 text-xs">Hours</p>
                        <p className="text-[#fffce1]">10:00 - 23:00</p>
                      </div>
                    </div>
                  </div>
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

              {stadiumPosts.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openGallery(0)}
                  className="text-[#4de840] hover:text-[#4de840]/80 flex items-center text-sm bg-[#4de840]/10 px-3 py-1.5 rounded-full border border-[#4de840]/20"
                >
                  View all photos
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
              )}
            </motion.div>

            {stadiumPosts.length === 0 ? (
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
                <h3 className="text-xl font-semibold mb-2 text-[#fffce1]">
                  No Gallery Photos
                </h3>
                <p className="text-[#fffce1]/60 max-w-md mx-auto">
                  There are no gallery photos available for this stadium yet.
                  Check back later or view the main stadium image.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {stadiumPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className="aspect-square overflow-hidden rounded-2xl cursor-pointer relative group"
                    onClick={() => openGallery(index)}
                  >
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.caption || "Stadium gallery"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      {post.caption && (
                        <p className="text-[#fffce1] text-sm line-clamp-2">
                          {post.caption}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && stadiumPosts.length > 0 && (
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
                e.stopPropagation();
                closeGallery();
              }}
              className="absolute top-4 right-4 text-[#fffce1] hover:text-red-500/90 p-2 bg-black/30 rounded-full transition-colors z-50"
              aria-label="Close gallery"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery(-1);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fffce1] hover:text-[#4de840] p-3 bg-black/30 rounded-full transition-colors z-50"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
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
                src={
                  stadiumPosts[selectedImageIndex].imageUrl ||
                  "/placeholder.svg"
                }
                alt="Stadium gallery"
                className="max-w-full max-h-[75vh] object-contain mx-auto rounded-lg shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 bg-black/50 p-4 rounded-xl backdrop-blur-sm"
              >
                {stadiumPosts[selectedImageIndex].caption ? (
                  <p className="text-[#fffce1] text-center">
                    {stadiumPosts[selectedImageIndex].caption}
                  </p>
                ) : (
                  <p className="text-[#fffce1]/50 text-center italic">
                    No caption
                  </p>
                )}
                <div className="mt-3 text-center flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-[#4de840]/20 border border-[#4de840]/30 rounded-full text-sm text-[#4de840]">
                    {selectedImageIndex + 1} / {stadiumPosts.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery(1);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#fffce1] hover:text-[#4de840] p-3 bg-black/30 rounded-full transition-colors z-50"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StadiumDetail;
