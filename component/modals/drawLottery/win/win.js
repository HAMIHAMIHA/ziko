const { communities } = require("../../../../utils/constants");

const app = getApp();

const _getPageTranslation = (page) => {
  page.setData({
    _t: {
      community: app.globalData.i18n.community,
      draw: app.globalData.i18n.draw,
      get: app.globalData.i18n.get,
      items_sold: app.globalData.i18n.offer_special_names.items_sold,
      just_won_lottery: app.globalData.i18n.just_won_lottery,
      orders: app.globalData.i18n.offer_special_names.orders,
      pick_up_your_item: app.globalData.i18n.pick_up_your_item,
      prize_will_be_delivered: app.globalData.i18n.prize_will_be_delivered,
      unlocked_at: app.globalData.i18n.unlocked_at,
      you_win: app.globalData.i18n.you_win,
    },
  })
}

Component({
  data: {
    _communities: communities,
    _language: app.db.get('language'),
    _t: {
      community: app.globalData.i18n.community,
      draw: app.globalData.i18n.draw,
      get: app.globalData.i18n.get,
      items_sold: app.globalData.i18n.offer_special_names.items_sold,
      just_won_lottery: app.globalData.i18n.just_won_lottery,
      orders: app.globalData.i18n.offer_special_names.orders,
      pick_up_your_item: app.globalData.i18n.pick_up_your_item,
      prize_will_be_delivered: app.globalData.i18n.prize_will_be_delivered,
      unlocked_at: app.globalData.i18n.unlocked_at,
      you_win: app.globalData.i18n.you_win,
    },
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    showModal: function(lottery) {
      const self = this;
      _getPageTranslation(self);
      
      let i18n = app.globalData.i18n;
      let _lang = app.db.get('language');
      const _getGiftValue = {
        add_on: (gift, offer) => {
          let product_idx = offer.miniprogram.items.findIndex( i => i.shortName === gift.singleItem);
          let prod = offer.miniprogram.items[product_idx];
          return {
            name: prod.product.name[_lang],
            picture: prod.product.mainPicture ? `${app.folders.product_picture}${prod.product.mainPicture[_lang].uri}` : '',
          }
        },
        pack: (gift, offer) => {
          let product_idx = offer.miniprogram.packs.findIndex( i => i.shortName === gift.pack);
          let prod = offer.miniprogram.packs[product_idx];
          return {
            name: prod.name[_lang],
            picture: prod.illustation ? `${app.folders.pack_picture}${prod.illustation.uri}` : '/assets/images/packDefault.png',
          }
        },
        custom: (gift) => {
          return {
            name: gift.custom[_lang],
            picture: gift.customImage ? `${app.folders.custom_image}${gift.customImage.uri}` : '',
          }
        },
        voucher: (gift) => {
          return {
            name: `￥${ gift.voucherValue }${ i18n.offer_special_details.voucher }`,
            picture: '',
          }
        },
        discount: (gift) => {
          return {
            name: `${ gift.discountAmount }${ i18n.offer_special_details.discount_off  }`,
            picture: '',
          }
        },
        free_delivery: () => {
          return {
            name: `${ i18n.offer_special_details.free_delivery }`,
            picture: '',
          }
        },
      }

      let draw_idx = lottery.offer.miniprogram.lottery.draws.findIndex( d => d._id === lottery.offerDrawId );

      let draw = lottery.offer.miniprogram.lottery.draws[draw_idx]
      draw.count = draw_idx + 1;

      draw.gifts.forEach((gift, i) => {
        draw.gifts[i] = _getGiftValue[gift.type](gift, lottery.offer)
      })

      self.setData({
        draw,
        lottery,
        _current: 0,
        _max_number: draw.gifts.length - 1,
        offer: lottery.offer
      })

      self.selectComponent('#modal_template').showModal();
    },
    
    getPrize: function() {
      this.selectComponent('#modal_template').closeModal();
    },

    closeCheck: function() {
      const self = this;
      if (self.data._current === self.data._max_number) {
        app.api.updateLotteryNotification(this.data.lottery.id).then( () => {
          app.globalData.pause_lottery_check = false;
        })
      } else {
        self.setData({
          _current: self.data._current + 1,
        })
        self.selectComponent('#modal_template').showModal();
      }
    },
  }
})