const { packProductDetail } = require("../../templates/offer/getOffers");
const { modifyCartItems } = require("../../templates/offer/modifyCart");
const { changeFocus, showLoading, getUserInfo } = require("../../utils/common");
const { communities } = require("../../utils/constants");
const { formatDate, getNewFreefall } = require("../../utils/util");
const { createOrder } = require("./createOrder");
const { getDeliveryFee } = require("./findDeliveryFee");

const app = getApp();
let area_list = [];

// Page default data
const _setPageDefaultItems = page => {
  let i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.cart
  })

  page.setData({
    _language: app.db.get('language'),
    _t: {
      address: i18n.address,
      address_type: i18n.address_type,
      available: i18n.available,
      checkout_message: i18n.checkout_message,
      choose_delivery_date: i18n.choose_delivery_date,
      comment: i18n.comment,
      contact_customer_hero: i18n.contact_customer_hero,
      contact_label: i18n.contact_label,
      delivery_fee: i18n.delivery_fee,
      fapiao: i18n.fapiao,
      fidelity_points: i18n.fidelity_points,
      items: i18n.items,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      lottery_tickets: i18n.lottery_tickets,
      minimum: i18n.minimum,
      only_left: i18n.only_left,
      pay: i18n.pay,
      phone_no: i18n.phone_no,
      products_left: i18n.products_left,
      storage_types: i18n.storage_types,
      total: i18n.total,
      use_voucher: i18n.use_voucher,
    },
    _routes: {
      address: app.routes.address,
      fapiao: app.routes.fapiao
    },
    _setting: {
      folders: app.folders.product_picture
    }
  })
}

// Get area list from db
const _getAddressAreas = () => {
  app.api.getAreas().then(res => {
    area_list = res;
  });
}

// Set product into display format
const _setProducts = (offer, cart) => {
  let offer_detail = offer.miniprogram;

  let products = [];
  for (var id in cart.products) {
    let item = cart.products[id];
    if (!item.type) continue;

    let offer_product = offer_detail[item.type][item.index_in_offer];
    offer_product.amount = item.amount;
    offer_product.type = item.type;
    products.push(offer_product);
  }

  return products;
}

// Get offer data
const _getOffers = page => {
  let callback = res => {
    let offer = res[0];
    offer.community = communities[offer.community.id];
    offer = packProductDetail(offer);

    let delivery_dates = [];

    let dates = offer.deliveryDates.sort();
    for (var i in dates) {
      if (new Date(dates[i]) > new Date().setHours(23, 59, 59, 999)) {
        delivery_dates.push(formatDate(dates[i]));
      }
    }

    // Set price with the newest purchase
    let offer_products = [...offer.miniprogram.items, ...offer.miniprogram.packs];

    if (offer.type === "free_fall") {
      offer_products.forEach( p => {
        // Check for free fall price 
        if (p.freeFall && p.freeFall.quantityTrigger) {
          let cart = app.db.get('cart');
          // Change all product price
          let cart_stock = cart[offer.id] && cart[offer.id].products[p._id] ? cart[offer.id].products[p._id].amount : 0;
          getNewFreefall(offer.id, p, cart_stock);
        }
      })
    }

    let cart = app.db.get('cart')[offer.id];

    page.setData({
      _offer: offer,
      '_t.units': app.globalData.i18n.units[offer.community],
      cart: cart,
      products: _setProducts(offer, cart),
      delivery_dates: delivery_dates,
      delivery_date: 0,
      _pay_set: {
        _static_total: cart.total,
        total: cart.total,
        reducedTotal: cart.reducedTotal,
        minimum: {
          price: offer.minimumOrderAmount,
          items: offer.minimumCartItems,
        }
      },
    })
    showLoading(false);
  }

  app.api.getOffers(`?id=${page.options.id}`).then(callback);
}

Page({
  onShow: function () {
    const self = this;

    // Need to get newest user info
    getUserInfo(self);

    if (self.options.back) {
      self.options.back = false;
      return;
    }

    showLoading(true);

    // Get data for page
    _setPageDefaultItems(self);
    _getOffers(self);
    _getAddressAreas();

    self.setData({
      address_selected: -1
    })
  },

  onHide: function() {
    this.options.back = true;
  },

  // Change checkout amount
  changeAmount: function(e) {
    const self = this;
    modifyCartItems(self, e);

    let cart = app.db.get('cart')[self.options.id];
  
    self.setData({
      cart: cart,
      products: _setProducts(self.data._offer, cart)
    })

    // Check for delivery fee after amount changed
    if (self.data.address_selected > -1) {
      let area = self.data.user.addresses[self.data.address_selected].area;
      getDeliveryFee(self, area, area_list);
    }
  },

  next: function(e) {
    changeFocus(this, e);
  },

  // Change picker result
  bindPickerChange: function(e) {
    const self = this;

    let changing_key = e.currentTarget.dataset.key;
    let new_value = e.detail.value;

    self.setData({
      [changing_key]: new_value
    })
  },

  // Change checkmark status 
  toggleCheck: function(e) {
    const self = this;

    let changing_key = e.currentTarget.dataset.key;

    self.setData({
      [changing_key]: !self.data[changing_key]
    })
  },

  calculateDeliveryFee: function(area) {
    getDeliveryFee(this, area, area_list);
  },

  pay: function(e) {
    createOrder(this, e.detail.value);
  }
})