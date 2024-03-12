var appconfig = require("./appconfig");

module.exports = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    initJson: "https://paas-init.revlet.net/clients/aastha/init/aastha-v1.json",
    appconfig: { ...appconfig },
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
};
