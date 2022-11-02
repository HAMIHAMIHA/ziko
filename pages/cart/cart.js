const OfferRules = require("../../templates/offer/offerRules");
const {
  packProductDetail
} = require("../../templates/offer/getOffers");
const {
  modifyCartItems
} = require("../../templates/offer/modifyCart");

const {
  changeFocus,
  showLoading,
} = require("../../utils/common.js");
const {
  communities
} = require("../../utils/constants");
const {
  formatDate,
  formatTime,
  formatCountDown,
} = require("../../utils/util.js");

const {
  createOrder
} = require("./createOrder");
const {
  getDeliveryFee
} = require("./findDeliveryFee");

const app = getApp();
let area_list = [],
  community, vouchers = [];

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
      copied: i18n.copied,
      delivery_fee: i18n.delivery_fee,
      fapiao: i18n.fapiao,
      free_delivery: i18n.free_delivery,
      fidelity_points: i18n.fidelity_points,
      items: i18n.items,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      lottery_tickets: i18n.lottery_tickets,
      minimum: i18n.minimum,
      only_left: i18n.only_left,
      pay: i18n.pay,
      phone_no: i18n.phone_no,
      pick_a_date: i18n.pick_a_date,
      products_left: i18n.products_left,
      storage_types: i18n.storage_types,
      total: i18n.total,
      use_voucher: i18n.use_voucher,

      ziko_special: i18n.ziko_special,
      delivery: i18n.delivery,
      expected_delivery_date: i18n.expected_delivery_date,
      contact_person: i18n.contact_person,
      special_requests: i18n.special_requests,
      send_fapiao_to: i18n.send_fapiao_to,
      available_ziko_vouchers: i18n.available_ziko_vouchers,
      if_you_need_to: i18n.if_you_need_to,
      add_chef_ziko_on_wechat: i18n.add_chef_ziko_on_wechat,
      lottery_tickets_you_can_get: i18n.lottery_tickets_you_can_get,
      anything_else_we: i18n.anything_else_we,
      no_details_yet: i18n.no_details_yet,
      yes: i18n.yes,
      no: i18n.no,
      received: i18n.received,
      ziko: i18n.ziko,
      expires: i18n.expires,
      use_now: i18n.use_now,
      no_vouchers_yet: i18n.no_vouchers_yet,
      its_up_to_you: i18n.its_up_to_you,
      view_ziko_offers: i18n.view_ziko_offers,
      simonmawas: i18n.simonmawas,
      wechat_id: i18n.wechat_id,
      add_cellar_ziko: i18n.add_cellar_ziko,
      add_farmer_ziko: i18n.add_farmer_ziko,
      add_pet_ziko: i18n.add_pet_ziko,
      add_chef_ziko: i18n.add_chef_ziko,
      please_long_press: i18n.please_long_press,
    },
    _routes: {
      address: app.routes.address,
      contacts: app.routes.contacts,
      fapiao: app.routes.fapiao,
    },
    _setting: {
      folders: {
        pack: app.folders.pack_picture,
        product: app.folders.product_picture
      }
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
  for (var id in cart?.products) {
    let item = cart.products[id];
    if (!item.type || !item.amount) continue;

    let offer_product = offer_detail[item.type][item.index_in_offer];
    offer_product.amount = item.amount;
    if (offer.type === "bourse") {
      offer_product.price = offer_detail.bourses[0].unitPrice;
    }
    offer_product.type = item.type;
    offer_product.actualPrice = item.price;
    products.push(offer_product);
  }

  return products;
}

