module.exports = {
  reactStrictMode: false,
  basePath: '',
  async rewrites() {
    return [
      {
        source: '/signin',
        destination: '/auth/signin',
      },
      {
        source: '/signup',
        destination: '/auth/signup',
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
        source: '/profiles/profile-lock/:userId',
        destination: '/auth/profiles/profile-lock'
      },
      {
        source: '/settings',
        destination: '/misc/misc',
      },
      {
        source: '/settings/edit-profile',
        destination: '/misc/misc',
      },
      {
        source: '/change-password',
        destination: '/misc/misc',
      },
      {
        source: '/',
        destination: '/home',
      },
    ];
  },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   // ignoreBuildErrors: true,
  // },
};
