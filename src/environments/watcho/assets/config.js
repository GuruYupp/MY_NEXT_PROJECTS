var appconfig = require('./appconfig');

module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // initJson:"https://d2k02uhj7uybok.cloudfront.net/init/dishtv/live/dishtv.json",
    initJson:
      'https://d2k02uhj7uybok.cloudfront.net/init/dishtv/uat/dishtv.json',
    // initJson: "https://d2k02uhj7uybok.cloudfront.net/init/dishtv/test/dishtv.json",
    appconfig: { ...appconfig },
  },
  basePath: ``,
  async rewrites() {
    return [
      {
        source: '/signin',
        destination: '/auth/signin',
      },
      {
        source: '/profiles/manage-user-profile',
        destination: '/auth/profiles/profile',
      },
      {
        source: '/profiles/select-user-profile',
        destination: '/auth/profiles/profile',
      },
      {
        source: '/profiles/create-user-profile',
        destination: '/auth/profiles/profile',
      },
      {
        source: '/profiles/update-user-profile/:userId',
        destination: '/auth/profiles/profile',
      },
      {
        source: '/add-profile-name',
        destination: '/auth/profiles/add-profile-name',
      },
      {
        source: '/profiles/view-restrictions/:userId',
        destination: '/auth/profiles/view-restrictions'
      },
      {
        source: '/settings',
        destination: '/misc/misc',
      },
      {
        source: '/',
        destination: '/home',
      },
    ];
  },
};
