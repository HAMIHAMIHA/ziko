// custom-tab-bar/index.js
const app = getApp();

Component({
  properties: {
    tabIndex: Number
  },

  data: {
    selected: 0,
    color: "#BFBFBF",
    selectedColor: "#12151C",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/assets/icons/land.png",
      selectedIconPath: "/assets/icons/landSel.png",
      // text: the_land
    }, {
      pagePath: "/pages/recipes/index/index",
      iconPath: "/assets/icons/explore.png",
      selectedIconPath: "/assets/icons/exploreSel.png",
      // text: explore
    },{
      pagePath: "/pages/account/index/index",
      iconPath: "/assets/icons/account.png",
      selectedIconPath: "/assets/icons/accountSel.png",
      // text: account
    }
  ]
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () {
      // console.log(this)
      // 页面创建时执行
      this.setData({
        "list[0].text": app.globalData.i18n.the_land,
        "list[1].text": app.globalData.i18n.explore,
        "list[2].text": app.globalData.i18n.account,
      })
      console.log("tabIndex", this.properties)
    },
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})