/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * 
 * @param {File} file - The original image file.
 * @param {number} maxWidth - Maximum width of the compressed image.
 * @param {number} maxHeight - Maximum height of the compressed image.
 * @param {number} quality - Quality of compression (0.1 to 1.0).
 * @returns {Promise<Blob>} - Resolves with the compressed image Blob.
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas 2D context'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with jpeg format and specified quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas toBlob failed'));
            }
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
