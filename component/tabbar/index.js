// custom-tab-bar/index.js
const app = getApp();
Component({
  /**
   * Component properties
   */
  properties: {
    tabIndex:Number
  },
  /**
   * Component initial data
   */
  data: {
    
    },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () { 
      // console.log(this)
        // 页面创建时执行
        this.setData({
          the_land:app.globalData.i18n.the_land,
          explore:app.globalData.i18n.explore,
          account:app.globalData.i18n.account,
        })
        console.log("tabIndex",this.properties)
    },
  },
  /**
   * Component methods
   */
  methods: {
    changeTabbar(e){
      let tabbar_flag=e.currentTarget.dataset.info
      if(tabbar_flag==0){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }else if(tabbar_flag==1){
      wx.switchTab({
        url: '/pages/recipes/index/index',
      })
    }else if(tabbar_flag==2){
      wx.switchTab({
        url: '/pages/account/index/index',
      })
    }
    }
  }
})
