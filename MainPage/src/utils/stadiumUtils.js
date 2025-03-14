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

// Update the getUpdatedStadiumData function to include custom stadiums
export const getUpdatedStadiumData = () => {
  // Get view counts
  const viewCountsStr = localStorage.getItem("stadiumViewCounts");
  const viewCounts = viewCountsStr ? JSON.parse(viewCountsStr) : {};

  // Get custom stadiums
  const customStadiumsStr = localStorage.getItem("customStadiums");
  const customStadiums = customStadiumsStr ? JSON.parse(customStadiumsStr) : [];

  // Create a map of stadium IDs to custom stadiums for quick lookup
  const customStadiumMap = {};
  customStadiums.forEach((stadium) => {
    customStadiumMap[stadium.id] = stadium;
  });

  // Update each stadium with dynamic data
  const updatedStadiums = stadiumsData.map((stadium) => {
    // Check if there's a custom stadium with the same ID or name
    const customStadium =
      customStadiumMap[stadium.id] ||
      customStadiums.find((s) => s.name === stadium.name);

    // If there's a custom stadium, use its data
    if (customStadium) {
      // Merge the original stadium with the custom stadium data
      stadium = {
        ...stadium,
        name: customStadium.name,
        hourlyRate: customStadium.hourlyRate,
        description: customStadium.description || stadium.description,
      };
    }

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

  // Add any custom stadiums that don't match existing stadiums
  customStadiums.forEach((customStadium) => {
    // Check if this custom stadium is already in the list
    const exists = updatedStadiums.some(
      (s) => s.id === customStadium.id || s.name === customStadium.name
    );

    if (!exists) {
      // Add reviews count and rating
      const reviews = viewCounts[customStadium.id] || 0;
      const calculatedRating = calculateStadiumRating(customStadium.id);
      const rating = calculatedRating || customStadium.rating || 4.0;

      updatedStadiums.push({
        ...customStadium,
        reviews,
        rating,
      });
    }
  });

  return updatedStadiums;
};

/**
 * Get stadium by ID with updated data
 * @param {string} stadiumId - The ID of the stadium
 * @returns {Object|null} Stadium object or null if not found
 */
export const getStadiumById = (stadiumId) => {
  // Get all updated stadiums
  const updatedStadiums = getUpdatedStadiumData();

  // Find the stadium with the matching ID
  return updatedStadiums.find((stadium) => stadium.id === stadiumId) || null;
};

/**
 * Get stadium by name
 * @param {string} stadiumName - The name of the stadium
 * @returns {Object|null} Stadium object or null if not found
 */
export const getStadiumByName = (stadiumName) => {
  // Get all updated stadiums
  const updatedStadiums = getUpdatedStadiumData();

  // Find the stadium with the matching name
  return (
    updatedStadiums.find((stadium) => stadium.name === stadiumName) || null
  );
};

/**
 * Update stadium data
 * @param {string} stadiumId - The ID of the stadium
 * @param {Object} updatedData - The updated stadium data
 * @returns {Object} Updated stadium object
 */
export const updateStadium = (stadiumId, updatedData) => {
  // Get custom stadiums from localStorage
  const customStadiumsStr = localStorage.getItem("customStadiums");
  const customStadiums = customStadiumsStr ? JSON.parse(customStadiumsStr) : {};

  // Update the custom data for this stadium
  customStadiums[stadiumId] = {
    ...(customStadiums[stadiumId] || {}),
    ...updatedData,
  };

  // Save back to localStorage
  localStorage.setItem("customStadiums", JSON.stringify(customStadiums));

  // Return the updated stadium
  return {
    ...getStadiumById(stadiumId),
    ...updatedData,
  };
};
