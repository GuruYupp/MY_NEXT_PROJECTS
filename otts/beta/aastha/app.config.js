const appConfig = {
  endPoints: {
   "location": "https://tsat-testapi.revlet.net",
   "api": "https://tsat-testapi.revlet.net",
   "search": "https://tsat-testapi.revlet.net",
   "guideURL": "https://tsat-testapi.revlet.net",
   "tenantCode": "aastha",
   "product": "aastha",
   "isSupported": true
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/aastha",
  bannerImgpath: "https://d229kpbsb5jevy.cloudfront.net/aastha/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/aastha_logo_white.png",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  systemconfigsApi:"/service/api/v1/system/config",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "support.app@aasthatv.co.in",
  header: {
    partners: false,
    languages: false,
    topheader: true,
  },
  signin: {
    primary: "mobile", //email (or) mobile
    emailPhoneToggle: true,
  },
  signup: {
    firstName: true,
    lastName: true,
    confirmPassword: false,
    age: true,
    gender: true,
  },
  profile: {
    type: "password",
    languages: true,
  },
  settings: {
    personal: true,
    email: true,
    mobile: true,
    password: true,
    logout: true,
    unSubscribe: false,
    resubscribe: false,
    showDeleteButtonIos: true,
    showDeleteButtonAndroid: true,
    changePasswordSupport: true,
    userSettings: true,
    activeScreenandDevices: {
      activeDevices: false,
      activeScreens: true,
    },
  },
  search: {
    apiversion: "v1",
  },
};

export default appConfig;
