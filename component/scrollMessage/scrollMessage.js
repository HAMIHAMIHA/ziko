const finalMsg = [
  "message1 message1",
  "message mesag asg asgkljsd agl messagesag asg asgkljsd agl messagesag asg asgkljsd agl messagesag asg asgkljsd agl message2",
  "mesag asg asgkljsd aessage2",
  "message2",
  "message1 message2"
]

var messagesShowing = 1;

Component({
  properties: {
  },

  data: {
    swiperAutoplay: false
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
        messages: messages,
      })
      // End of TEMP

      // Add Animation
      var animateHeight = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
      })

      // TODO
      // var animate = wx.createAnimation({
      //   duration: 500,
      //   timingFunction: 'linear',
      // })

      let interval = setInterval(
        function() {
          if (messagesShowing < 5) {
            // Show first five by animation on height
            messagesShowing++;
            // Using rpx cannot just calcuate the sum, will show up different for different screen
            animateHeight.height('calc((36rpx + 8rpx + 8rpx + 2rpx + 2rpx) *' + messagesShowing).step();

            // TODO animateOpacity
            // Start swiper autoplay after the fifth shown
            if (messagesShowing == 5) {
              self.setData({
                swiperAutoplay: true
              })
              clearInterval(interval)
            }
          }

          self.setData({
            animateHeight: animateHeight.export()
          })
      }, 1000)
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
      console.log(e.detail.current);
      const self = this;

    },

    messageHeightChange: function() {
    }
  }
})
