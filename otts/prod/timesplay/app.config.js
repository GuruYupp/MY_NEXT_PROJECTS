const appConfig = {
  endPoints: {
    location: "https://timesplay-api.revlet.net",
    api: "https://timesplay-api.revlet.net",
    search: "https://timesplay-api.revlet.net",
    pgURL: "https://timesplay-api.revlet.net",
    guideURL: "https://timesplay-api.revlet.net",
    tenantCode: "timesplay",
    product: "timesplay",
    isSupported: true,
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/timesplay",
  bannerImgpath: "https://d229kpbsb5jevy.cloudfront.net/timesplay/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/timesplay/images/logo.svg",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/timesplay/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/timesplay/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  videosuggestionDefaultImg:"",
  systemconfigsApi:"/service/api/v1/system/config",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "info@timesgroup.com",
  header: {
    partners: false,
    languages: true,
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
  },
  search: {
    apiversion: "v1",
  },
};

export default appConfig;
