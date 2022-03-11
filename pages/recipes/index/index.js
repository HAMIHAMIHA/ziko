const app = getApp();

// Set Translation text
const _setTranslation = page => {
  // Translate tabbar
  app.setTabbar();

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
    // _getPageData() // TODO recipes / favourites

  },

  changeRecipes: function() {
    const self = this;

    // self.selectComponent('#recipes-component').updateRecipeList(data);
  },
})