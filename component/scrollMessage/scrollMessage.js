const finalMsg = [
  "message1 message1",
  "message mesag asg asgkljsd agl messagesag asg asgkljsd agl messagesag asg asgkljsd agl messagesag asg asgkljsd agl message2",
  "mesag asg asgkljsd aessage2",
  "message2",
  "message1 message2",
  "mesag asg asgkljsd aessage2"
]

var messagesShowing = 1;
var current = [-4, -3, -2, -1, 0];
var currentTop = -4;

// Set up Animation
var animation = {
  opacity: {
    normal: wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    }).opacity(1).step().export(),
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
    }).opacity(1).step().export()
  },
  height: wx.createAnimation({
    duration: 500,
    timingFunction: 'linear'
  })
}
// End of Set up Animation

Component({
  properties: {
  },

  data: {
    currentTop: currentTop,
    swiperAutoplay: false,
    animation: {
      test: animation.test,
      opacity: animation.opacity,
      height: ''
    }
  },

  pageLifetimes: {
    show () {
      const self = this;

      // TEMP Set message data
      var messages = finalMsg;
      if (messages.length <= 5) {
        messages = finalMsg.concat(finalMsg);
      }

      self.setData({
        messages: messages
      })
      // End of TEMP

      // Add Animation For Showing messages
      let interval = setInterval(
        function() {
          if (messagesShowing < 5) {
            // Show first five by animation on height
            messagesShowing++;
            // Using rpx cannot just calcuate the sum, will show up different for different screen
            animation.height.height('calc((36rpx + 8rpx + 8rpx + 2rpx + 2rpx) *' + messagesShowing).step();

            // Start swiper autoplay after the fifth shown
            if (messagesShowing == 5) {
              self.setData({
                swiperAutoplay: true
              })
              clearInterval(interval);
            }
          }

          // Add Opacity Effect
          current = [current[1], current[2], current[3], current[4], current[4] + 1];

          self.setData({
            "animation.height": animation.height.export(),
            current: current
          })
      }, 300)
      // End of Animation
    }
  },

  observers: {

  },

  options: {
    addGlobalClass: true
  },

  methods: {
    messageSwiperChange: function(e) {
      const self = this;

      current = [
        current[1],
        current[2],
        current[3],
        current[4],
        (current[4] + 1 == self.data.messages.length) ? 0 : current[4] + 1
      ];

      self.setData({
        current: current
      })
    },

    messageHeightChange: function() {
    }
  }
})
