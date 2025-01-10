export const generateSparkle = (color) => {
  return {
    id: Math.random().toString(),
    createdAt: Date.now(),
    color,
    size: Math.random() * 20 + 15,
    style: {
      // Pick a random spot in the available space
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      opacity: Math.random() * 0.5 + 0.5,
      // Float sparkles above sibling content
      zIndex: 2,
    }
  };
};