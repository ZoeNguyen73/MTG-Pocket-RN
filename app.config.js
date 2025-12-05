export default ({ config }) => {
  const isDev = process.env.APP_ENV !== "production";

  return {
    ...config,
    extra: {
      apiUrl: isDev
        ? "http://192.168.0.238:3000/api/v1"
        : "https://mtg-pocket-express.onrender.com/api/v1", // TO DO: update this after deploy
    },
  };
};