// Get offer data
const _getOffers = page => {
  let offer;
  let callback = res => {
    community = offer.community.id;
    offer.community = communities[offer.community.id];
    res.forEach(voucher => {
      if (voucher.status === 'pending' || voucher.status === 'declined') return;

      if (voucher.communities.findIndex(c => communities[c] === offer.community) == -1) return;

      voucher.createdAt = `${formatDate('yyyy/mm/dd', voucher.createdAt)} ${formatTime(voucher.createdAt)}`;
      voucher.expireIn = formatCountDown(voucher.expirationDate);

      // Check if voucher expired
      if (voucher.expirationDate > new Date()) {
        voucher.status = "expired";
      }

      // Available for community
      let community_list = [];
      let ticket_type = "kitchen";
      if (voucher.communities.length === 4) voucher.community = app.globalData.i18n.community.all
      else {
        if (voucher.communities.find(c => communities[c] === "pet")) {
          community_list.unshift({
            name: app.globalData.i18n.community.pet,
            style: "pet"
          });
          ticket_type = "pet";
        }
        if (voucher.communities.find(c => communities[c] === "farm")) {
          community_list.unshift({
            name: app.globalData.i18n.community.farm,
            style: "farm"
          });
          ticket_type = "farm";
        }
        if (voucher.communities.find(c => communities[c] === "cellar")) {
          community_list.unshift({
            name: app.globalData.i18n.community.cellar,
            style: "cellar"
          });
          ticket_type = "cellar";
        }
        if (voucher.communities.find(c => communities[c] === "kitchen")) {
          community_list.unshift({
            name: app.globalData.i18n.community.kitchen,
            style: "kitchen"
          });
          ticket_type = "kitchen";
        }

        voucher.community_list = community_list;
      }

      voucher.ticket_type = ticket_type;
      vouchers.push(voucher);
    });

    // TEMP TEST
    // let voucherTest = [res[0]];
    // vouchers = voucherTest;

    // vouchers = res;

    // community = offer.community.id;
    // offer.community = communities[offer.community.id];
    offer = packProductDetail(offer);

    let delivery_dates = [];

    let dates = offer.deliveryDates.sort();
    for (var i in dates) {
      if (new Date(dates[i]) > new Date().setHours(23, 59, 59, 999)) {
        delivery_dates.push(formatDate('yyyy-mm-dd', dates[i]));
      }
    }

    // Set price with the newest purchase
    let offer_products = [...offer.miniprogram.items, ...offer.miniprogram.packs];
    let total_sold = 0;
    offer.addon_sold = 0;
    offer_products.forEach(i => {
      total_sold += i.stock - i.actualStock;
      if (offer.type === 'bourse' && i.type === 'items') {
        offer.addon_sold += (i.stock - i.actualStock);
      }
    });
    offer.sold = total_sold;

    // Free fall total
    if (offer.type === "free_fall") {
      offer_products.forEach(p => {
        // Check for and change all free fall product price 
        if (p.freeFall && p.freeFall.quantityTrigger) {
          OfferRules.getRulePrice("free_fall", offer.id, p);
        }
      })
    }

    // Multiple total
    if (offer.type === "multiple_items") {
      offer_products.forEach(p => {
        if (p.multipleItem && p.multipleItem.length > 0) {
          OfferRules.getRulePrice("multiple", offer.id, p)
        }
      })
    }

    // Bourse total
    if (offer.type === "bourder") {
      OfferRules.getBoursePrice(offer, null);
    }

    let cart = app.db.get('cart')[offer.id];

    page.setData({
      _offer: offer,
      '_t.units': app.globalData.i18n.units[offer.community],
      cart: cart,
      products: _setProducts(offer, cart),
      delivery_dates: delivery_dates,
      // delivery_date: 0,
      _vouchers: vouchers,
      _pay_set: {
        _static_total: cart.total,
        total: cart.total,
        reducedTotal: cart.reducedTotal,
        finalFee: cart.reducedTotal ? cart.reducedTotal : cart.total,
        minimum: {
          price: offer.minimumOrderAmount,
          items: offer.minimumCartItems,
        },
        pay_disabled: false,
      },
    })

    // Get usable voucher length
    OfferRules.checkVouchers(page, vouchers, community);

    // Special
    if (offer.miniprogram.zikoSpecials.length > 0) {
      OfferRules.checkOfferSpecial(page, offer);
    }

    // Lottery
    if (offer.miniprogram.lotteryEnable) {
      OfferRules.checkOfferTicket(page, offer);
    }

    // Prefill default address or contact info
    if (page.data.user?.addresses.length > 0) {
      for (const i in page.data.user.addresses) {
        if (page.data.user.addresses[i].default == true) {
          page.setData({
            address_selected: i,
          })

          page.calculateDeliveryFee(page.data.user.addresses[i].area);
          break;
        }
      }
    }
    if (page.data.user?.contacts.length > 0) {
      for (const i in page.data.user.contacts) {
        if (page.data.user.contacts[i].default == true) {
          page.setData({
            contact_selected: i,
          })
          break;
        }
      }
    }

    showLoading(false);
  }
  app.api.getOffers(`?id=${page.options.id}`).then(res => {
    offer = res[0];
    // app.api.getVouchers("validated", true).then(callback);
    app.api.getVouchers("validated", false).then(callback); // TEMP TODO
  });
}

