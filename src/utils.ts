import getConfig from 'next/config';

let appConfig = getConfig().publicRuntimeConfig.appconfig;

export function isclient(): boolean {
  return typeof window == 'undefined' ? false : true;
}

export function isserver(): boolean {
  return typeof window == 'undefined' ? true : false;
}

export function getBoxId(): string {
  function GUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    var boxID =
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4();
    return boxID;
  }
  return GUID();
}

export function setSessionToken(key: string, value: any): string | void {
  return localStorage.setItem(key, value);
}

export function getsessionToken(): string | null {
  if (appConfig.sessionId != undefined) {
    return appConfig.sessionId;
  }
  return localStorage.getItem('session-id');
}

export function getFromlocalStorage(key: string): string | null {
  return localStorage.getItem(key);
}

export const getAbsolutPath = (resourcePath: any) => {
  if (
    resourcePath.indexOf('http://') == '0' ||
    resourcePath.indexOf('https://') == '0'
  ) {
    return resourcePath;
  } else if (resourcePath.split(',').length > 1) {
    let arr = resourcePath.split(',');
    let profile = getProfile(arr[0]);
    return profile + arr.slice(1, arr.length).join();
  } else {
    // console.log(getProfile() + resourcePath)
    return getProfile() + resourcePath;
  }
};

const getProfile = (resource?: string) => {
  let resourceProfiles = JSON.parse(
    localStorage.getItem('resourceProfiles') || '{}'
  );
  if (!!resource) {
    for (let i = 0; i < resourceProfiles.length; i++) {
      if (resource === resourceProfiles[i].code) {
        return resourceProfiles[i].urlPrefix;
      }
    }
  } else {
    for (let i = 0; i < resourceProfiles.length; i++) {
      if (resourceProfiles[i].isDefault) {
        return resourceProfiles[i].urlPrefix;
      }
    }
  }
};

export function getplatform() {
  if (window.innerWidth < 950) {
    return 'mobileweb';
  }
  return 'web';
}

export function getDeviceId() {
  if (window.innerWidth < 950) {
    return '61';
  }
  return '5';
}

export function getCardRatio(cardType: string) {
  switch (cardType) {
    case 'roller_poster':
      return 0.6666666666666667;
    case 'overlay_poster':
    case 'overlayIcon_poster':
    case 'sheet_poster':
    case 'expand_poster':
    case 'expands_poster':
    case 'content_poster':
      //0.5625 is the heigth / width value eg(9:16)
      return 0.5625;
    case 'circle_poster':
    case 'square_poster':
      return 1;
    case 'expand_roller_poster':
    case 'roller_poster':
      return 1.5;
    default:
      return 0;
      break;
  }
}

export function debunceFunction(fn: any, ms: number) {
  let timerId: ReturnType<typeof setTimeout>;
  return function (...args: any) {
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      fn(...args);
    }, ms);
  };
}

export function throttelFunction(fn: any, ms: number) {
  let shouldWait: boolean = false;
  return function (...args: any) {
    if (shouldWait) return;
    fn(...args);
    shouldWait = true;
    setTimeout(function () {
      shouldWait = false;
    }, ms);
  };
}

