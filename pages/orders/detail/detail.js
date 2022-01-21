const { showLoading } = require("../../../utils/common");
const { communities } = require("../../../utils/constants");
const { formatDate } = require("../../../utils/util");
const { makePayment } = require("../../cart/createOrder");

const app = getApp();

const getOrders = (page) => {
  let order_id = page.options.id;

  showLoading(true);

  const callback = {
    success: res => {
      showLoading(false);

      res.actualAmount = Math.round(res.actualAmount * 100) / 100;
      res.deliveryDate = formatDate(res.deliveryDate);
      let community = communities[res.community];
      res.packs.map( item => item.type = 'pack');
      res.singleItems.map( item => item.type = 'item');

      res.products = [...res.packs, ...res.singleItems];

      if (res.statusHistory) {
        res.statusHistory.map( history => history.date = formatDate(history.date));
      }

      page.setData({
        order: res,
        "_t.units": app.globalData.i18n.units[community],
      })
    }
  }

  app.api.getOrders({filter_str: null, id: order_id}, callback);
}

Page({
  data: {
    _folders: {
      product_picture: app.folders.product_picture,
    }
  },

  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.order_detail
    })

    // Translate page
    self.setData({
      _language: app.db.get('language'),
      _t: {
        address: i18n.address,
        address_type: i18n.address_type,
        chosen_delivery_date: i18n.chosen_delivery_date,
        comment: i18n.comment,
        contact_customer_hero: i18n.contact_customer_hero,
        contact_label: i18n.contact_label,
        delivery_company: i18n.delivery_company,
        delivery_companies: i18n.delivery_companies,
        delivery_fee: i18n.delivery_fee,
        fapiao: i18n.fapiao,
        fidelity_points: i18n.fidelity_points,
        items: i18n.items,
        lottery_tickets: i18n.lottery_tickets,
        offer_label: i18n.offer_label,
        order_no: i18n.order_no,
        order_status: {...i18n.payment_status, ...i18n.order_status},
        pay: i18n.pay,
        phone_no: i18n.phone_no,
        problem_with_order: i18n.problem_with_order,
        total: i18n.total,
        tracking_number: i18n.tracking_number,
        use_voucher: i18n.use_voucher,
      }
    })

    getOrders(self);
  },

  makePayment: function() {
    const self = this;
    makePayment({ id: self.options.id });
  }
})