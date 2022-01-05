const app = getApp();
const translate = require('../../../utils/internationalize/translate.js'); // 翻译功能

const updatePageLanguage = page => {
  let i18n = app.globalData.i18n;
  console.log(i18n);

  // Set tabbar translation
  app.setTabbar();

  // Set page translation
  page.setData({
    _t: {
      account_ranking: i18n.account_ranking,
      claims: i18n.claims,
      contact: i18n.contact,
      edit_my_address: i18n.edit_my_address,
      edit_my_info: i18n.edit_my_info,
      en: i18n.en,
      fapiao_info: i18n.fapiao_info,
      login: i18n.login,
      my_favorite_recipes: i18n.my_favorite_recipes,
      orders: i18n.orders,
      vouchers: i18n.vouchers,
      zh: i18n.zh,
    },
    language: app.db.get('language')
  })
}

Page({
  data: {
    _routes: {
      account_info: app.routes.account_info,
      fapiao: app.routes.fapiao,
      address: app.routes.address,
      orders: app.routes.orders
    }
  },

  onShow: function () {
    const self = this;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: ''
    })

    // Set page translation
    updatePageLanguage(self);

    // Get user info
    let user = app.db.get('userInfo');
    if (!user) { return; }

    // Set page Data
    self.setData({
      user: user
    })
  },

  switchLanguage: function(e) {
    const self = this;

    let new_language = e.currentTarget.dataset.language;
    if (app.db.get('langugae') != new_language) {
      app.globalData.i18n = translate.change(new_language);
      updatePageLanguage(self);
      // TODO update user database
    }
  }
})