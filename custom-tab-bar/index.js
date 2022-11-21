// custom-tab-bar/index.js
const app = getApp();

Component({
  data: {
    selected: 0,
    color: "#BFBFBF",
    selectedColor: "#12151C",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/assets/icons/land.png",
      selectedIconPath: "/assets/icons/landSel.png",
      text: {
        en: 'The land',
        zh: 'The land'
      }
    }, {
      pagePath: "/pages/recipes/index/index",
      iconPath: "/assets/icons/explore.png",
      selectedIconPath: "/assets/icons/exploreSel.png",
      text: {
        en: 'Explore',
        zh: 'explore'
      }
    }, {
      pagePath: "/pages/account/index/index",
      iconPath: "/assets/icons/account.png",
      selectedIconPath: "/assets/icons/accountSel.png",
      text: {
        en: 'Account',
        zh: '个人中心'
      }
    }],
    lang: '',
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;

      wx.switchTab({
        url
      })
    }
  }
})