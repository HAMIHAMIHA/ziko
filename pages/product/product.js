const checkout = require('../../templates/checkout/checkout.js');
const offers = require('../../templates/offer/getOffers.js');
const api = require('../../utils/api.js');
const { showLoading } = require('../../utils/common.js');
const { communities } = require('../../utils/constants.js');
const { findIndex } = require('../../utils/util.js');

const app = getApp();
const routes = app.routes;

const getProductDetail = page => {
  showLoading(true);
  const callback = {
    success: res => {
      const list_var = { pack: 'packs', product: 'items' };
      const id = page.options.id;
      const type = page.options.type;

      const community = communities[res[0].community.id];
      const offer_products = res[0].miniprogram;

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
      let total_weight = 0;
      if (type == 'pack') {
        for (var i in product.products) {
          let item = product.products[i];
          total_weight += item.weight * item.quantity;
          product.weight = total_weight;
        }

        if (community != 'cellar' && total_weight > 1000) {
          total_weight = ( total_weight / 1000 ).toFixed(2);
          general_unit = app.globalData.i18n.units.kg;
        }
      }
      
      page.setData({
        _folders: {
          product_picture: app.folders.product_picture,
        },
        "_t.general_unit": general_unit,
        "_t.units": app.globalData.i18n.units[community],
        _setting: {
          community: community,
          type: type,
        },
        offer_id: page.options.offer_id,
        product: product
      })

      showLoading(false);
    }
  }

  api.getOffers(`?id=${ page.options.offer_id }`, callback);
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
        only_left: i18n.only_left,
        pay: i18n.pay,
        price_rules: i18n.price_rules,
        products_left: i18n.products_left,
        related_receipes: i18n.related_receipes,
      }
    })

    getProductDetail(self);
  },

  changeAmount: function(e) {
  },

  checkout: function() {
    checkout.checkoutItems(this, true);
  },
  
  onReachBottom: function() {
    offers.updateReceipes(this);
  },

  onShareAppMessage: function () {}
})