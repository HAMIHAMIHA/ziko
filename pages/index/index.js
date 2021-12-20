const app = getApp();

Page({
  data: {
    map: true,
    map_filters: [
      {
        name: "kitchen",
        width: 135,
        height: 60,
        xPos: 25,
        yPos: 45
      }, {
        name: "baby",
        width: 115,
        height: 55,
        xPos: 235,
        yPos: 50
      }, {
        name: "pet",
        width: 135,
        height: 60,
        xPos: 220,
        yPos: 555
      }
    ],
    // map: false,
    mapList: false
  },

  onShow() {
    const self = this;
    self.setData({
      _t: {
        
      }
    })

  },

  switchType: function(e) {
    const self = this;
    // Check if changing to the map view
    let map = (e.currentTarget.dataset.type == "map");

    // Change page view
    const setMap = () => {
      self.setData({
        map: map
      })
    }

    // Scroll page
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })

    // Toggle timer intervals for list offers (which is only showing after of before switch)
    if (!map) {
      setMap();
      let offers = self.selectComponent('#list-offers');
      offers.changeTimers(true);
    } else {
      let offers = self.selectComponent('#list-offers');
      setMap();
      offers.changeTimers(false);
    }
  },

  mapClick: function(e) {
    const self = this;
    // todo open filtertype card
    let filter_name = e.currentTarget.dataset.filterName;

    let offers = self.selectComponent('#map-offers');
    offers.changeTimers(true);
  
    self.setData({
      map_list: {
        type_name: filter_name
      },
    })
  },

  closeMapModal: function() {
    const self = this;

    let offers = self.selectComponent('#map-offers');
    offers.changeTimers(false);
    self.setData({
      map_list: null
    })
  },

  preventSlide: function() {}


  /** TODO Get user info
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  **/
})
