import { getUserInfo, showLoading } from "../../utils/common";
import { communities } from "../../utils/constants";
import { findIndex } from "../../utils/util";

const app = getApp();

// Clear countdown timer interval
export const _clearCountdown = (page, countdown_timer) => {
  let timer = page.selectComponent('#countdown');
  timer.setTimer(countdown_timer, false);
  return [];
}

// Get page translations
export const _getTranslations = (page, community) => {
  let i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.offer
  })

  // Set page content translation
  page.setData({
    _language: app.db.get('language'),
    _t: {
      item_unit: i18n.item_unit,
      items: i18n.items,
      minimum: i18n.minimum,
      order_unit: i18n.order_unit,
      orders_unit: i18n.orders_unit,
      our_selected_packs: i18n.our_selected_packs,
      pay: i18n.pay,
      price_rules: i18n.price_rules,
      products: i18n.products,
      receipes: i18n.receipes,
      related_receipes: i18n.related_receipes,
      remaining_time: i18n.remaining_time,
      single_items: i18n.single_items,
      total_units_available: i18n.total_units_available,
      viewers: i18n.viewers,
    },
    _t_product: {
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      available: i18n.available,
      only_left: i18n.only_left,
      products_left: i18n.products_left,
      storage_types: i18n.storage_types,
      units: i18n.units[community],
    }
  })
}

// Modify for pack product
export const packProductDetail = function(offer) {
  let units = app.globalData.i18n.units[offer.community];
  let item_unit = app.globalData.i18n.item_unit;
  let items_unit = app.globalData.i18n.items_unit;

  offer.miniprogram.packs.map( item => {
    let details = [];
    item.products.forEach( product => {
      details.push(
        `${product.product.name[app.db.get('language')]} ${ product.quantity ? product.quantity : '' }${ product.quantity && product.weight ? 'x' : '' }${ product.weight ? `${product.weight}` : '' }${ product.weight ? units : product.quantity == 1 ? item_unit : items_unit }`
      );
    })
    item.products_info = details.join(', ');
  })
  return offer;
}

// Get Offer
export const getOffer = function(page, offer_id) {
  showLoading(true);

  const callback = res => {
    let offer = res[0];
    offer.community = communities[offer.community.id];
    offer = packProductDetail(offer);

    getUserInfo(page);

    page.setData({
      _folders: {
        offer_media: app.folders.offer_media,
      },
      _offer_setting: {
        folders: {
          product_picture: app.folders.product_picture
        },
        language: app.db.get('language'),
        routes: {
          product: app.routes.product
        },
      },
      /* data="{{ _pay_set: _pay_set, original_price: original_price, tickets: tickets, special: '', _t: _t }}" */
      _pay_set: {
        cart: app.db.get('cart')[offer.id] ? app.db.get('cart')[offer.id].count : 0,
        minimum: {
          price: offer.minimumOrderAmount,
          items: offer.minimumCartItems,
        },
        total: app.db.get('cart')[offer.id] ? app.db.get('cart')[offer.id].total : 0,
      },
      _offer: offer,
      cart: app.db.get('cart')[offer.id],
    })

    // Change page translation
    _getTranslations(page, offer.community);
    page.startCountdown();
    showLoading(false);

    // Update quantity button setting
    let quantity_changers = page.selectAllComponents('.product-quantity');
    quantity_changers.forEach( changer => {
      let products = [...offer.miniprogram.packs, ...offer.miniprogram.items];
      let product_id = changer.data.product_id;
      let product = products[findIndex(products, product_id, '_id')];
      changer.updateData(app.db.get('cart')[offer.id], product);
    });
  }

  // Update number of views for offer before getting offer
  app.api.setOfferView(offer_id, res => {
    // Get product by offer id
    app.api.getOffers(`?id=${offer_id}`).then(callback);
  });
}


// Hide for v1
// Get offer messages


// Hide for v1
// Get offer receipes
export const updateReceipes = (page) => {
  // var receipecomp = page.selectComponent("#receipes-component");
  // // TODO
  // if (data) {
  //   receipecomp.onReachBottom();
  // }
}

export const unloadOfferPage = () => {
  let pages = getCurrentPages();
  let previous_page = pages[pages.length - 2];
  (previous_page && previous_page.filterOffers) ? previous_page.filterOffers({}) : '';
}