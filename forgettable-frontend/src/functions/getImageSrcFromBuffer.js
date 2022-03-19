global.Buffer = global.Buffer || require('buffer').Buffer;

/**
 * Converts a image buffer into a format that a <img> src can interpret
 * @param {*} buffer the buffer to be converted into an image src
 * @returns format that a <img> src can interpret
 */
export const getImageSrcFromBuffer = (buffer) => {
  if (!buffer) return null;
  return Buffer.from(buffer, 'base64');
};
