const appConfig = {
  endPoints: {
    location: "https://api-apac.revlet.net",
    api: "https://api-apac.revlet.net",
    search: "https://api-apac.revlet.net",
    tenantCode: "aastha",
    product: "aastha",
    isSupported: true,
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
  videosuggestionDefaultImg:
    "https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/default-tvshow.jpg",
  systemconfigsApi: "/service/api/v1/system/config",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "support.app@aasthatv.co.in",
  appDefaultLanguage: "en",
  localelangs: ["en"],
  header: {
    partners: false,
    languages: false,
    topheader: {
      show: true,
      postionfixed: true,
    },
    signup: true,
    helpandsupport: true,
    faq: false,
    signout: true,
    becomeourpartner:false,
    aboutus:true
  },
  signin: {
    primary: "mobile", //email (or) mobile
    emailPhoneToggle: true,
  },
  signup: {
    firstName: false,
    lastName: false,
    confirmPassword: false,
    age: false,
    gender: false,
  },
  profile: {
    type: "password",
    languages: true,
  },
  settings: {
    personal: false,
    email: true,
    mobile: true,
    password: true,
    logout: false,
    unSubscribe: false,
    resubscribe: false,
    showDeleteButtonIos: true,
    showDeleteButtonAndroid: true,
    changePasswordSupport: true,
    userSettings: true,
    profileandparentalcontrol: false,
    activeScreenandDevices: {
      activeDevices: false,
      activeScreens: false,
    },
  },
  search: {
    apiversion: "v1",
  },
  parentalconrolpin: {
    forgotpin: false,
  },
  player:{
    startover:true,
    skipintro:true,
    nextepisode:true,
  }
};

export default appConfig;
