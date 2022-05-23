
// Set up Animation
const animation = require('../../templates/offer/animation.js').message;
// End of Set up Animation

var messagesShowing;
var current;
var interval;

var nextCurrent = function(messages) {
  current = [current[1], current[2], current[3], current[4], current[5],
    (current[5] + 1 == messages.length) ? 0 : current[5] + 1
  ];
}

Component({
  data: {
    swiperAutoplay: false,
    animation: {
      test: animation.test,
      opacity: animation.opacity,
      height: ''
    }
  },

  pageLifetimes: {
  },

  lifetimes: {
    attached() {
      // Reset message
      messagesShowing = 1;
      current = [-4, -3, -2, -1, 0, 1];
      clearInterval(interval);
    }
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    show: function(messages) {
      const self = this;

      while (messages.length <= 5) {
        messages = messages.concat(messages);
      }

      self.setData({
        messages: messages
      })

      // Add Animation For Showing messages
      interval = setInterval(
        function() {
          if (messagesShowing < 5) {
            messagesShowing++;
            // Using rpx cannot just calcuate the sum, will show up different for different screen
            animation.height.height('calc((30rpx + 4rpx + 4rpx + 6rpx + 6rpx) *' + messagesShowing).step();
            // Add Opacity Effect
            nextCurrent(self.data.messages);
  
            self.setData({
              "animation.height": animation.height.export(),
              current: current
            })

            // Start swiper autoplay after the fifth shown
            if (messagesShowing == 5) {
              self.setData({
                swiperAutoplay: true
              })
              clearInterval(interval);
            }
          } else {
            clearInterval(interval);
          }
      }, 3000)
      // End of Animation
    },

    messageSwiperChange: function(e) {
      const self = this;

      nextCurrent(self.data.messages);
      self.setData({
        current: current
      })
    },

    messageHeightChange: function() {
    },

    clearMessageInterval: function() {
      clearInterval(interval);
    }
  }
})
