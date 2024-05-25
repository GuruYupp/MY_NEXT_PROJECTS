const appConfig = {
  endPoints: {
    location: "https://firstshows-api.revlet.net",
    api: "https://firstshows-api.revlet.net",
    search: "https://firstshows-api.revlet.net",
    pgURL: "https://firstshows-api.revlet.net",
    heURL: "http://firstshows-api.revlet.net/service/api/v1/usermobile",
    tenantCode: "firstshows",
    product: "firstshows",
    isSupported: true,
    otpURL: "https://firstshows-api.revlet.net",
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/firstshows",
  bannerImgpath: "https://d229kpbsb5jevy.cloudfront.net/firstshows/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/firstshows/images/first-shows-white-logo.png",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/firstshows/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/firstshows/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  videosuggestionDefaultImg: "",
  systemconfigsApi: "/service/api/v1/system/config",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "support@firstshows.com",
  appDefaultLanguage: "en",
  localelangs: ["en"],
  header: {
    partners: false,
    languages: true,
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
    confirmPassword: true,
    age: false,
    gender: false,
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
    profileandparentalcontrol: true,
    activeScreenandDevices: {
      activeDevices: false,
      activeScreens: true,
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
