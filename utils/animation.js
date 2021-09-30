const tabbar = {
  tab: wx.createAnimation({
    duration: 100,
    timingFunction: 'linear'
  }).opacity(1).step().export(),
  highlight: wx.createAnimation({
    duration: 100,
    timingFunction: 'linear'
  }).translateY(0).step().export(),
}

const message = {
  opacity: {
    fst: wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    }).opacity(0.3).step().export(),
    snd: wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    }).opacity(0.5).step().export(),
    trd: wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    }).opacity(0.6).step().export(),
    fth: wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    }).opacity(0.8).step().export(),
    normal: wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    }).opacity(1).step().export(),
    still: wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear'
    }).opacity(1).step().export()
  },
  height: wx.createAnimation({
    duration: 500,
    timingFunction: 'linear'
  })
}


module.exports = {
  tabbar: tabbar,
  message: message
}