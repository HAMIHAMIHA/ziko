const { showLoading } = require("../../../utils/common");
const { communities } = require("../../../utils/constants");
const { formatDate, findIndex } = require("../../../utils/util");
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

    let i18n = app.globalData.i18n;
    let _lang = app.db.get('language');
    const _getGiftValue = {
      add_on: (gift, offer) => {
        let product_idx = offer.miniprogram.items.findIndex( i => i.shortName === gift.singleItem);
        let prod = offer.miniprogram.items[product_idx];
        let prod_info = product.product.storageType != 'none' ? `(${ _t.storage_types[product.product.storageType]})` : '';
        if (product.weight) {
          prod_info += product.quantity ? `${product.quantity} x ${product.weight}${i18n.units}` : `${product.weight}${i18n.units}`;
        } else {
          prod_info += product.quantity ? product.quantity > 1 ? `${product.quantity}${_t.items_unit}` : `${product.quantity}${_t.item_unit}` : '';
        }
  
        return ['gift', {
          _id: gift._id,
          count: 1,
          name: prod.name[_lang],
          offerDrawId: gift.offerDrawId,
          origin: gift.origin,
          picture: `${app.folders.product_picture}${prod.mainPicture[_lang].uri}`,
          product_info: prod_info,
          shortName: gift.singleItem,
        }]
      }, 
      pack: (gift, offer) => {
        let product_idx = offer.miniprogram.packs.findIndex( i => i.shortName === gift.pack);
        let prod = offer.miniprogram.packs[product_idx];
        return ['gift', {
          _id: gift._id,
          count: 1,
          offerDrawId: gift.offerDrawId,
          origin: gift.origin,
          name: prod.name[_lang],
          picture: '/assets/images/packDefault.png',
          product_info: prod.products_info,
          shortName: gift.pack,
        }]
      }, 
      custom: (gift) => {
        return ['gift', {
          _id: gift._id,
          count: 1,
          name: gift.custom[_lang],
          origin: gift.origin,
          picture: '',
        }]
      }, 
      voucher: (gift) => {
        return ['gift', {
          _id: gift._id,
          count: 1,
          name: `￥${ gift.voucherValue }${ i18n.offer_special_details.voucher }`,
          picture: '',
          origin: gift.origin,
        }]
      }, 
      discount: (gift) => {
        return [gift.origin, res.totalAmount * (gift.discountAmount / 100)];
      }, 
      free_delivery: () => {
        return ['delivery', 0];
      }, 
    }

    // Gfit info
    let gifts = [], lottery_discount = 0, special_discount = 0, modal_gifts = [];
    res.gifts.forEach( gift => {
      let [gift_type, gift_info] = _getGiftValue[gift.type](gift, res.offer);

      // Show in gift list
      if (gift_type === 'gift') {
        let gifts_idx = findIndex(gifts, gift_info, '_id');
        if (gifts_idx === -1) {
          gifts.push(gift_info)
        } else {
          gifts[gifts_idx].count +=1;
        }

        // Find special
        let special_idx = res.offer.miniprogram.zikoSpecials.findIndex( s => (s.gift.custom && s.gift.custom[app.db.get('language')] === gift_info.name ) || (s.gift.pack && s.gift.pack === gift_info.shortName ) || (s.gift.singleItem && s.gift.singleItem === gift_info.shortName));
        if (special_idx > -1) {
          gift_info.special = res.offer.miniprogram.zikoSpecials[special_idx];
        }
      } else if (gift_type === 'ziko_special') {
        special_discount += gift_info;
      } else if (gift_type === 'lottery') {
        lottery_discount += gift_info;
      } else {
        order.deliveryFee = 0
      }

      // Set up for use in popups
      modal_gifts = [...gifts];
      if (special_discount > 0) {
        modal_gifts = modal_gifts.concat({
          _id: 'ziko_special000',
          name: `￥${special_discount}`,
          special: {
            conditionType: 'ziko_special',
            conditionValue: ''
          }
        })
      }
    })

    res.gifts = gifts;
    res.lottery_discount = lottery_discount;
    res.special_discount = special_discount;
    page.setData({
      order: res,
      "_t.units": app.globalData.i18n.units[community],
    })

    if (page.options.type === 'paid') {
      if (modal_gifts.length > 0) {
        page.selectComponent('#order_gifts').showResults(modal_gifts);
      } else {
        page.selectComponent('#order_complete').show();
      }
    }

    showLoading(false);
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
        free: i18n.free,
        free_delivery: i18n.free_delivery,
        fidelity_points: i18n.fidelity_points,
        gift_source: i18n.gift_source,
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
        ziko_lottery: i18n.ziko_lottery,
        ziko_special: i18n.ziko_special,
      },
      _t_gifts: {
        congrats: app.globalData.i18n.congrats,
        get: app.globalData.i18n.get,
        just_won_items: app.globalData.i18n.just_won_items,
        next: app.globalData.i18n.next,
        offer_special_result: app.globalData.i18n.offer_special_result,
        pick_up_your_item: app.globalData.i18n.pick_up_your_item,
      },
      _t_complete: {
        back_to_order: i18n.back_to_order,
        message: i18n.order_confirmed,
        title: i18n.all_done,
      },
      _t_collected: {
        back_to_order: i18n.back_to_order,
        message: i18n.see_you_soon,
        title: i18n.collected_all_items,
      }
    })

    getOrders(self);
  },

  makePayment: function() {
    const self = this;
    makePayment({ id: self.options.id });
  },

  showCollected: function() {
    const self = this;
    // self.selectComponent('#order_collected').show();
  },
})