/**
 * Utility functions for processing and optimizing images
 */

/**
 * Process an image according to specified settings
 * @param {File} file - The image file to process
 * @param {Object} settings - Image processing settings
 * @param {number} settings.maxWidth - Maximum width of the processed image
 * @param {number} settings.maxHeight - Maximum height of the processed image
 * @param {number} settings.quality - Image quality (0-1)
 * @param {string} settings.format - Output format (jpeg, png, webp)
 * @returns {Promise<Blob>} - Processed image as a Blob
 */
export const processImage = (file, settings) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const processedBlob = resizeAndOptimizeImage(img, settings);
          resolve(processedBlob);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Resize and optimize an image
 * @param {HTMLImageElement} img - The image element to process
 * @param {Object} settings - Image processing settings
 * @returns {Blob} - Processed image as a Blob
 */
const resizeAndOptimizeImage = (img, settings) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Calculate new dimensions while maintaining aspect ratio
  let { width, height } = calculateDimensions(
    img.width,
    img.height,
    settings.maxWidth,
    settings.maxHeight
  );

  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw image with smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      `image/${settings.format}`,
      settings.quality
    );
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {Object} - New dimensions { width, height }
 */
const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  
  // If image is smaller than max dimensions, keep original size
  if (ratio > 1) {
    ratio = 1;
  }

  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio)
  };
};

/**
 * Convert a data URL to a Blob
 * @param {string} dataUrl - The data URL to convert
 * @returns {Blob} - The resulting Blob
 */
export const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Get image dimensions
 * @param {File} file - The image file
 * @returns {Promise<Object>} - Image dimensions { width, height }
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Check if file is an image
 * @param {File} file - The file to check
 * @returns {boolean} - True if file is an image
 */
export const isImage = (file) => {
  return file && file.type.startsWith('image/');
};

/**
 * Format file size in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Create an object URL for a blob
 * @param {Blob} blob - The blob to create a URL for
 * @returns {string} - Object URL
 */
export const createObjectURL = (blob) => {
  return URL.createObjectURL(blob);
};

/**
 * Revoke an object URL
 * @param {string} url - The URL to revoke
 */
export const revokeObjectURL = (url) => {
  URL.revokeObjectURL(url);
};
