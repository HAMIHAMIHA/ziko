const app = getApp();

Component({
  properties: {
    // lottery: Object
  },

  data: {
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
    draw: {
      count: 6, // index + 1
      conditionType: "number_of_order",
      conditionValue: 5,
      gifts: {
        custom: {zh: "Pork shoulder minced 250 g", en: "Pork shoulder minced 250 g zh"},
        name: "Pork shoulder minced 250 g",
        picture: '',
        discountAmount: null,
        offerDrawId: "623be7a2c64fc9f745a6ece0",
        origin: "ziko_special",
        pack: null,
        singleItem: null,
        type: "custom",
        voucherExpiration: null,
        voucherValue: null,
        _id: "6249f20cc64fc9f745a7b158",
      },
      winners: [],
      _id: "623c0438c64fc9f745a6f72f",
      offer: {
        name: 'La bourse du pinard',
        community: 'cellar'
      }
    },
  },

  options: {
    addGlobalClass: true
  },

  methods: {

  }
})
