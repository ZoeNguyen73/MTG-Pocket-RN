export default ({ config }) => {
  const isDev = process.env.APP_ENV !== "production";

  return {
    ...config,
    extra: {
      apiUrl: isDev
        ? "https://mtg-pocket-express.onrender.com/api/v1"
        : "https://mtg-pocket-express.onrender.com/api/v1", // TO DO: update this after deploy
    },
  };
};
