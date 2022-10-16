const app = getApp();
function _setI18n(component) {
  const {i18n} = app.globalData;
  component.setData({
    _language: app.db.get('language'),
    _t: {
      available_for: i18n.available_for,
      contact_customer_hero: i18n.contact_customer_hero,
      expire_on: i18n.expire_on,
      from: i18n.from,
      get_profile: i18n.get_profile,
      moile_login: i18n.mobile_login,
      need_login: i18n.need_login,
      received: i18n.received,
      select: i18n.select,
      to_order: i18n.to_order,
      voucher_question: i18n.voucher_question,
      voucher_status: i18n.voucher_status,
      ziko: i18n.ziko,
      expires: i18n.expires,
      use_now: i18n.use_now,
      no_vouchers_yet: i18n.no_vouchers_yet,
      its_up_to_you: i18n.its_up_to_you,
      view_ziko_offers: i18n.view_ziko_offers
    },
  })
}
const _getUserProfile = (component) => {
  app.sessionUtils.getWxUserInfo(component);
}
const _getPhoneNumber = async (code, component) => {
  await app.sessionUtils.mobileLogin(component, code);
  component.setData({userLogin: true});
}
Component({
  options: {
    styleIsolation: "apply-shared"
  },
  properties: {},
  data: {
    userLogin: false,
  },
  lifetimes: {
    attached: function () {
      _setI18n(this);
      console.log("attached")
      const {customer} = app.db.get('userInfo');
      console.log("user login-hint", customer);
      if (!customer?.id) this.setData({userLogin: true});
    }
  },
  methods: {
    getUserProfile: function (event) {
      _getUserProfile(this);
    },
    getPhoneNumber: function (event) {
      const { code } = event.detail;
      _getPhoneNumber(code, this);
    }
  },
  observers: {
    "userLogin": function () {
      console.log("userlogin changed to", this.data.userLogin);
      const { userLogin } = this.data;
      this.triggerEvent("refresh", {userLogin});
    }
  }
});

