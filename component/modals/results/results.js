const app = getApp();

Component({
  properties: {
    _t: Object,
    // gifts: Object,
    // specials: Object,
  },

  data: {
    // gifts: [{
    //   count: 6, // index + 1
    //   conditionType: "number_of_order",
    //   conditionValue: 5,
    //   gifts: {
    //     custom: {zh: "Pork shoulder minced 250 g", en: "Pork shoulder minced 250 g zh"},
    //     name: "Pork shoulder minced 250 g",
    //     picture: '',
    //     discountAmount: null,
    //     offerDrawId: "623be7a2c64fc9f745a6ece0",
    //     origin: "ziko_special",
    //     pack: null,
    //     singleItem: null,
    //     type: "custom",
    //     voucherExpiration: null,
    //     voucherValue: null,
    //     _id: "6249f20cc64fc9f745a7b158",
    //   },
    //   winners: [],
    //   _id: "623c0438c64fc9f745a6f72f",
    //   offer: {
    //     name: 'La bourse du pinard',
    //     community: 'cellar'
    //   }
    // },{
    //   count: 6, // index + 1
    //   conditionType: "number_of_order",
    //   conditionValue: 5,
    //   gifts: {
    //     custom: {zh: "Pork shoulder minced 250 g", en: "Pork shoulder minced 250 g zh"},
    //     name: "Pork shoulder minced 250 g",
    //     picture: '',
    //     discountAmount: null,
    //     offerDrawId: "623be7a2c64fc9f745a6ece0",
    //     origin: "ziko_special",
    //     pack: null,
    //     singleItem: null,
    //     type: "custom",
    //     voucherExpiration: null,
    //     voucherValue: null,
    //     _id: "6249f20cc64fc9f745a7b158",
    //   },
    //   winners: [],
    //   _id: "623c0438c64fc9f745a6f72f",
    //   offer: {
    //     name: 'La bourse du pinard',
    //     community: 'cellar'
    //   }
    // },{
    //   count: 6, // index + 1
    //   conditionType: "number_of_order",
    //   conditionValue: 5,
    //   gifts: {
    //     custom: {zh: "Pork shoulder minced 250 g", en: "Pork shoulder minced 250 g zh"},
    //     name: "Pork shoulder minced 250 g",
    //     picture: '',
    //     discountAmount: null,
    //     offerDrawId: "623be7a2c64fc9f745a6ece0",
    //     origin: "ziko_special",
    //     pack: null,
    //     singleItem: null,
    //     type: "custom",
    //     voucherExpiration: null,
    //     voucherValue: null,
    //     _id: "6249f20cc64fc9f745a7b158",
    //   },
    //   winners: [],
    //   _id: "623c0438c64fc9f745a6f72f",
    //   offer: {
    //     name: 'La bourse du pinard',
    //     community: 'cellar'
    //   }
    // },],
    current: 0,
  },

  options: {
    addGlobalClass: true,
  },

  methods: {
    showResults: function(gifts) {
      const self =this;

      self.setData({
        gifts
      })

      self.selectComponent('#modal_template').showModal();
      console.log('show');
    }
  }
})
