export interface initJsoninterface {
  api: string;
  heURL: string;
  isSupported: boolean;
  location: string;
  otpURL: string;
  pgURL: string;
  product: string;
  search: string;
  tenantCode: string;
}

export interface responseInterface {
  status: boolean;
  response?: any;
  error?: {
    code: number;
    type: string;
    message: string;
    details: any;
    actionCode?: number;
  };
}

export interface configsandfeaturesInterface extends responseInterface {
  expireTime?: number;
}

export interface menuInterface {
  code: string;
  description: string;
  displayText: string;
  geoRuleId: number;
  iconUrl: string;
  isClickable: boolean;
  params: {
    web?: string;
  };
  subMenus: menuInterface[];
  targetPath: string;
  targetType: string;
}

export interface bannerInterface {
  subtitle?: string;
  title?: string;
  buttonText?: string;
  code?: string;
  id?: number;
  imageUrl: string;
  isInternal?: boolean;
  metadata?: {};
  params?: {
    licenseKey?: string;
    streamProvider?: string;
    streamUrl?: string;
  };
  target?: {
    pageAttributes?: any;
    pageType?: string;
    path?: string;
  };
}

export type typeofcardType =
  | "expands_poster"
  | "overlay_poster"
  | "sheet_poster"
  | "expand_poster"
  | "content_poster"
  | "circle_poster"
  | "expand_roller_poster"
  | "roller_poster"
  | "square_poster"
  | "promo_poster"
  | "overlayIcon_poster";

export type templateType = "channel_overlay" | "tvguide_overlay" | "";

export interface pageAttributesInterface {
  isDeeplinking?: "false" | "true";
  tvShowName?: string;
  ContentAccessErrorMessage?: string;
  genre?: string;
  CreditEndTime?: string;
  SignAndSignupErrorMessage?: string;
  recommendationText?: string;
  seasonSeqNo?: string;
  RentErrorMessage?: string;
  RentAndSubscribeErrorMessag?: string;
  targetMenuCode?: string;
  "pgRatingTitle<condition>{pgRating}!="?: string;
  contentType?: string;
  payType?: string;
  creditsStartTime?: string;
  showNextButton?: "false" | "true";
  mediaContentType?: string;
  SubscribeErrorMessage?: string;
  networkName?: string;
  showOnPlayer?: string;
  nextButtonTitle?: string;
  episodeSeqNo?: string;
}

export interface cardInterface {
  hover: {
    elements: {
      key: string;
      value: string;
      elementType: string;
      icon: string;
    }[];
  };
  metadata: {};
  target: {
    path: string;
    pageType: string;
    pageAttributes: pageAttributesInterface;
  };
  cardType: typeofcardType;
  display: {
    subtitle5?: string;
    subtitle3?: string;
    parentIcon?: string;
    subtitle2?: string;
    markers: {
      bgColor?: string;
      markerType?: string;
      textColor?: string;
      value?: string;
    }[];
    partnerIcon?: string;
    parentName?: string;
    subtitle1?: string;
    subtitle4?: string;
    layout?: string;
    title?: string;
    imageUrl?: string;
  };
  template?: templateType;
}

export interface sectionInterface {
  contentCode: string;
  paneType: string;
  section: {
    sectionInfo: {
      name: string;
      description: string;
      dataSubType: string;
      bannerImage: string;
      code: string;
      dataType: string;
      imageUrl: string;
      iconUrl: string;
    };
    sectionControls: {
      infiniteScroll: true | false;
      showViewAll: true | false;
      viewAllTargetPath: string;
    };
    sectionData: {
      data: cardInterface[];
      dataRequestDelay: number;
      hasMoreData: false | true;
      section: string;
      lastIndex: number;
      params?: {
        showOnPlayer: "true" | "false";
      };
    };
  };
}

export interface seoInterface {
  title?: string;
  description?: string;
  keywords?: string;
  metaTags?: {
    tagType?: string;
    tagName?: string;
    content?: string;
  }[];
}

