const { communities } = require("../../../utils/constants.js");

const app = getApp();

Component({
  properties: {
    _t: Object,
  },

  data: {
    current: 0,
  },

  options: {
    addGlobalClass: true,
  },

  methods: {
    showResults: function(gifts, order) {
      const self = this;

      self.setData({
        _communities: communities,
        current: 0,
        gifts,
        order
      })

      self.selectComponent('#modal_template').showModal();
    },

    getPrize: function() {
      const self = this;

      let gifts = self.data.gifts;
      gifts[self.data.current].checked = true

      self.setData({
        gifts
      })
    },

    nextItem: function(e) {
      const self = this;

      if (self.data.current + 1 < self.data.gifts.length) {
        self.setData({
          current: self.data.current + 1,
        })
      } else {
        self.selectComponent('#modal_template').closeModal();
        setTimeout(() => {
          self.triggerEvent('showCollected');
        }, 150);
      }
    }
  }
})
