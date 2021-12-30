
// Set up Animation
const animation = require('../../templates/offer/animation.js').message;
// End of Set up Animation

const finalMsg = [
  "message1 message1",
  "message mesag asg asgkljsd agl messagesag asg asgkljsd agl messagesag asg asgkljsd agl messagesag asg asgkljsd agl message2",
  "mesag asg asgkljsd aessage2",
  "message2",
  "message1 message2",
  "mesag asg asgkljsd aessage2"
]

var messagesShowing;
var current;
var interval;


var nextCurrent = function(messages) {
  current = [current[1], current[2], current[3], current[4], current[5],
    (current[5] + 1 == messages.length) ? 0 : current[5] + 1
  ];
}

Component({
  properties: {
  },

  data: {
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
      while (messages.length <= 5) {
        messages = messages.concat(finalMsg);
      }

      self.setData({
        messages: messages
      })
      // End of TEMP

      // Add Animation For Showing messages
      interval = setInterval(
        function() {
          if (messagesShowing < 5) {
            messagesShowing++;
            // Using rpx cannot just calcuate the sum, will show up different for different screen
            animation.height.height('calc((36rpx + 8rpx + 8rpx + 2rpx + 2rpx) *' + messagesShowing).step();
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
    }
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
    messageSwiperChange: function(e) {
      const self = this;

      nextCurrent(self.data.messages);
      self.setData({
        current: current
      })
    },

    messageHeightChange: function() {
    }
  }
})
