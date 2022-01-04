const app = getApp();

Page({
  data: {
    order: {
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
      }],
      status: [{
        date: '2021-12-12',
        status: 'on-the-way'
      }, {
        date: '2021-12-12',
        status: 'on-the-way'
      }, {
        date: '2021-12-12',
        status: 'on-the-way'
      }]
    },

  },

  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // TEMP
    let community = 'cellar';

    self.setData({
      _t: {
        address: i18n.address,
        chosen_delivery_date: i18n.chosen_delivery_date,
        comment: i18n.comment,
        contact_customer_hero: i18n.contact_customer_hero,
        contact_label: i18n.contact_label,
        delivery_company: i18n.delivery_company,
        delivery_fee: i18n.delivery_fee,
        fapiao: i18n.fapiao,
        fidelity_points: i18n.fidelity_points,
        items: i18n.items,
        lottery_tickets: i18n.lottery_tickets,
        offer_label: i18n.offer_label,
        order_no: i18n.order_no,
        order_status: i18n.order_status,
        phone_no: i18n.phone_no,
        problem_with_order: i18n.problem_with_order,
        total: i18n.total,
        tracking_number: i18n.tracking_number,
        units: i18n.units[community],
        use_voucher: i18n.use_voucher,
      }
    })
  }
})