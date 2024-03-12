var appconfig = require("./appconfig");

module.exports = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    initJson:
      "https://paas-init.revlet.net/clients/firstshows/init/live/firstshows.json",
    appconfig: { ...appconfig },
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home123",
      },
    ];
  },
};
