const { createOrderData } = require("./createOrder");

const app = getApp();

Page({
  data: {
    cart: {
      products: [{
        name: "product A",
        type: "product",
        available: 1,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        id: 1,
        available: 31,
        type: "pack",
        products: [{
          name: "product A",
          quantity: 2,
          weight: 200
        }, {
          name: "product B",
          quantity: 1,
          weight: 400
        }, {
          name: "product C",
          quantity: 2,
          weight: 200
        }],
        price: 500
      }, {
        name: "product B",
        type: "product",
        available: 110,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        name: "product C",
        type: "product",
        available: 10,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        id: 2,
        available: 190,
        type: "pack",
        products: [{
          name: "product A",
          quantity: 2,
          weight: 200
        }, {
          name: "product B",
          quantity: 1,
          weight: 400
        }, {
          name: "product C",
          quantity: 2,
          weight: 200
        }],
        price: 500
      }]
    }
  },

  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // TEMP
    let community = 'cellar';

    self.setData({
      _t: {
        address: i18n.address,
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
        lottery_tickets: i18n.lottery_tickets,
        only_left: i18n.only_left,
        pay: i18n.pay,
        phone_no: i18n.phone_no,
        products_left: i18n.products_left,
        total: i18n.total,
        units: i18n.units[community],
        use_voucher: i18n.use_voucher,
      }
    })
  },

  pay: function() {
    createOrderData(this, '');
  }
})