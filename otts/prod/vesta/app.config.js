const appConfig = {
  endPoints: {
      "location": "https://vesta-api.revlet.net",
      "api": "https://vesta-api.revlet.net",
      "search": "https://vesta-api.revlet.net",
      "pgURL": "https://vesta-api.revlet.net",
      "guideURL": "https://vesta-api.revlet.net",
      "heURL": "https://vesta-api.revlet.net",
      "otpURL": "https://vesta-api.revlet.net",
      "tenantCode": "vesta",
      "product": "vesta",
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/vesta",
  bannerImgpath: "https://d229kpbsb5jevy.cloudfront.net/vesta/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/vesta/images/logo.png",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/vesta/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/vesta/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  videosuggestionDefaultImg:"",
  systemconfigsApi:"/service/api/v1/system/config",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "",
  appDefaultLanguage:"en",
  localelangs:["en"],
  header: {
    partners: false,
    languages: true,
    topheader: false,
    signup:true,
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
      activeDevices: true,
      activeScreens: true,
    },
  },
  search: {
    apiversion: "v1",
  },
};

export default appConfig;
