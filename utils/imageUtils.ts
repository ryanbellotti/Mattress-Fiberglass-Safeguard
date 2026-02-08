export const resizeImage = (base64Data: string, mimeType: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if we are in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('resizeImage: Not in browser environment, skipping resize.');
      resolve(base64Data);
      return;
    }

    const img = new Image();
    // We need the data URL format for the Image src
    img.src = `data:${mimeType};base64,${base64Data}`;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      let newWidth = width;
      let newHeight = height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          if (width > maxWidth) {
            newHeight = Math.round((height * maxWidth) / width);
            newWidth = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            newWidth = Math.round((width * maxHeight) / height);
            newHeight = maxHeight;
          }
        }
      } else {
        // No resize needed
        resolve(base64Data);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('resizeImage: Could not get canvas context.');
        resolve(base64Data);
        return;
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Get the resized image as a data URL
      const dataUrl = canvas.toDataURL(mimeType);

      // Extract the base64 part
      const resizedBase64 = dataUrl.split(',')[1];
      resolve(resizedBase64);
    };

    img.onerror = (err) => {
      console.error('resizeImage: Error loading image.', err);
      // Fallback to original
      resolve(base64Data);
    };
  });
};
