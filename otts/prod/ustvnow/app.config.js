const appConfig = {
  endPoints: {
    location: "https://teleupapi.revlet.net",
    api: "https://teleupapi.revlet.net",
    search: "https://teleupapi.revlet.net",
    tenantCode: "ustvnow",
    product: "ustvnow",
    isSupported: true,
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/teleup",
  bannerImgpath: "https://d229kpbsb5jevy.cloudfront.net/teleup/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/ustv/images/logo_with_tagline.png",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/teleup/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/teleup/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  videosuggestionDefaultImg: "",
  systemconfigsApi: "/service/api/v1/system/config",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "support@teleup.com",
  appDefaultLanguage: "en",
  localelangs: ["en"],
  header: {
    partners: false,
    languages: false,
    topheader: {
      show: false,
      postionfixed: true,
    },
    signup: true,
    helpandsupport: false,
    faq: false,
    signout: true,
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
};

export default appConfig;
