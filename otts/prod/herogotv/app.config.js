const appConfig = {
  endPoints: {
    location: "https://herogotv-api.revlet.net",
    api: "https://herogotv-api.revlet.net",
    search: "https://herogotv-api.revlet.net",
    pgURL: "https://herogotv-api.revlet.net",
    guideURL: "https://herogotv-api.revlet.net",
    tenantCode: "herogotv",
    product: "herogotv",
    isSupported: true,
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/herogotv",
  bannerImgpath: "https://d229kpbsb5jevy.cloudfront.net/herogotv/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/herogotv/images/logo.svg",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/herogotv/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/herogotv/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  videosuggestionDefaultImg: "",
  systemconfigsApi: "/service/api/v1/system/config",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "",
  appDefaultLanguage: "en",
  localelangs: ["en"],
  header: {
    partners: false,
    languages: true,
    topheader: {
      show: false,
      postionfixed: true,
    },
    signup: true,
    helpandsupport: true,
    faq: false,
    signout: true,
  },
  signin: {
    primary: "mobile", //email (or) mobile
    emailPhoneToggle: false,
  },
  signup: {
    firstName: true,
    lastName: true,
    confirmPassword: true,
    age: false,
    gender: false,
  },
  profile: {
    type: "password",
    languages: false,
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
    userSettings: false,
    profileandparentalcontrol: true,
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
