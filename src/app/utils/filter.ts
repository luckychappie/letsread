const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} Bytes`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

export default formatFileSize;