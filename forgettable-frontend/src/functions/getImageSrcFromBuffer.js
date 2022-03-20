global.Buffer = global.Buffer || require('buffer').Buffer;

/**
 * Converts a image buffer into a format that a <img> src can interpret
 * @param {*} buffer the buffer to be converted into an image src
 * @return a format that a <img> src can interpret
 */
export const getImageSrcFromBuffer = (buffer) => {
  if (!buffer) return null;
  return 'data:image/png;base64, ' + Buffer.from(buffer, 'base64');
};
