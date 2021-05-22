module.exports = {
  env: {
    SERVER_URL: "http://localhost",
    PORT: 3000,
  },
};
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};