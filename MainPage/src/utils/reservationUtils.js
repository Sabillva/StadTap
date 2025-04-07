/**
 * Checks and updates expired reservations
 * - Auto-rejects waiting reservations if the time slot has passed
 * - Auto-rejects accepted reservations if payment time has expired
 * @returns {boolean} True if any reservations were updated
 */
export const checkAndUpdateExpiredReservations = () => {
  const allReservations = JSON.parse(
    localStorage.getItem("reservations") || "[]"
  );
  const today = new Date().toISOString().split("T")[0];
  const currentHour = new Date().getHours();
  const currentTime = new Date().getTime();

  let hasUpdates = false;

  const updatedReservations = allReservations.map((reservation) => {
    // Only check waiting reservations
    if (reservation.status === "waiting") {
      // Check if the date is today or in the past
      if (
        reservation.date < today ||
        (reservation.date === today &&
          reservation.timeSlots.some((slot) => {
            const slotHour = Number.parseInt(slot.split("-")[0], 10);
            return slotHour <= currentHour;
          }))
      ) {
        hasUpdates = true;
        return {
          ...reservation,
          status: "rejected",
          autoRejected: true,
          rejectedAt: currentTime,
          rejectionReason: "Automatically rejected: Time slot has passed",
        };
      }
    }

    // Check if payment time expired for accepted reservations
    if (reservation.status === "accepted" && reservation.acceptedAt) {
      // Calculate the expiry time based on the minimum of:
      // 1. Standard 1 hour payment window
      // 2. Time until the reservation starts (if it's a future reservation)
      let expiryTime = reservation.acceptedAt + 60 * 60 * 1000; // Default: 1 hour in milliseconds

      // Check if this is a reservation for today
      if (reservation.date === today) {
        // Find the earliest time slot
        const earliestSlotHour = Math.min(
          ...reservation.timeSlots.map((slot) =>
            Number.parseInt(slot.split("-")[0], 10)
          )
        );

        // Calculate when this slot starts today
        const slotStartTime = new Date();
        slotStartTime.setHours(earliestSlotHour, 0, 0, 0);

        // If the slot starts in the future but sooner than our 1-hour window
        if (
          slotStartTime.getTime() > currentTime &&
          slotStartTime.getTime() < expiryTime
        ) {
          // Set expiry time to when the slot starts
          expiryTime = slotStartTime.getTime();
        }
      }

      if (currentTime > expiryTime) {
        hasUpdates = true;
        return {
          ...reservation,
          status: "rejected",
          autoRejected: true,
          rejectedAt: currentTime,
          rejectionReason: "Automatically rejected: Payment time expired",
        };
      }
    }

    return reservation;
  });

  if (hasUpdates) {
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  }

  return hasUpdates;
};

/**
 * Calculates the remaining time for payment in seconds
 * @param {Object} reservation - The reservation object
 * @returns {number} Remaining time in seconds
 */
export const calculatePaymentTimeRemaining = (reservation) => {
  if (!reservation || !reservation.acceptedAt) return 0;

  const currentTime = new Date().getTime();
  const today = new Date().toISOString().split("T")[0];

  // Default expiry time (1 hour from acceptance)
  let expiryTime = reservation.acceptedAt + 60 * 60 * 1000;

  // Check if this is a reservation for today
  if (reservation.date === today) {
    // Find the earliest time slot
    const earliestSlotHour = Math.min(
      ...reservation.timeSlots.map((slot) =>
        Number.parseInt(slot.split("-")[0], 10)
      )
    );

    // Calculate when this slot starts today
    const slotStartTime = new Date();
    slotStartTime.setHours(earliestSlotHour, 0, 0, 0);

    // If the slot starts in the future but sooner than our 1-hour window
    if (
      slotStartTime.getTime() > currentTime &&
      slotStartTime.getTime() < expiryTime
    ) {
      // Set expiry time to when the slot starts
      expiryTime = slotStartTime.getTime();
    }
  }

  const remainingMs = expiryTime - currentTime;
  return Math.max(0, Math.floor(remainingMs / 1000)); // Convert to seconds, minimum 0
};
