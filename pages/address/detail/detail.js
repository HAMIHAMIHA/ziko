Page({
  data: {
  },

  onLoad: function (options) {
    let self = this;
    if (options.id) {
      self.setData({
        formData: {
          name: "Address 1",
          type: 'Home',
          city: 'Shanghai',
          area: 'Xuhui',
          zipcode: '200000',
          address: '水电路1200弄3号401室',
          phone: '13111111111',
          comment: 'Here is a long comment about the adress'
        }
      })
    }
  },

  onShareAppMessage: function () { }
})