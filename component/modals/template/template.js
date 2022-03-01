const animation = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease-in-out',
})


Component({
  properties: {
    header: String,
    containerPadding: String,
    submitText: String,
    scrollY: {
      type: Boolean,
      value: false
    }
  },

  data: {
    show: false
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    showModal: function() {
      const self = this;

      animation.opacity(1).step();
  
      self.setData({
        show: true,
        animation: animation.export()
      })
    },
  
    closeModal: function() {
      const self = this;
      animation.opacity(0).step();
      self.setData({
        show: false,
        animation: animation.export(),
        scrollTop: 0
      })
    },

    preventSlide: function() {}
  }
})
