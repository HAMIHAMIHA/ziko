import { showLoading } from "../../utils/common";
import { communities } from "../../utils/constants";

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
      available: i18n.available,
      only_left: i18n.only_left,
      products_left: i18n.products_left,
      units: i18n.units[community],
    }
  })

  let products = page.selectAllComponents('.product-list');
  let products_translation = {
    available: i18n.available,
    only_left: i18n.only_left,
    products_left: i18n.products_left,
    units: i18n.units[community],
  }

  for (var i in products) {
    products[i].updatePage(products_translation);
  }
}

// Get Offer
export const getOffer = function(page, offer_id) {
  showLoading(true);
  const callback = {
    success: res => {
      let offer = res[0];
      offer.community = communities[offer.community.id];
      offer.minimum = {
        price: offer.minimumOrderAmount,
        items: offer.minimumCartItems
      }

      page.setData({
        _offer: offer,
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
      })

      // Change page translation
      _getTranslations(page, offer.community);
      page.startCountdown();
      showLoading(false);
    }
  }

  // callback -> for each item in product and pack list -> add quantity based on storage cart[order_id]
    // if item in cart offer -> check quantity and availibity -> reduce to min or remove or keep
    // update page data
  // get product by offer id
  app.api.getOffers(`?id=${offer_id}`, callback)
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