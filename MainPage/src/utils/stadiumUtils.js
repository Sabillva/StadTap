// Utility functions for stadium data management
import stadiumsData from "./stadiumsData";

/**
 * Increment the view count for a stadium and update its review count
 * @param {string} stadiumId - The ID of the stadium
 */
export const incrementStadiumViews = (stadiumId) => {
  // Get current view counts from localStorage
  const viewCountsStr = localStorage.getItem("stadiumViewCounts");
  const viewCounts = viewCountsStr ? JSON.parse(viewCountsStr) : {};

  // Increment the view count for this stadium by 1 (not 2)
  viewCounts[stadiumId] = (viewCounts[stadiumId] || 0) + 1;

  // Save back to localStorage
  localStorage.setItem("stadiumViewCounts", JSON.stringify(viewCounts));

  return viewCounts[stadiumId] || 0;
};

/**
 * Get the view count for a stadium
 * @param {string} stadiumId - The ID of the stadium
 * @returns {number} The number of views
 */
export const getStadiumViewCount = (stadiumId) => {
  const viewCountsStr = localStorage.getItem("stadiumViewCounts");
  const viewCounts = viewCountsStr ? JSON.parse(viewCountsStr) : {};
  return viewCounts[stadiumId] || 0;
};

/**
 * Calculate stadium rating based on paid reservations
 * @param {string} stadiumId - The ID of the stadium
 * @returns {number} Rating between 1-5
 */
export const calculateStadiumRating = (stadiumId) => {
  // Get all reservations from localStorage
  const reservationsStr = localStorage.getItem("reservations");
  const reservations = reservationsStr ? JSON.parse(reservationsStr) : [];

  // Filter paid reservations for this stadium
  const paidReservations = reservations.filter(
    (r) => r.stadiumId === stadiumId && r.status === "paid"
  );

  // Count total paid hours
  let totalPaidHours = 0;
  paidReservations.forEach((reservation) => {
    totalPaidHours += reservation.timeSlots.length;
  });

  // Calculate rating based on paid hours
  // Base rating of 3.5 + bonus based on paid hours (max 5.0)
  let rating = 3.5;

  if (totalPaidHours > 0) {
    // Add bonus rating based on paid hours (max +1.5)
    const bonus = Math.min(1.5, totalPaidHours * 0.1);
    rating += bonus;
  }

  // Round to 1 decimal place
  return Math.round(rating * 10) / 10;
};

/**
 * Load and update stadium data with dynamic ratings and reviews
 * @returns {Array} Updated stadium data
 */
export const getUpdatedStadiumData = () => {
  // Get view counts
  const viewCountsStr = localStorage.getItem("stadiumViewCounts");
  const viewCounts = viewCountsStr ? JSON.parse(viewCountsStr) : {};

  // Update each stadium with dynamic data
  return stadiumsData.map((stadium) => {
    // Update reviews count based on views
    const reviews = viewCounts[stadium.id] || 0;

    // Calculate rating based on paid reservations
    const calculatedRating = calculateStadiumRating(stadium.id);

    // Use calculated rating if available, otherwise use the default
    const rating = calculatedRating || stadium.rating;

    return {
      ...stadium,
      reviews,
      rating,
    };
  });
};
