// get truncated hash
export const getTruncateHash = (hash: string, length: number = 6) => {
  if (!hash) {
    return "";
  }

  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};