Page({
  data: {
    discount: 1,
    voucher: {
      amount: 0,
      id: null,
    },
    delivery_fee: -1,
    delivery_fee: 10, // The default delivery fee is 10
    free_delivery: false,

    showCopyBox: false,
    showLottery: true,

    // TEMP
    // To fill in the real wechat ids
    copyContent: {
      cellar: {
        qrcode: '/assets/images/QRCODE.png',
        title: app.globalData.i18n.add_cellar_ziko,
        wechat: 'SimonMawas',
      },
      farm: {
        qrcode: '/assets/images/QRCODE.png',
        title: app.globalData.i18n.add_farmer_ziko,
        wechat: 'SimonMawas',
      },
      kitchen: {
        qrcode: '/assets/images/QRCODE.png',
        title: app.globalData.i18n.add_chef_ziko,
        wechat: 'SimonMawas',
      },
      pet: {
        qrcode: '/assets/images/QRCODE.png',
        title: app.globalData.i18n.add_pet_ziko,
        wechat: 'SimonMawas',
      },
    },
  },

  onLoad: function (options) {
    const self = this;
    if (options.community) {
      self.setData({
        community: options.community,
      });
    }
  },

  onShow: function () {
    const self = this;
    vouchers = [];

    // Need to get newest user info
    app.sessionUtils.getUserInfo(self);

    if (self.options.back) {
      self.options.back = false;
      return;
    }

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    showLoading(true);

    // Get data for page
    _setPageDefaultItems(self);
    _getOffers(self);
    _getAddressAreas();

    self.setData({
      voucher_selected: -1,
      address_selected: -1,
      contact_selected: -1
    })
  },

  onHide: function () {
    this.options.back = true;
  },

  // Change checkout amount
  changeAmount: function (e) {
    const self = this;
    modifyCartItems(self, e, true);

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

    // Check for usable vouchers
    OfferRules.checkVouchers(self, vouchers, community);
  },

  next: function (e) {
    changeFocus(this, e);
  },

  // Change picker result
  bindPickerChange: function (e) {
    const self = this;

    let changing_key = e.currentTarget.dataset.key;
    let new_value = e.detail.value;

    self.setData({
      [changing_key]: new_value
    })
  },

  // Change checkmark status 
  toggleCheck: function (e) {
    const self = this;

    let changing_key = e.target.dataset.key;

    self.setData({
      [changing_key]: !self.data[changing_key]
    })
  },

  // toSelectVoucher: function() {
  //   const self = this;
  //   if (self.data.voucher_count > 0) {
  //     wx.navigateTo({
  //       url: `${app.routes.vouchers_select}?community=${community}`,
  //     })
  //   } else {
  //     showToast(app.globalData.i18n.no_vouchers)
  //   }
  // },

  calculateDeliveryFee: function (area) {
    getDeliveryFee(this, area, area_list);
    OfferRules.checkVouchers(this, vouchers, community);
  },

  pay: function (e) {
    createOrder(this, e.detail.value);
  },

  showCopyBox: function () {
    this.setData({
      showCopyBox: true,
    })
  },

  hideCopyBox: function () {
    this.setData({
      showCopyBox: false,
    })
  },

  copyBtn: function (e) {
    const self = this;

    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: () => {
        wx.hideToast();
        wx.showToast({
          title: self.data._t.copied,
          duration: 1500,
        })
      }
    })
  },

  showLottery: function () {
    this.setData({
      showLottery: false
    })
  },

  hideLottery: function () {
    this.setData({
      showLottery: true
    })
  },

  selectVoucher: function (e) {
    const self = this;
    const index = parseInt(e.currentTarget.dataset.index);

    if (self.data.voucher_selected != index) {
      self.setData({
        voucher_selected: index,
        voucher: {
          amount: self.data._vouchers[index].amount,
          id: self.data._vouchers[index].id,
        },
      })      
    } else {
      self.setData({
        voucher_selected: -1,
        voucher: {
          amount: 0,
          id: null,
        },
      })     
    }
  },
})