export interface paginationsectionInterface {
  sectionindex: number;
  data: sectionInterface;
}

export interface dataRowElementInterface {
  elementSubtype?: string;
  contentCode?: string;
  data?: string;
  rowNumber?: number;
  columnSpan?: number;
  id?: number;
  columnNumber?: number;
  displayConditionExpr?: string;
  rowSpan?: number;
  target?: string;
  isClickable?: boolean;
  elementType?: string;
}

export interface dataRowInterface {
  rowDataType?: string;
  rowNumber?: number;
  elements?: dataRowElementInterface[];
}
export interface contentInterface {
  contentCode?: string;
  paneType?: string;
  content?: {
    backgroundImage?: string;
    posterImage?: string;
    title?: string;
    dataRows?: dataRowInterface[];
  };
}

export interface pageTabInterface {
  code: string;
  infiniteScroll: boolean;
  sectionCodes: string | string[];
  title: string;
}

export interface pageState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  pagination: "idle" | "pending" | "succeeded" | "failed";
  response: {
    banners: bannerInterface[];
    sections: sectionInterface[];
    info: {
      attributes?: any;
      code?: string;
      pageType?: string;
      path?: string;
    };
    content: contentInterface[];
    paginationData: paginationsectionInterface[];
    pageButtons: any;
    shareInfo: {
      description?: string;
      imageUrl?: string;
      isSharingAllowed?: boolean;
      name?: string;
    };
    tabsInfo: {
      hints: string;
      selectTab: string;
      showTabs: boolean;
      tabs: pageTabInterface[];
    };
    streamStatus: streamStatusInterface;
  };
}

export interface useDetailsInterface {}

export interface contentLanguageInterface {
  name: string;
  priority: number;
  description: string;
  pageAttributes: {};
  bannerUrl: string;
  code: string;
  symbol: string;
  id: 1;
  displayText: string;
  targetType: string;
  targetPath: string;
  imageUrl: string;
}

export interface resourceProfileInterface {
  code: string;
  isDefault: boolean;
  urlPrefix: string;
}

export interface networkInterface {
  bannerImageUrl: string;
  name: string;
  deeplinkInfo: string;
  code: string;
  id: number;
  customAttributes: {
    isDeepLinkingTrailer: string;
    isDeepLinkingmobisode: string;
    partnerCode: string;
    isDeepLinkingClip: string;
    isDeepLinkingPromo: string;
    needSubscriptionForTrailer: string;
    isDeepLinkingwebisode: string;
    isDeepLinkingPreview: string;
  };
  imageUrl: string;
  iconUrl: string;
}

interface systemconfigsInterface {
  clientConfigs?: {};
  configs?: {
    [key: string]: string;
  };
  contentLanguages?: contentLanguageInterface[];
  resourceProfiles?: resourceProfileInterface[];
  langSelectionAttributes?: {
    isMultiSelectable: boolean;
    forceSelection: boolean;
    minSelectable: number;
    maxSelectable: number;
  };
  networks?: networkInterface[];
  menus?: menuInterface[];
}

export interface templateresponseInterface {
  addFavourite?: string;
  description?: string;
  favourite?: string;
  image?: string;
  isFavourite?: string;
  name?: string;
  networkIcon?: string;
  removeFavourite?: string;
  share?: string;
  shareDescription?: string;
  shareImageUrl?: string;
  shareName?: string;
  show_addFavourite?: string;
  show_description?: string;
  show_favourite?: string;
  show_image?: string;
  show_name?: string;
  show_networkIcon?: string;
  show_removeFavourite?: string;
  show_share?: string;
  show_signin?: string;
  show_subscribe?: string;
  show_subtitle?: string;
  show_watchlive?: string;
  signin?: string;
  subscribe?: string;
  subtitle?: string;
  target_addFavourite?: string;
  target_description?: string;
  target_favourite?: string;
  target_image?: string;
  target_name?: string;
  target_networkIcon?: string;
  target_removeFavourite?: string;
  target_share?: string;
  target_signin?: string;
  target_subscribe?: string;
  target_subtitle?: string;
  target_watchlive?: string;
  watchlive?: string;
}

