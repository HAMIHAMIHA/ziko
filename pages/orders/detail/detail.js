const { communities } = require("../../../utils/constants");

const app = getApp();

const getOrders = (page) => {
  let order_id = page.options.id;

  const callback = {
    success: res => {
      let community = communities[res.community];

      page.setData({
        order: res,
        units: app.globalData.i18n.units[community],
      })
    }
  }

  app.api.getOrders({filter_str: null, id: order_id}, callback);
}

Page({
  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.order_detail
    })

    // Translate page
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
        use_voucher: i18n.use_voucher,
      }
    })

    getOrders(self)
  }
})