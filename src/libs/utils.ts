export const bufferToBlob = (buffer: Buffer): Blob => {
  const mimeType = 'text/plain';
  const blob = new Blob([buffer], { type: mimeType });
  return blob;
};
