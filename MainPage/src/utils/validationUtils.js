/**
 * Validates a phone number format
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber) => {
  // Stricter validation for phone numbers
  // Only allows + at the beginning and numbers
  const phoneRegex = /^\+?[0-9]+$/;
  return phoneRegex.test(phoneNumber);
};
