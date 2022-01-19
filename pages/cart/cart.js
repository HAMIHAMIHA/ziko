const { modifyCartItems } = require("../../templates/offer/modifyCart");
const { changeFocus } = require("../../utils/common");
const { communities } = require("../../utils/constants");
const { formatDate } = require("../../utils/util");
const { createOrder } = require("./createOrder");

const app = getApp();

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
      only_left: i18n.only_left,
      pay: i18n.pay,
      phone_no: i18n.phone_no,
      products_left: i18n.products_left,
      total: i18n.total,
      use_voucher: i18n.use_voucher,
    },
    _routes: {
      address: app.routes.address
    },
    _setting: {
      folders: app.folders.product_picture
    }
  })
}

const _setProducts = (offer, cart) => {
  let offer_detail = offer.miniprogram;

  let products = [];
  for (var id in cart.products) {
    let item = cart.products[id];

    let offer_product = offer_detail[item.type][item.index_in_offer];
    offer_product.amount = item.amount;
    offer_product.type = item.type;
    products.push(offer_product);
  }

  return products;
}

const _getOffers = page => {
  let callback = {
    success: res => {
      let offer = res[0];
      let cart = app.db.get('cart')[offer.id];

      let delivery_dates = [];

      let dates = offer.deliveryDates.sort();
      for (var i in dates) {
        delivery_dates.push(formatDate(dates[i]));
      }

      page.setData({
        _offer: offer,
        '_t.units': app.globalData.i18n.units[communities[offer.community.id]],
        cart: cart,
        products: _setProducts(offer, cart),
        delivery_dates: delivery_dates,
        delivery_date: 0,
        _pay_set: {
          total: cart.total,
          minimum: {
            price: offer.minimumOrderAmount,
            items: offer.minimumCartItems,
          }
        },
      })
      
    }
  }

  app.api.getOffers(`?id=${page.options.id}`, callback);
}

Page({
  onShow: function () {
    const self = this;

    if (self.options.back) return;

    _setPageDefaultItems(self);

    // 1. get offer data community
    _getOffers(self);
    // 2. get user data
    let address = app.db.get('userInfo').customer.address;

    self.setData({
      address: address,
      address_selected: -1
    })
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

  pay: function(e) {
    createOrder(this, e.detail.value);
  }
})