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
      offer_special_names: i18n.offer_special_names,
      offer_special_details: i18n.offer_special_details,
      order_unit: i18n.order_unit,
      orders: i18n.orders,
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
    },
    _t_lottery: {
      extra_ticket: i18n.extra_ticket,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      rmb: i18n.rmb,
      ticket: i18n.ticket,
    }
  })
}

// Modify for pack product info string
export const packProductDetail = function(offer) {
  let units = app.globalData.i18n.units[offer.community];
  let item_unit = app.globalData.i18n.item_unit;
  let items_unit = app.globalData.i18n.items_unit;

  offer.total = 0;
  offer.sold = 0;
  offer.miniprogram.packs.map( item => {
    let details = [];
    offer.total += item.stock;
    offer.sold += (item.stock - item.actualStock);

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
  const callback = res => {
    let offer = res[0];
    offer.media.map( m => m.uri = `${app.folders.offer_media}${m.uri}` )

    // Banner
    let banner = '';
    if (offer.banner) {
      if (offer.banner[app.db.get('language')]) {
        banner = offer.banner[app.db.get('language')];
      } else if (app.db.get('language') === 'zh' && offer.banner.en) {
        banner = offer.banner.en;
      } else if (app.db.get('language') === 'en' && offer.banner.zh) {
        banner = offer.banner.zh;
      }
    }
    banner.uri = `${app.folders.offer_banner}${banner.uri}`;
    offer.media = [banner, ...offer.media];
    offer.community = communities[offer.community.id];
    offer = packProductDetail(offer);

    // Add to total
    offer.miniprogram.items.map( i => {
      offer.total += i.stock;
      offer.sold += (i.stock - i.actualStock);
    })

    // Product / Pack name
    let offer_products = [...offer.miniprogram.items, ...offer.miniprogram.packs];
    let product_name_list = {};
    offer_products.map( p => {
      let p_name = '';
      if (p.products) {
        p_name = `${p.name[app.db.get('language')]}`;
      } else {
        p_name = `${p.product.name[app.db.get('language')]}`;
      }
      product_name_list[p.shortName] = p_name;
    })

    // Find if Offer Popup message needed
    if (offer.miniprogram.zikoSpecials.length > 0) {
      let specail_orders_list = [...offer.miniprogram.zikoSpecials].filter(special => special.conditionType === 'number_of_order').sort((s1, s2) => {s2.conditionValue - s1.conditionValue });
      console.log(specail_orders_list);
    }

    getUserInfo(page);

    page.setData({
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
      _product_names: product_name_list,
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

  showLoading(true);
  // Update number of views for offer before getting offer
  app.api.setOfferView(offer_id).then(res => {
    // Get product by offer id
    app.api.getOffers(`?id=${offer_id}`).then(callback);
  });
}


// Hide for v1
// Get offer messages

export const unloadOfferPage = () => {
  let pages = getCurrentPages();
  let previous_page = pages[pages.length - 2];
  (previous_page && previous_page.filterOffers) ? previous_page.filterOffers({}) : '';
}