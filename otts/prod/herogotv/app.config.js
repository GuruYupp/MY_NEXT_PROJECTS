const appConfig={
  "endPoints": {
    "location": "https://herogotv-api.revlet.net",
    "api": "https://herogotv-api.revlet.net",
    "search": "https://herogotv-api.revlet.net",
    "pgURL": "https://herogotv-api.revlet.net",
    "guideURL": "https://herogotv-api.revlet.net",
    "tenantCode": "herogotv",
    "product": "herogotv",
    "isSupported": true
  },
  "cloudpath": 'https://d2ivesio5kogrp.cloudfront.net/static/herogotv',
  "bannerImgpath": 'https://d229kpbsb5jevy.cloudfront.net/herogotv/',
  "headerIconpath": 'https://d2ivesio5kogrp.cloudfront.net/static/herogotv/images/logo.svg',
  "cardDefaultImage": 'https://d2ivesio5kogrp.cloudfront.net/static/herogotv/images/default-details.png',
  "staticImagesPath": 'https://d2ivesio5kogrp.cloudfront.net/static/herogotv/images/',
  "tvguideChannelsImgPath": 'https://d388d59m61mm0v.cloudfront.net/optimized',
  "namePattern": /^[A-Za-z0-9]+$/,
  "authMobilePattern": /^[0-9]{10}$/,
  "authEmailPattern": /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  "header":{
    "partners":false,
    "languages":true,
    "topheader":false,
  },
  "signin": {
    "primary": 'mobile',  //email (or) mobile
    "emailPhoneToggle": false,
  },
  "signup":{
    "firstName":true,
    "lastName":true,
    "confirmPassword":true,
    "age":false,
    "gender":false,
  },
  "profile": {
    "type": 'password',
    "languages": false,
  },
  "settings": {
    "personal": true,
    "email": true,
    "mobile": true,
    "password": true,
    "logout": true,
    "unSubscribe": false,
    "resubscribe": false,
    "showDeleteButtonIos": true,
    "showDeleteButtonAndroid": true,
    "changePasswordSupport":true
  },
  "search":{
    "apiversion":"v1"
  }
}

export default appConfig
