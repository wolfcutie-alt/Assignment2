/**
 * Get the full path for an image from the public folder
 * @param {string} imagePath - The path to the image relative to the public folder
 * @returns {string} The full path to the image
 */
export const getPublicImagePath = (imagePath) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${process.env.PUBLIC_URL}/${cleanPath}`;
};

/**
 * Get the full path for an image from the public/images folder
 * @param {string} imageName - The name of the image file
 * @returns {string} The full path to the image
 */
export const getImagePath = (imageName) => {
  // For development environment
  if (process.env.NODE_ENV === 'development') {
    return `/images/${imageName}`;
  }
  // For production environment
  return getPublicImagePath(`images/${imageName}`);
}; 