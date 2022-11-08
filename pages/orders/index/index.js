const {
  showLoading
} = require("../../../utils/common.js");
const {
  communities
} = require("../../../utils/constants.js");
const index_data = require("../../../utils/constants.js");
const {
  formatDate,
  formatTime,
  findIndex
} = require("../../../utils/util.js");

const app = getApp();

const pickers = {
  // community: ['all', 'cellar', 'farm', 'kitchen', 'pet'],
  community: ['all', 'kitchen', 'cellar', 'farm', 'pet'],
  order_status: ['all', 'delivered', 'on_the_way', 'prepared'],
}
const PAGE_RANGE = 10;

let current = {
  community: '',
  order_status: '',
  payment_status: ''
};
let current_load = 0;

// Save new status to storage
const _setOrderStatus = () => {
  app.api.getOrders({
    filter_str: `channel=miniprogram`
  }).then(res => {
    let order_deliveries = [];
    res.forEach(o => {
      order_deliveries.push(o.trackingStatus)
    })
    app.db.set('orderDeliveries', order_deliveries);
  })
}

// Change selected filters
const _defaultFilters = (page, key, index_val) => {
  let value = '';
  if (index_val != 0) {
    value = pickers[key][index_val];
  }

  current[key] = value;

  // Change picker select
  let page_selected = page.data._picker_selected;
  page_selected[key] = `${index_val}`;

  page.setData({
    _picker_selected: page_selected
  })
}

const getOrders = (page) => {
  showLoading(true);

  let _lang = app.db.get('language');
  const _getGiftValue = {
    add_on: (gift, offer) => {
      let product_idx = offer.miniprogram.items.findIndex(i => i.shortName === gift.singleItem);
      if (product_idx > -1) {
        return {
          name: offer.miniprogram.items[product_idx].product.name[_lang],
          picture: offer.miniprogram.items[product_idx].product.mainPicture ? `${app.folders.product_picture}${offer.miniprogram.items[product_idx].product.mainPicture[_lang].uri}` : '',
          count: 1,
          _id: gift._id
        }
      }
    },
    pack: (gift, offer) => {
      let product_idx = offer.miniprogram.packs.findIndex(i => i.shortName === gift.pack);
      if (product_idx > -1) {
        return {
          name: offer.miniprogram.packs[product_idx].name[_lang],
          picture: offer.miniprogram.packs[product_idx].illustation ? `${app.folders.pack_picture}${offer.miniprogram.packs[product_idx].illustation.uri}` : '/assets/images/packDefault.png',
          count: 1,
          _id: gift._id
        }
      }
    },
    custom: (gift) => {
      return {
        name: gift.custom[_lang],
        picture: gift.customImage ? `${app.folders.custom_image}${gift.customImage.uri}` : '',
        count: 1,
        _id: gift._id
      }
    },
    voucher: (gift) => {
      return {
        name: `￥${gift.voucherValue}${app.globalData.i18n.offer_special_details.voucher}`,
        picture: '',
        count: 1,
        _id: gift._id
      }
    },
    discount: (gift) => {
      gift.discountAmount
      return {
        name: `${gift.discountAmount}${app.globalData.i18n.offer_special_details.discount_off}`,
        picture: '',
        count: 1,
        _id: gift._id
      }
    },
    free_delivery: (gift) => {
      return {
        name: app.globalData.i18n.offer_special_details.free_delivery,
        picture: '',
        count: 1,
        _id: gift._id
      }
    },
  }
  const callback = res => {
    if (!res.length) {
      showLoading(false);
      // return;
    }

    _setOrderStatus();

    // Count total items
    let countItems = list => {
      let count = 0;
      for (var p in list) {
        count += list[p].amount;
      }
      return count;
    }

    let order_res = [];
    res.forEach(order => {
      let order_info = {
        id: order.id,
        community: order.community,
        offer: order.offer.name,
        paymentStatus: order.paymentStatus,
        trackingStatus: order.trackingStatus,
      };
      order.actualTotal = 0;

      [...order.singleItems, ...order.packs].forEach(item => {
        let price = order.offer.type === "bourse" ? order.offer.miniprogram.bourses[0].unitPrice : item.price;
        order.actualTotal += price * item.amount;
      })

      order.actualTotal += order.deliveryFee;
      order_info.actualTotal = Math.round(order.actualTotal * 100) / 100;

      order_info.actualAmount = Math.round(order.actualAmount * 100) / 100;
      order_info.orderDate = `${formatDate('yyyy-mm-dd', order.orderDate)} ${formatTime(order.orderDate)}`;
      order_info.count = countItems([...order.packs, ...order.singleItems]);

      order_info.payment = order.statusHistory.find(status => (status.type === "payment_status" && status.value === 'paid'));
      order_info.refund = order.statusHistory.find(status => (status.type === "refund"));

      // Gfit info
      let gifts = [];
      order.gifts.forEach(gift => {
        let gift_info = _getGiftValue[gift.type](gift, order.offer);
        if (gift_info) {
          let gifts_idx = findIndex(gifts, gift_info, '_id');
          if (gifts_idx === -1) {
            gifts.push(gift_info)
          } else {
            gifts[gifts_idx].count += 1;
          }
        }
      })
      order_info.gifts = gifts;
      order_res.push(order_info);
    })

    let orders = current_load ? [...page.data.orders, ...order_res] : order_res;
    page.setData({
      orders,
    }, function () {
      current_load = orders.length;
    });

    showLoading(false);
  }

  let community_id = Object.keys(communities).find(item => communities[item] == current.community);
  community_id = community_id ? community_id : ''; // Remove undefined
  let order_status = current.order_status;

  // Tracking status filter
  let tracking_filter_str = `trackingStatus=${order_status}`;
  if (order_status === 'prepared') {
    tracking_filter_str = `filter={"$or":[{"trackingStatus":"prepared"},{"trackingStatus":"delayed"}]}`;
  }

  let filter = {
    filter_str: `${tracking_filter_str}&channel=miniprogram&community=${community_id}&range=[${current_load}, ${current_load + PAGE_RANGE - 1}]`,
  }
  // if (!!order_status) filter.trackingStatus = order_status;
  // if (!!community_id) filter.community = community_id;
  // if (!!current_load && !!PAGE_RANGE) filter.range = [current_load,current_load + PAGE_RANGE - 1 ];
  console.log("filter: ", filter);

  app.api.getOrders(filter).then(callback);
}

