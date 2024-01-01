const appConfig={
  "endPoints": {
    "location": "https://timesnow-test-api.revlet.net",
    "api": "https://timesnow-test-api.revlet.net",
    "search": "https://timesnow-test-api.revlet.net",
    "guideURL": "https://timesnow-test-api.revlet.net",
    "tenantCode": "timesplay",
    "product": "timesplay",
    "isSupported": true
  },
  "cloudpath": 'https://d2ivesio5kogrp.cloudfront.net/static/timesplay',
  "bannerImgpath": 'https://d229kpbsb5jevy.cloudfront.net/timesplay/',
  "headerIconpath": 'https://d2ivesio5kogrp.cloudfront.net/static/timesplay/images/logo.svg',
  "cardDefaultImage": 'https://d2ivesio5kogrp.cloudfront.net/static/timesplay/images/default-details.png',
  "staticImagesPath": 'https://d2ivesio5kogrp.cloudfront.net/static/timesplay/images/',
  "tvguideChannelsImgPath": 'https://d388d59m61mm0v.cloudfront.net/optimized',
  "namePattern": /^[A-Za-z0-9]+$/,
  "authMobilePattern": /^[0-9]{10}$/,
  "authEmailPattern": /^[a-zA-Z0-9_.-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  "header":{
    "partners":false,
    "languages":true,
    "topheader": true,
  },
  "signin": {
    "primary": 'mobile',  //email (or) mobile
    "emailPhoneToggle": true,
  },
}

export default appConfig
