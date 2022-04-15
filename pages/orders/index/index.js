const { mobileLogin, getUserInfo, showLoading, getWxUserInfo } = require("../../../utils/common");
const { communities } = require("../../../utils/constants");
const { formatDate, formatTime, findIndex } = require("../../../utils/util");

const app = getApp();
const pickers = {
  community: ['all', 'cellar', 'garden', 'kitchen', 'pet'],
  order_status: ['all', 'delivered', 'on_the_way', 'prepared', 'delayed'],
}

let current = { community: '', order_status: '', payment_status: '' };

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
      let product_idx = offer.miniprogram.items.findIndex( i => i.shortName === gift.singleItem);
      return {
        name: offer.miniprogram.items[product_idx].product.name[_lang],
        picture: offer.miniprogram.items[product_idx].product.mainPicture ? `${app.folders.product_picture}${offer.miniprogram.items[product_idx].product.mainPicture[_lang].uri}` : '',
        count: 1,
        _id: gift._id
      }
    }, 
    pack: (gift, offer) => {
      let product_idx = offer.miniprogram.packs.findIndex( i => i.shortName === gift.pack);
      return {
        name: offer.miniprogram.packs[product_idx].name[_lang],
        picture: '/assets/images/packDefault.png',
        count: 1,
        _id: gift._id
      }
    }, 
    custom: (gift) => {
      return {
        name: gift.custom[_lang],
        picture: '',
        count: 1,
        _id: gift._id
      }
    }, 
    voucher: (gift) => {
      return {
        name: `￥${ gift.voucherValue }${ app.globalData.i18n.offer_special_details.voucher }`,
        picture: '',
        count: 1,
        _id: gift._id
      }
    },
    discount: (gift) => {
      gift.discountAmount
      return {
        name: `${ gift.discountAmount }${ app.globalData.i18n.offer_special_details.discount_off }`,
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
    showLoading(false);

    // Count total items
    let countItems = list => {
      let count = 0;
      for (var p in list) {
        count += list[p].amount;
      }
      return count;
    }

    let order_deliveries = [];
    res.map( order => {
      order.actualAmount = Math.round(order.actualAmount * 100) / 100;
      order.orderDate = `${formatDate('yyyy-mm-dd', order.orderDate)} ${formatTime(order.orderDate)}`;
      order.count = countItems( [...order.packs, ...order.singleItems] )

      // Gfit info
      let gifts = [];
      order.gifts.forEach( gift => {
        let gift_info = _getGiftValue[gift.type](gift, order.offer);
        if (gift_info) {
          let gifts_idx = findIndex(gifts, gift_info, '_id');
          if (gifts_idx === -1) {
            gifts.push(gift_info)
          } else {
            gifts[gifts_idx].count +=1;
          }
        }
      })
      order.gifts = gifts;


      // Save delivery status for checking in future
      if (!current.community && !current.order_status && !current.payment_status) {
        order_deliveries.push(order.trackingStatus);
      }
    })

    page.setData({
      orders: res,
    });

    // Save for comparsion in profile page
    if (!current.community && !current.order_status && !current.payment_status) {
      app.db.set('orderDeliveries', order_deliveries);
    }
  }

  let community_id = Object.keys(communities).find(item => communities[item] == current.community);
  community_id = community_id ? community_id : ''; // Remove undefined
  let order_status = current.order_status;

  let filter = {
    filter_str: `filter={"$or":[{"channel":"all"},{"channel":"miniprogram"}]}&community=${ community_id }&trackingStatus=${ order_status }`,
  }

  app.api.getOrders(filter).then(callback);
}

Page({
  data: {
    _routes: { order: app.routes.order },
    _picker_selected: { community: '', order_status: '' }
  },

  onShow: function () {
    const self = this;

    self.updatePageConstants();

    getUserInfo(self);
  
    if (app.db.get('userInfo') && app.db.get('userInfo').token) {
      if (!self.options.back) {
        self.initOrders();
      } else {
        self.options.back = false;
        getOrders(self);
      }
    }
  },

  onHide: function() {
    this.options.back = true;
  },

  initOrders: function() {
    const self = this;
    // Set page filter and get order
    _defaultFilters(self, 'community', 0);
    _defaultFilters(self, 'order_status', 0);
    getOrders(self);
  },

  // Get Profile info
  getUserProfile: function(e) {
    getWxUserInfo(this);
  },

  // Mobile login
  getPhoneNumber: function(e) {
    mobileLogin(this, e.detail.code, this.initOrders);
  },

  // change filter content
  changeFilter: function(e) {
    const self = this;

    let filter_type = e.currentTarget.dataset.filter_type;
    let value = filter_type == 'community' ? e.detail.value : e.currentTarget.dataset.value;

    _defaultFilters(self, filter_type, value);
    getOrders(self);
  },

  updatePageConstants: function() {
    const self = this;
    let i18n = app.globalData.i18n;

    app.setTabbar();

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
        item_unit: i18n.item_unit,
        items_unit: i18n.items_unit,
        lottery_gift: i18n.lottery_gift,
        moile_login: i18n.mobile_login,
        need_login: i18n.need_login,
        no_orders: i18n.no_orders,
        order_status: i18n.order_status,
        payment_status: i18n.payment_status,
      },
      _pickers: {
        communities: picker_communities,
        order_status: pickers.order_status,
      },
      _communities: communities
    })
  }
})