Page({
  data: {
    _picker_selected: {
      community: '',
      order_status: ''
    },
    _filters: {
      list: index_data.list_filter,
    },
  },

  onLoad: function (options) {
    const self = this;

    self.updatePageConstants();

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    app.sessionUtils.getUserInfo(self);

    if (app.db.get('userInfo') && app.db.get('userInfo').token) {
      if (!self.options.back) {
        self.initOrders();
      } else {
        self.options.back = false;
        getOrders(self);
      }
    }
  },

  onReachBottom: function () {
    getOrders(this);
  },

  initOrders: function () {
    const self = this;
    // Set page filter and get order
    _defaultFilters(self, 'community', 0);
    _defaultFilters(self, 'order_status', 0);
    current_load = 0;
    self.setData({
      orders: []
    })
    getOrders(self);
  },

  // Get Profile info
  getUserProfile: function (e) {
    app.sessionUtils.getWxUserInfo(this);
  },

  // Mobile login
  getPhoneNumber: async function (e) {
    await app.sessionUtils.mobileLogin(this, e.detail.code);
    this.initOrders();
  },

  // change filter content
  changeFilter: function (e) {
    const self = this;
    current_load = 0;

    let filter_type = e.currentTarget.dataset.filter_type;
    // let value = filter_type == 'community' ? e.detail.value : e.currentTarget.dataset.value;
    let value = e.currentTarget.dataset.value;

    current_load = 0;

    _defaultFilters(self, filter_type, value);
    getOrders(self);
  },

  updatePageConstants: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // app.setTabbars();

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.my_orders
    })

    // Format picker values based on langauge
    let picker_communities = [];
    for (var community in pickers.community) {
      let community_variable = pickers.community[community];
      picker_communities.push(i18n.community[community_variable]);
    }

    // Set page translation
    self.setData({
      _language: app.db.get('language'),
      _t: {
        community: i18n.community,
        get_profile: i18n.get_profile,
        gift: i18n.gift,
        item_unit: i18n.item_unit,
        items_unit: i18n.items_unit,
        moile_login: i18n.mobile_login,
        need_login: i18n.need_login,
        no_orders: i18n.no_orders,
        order_status: i18n.order_status,
        payment_status: i18n.payment_status,
        payment_cleared: i18n.payment_cleared,
        lottery_gift: i18n.lottery_gift,
        amount_paid: i18n.amount_paid,
        ziko_returned: i18n.ziko_returned,
        pending: i18n.payment_status.pending,
        cancelled: i18n.payment_status.ccl,
        refund: i18n.payment_status.rfd
      },
      _pickers: {
        communities: picker_communities,
        order_status: pickers.order_status,
      },
      _communities: communities
    })
  },

  toDetails: function (e) {
    const self = this;
    self.options.back = true;
    wx.navigateTo({
      url: `${app.routes.order}?id=${e.currentTarget.dataset.id}`,
    })
  },

  refreshLoginState: function (e) {
    const userLogin = e.detail.userLogin;
    if (userLogin) getOrders(this);
  }
})