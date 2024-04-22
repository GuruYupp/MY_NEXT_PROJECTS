const appConfig = {
  endPoints: {
    "location": "https://lynktelecom-api.revlet.net",
    "api": "https://lynktelecom-api.revlet.net",
    "search": "https://lynktelecom-api.revlet.net",
    "pgURL": "https://lynktelecom-api.revlet.net",
    "heURL": "https://lynktelecom-api.revlet.net/service/api/v1/usermobile",
    "tenantCode": "lynktelecom",
    "product": "lynktelecom",
    "isSupported": true
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/wassa2",
  bannerImgpath: "https://wassaimages.yuppcdn.net/lynktelecom/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/wassa2/images/Wassa_logo.png",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/wassa2/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/wassa2/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  videosuggestionDefaultImg:"https://d2ivesio5kogrp.cloudfront.net/static/wassa2/images/default-tvshow.jpg",
  systemconfigsApi:"/service/api/v1/system/config?version=v2",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "contact@wassa.tv",
  appDefaultLanguage:"fr",
  localelangs:["en","fr"],
  header: {
    partners: false,
    languages: true,
    topheader: true,
    signup:true,
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
    activeScreenandDevices: {
      activeDevices: false,
      activeScreens: false,
    },
  },
  search: {
    apiversion: "v1",
  },
};

export default appConfig;
