const appConfig = {
  endPoints: {
    // "location": "https://dishtv-uatapi.revlet.net",
    // "api": "https://dishtv-uatapi.revlet.net",
    // "search": "https://dishtv-uatapi.revlet.net",
    // "pgURL": "https://dishtv-uatapi.revlet.net",
    // "guideURL": "https://dishtv-uatapi.revlet.net",
    // "referralURL": "http://3.6.152.69:8088",
    // "myReco": "http://13.232.120.244",
    // "tenantCode": "dishtv",
    // "product": "dishtv",
    // "isSupported": true
    "location": "https://dishtv-api.revlet.net",
	"api": "https://dishtv-api.revlet.net",
	"search": "https://dishtv-searchapi.revlet.net",
	"pgURL": "https://dishtv-pgapi.revlet.net",
	"guideURL": "https://dishtv-api.revlet.net",
	"referralURL": "https://dishtv-referrerservice.revlet.net",
	"tenantCode": "dishtv",
	"product": "dishtv",
	"isSupported": true
  },
  cloudpath: "https://d2ivesio5kogrp.cloudfront.net/static/watcho",
  bannerImgpath: "https://d229kpbsb5jevy.cloudfront.net/watcho/",
  headerIconpath:
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/logo.svg",
  cardDefaultImage:
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/default-details.png",
  staticImagesPath:
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/",
  tvguideChannelsImgPath: "https://d388d59m61mm0v.cloudfront.net/optimized",
  videosuggestionDefaultImg:"",
  systemconfigsApi:"/service/api/v1/system/config?version=v2",
  namePattern: /^[A-Za-z0-9]+$/,
  authMobilePattern: /^[0-9]{10}$/,
  authEmailPattern:
    /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  supportmail: "",
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
    email: false,
    mobile: false,
    password: false,
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
