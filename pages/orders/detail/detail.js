const { showLoading } = require("../../../utils/common");
const { communities } = require("../../../utils/constants");
const { formatDate } = require("../../../utils/util");
const { makePayment } = require("../../cart/createOrder");

const app = getApp();

const getOrders = (page) => {
  let order_id = page.options.id;

  showLoading(true);

  const callback = res => {
    let community = communities[res.community];
    let units = app.globalData.i18n.units[community];
    let item_unit = app.globalData.i18n.item_unit;
    let items_unit = app.globalData.i18n.items_unit;

    showLoading(false);

    res.actualAmount = Math.round(res.actualAmount * 100) / 100;
    res.deliveryDate = formatDate('yyyy-mm-dd', res.deliveryDate);
    res.packs.map(item => {
      let details = [];
      item.products.forEach( product => {
        details.push(
          `${product.product.name[app.db.get('language')]} ${ product.quantity ? product.quantity : '' }${ product.quantity && product.weight ? 'x' : '' }${ product.weight ? `${product.weight}` : '' }${ product.weight ? units : product.quantity == 1 ? item_unit : items_unit }`
        );
      })
      item.products_info = details.join(', ');
      item.type = 'pack'
    });
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

  app.api.getOrders({filter_str: null, id: order_id}).then(callback);
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
        item_unit: i18n.item_unit,
        items_unit: i18n.items_unit,
        lottery_tickets: i18n.lottery_tickets,
        offer_label: i18n.offer_label,
        order_no: i18n.order_no,
        order_status: {...i18n.payment_status, ...i18n.order_status},
        pay: i18n.pay,
        phone_no: i18n.phone_no,
        problem_with_order: i18n.problem_with_order,
        storage_types: i18n.storage_types,
        total: i18n.total,
        tracking_number: i18n.tracking_number,
        use_voucher: i18n.use_voucher,
      }
    })

    getOrders(self);
  },

  // wx.navigateToMiniProgram(Object object)

  makePayment: function() {
    const self = this;
    makePayment({ id: self.options.id });
  }
})