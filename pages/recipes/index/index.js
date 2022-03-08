const app = getApp();

// Set Translation text
const _setTranslation = page => {
  const i18n = app.globalData.i18n;

  page.setData({
    _t: {
      baking: i18n.baking,
      min: i18n.min,
      preparation: i18n.preparation,
      _language: app.db.get('language'),
    }
  })
}

Page({
  onLoad: function() {
    const self = this;
    self.setData({
      recipes: {}
    })
  },

  onShow: function() {
    const self = this;
    _setTranslation(self);

    self.updatePageLanguage();
  },

  updatePageLanguage: function() {
    const self = this;

    // Translate tabbar
    app.setTabbar();

    // Translation and default values
    let i18n = app.globalData.i18n;
    self.setData({
      _t: {
        _language: app.db.get('language'),
        baking: i18n.baking,
        minutes: i18n.minutes,
        preparation: i18n.preparation,
      }
    })
  },

  changeRecipes: function() {
    const self = this;

    // self.selectComponent('#recipes-component').updateRecipeList(data);
  },
})