export interface subprofileInterface {
  profileId?: number;
  name?: string;
  isChildren?: boolean;
  isPinExpired?: boolean;
  profileRating?: string;
  addProfilePinEnable?: boolean;
  isProfileLockActive?: boolean;
  isMasterProfile?: boolean;
  isPinAvailable?: boolean;
  isParentalControlEnabled?: boolean;
  profileRatingDesc?: string;
  profileRatingId?: number;
  imageUrl?: string;
  langs?: string;
}

export interface userDetailsInterface {
  profileId?: number;
  name?: string;
  swagToken?: string;
  sessionDetails?: {
    clientAppVersion?: string;
    loginStatus?: number;
    timezone?: string;
    boxId?: string;
    displayLangCode?: string;
    sessionId?: string;
    deviceSubtype?: string;
    deviceId?: number;
    contentLangCodes?: string;
    productCode?: string;
  };
  phoneNumber?: string;
  authToken?: string;
  email?: string;
  isEmailVerified?: boolean;
  dob?: number;
  profileParentalDetails?: subprofileInterface[];
  credits?: 0;
  age?: number;
  attributes?: {
    networks?: string;
  };
  userCategory?: number;
  lastName?: string;
  firstName?: string;
  languages?: string;
  externalUserId?: number;
  isFreetrialAvailed?: boolean;
  status?: number;
  message?: string;
  userId?: number;
  hasPassword?: boolean;
  isPhoneNumberVerified?: boolean;
  packages?: {
    name?: string;
    geoRuleId?: number;
    orderId?: string;
    expiryDate?: number;
    gateway?: string;
    mpId?: number;
    id?: number;
    status?: string;
    gracePeriodInMilliSec?: number;
    effectiveFrom?: number;
  }[];
  loginMode?: number;
  gender?: string;
}
//stream data interfaces...
export interface StreamInteface {
  attributes?: {
    mimeType?: string;
  };
  isDefault?: boolean;
  isTrailer?: boolean;
  keys?: {
    licenseKey?: string;
    certificate?: string;
  };
  params?: {
    sessionid?: string;
    token?: string;
  };
  streamType?: string;
  url?: string;
}

export interface streamStatusInterface {
  errorCode?: number;
  hasAccess?: boolean;
  isParentControlled?: boolean;
  message?: string;
  previewStreamStatus?: boolean;
  seekPositionInMillis?: number;
  totalDurationInMillis?: number;
  trailerStreamStatus?: boolean;
}

export interface streamDataIterface {
  streamapiloading: "idle" | "pending" | "succeeded" | "failed";
  response: {
    analyticsInfo?: {
      contentType?: string;
      customData?: string;
      dataKey?: string;
      dataType?: string;
      id?: number;
      packageType?: string;
    };
    count?: number;
    maxBitrateAllowed?: number;
    pageAttributes?: pageAttributesInterface;
    streamStatus?: streamStatusInterface;
    streams?: StreamInteface[];
  };
  error: {
    code?: number;
    details?: any;
    message?: string;
    type?: string;
  };
}

//guide interfaces....
export interface channelInterface {
  id: number;
  display: {
    imageUrl?: string;
    subtitle1?: String;
    subtitle2?: string;
    subtitle3?: string;
    title?: string;
    markers?: {
      special?: {
        value?: string;
      };
    };
  };
  metadata: {
    id?: string;
    monochromeImage?: string;
  };
  target: {
    path?: string;
    pageType?: string;
    pageAttributes?: pageAttributesInterface;
  };
  template?: string;
}

export interface channelsDataInterface {
  channelId: number;
  programs: {
    id: number;
    display: {
      imageUrl?: string;
      subtitle1?: String;
      subtitle2?: string;
      subtitle3?: string;
      title?: string;
      markers?: {
        special?: {
          value?: string;
        };
        endTime?: {
          value?: string;
        };
        startTime?: {
          value?: string;
        };
      };
    };
    metadata: {
      id?: string;
    };
    target: {
      path: string;
      pageType?: string;
      pageAttributes?: pageAttributesInterface;
    };
    template?: templateType;
  }[];
}

