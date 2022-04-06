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
    showResults: function(gifts) {
      const self =this;

      self.setData({
        gifts
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
          current: self.data.current++,
        })
      } else {
        self.selectComponent('#modal_template').closeModal();
        self.triggerEvent('showCollected');
      }
    }
  }
})