export function cardDimentionsForResponsive(cardType: string): {
  cardCount: number;
  gridCound: number;
  cardRatio: number;
} {
  let windowWidth: number = window.innerWidth;
  // 3:4 === 1.5 ==> 0.66
  // 16:9 ==== 0.5625 ==> (1.75-1.76)
  // largeCards === 16:9 ==> (1.75 - 1.76)
  // windowWidth = window.innerWidth;
  if (
    cardType == 'overlay_poster' ||
    cardType == 'overlayIcon_poster' ||
    cardType == 'sheet_poster' ||
    cardType == 'network_poster' ||
    cardType == 'content_poster' ||
    cardType == 'expands_poster' ||
    cardType == 'expand_poster'
  ) {
    if (windowWidth <= 320) {
      return { cardCount: 2, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 380) {
      return { cardCount: 2.14, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 425) {
      return { cardCount: 2.14, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 480) {
      return { cardCount: 2.14, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 576) {
      return { cardCount: 2.38, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 767) {
      return { cardCount: 2.77, gridCound: 3, cardRatio: 0.5625 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 3, gridCound: 3, cardRatio: 0.5625 };
    } else if (windowWidth <= 1300) {
      return { cardCount: 4, gridCound: 4, cardRatio: 0.5625 };
    } else if (windowWidth <= 1650) {
      return { cardCount: 5, gridCound: 5, cardRatio: 0.5625 };
    } else {
      return { cardCount: 6, gridCound: 6, cardRatio: 0.5625 };
    }
  } else if (cardType == 'roller_poster') {
    if (windowWidth <= 320) {
      return { cardCount: 2.8, gridCound: 2, cardRatio: 1.5 };
    } else if (windowWidth <= 380) {
      return { cardCount: 3.3, gridCound: 3, cardRatio: 1.5 };
    } else if (windowWidth <= 425) {
      return { cardCount: 3.3, gridCound: 3, cardRatio: 1.5 };
    } else if (windowWidth <= 480) {
      return { cardCount: 3.3, gridCound: 3, cardRatio: 1.5 };
    } else if (windowWidth <= 576) {
      return { cardCount: 4.2, gridCound: 4, cardRatio: 1.5 };
    } else if (windowWidth <= 767) {
      return { cardCount: 4.5, gridCound: 4, cardRatio: 1.5 };
    } else if (windowWidth <= 950) {
      return { cardCount: 5, gridCound: 5, cardRatio: 1.5 };
    } else if (windowWidth <= 991) {
      return { cardCount: 5.55, gridCound: 5, cardRatio: 1.5 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 6.2, gridCound: 5, cardRatio: 1.5 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 6.66, gridCound: 6, cardRatio: 1.5 };
    } else if (windowWidth <= 1366) {
      return { cardCount: 7, gridCound: 7, cardRatio: 1.5 };
    } else if (windowWidth <= 1440) {
      return { cardCount: 8, gridCound: 8, cardRatio: 1.5 };
    } else {
      return { cardCount: 8, gridCound: 8, cardRatio: 1.5 };
    }
  } else if (cardType == 'large_poster') {
    if (windowWidth <= 320) {
      return { cardCount: 1.4, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 380) {
      return { cardCount: 1.7, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 425) {
      return { cardCount: 2, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 576) {
      return { cardCount: 2.2, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 767) {
      return { cardCount: 2.8, gridCound: 3, cardRatio: 0.5625 };
    } else if (windowWidth <= 991) {
      return { cardCount: 3.4, gridCound: 3, cardRatio: 0.5625 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 3.8, gridCound: 4, cardRatio: 0.5625 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 4, gridCound: 4, cardRatio: 0.5625 };
    } else if (windowWidth <= 1366) {
      return { cardCount: 4, gridCound: 4, cardRatio: 0.5625 };
    } else if (windowWidth <= 1440) {
      return { cardCount: 4, gridCound: 4, cardRatio: 0.5625 };
    } else {
      return { cardCount: 5, gridCound: 5, cardRatio: 0.5625 };
    }
  }
  // circle poster and Square poster
  else if (cardType == 'icon_poster') {
    if (windowWidth <= 320) {
      return { cardCount: 3, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 380) {
      return { cardCount: 3.6, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 425) {
      return { cardCount: 3.6, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 576) {
      return { cardCount: 3.8, gridCound: 3.8, cardRatio: 1 };
    } else if (windowWidth <= 767) {
      return { cardCount: 5.2, gridCound: 4, cardRatio: 1 };
    } else if (windowWidth <= 991) {
      return { cardCount: 5.8, gridCound: 5, cardRatio: 1 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 6, gridCound: 6, cardRatio: 1 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 6, gridCound: 6, cardRatio: 1 };
    } else if (windowWidth <= 1366) {
      return { cardCount: 7, gridCound: 7, cardRatio: 1 };
    } else if (windowWidth <= 1440) {
      return { cardCount: 8, gridCound: 8, cardRatio: 1 };
    } else {
      return { cardCount: 10, gridCound: 10, cardRatio: 1 };
    }
  }
  // circle poster and Square poster
  else if (cardType == 'square_poster') {
    if (windowWidth <= 320) {
      return { cardCount: 3, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 380) {
      return { cardCount: 3.6, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 425) {
      return { cardCount: 3.6, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 576) {
      return { cardCount: 3.8, gridCound: 3.8, cardRatio: 1 };
    } else if (windowWidth <= 767) {
      return { cardCount: 5.2, gridCound: 4, cardRatio: 1 };
    } else if (windowWidth <= 991) {
      return { cardCount: 5.8, gridCound: 5, cardRatio: 1 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 5, gridCound: 5, cardRatio: 1 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 8, gridCound: 8, cardRatio: 1 };
    } else if (windowWidth <= 1360) {
      return { cardCount: 10, gridCound: 10, cardRatio: 1 };
    } else if (windowWidth <= 1440) {
      return { cardCount: 11, gridCound: 11, cardRatio: 1 };
    } else {
      return { cardCount: 12, gridCound: 12, cardRatio: 1 };
    }
  } else if (cardType == 'circle_poster') {
    if (windowWidth <= 320) {
      return { cardCount: 3, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 380) {
      return { cardCount: 3, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 425) {
      return { cardCount: 3, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 576) {
      return { cardCount: 3, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 767) {
      return { cardCount: 4, gridCound: 4, cardRatio: 1 };
    } else if (windowWidth <= 991) {
      return { cardCount: 4, gridCound: 4, cardRatio: 1 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 5, gridCound: 5, cardRatio: 1 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 8, gridCound: 8, cardRatio: 1 };
    } else if (windowWidth <= 1360) {
      return { cardCount: 10, gridCound: 10, cardRatio: 1 };
    } else if (windowWidth <= 1440) {
      return { cardCount: 11, gridCound: 11, cardRatio: 1 };
    } else {
      return { cardCount: 12, gridCound: 12, cardRatio: 1 };
    }
  }

  // edge poster
  else if (cardType == 'edge_poster') {
    if (windowWidth <= 320) {
      return { cardCount: 2.5, gridCound: 2, cardRatio: 1 };
    } else if (windowWidth <= 380) {
      return { cardCount: 2.5, gridCound: 2, cardRatio: 1 };
    } else if (windowWidth <= 425) {
      return { cardCount: 2.8, gridCound: 2, cardRatio: 1 };
    } else if (windowWidth <= 576) {
      return { cardCount: 3.2, gridCound: 3, cardRatio: 1 };
    } else if (windowWidth <= 767) {
      return { cardCount: 4, gridCound: 4, cardRatio: 1 };
    } else if (windowWidth <= 991) {
      return { cardCount: 4.5, gridCound: 4, cardRatio: 1 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 4.8, gridCound: 5, cardRatio: 1 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 5, gridCound: 5, cardRatio: 1 };
    } else if (windowWidth <= 1366) {
      return { cardCount: 5, gridCound: 5, cardRatio: 1 };
    } else if (windowWidth <= 1440) {
      return { cardCount: 5, gridCound: 5, cardRatio: 1 };
    } else {
      return { cardCount: 6, gridCound: 6, cardRatio: 1 };
    }
  } else if (cardType == 'channel_poster') {
    return {
      cardCount: 6,
      gridCound: 6,
      cardRatio: 0.5625,
    };
  } else if (cardType == 'common_poster') {
    return {
      cardCount: 6,
      gridCound: 6,
      cardRatio: 0.5625,
    };
  } else if (cardType == 'expand_roller_poster') {
    if (windowWidth <= 320) {
      return { cardCount: 2.8, gridCound: 2, cardRatio: 1.5 };
    } else if (windowWidth <= 380) {
      return { cardCount: 3.3, gridCound: 3, cardRatio: 1.5 };
    } else if (windowWidth <= 425) {
      return { cardCount: 3.3, gridCound: 3, cardRatio: 1.5 };
    } else if (windowWidth <= 480) {
      return { cardCount: 3.3, gridCound: 3, cardRatio: 1.5 };
    } else if (windowWidth <= 576) {
      return { cardCount: 4.2, gridCound: 4, cardRatio: 1.5 };
    } else if (windowWidth <= 767) {
      return { cardCount: 4.5, gridCound: 4, cardRatio: 1.5 };
    } else if (windowWidth <= 950) {
      return { cardCount: 5, gridCound: 5, cardRatio: 1.5 };
    } else if (windowWidth <= 991) {
      return { cardCount: 5.55, gridCound: 5, cardRatio: 1.5 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 6.2, gridCound: 5, cardRatio: 1.5 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 6.66, gridCound: 6, cardRatio: 1.5 };
    } else if (windowWidth <= 1500) {
      return { cardCount: 7, gridCound: 7, cardRatio: 1.5 };
    } else {
      return { cardCount: 8, gridCound: 8, cardRatio: 1.5 };
    }
  } else {
    if (windowWidth <= 425) {
      return { cardCount: 2.14, gridCound: 2, cardRatio: 0.5625 };
    } else if (windowWidth <= 576) {
      return { cardCount: 2.38, gridCound: 3, cardRatio: 0.5625 };
    } else if (windowWidth <= 767) {
      return { cardCount: 2.77, gridCound: 5, cardRatio: 0.5625 };
    } else if (windowWidth <= 991) {
      return { cardCount: 4, gridCound: 5, cardRatio: 0.5625 };
    } else if (windowWidth <= 1024) {
      return { cardCount: 4.55, gridCound: 5, cardRatio: 0.5625 };
    } else if (windowWidth <= 1199) {
      return { cardCount: 4.55, gridCound: 4.55, cardRatio: 0.5625 };
    } else if (windowWidth <= 1366) {
      return { cardCount: 5, gridCound: 5, cardRatio: 0.5625 };
    } else if (windowWidth <= 1440) {
      return { cardCount: 6, gridCound: 6, cardRatio: 0.5625 };
    } else {
      return { cardCount: 6, gridCound: 6, cardRatio: 0.5625 };
    }
  }
}
