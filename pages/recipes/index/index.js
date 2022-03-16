const app = getApp();

const { findIndex } = require('../../../utils/util.js');

// Set Translation text
const _setTranslation = page => {
  // Translate tabbar
  app.setTabbar();

  const i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.recipe_list
  })

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
  data: {
    choose_filter: false,
    selected_filters: {}, // filter ids for selected style in filter list
    filters: [],
  },

  onLoad: function() {
    const self = this;
    self.setData({
      recipes: {},
      filters:[{"name":{"zh":"name1","en":"name1"},"_id":1, cat_id:1}],
      filter_categories: [
        {"name":{"zh":"cat1","en":"cat1"},"tags":[{"name":{"zh":"name1","en":"name1"},"_id":1},{"name":{"zh":"name2","en":"name2"},"_id":2},{"name":{"zh":"name3","en":"name3"},"_id":3},{"name":{"zh":"name4","en":"name4"},"_id":4},{"name":{"zh":"name5","en":"name5"},"_id":5},{"name":{"zh":"name6","en":"name6"},"_id":6},{"name":{"zh":"name7","en":"name7"},"_id":7},{"name":{"zh":"name8","en":"name8"},"_id":8}],"_id":1},{"name":{"zh":"cat2","en":"cat2"},"tags":[{"name":{"zh":"name1","en":"name1"},"_id":1},{"name":{"zh":"name2","en":"name2"},"_id":2},{"name":{"zh":"name3","en":"name3"},"_id":3},{"name":{"zh":"name4","en":"name4"},"_id":4},{"name":{"zh":"name5","en":"name5"},"_id":5},{"name":{"zh":"name6","en":"name6"},"_id":6},{"name":{"zh":"name7","en":"name7"},"_id":7},{"name":{"zh":"name8","en":"name8"},"_id":8}],"_id":2},{"name":{"zh":"cat3","en":"cat3"},"tags":[{"name":{"zh":"name1","en":"name1"},"_id":1},{"name":{"zh":"name2","en":"name2"},"_id":2},{"name":{"zh":"name3","en":"name3"},"_id":3},{"name":{"zh":"name4","en":"name4"},"_id":4},{"name":{"zh":"name5","en":"name5"},"_id":5},{"name":{"zh":"name6","en":"name6"},"_id":6},{"name":{"zh":"name7","en":"name7"},"_id":7},{"name":{"zh":"name8","en":"name8"},"_id":8}],"_id":3},{"name":{"zh":"cat4","en":"cat4"},"tags":[{"name":{"zh":"name1","en":"name1"},"_id":1},{"name":{"zh":"name2","en":"name2"},"_id":2},{"name":{"zh":"name3","en":"name3"},"_id":3},{"name":{"zh":"name4","en":"name4"},"_id":4},{"name":{"zh":"name5","en":"name5"},"_id":5},{"name":{"zh":"name6","en":"name6"},"_id":6},{"name":{"zh":"name7","en":"name7"},"_id":7},{"name":{"zh":"name8","en":"name8"},"_id":8}],"_id":4},{"name":{"zh":"cat5","en":"cat5"},"tags":[{"name":{"zh":"name1","en":"name1"},"_id":1},{"name":{"zh":"name2","en":"name2"},"_id":2},{"name":{"zh":"name3","en":"name3"},"_id":3},{"name":{"zh":"name4","en":"name4"},"_id":4},{"name":{"zh":"name5","en":"name5"},"_id":5},{"name":{"zh":"name6","en":"name6"},"_id":6},{"name":{"zh":"name7","en":"name7"},"_id":7},{"name":{"zh":"name8","en":"name8"},"_id":8}],"_id":5}
      ],
      selected_filters: {
        "1":{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false},"2":{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false},"3":{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false},"4":{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false},"5":{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false}
      }
    })
  },

  onShow: function() {
    const self = this;
    _setTranslation(self);
    // _getPageData() // TODO recipes / favourites

  },

  showFilter: function() {
    const self = this;
    self.setData({
      choose_filter: true
    })
  },

  hideFilter: function() {
    const self = this;

    // Change selectors to current using
    let categories = self.data.filter_categories;
    let selected = self.data.selected_filters;
    categories.forEach( cat => {
      cat.tags.forEach( tag => {
        selected[cat._id][tag._id] = false;
        if (tag.selected) {
          selected[cat._id][tag._id] = true;
        }
      });
    });

    self.setData({
      choose_filter: false,
      selected_filters: selected,
      _filter_scroll_top: 0,  // scroll filter list to top
    })    
  },

  resetFilters: function() {
    const self = this;
    let selected = self.data.selected_filters;
    Object.entries(selected).forEach( cat => {
      const [c_key, c_val] = cat;
      Object.keys(c_val).forEach( tag => {
        selected[c_key][tag] = false;
      });
    });

    self.setData({
      selected_filters: selected
    })
  },

  selectFilter: function(e) {
    const self = this;
    let selected = self.data.selected_filters;
    Object.entries(selected).forEach( cat => {
      const [c_key, c_val] = cat;
      Object.keys(c_val).forEach( tag => {
        if (e.currentTarget.dataset.cat_id == c_key) {
          selected[c_key][tag] = false;
          if (e.currentTarget.dataset.tag_id == tag) {
            selected[c_key][tag] = true;
          }
        }
      })
    });

    self.setData({
      selected_filters: selected
    })
  },

  removeTag: function(e) {
    const self = this;
    let filter_index = e.currentTarget.dataset.filter_index;
    let filter = self.data.filters[filter_index];

    let categories = self.data.filter_categories;
    let c_idx = findIndex(categories, filter.cat_id, '_id');
    let t_idx = findIndex(categories[c_idx].tags, filter._id, '_id');
    categories[c_idx].tags[t_idx].selected = false;

    let selected = self.data.selected_filters;
    selected[filter.cat_id][filter._id] = false;

    let filters = self.data.filters;
    filters.splice(filter_index, 1);

    self.setData({
      categories: categories,
      selected_filters: selected,
      filters: filters,
    })

    // TODO update recipe
  },
  
  saveFilter: function() {
    const self = this;

    let categories = self.data.filter_categories;
    let selected = self.data.selected_filters;
    let filters = self.data.filters;

    // Change selectors to current using
    categories.forEach( cat => {
      cat.tags.forEach( tag => {
        tag.selected = false;
        let f_idx = filters.findIndex(filter => filter._id === tag._id && filter.cat_id === cat._id);
        if (selected[cat._id][tag._id]) {
          tag.selected = true;
          if (f_idx === -1) {
            let t = tag;
            t.cat_id = cat._id;
            filters.push(t)
          }
        } else {
          if (f_idx > -1) {
            filters.splice(f_idx, 1);
          }
        }
      });
    });

    self.setData({
      choose_filter: false,
      filter_categories: categories,
      filters: filters,
    });

    // TODO get recipes, change Recipe

    
  },

  searchKeyword: function() {

  },

  changeRecipes: function() {
    const self = this;

    // self.selectComponent('#recipes-component').updateRecipeList(data);
  },
})