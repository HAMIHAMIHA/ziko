const app = getApp();

const { showLoading } = require('../../../utils/common.js');

const PAGE_RANGE = 20;
let current_load = 0;

// Set Translation text
const _setTranslation = page => {
  const i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.recipe_list
  })

  page.setData({
    _t: {
      baking: i18n.baking,
      minutes: i18n.minutes,
      no_recipe_found: i18n.no_recipe_found,
      preparation: i18n.preparation,
      _language: app.db.get('language'),
    }
  })
}

// Get recipes
const _getRecipes = (page) => {
  showLoading(true);
  let recipes = page.data.recipes;
  const recipeCallback = res => {
    recipes = recipes.concat(res.filter(r => { return r.status === "available" }));
    current_load = recipes.length;
    page.selectComponent('#recipes-component').updateRecipes(recipes);
    page.setData({
      recipes,
    })
    showLoading(false);
  }

  // Get favourites recipes
  let next_end = current_load + PAGE_RANGE;
  if (page.data.recipes.length < next_end) {
    app.api.getRecipeLikes({ detail: `?range=[${current_load}, ${next_end}]` }).then(recipeCallback)
  }
}

Page({
  onLoad: function() {
    const self = this;
    self.setData({
      recipes: [],
    })
  },

  onShow: function() {
    const self = this;
    _setTranslation(self);
    _getRecipes(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;
  },

  onReachBottom: function () {
    _getRecipes(self);
  },
})