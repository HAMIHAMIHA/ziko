// custom-tab-bar/index.js
const app = getApp();
Component({
  /**
   * Component properties
   */
  properties: {

  },
  /**
   * Component initial data
   */
  data: {

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () { 
        // 页面创建时执行
        this.setData({
          the_land:app.globalData.i18n.the_land,
          explore:app.globalData.i18n.explore,
          account:app.globalData.i18n.account,
        })
        console.log("tabbar",this.data)
    },
  },
  /**
   * Component methods
   */
  methods: {
    changeTabbar(e){
      let i=e.currentTarget.dataset.info
      if(i==0){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }else if(i==1){
      wx.switchTab({
        url: '/pages/recipes/index/index',
      })
    }else{
      wx.switchTab({
        url: '/pages/account/index/index',
      })
    }
    }
  }
})
