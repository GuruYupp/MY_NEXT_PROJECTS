/* eslint-disable camelcase */
export const packageResponse = {
  status: true,
  response: [
    {
      name: 'VIP',
      saleAmount: 599,
      purchaseDate: 1675677116577,
      paymentProfileId: 1349,
      orderId: 'I595CHIITJTHJ7HN0R',
      currencySymbol: '₹',
      isChangeCardSuports: false,
      features: {},
      gatewayName: 'Razor Pay',
      paymentProfileDetails: {
        profileId: 1349,
        status: 1,
        lastUpdatedDate: 1675677116575,
      },
      expiryDate: 1707213094711,
      gateway: 'razorpay',
      showResubscribe: false,
      code: 'vip',
      packageAmount: 599,
      isFreeTrail: false,
      packageType: '12 Months',
      points: 0,
      id: 180,
      isUnSubscribed: true,
      isRecurring: false,
      changePlanAvailable: false,
      additionalInfo: {},
      message: 'Expires on 06/02/2024',
      customAttributes: {},
      isUpGradeable: false,
      isGracePeriod: false,
      isCurrentlyActivePlan: true,
      effectiveFrom: '',
      gracePeriod: 0,
    },
    {
      name: 'Annual Plan',
      saleAmount: 999,
      purchaseDate: 1690449715916,
      paymentProfileId: 1799,
      orderId: 'EM81U4A3G01071J18B',
      currencySymbol: '₹',
      isChangeCardSuports: true,
      features: {},
      gatewayName: 'Stripe',
      paymentProfileDetails: {
        profileId: 1799,
        expiryDate: '11/2056',
        cardDetail: 'XXXX1111',
        lastUpdatedDate: 1690449715914,
        status: 1,
        cardType: 'visa',
      },
      expiryDate: 1722072100023,
      gateway: 'stripe',
      showResubscribe: false,
      code: 'annual_plan_s',
      packageAmount: 999,
      isFreeTrail: false,
      packageType: '12 Months',
      points: 0,
      id: 223,
      isUnSubscribed: true,
      isRecurring: true,
      changePlanAvailable: false,
      additionalInfo: {},
      message: 'Expires on 27/07/2024',
      customAttributes: {
        '\tserviceCode': '',
        stackable_package: '',
        chargeAmount: '',
        tvod_expiry_duration: '',
        total_recurrence_count: '',
        razorpay_plan_id: 'plan_M45YppeNRe0BSj',
        priceTagDescription: '',
        ' serivceCategory': '',
      },
      isUpGradeable: false,
      isGracePeriod: false,
      isCurrentlyActivePlan: true,
      effectiveFrom: '',
      gracePeriod: 0,
    },
  ],
};