export interface tvguidestateInterface {
  title: string;
  channelsIdState: "pending" | "failed" | "succeeded" | "idle";
  channelsdataState: "pending" | "failed" | "succeeded" | "idle";
  channelIds: channelInterface[];
  paginationchannelIds: channelInterface[];
  channelsData: channelsDataInterface[];
  tabs: {
    endTime?: number;
    isSelected?: boolean;
    startTime?: number;
    subtitle?: string;
    title?: string;
  }[];
  selectedTab: {
    endTime?: number;
    isSelected?: boolean;
    startTime?: number;
    subtitle?: string;
    title?: string;
  };
  page: number;
}

//payments.....

export interface plansInterface {
  name: string;
  saleAmount: number;
  purchaseDate: number;
  paymentProfileId: number;
  orderId: string;
  currencySymbol: string;
  isChangeCardSuports: boolean;
  features: {};
  gatewayName: string;
  paymentProfileDetails: {
    profileId: number;
    expiryDate: string;
    cardDetail: string;
    lastUpdatedDate: number;
    status: number;
    cardType: string;
  };
  expiryDate: string;
  gateway: string;
  showResubscribe: boolean;
  code: string;
  packageAmount: number;
  isFreeTrail: boolean;
  packageType: string;
  points: number;
  id: number;
  isUnSubscribed: boolean;
  isRecurring: boolean;
  changePlanAvailable: boolean;
  additionalInfo: {};
  message: string;
  customAttributes: {
    serviceCode: string;
    stackable_package: string;
    chargeAmount: string;
    tvod_expiry_duration: string;
    total_recurrence_count: string;
    razorpay_plan_id: string;
    priceTagDescription: string;
    serivceCategory: string;
  };
  isUpGradeable: boolean;
  isGracePeriod: boolean;
  isCurrentlyActivePlan: boolean;
  effectiveFrom: string;
  gracePeriod: string;
}

//search page interfaces
export interface v3bucketsInterface {
  lastDoc: string;
  lastSearchOrder: "typesense" | "done";
  searchResults: {
    sourceType: string;
    displayName: string;
    count: number;
    data: cardInterface[];
    pagination: "pending" | "idle" | "fulfilled" | "rejected";
  };
  error?: {
    code?: number;
    message?: string;
    details?: {};
    type?: string;
  };
}

export interface v1bucketsInterface {
  searchResults: {
    sourceType: string;
    displayName: string;
    count: number;
    data: cardInterface[];
  };
  error?: {
    code?: number;
    message?: string;
    details?: {};
    type?: string;
  };
}

export interface searchtabInterface {
  displayName: string;
  code: string;
}

export interface searchv3Interface {
  searchtext: string;
  suggestions: {
    isloading: "pending" | "idle" | "fulfilled" | "rejected";
    data: string[];
    error: any;
    show: boolean;
  };
  showSections: boolean;
  activeTab: searchtabInterface;
  tabsdata: v3bucketsInterface[];
  searchResultstate: "pending" | "idle" | "fulfilled" | "rejected";
}

export interface searchv1Interface {
  searchtext: string;
  suggestions: {
    isloading: "pending" | "idle" | "fulfilled" | "rejected";
    data: string[];
    error: any;
    show: boolean;
  };
  showSections: boolean;
  activeTab: searchtabInterface;
  tabsdata: v1bucketsInterface[];
  searchResultstate: "pending" | "idle" | "fulfilled" | "rejected";
  pagination: "idle" | "pending" | "succeeded" | "failed";
  pagesize: number;
}

export type SSOParamsType = {
  ut: ReturnType<typeof encodeURI>;
};

export type profileRatingType = {
  name: string;
  priority: number;
  displayCode: string;
  description: string;
  pinRequiredRatings: string;
  id: number;
  imageUrl: string;
};
