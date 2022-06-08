const app = getApp();

const { showLoading } = require('../../../utils/common.js');
const { findIndex } = require('../../../utils/util.js');

const PAGE_RANGE = 20;
let current_load = 0;
let rand_number = -1;

// Set Translation text
const _setTranslation = page => {
  // Translate tabbar
  app.setTabbars();

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
      reset_filters: i18n.reset_filters,
      save_filters: i18n.save_filters,
      try_text: i18n.try_text,
      _language: app.db.get('language'),
    }
  })
}

// Get recipes
const _getRecipes = (page, is_new) => {
  showLoading(true);
  let recipes = page.data.recipes;
  const recipeCallback = res => {
    recipes = recipes.concat(res);
    current_load += res.length;
    if (is_new || rand_number >= recipes.length) {
      rand_number = Math.floor(Math.random() * recipes.length);
    }
    page.selectComponent('#recipes-component').updateRecipes(recipes);

    page.setData({
      recipes,
      sample_name: recipes.length > 0 ? recipes[rand_number].name[app.db.get('language')] : ''
    })
    showLoading(false);
  }


  let search_cases = []; // Used for and operator in suffix
  // Tag search
  let filters = page.data.filters;
  let tags = [];
  if (filters.length > 0) {
    filters.forEach( f => tags.push( f.id ));
    search_cases.push(`{"tags":{"$in":["${tags.join('","')}"]}}`);
  }

  // Keyword search
  let keyword = page.data.keyword;
  if (keyword != "") {
    search_cases.push(`{"$or":[{"name.en":{"$regex":"${keyword}","$options":"i"}},{"name.zh":{"$regex":"${keyword}","$options":"i"}}]}`)
  }

  let suffix = `?status=available&sort=["createdAt","DESC"]`; 
  if (search_cases.length > 0) {
    suffix += `&filter={"$and":[${search_cases.join(',')}]}`;
  }

  // Get pinned recipes
  let next_end = current_load + PAGE_RANGE;

  if (page.data.recipes.length < next_end) {
    app.api.getRecipes({ detail: `${suffix}&pinTop=true&range[${current_load}, ${next_end}]` }).then( res => {
      recipes = res;
      current_load += res.length;

      if (next_end > current_load) {
        // Get rest of recipes
        app.api.getRecipes({ detail: `${suffix}&pinTop=false&range[${current_load}, ${next_end}]` }).then(recipeCallback)
      }
    })
  }
}

// Init get page data
async function _getPageContents(page) {
  showLoading(true);
  await app.api.getRecipeTags().then( res => {
    let categories = [];
    let selected_filters = {};
    res.forEach(tag => {
      let c_idx = findIndex(categories, tag.category.id, 'id');
      if (c_idx === -1) {
        let category = tag.category;
        category.tags = [{
          name: tag.name,
          id: tag.id,
        }];
        categories.push(tag.category);
        selected_filters[category.id] = { [tag.id]: false };
      } else {
        let category = categories[c_idx];
        category.tags.push({
          name: tag.name,
          id: tag.id,
        })

        selected_filters[category.id][tag.id] = false;
      }
    })

    page.setData({
      filter_categories: categories,
      selected_filters: selected_filters,
    })
  })

  _getRecipes(page, true);
}

Page({
  data: {
    choose_filter: false,
    selected_filters: {}, // filter ids for selected style in filter list
    filters: [], 
    keyword: '',
  },

  onLoad: function() {
    const self = this;
    self.setData({
      recipes: [],
      filters:[],
    })
  },

  onShow: function() {
    const self = this;
    _setTranslation(self);
    _getPageContents(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;
  },

  showFilter: function() {
    const self = this;
    self.setData({
      choose_filter: true
    })
  },

  // Close filter slide without saving changes
  hideFilter: function() {
    const self = this;

    // Change selectors to current using
    let categories = self.data.filter_categories;
    let selected = self.data.selected_filters;
    categories.forEach( cat => {
      cat.tags.forEach( tag => {
        selected[cat.id][tag.id] = false;
        if (tag.selected) {
          selected[cat.id][tag.id] = true;
        }
      });
    });

    self.setData({
      choose_filter: false,
      selected_filters: selected,
      _filter_scroll_top: 0,  // scroll filter list to top
    })    
  },

  // Reset all filters to not selected
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

  // Select filters
  selectFilter: function(e) {
    const self = this;
    let selected = self.data.selected_filters;
    Object.entries(selected).forEach( cat => {
      const [c_key, c_val] = cat;
      Object.keys(c_val).forEach( tag => {
        if (e.currentTarget.dataset.cat_id == c_key) {
          if (e.currentTarget.dataset.tag_id == tag) {
            selected[c_key][tag] = !selected[c_key][tag];
          }
        }
      })
    });

    self.setData({
      selected_filters: selected
    })
  },

  // Remove tag
  removeTag: function(e) {
    const self = this;
    let filter_index = e.currentTarget.dataset.filter_index;
    let filter = self.data.filters[filter_index];

    let categories = self.data.filter_categories;
    let c_idx = findIndex(categories, filter.cat_id, 'id');
    let t_idx = findIndex(categories[c_idx].tags, filter.id, 'id');
    categories[c_idx].tags[t_idx].selected = false;

    let selected = self.data.selected_filters;
    selected[filter.cat_id][filter.id] = false;

    let filters = self.data.filters;
    filters.splice(filter_index, 1);

    self.setData({
      categories: categories,
      selected_filters: selected,
      filters: filters,
    })

    self.setData({
      recipes: [],
    })
    current_load = 0;
    _getRecipes(self, false);
  },

  // Save filter with selected tags
  saveFilter: function() {
    const self = this;

    let categories = self.data.filter_categories;
    let selected = self.data.selected_filters;
    let filters = self.data.filters;

    // Change selectors to current using
    categories.forEach( cat => {
      cat.tags.forEach( tag => {
        tag.selected = false;
        let f_idx = filters.findIndex(filter => filter.id === tag.id && filter.cat_id === cat.id);
        if (selected[cat.id][tag.id]) {
          tag.selected = true;
          if (f_idx === -1) {
            let t = tag;
            t.cat_id = cat.id;
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

    self.setData({
      recipes: [],
    })
    current_load = 0;
    _getRecipes(self, false);
  },

  searchKeyword: function() {
    const self = this;
    self.setData({
      recipes: [],
    })
    current_load = 0;
    _getRecipes(self, false);
  },

  onReachBottom: function () {
    _getRecipes(self, false);
  },

  onShareAppMessage: function (res) {},
})