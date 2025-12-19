export const devDelay = async (ms = 3000) => {
  if (process.env.NODE_ENV !== "development") return;
  return new Promise(resolve => setTimeout(resolve, ms));
};