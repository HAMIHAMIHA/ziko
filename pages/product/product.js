const ModifyCart = require('../../templates/offer/modifyCart.js');
const { checkOfferTicket, getRulePrice, getBoursePrice } = require('../../templates/offer/offerRules.js');

const { showLoading } = require('../../utils/common.js');
const { communities } = require('../../utils/constants.js');
const { findIndex, _checkMediaType } = require('../../utils/util.js');

const app = getApp();
const routes = app.routes;

// Get recipes
const _getRecipes = (page, product_item) => {
  let recipes = [];
  const recipeCallback = res => {
    recipes = recipes.concat(res);

    // Check if main picture is video
    recipes.map( r => {
      r.mainPicture = {
        uri: `${ app.folders.recipe_picture }${ r.mainPicture[app.db.get('language')].uri }`,
        type: _checkMediaType(r.mainPicture[app.db.get('language')].type),
        pause: true,
      };
    })

    page.setData({
      recipes: recipes,
    })
    page.selectComponent('#recipes-component').updateRecipes(recipes);
    showLoading(false);
  }

  // Products search
  let products = [];
  let _updateProducts = item => {
    let p_idx = products.findIndex( p => { p === item.product.id });
    if (p_idx === -1) {
      products.push(item.product.id);
    }
  }

  // Packs product
  if (page.options.type == 'pack') {
    product_item.products.forEach(_updateProducts)
  } else {
    _updateProducts(product_item);
  }

  let suffix = `?status=available&sort=["createdAt","DESC"]&filter={"products":{"$in":["${products.join('","')}"]}}`;
  // Get pinned recipes
  app.api.getRecipes({ detail: `${suffix}&pinTop=true` }).then( res => {
    recipes = res;
    // Get rest of recipes
    app.api.getRecipes({ detail: `${suffix}&pinTop=false` }).then(recipeCallback)
  })
}

const getProductDetail = page => {
  showLoading(true);
  const callback = res => {
    const list_var = { pack: 'packs', product: 'items' };
    const offer_id = page.options.offer_id;
    const id = page.options.id;
    const type = page.options.type;

    let offer = res[0];

    const community = communities[offer.community.id];
    const offer_products = offer.miniprogram;
    offer.coming = new Date(offer.startingDate).getTime() > new Date().getTime();

    // Find product index in packs or items
    let product_index = -1;
    let pack_index = 0;
    if (type == 'packProduct') {
      while (product_index < 0) {
        product_index = findIndex(offer_products.packs[pack_index].products, id, '_id');
        product_index == -1 ? pack_index++ : pack_index;
      }
    } else {
      product_index = findIndex(offer_products[list_var[type]], id, '_id');
    }

    let product = (type == 'packProduct') ? offer_products.packs[pack_index].products[product_index] : offer_products[list_var[type]][product_index];

    // Get total weight if pack
    let general_unit = app.globalData.i18n.units[community];
    // let total_weight = 0;
    if (type == 'pack') {
      let weights = {};

      product.products.forEach(item => {
        let weight_total = weights[item.weightType] ? weights[item.weightType] : 0;
        weight_total += item.weight * item.quantity;
        weights[item.weightType] = weight_total;
      })

      if (community != 'cellar' && weights.g >= 1000) {
        weights.kg = Math.round(weights.g / 1000 * 100) / 100;
        delete weights.g;
      }

      product.weights = Object.keys(weights).map((key) => { return { unit: (key), weight: weights[key] }});
    }

    // Get user data
    app.sessionUtils.getUserInfo(page)

    // Check for and Change all free fall product price 
    if (offer.type === "free_fall" && product.freeFall && product.freeFall.quantityTrigger) {
      getRulePrice("free_fall", offer_id, product);
    }

    // Check for multiple price
    if (offer.type === "multiple_items" && product.multipleItem && product.multipleItem.length > 0) {
      getRulePrice("multiple", offer_id, product)
    }

    // Check for bourse
    if (offer.type === 'bourse') {
      offer.sold = 0
      offer.miniprogram.items.forEach( i => {
        offer.sold += (i.stock - i.actualStock);
      })

      getBoursePrice(offer, null);
    }

    // Lottery Ticket amount check
    if (offer.miniprogram.lotteryEnable) {
      checkOfferTicket(page, offer);
    }
    
    page.setData({
      _folders: {
        pack_picture: app.folders.pack_picture,
        product_picture: app.folders.product_picture,
      },
      _offer: offer,
      _pay_set: {
        cart: app.db.get('cart')[offer_id] ? app.db.get('cart')[offer_id].count : 0,
        minimum: {
          price: offer.minimumOrderAmount,
          items: offer.minimumCartItems,
        },
        total: app.db.get('cart')[offer_id] ? app.db.get('cart')[offer_id].total : 0,
        reducedTotal: app.db.get('cart')[offer_id] ? app.db.get('cart')[offer_id].reducedTotal : 0,
      },
      _setting: {
        community: community,
        type: type,
      },
      "_t.general_unit": general_unit,
      "_t.units": app.globalData.i18n.units[community],
      cart: app.db.get('cart')[offer_id],
      product: product,
      product_index: product_index,
    })

    // Get recipes
    _getRecipes(page, product)

    page.setData({
      recipes: {}
    })
  }

  app.api.getOffers(`?id=${ page.options.offer_id }`).then(callback);
}

Page({
  data: {
    _routes: routes,
    _setting: {},
  },

  onShow: function() {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page navbar title
    wx.setNavigationBarTitle({
      title: i18n.product_detail
    })

    // Set page content translation
    self.setData({
      _language: app.db.get('language'),
      _t: {
        available: i18n.available,
        contains_items: i18n.contains_items,
        discover: i18n.discover,
        item_unit: i18n.item_unit,
        items_unit: i18n.items_unit,
        minimum: i18n.minimum,
        no_recipes: i18n.no_recipes,
        only_left: i18n.only_left,
        pay: i18n.pay,
        price_rules: i18n.price_rules,
        products_left: i18n.products_left,
        related_recipes: i18n.related_recipes,
        storage_types: i18n.storage_types,
      },
      _t_recipes: {
        _language: app.db.get('language'),
        baking: i18n.baking,
        minutes: i18n.minutes,
        preparation: i18n.preparation,
      }
    })

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    getProductDetail(self);
  },

  changeAmount: function(e) {
    ModifyCart.modifyCartItems(this, e);
  },

  checkout: function() {
    ModifyCart.checkoutItems(this.options.offer_id);
  },

  // Mobile login
  getPhoneNumber: async function(e) {
    await app.sessionUtils.mobileLogin(this, e.detail.code);
    this.checkout();
  },

  // Get user profile if not logged in
  getUserProfile: function() {
    app.sessionUtils.getWxUserInfo(this);
  },
})