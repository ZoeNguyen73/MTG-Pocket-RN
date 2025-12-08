export default ({ config }) => {
  const isDev = process.env.APP_ENV !== "production";

  return {
    ...config,
    extra: {
      apiUrl: isDev
        ? process.env.DEV_API_URL
        : process.env.PROD_API_URL,
    },
  };
};
