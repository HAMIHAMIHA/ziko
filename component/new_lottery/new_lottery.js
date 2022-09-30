const app = getApp();
let i18n = app.globalData.i18n;

Component({
  properties: {

  },
  data: {
    type: ["farm", "chef", "cellar", "pet"],
    index: 3, //type index from 0 to 3
    completed: ["undo", "win", "lose"],
    com_index: 0, //com_index from 0 to 2
    lottery_content: [{
      numb: "i0",
      name: "bottle-1",
      src: "../../assets/icons/bottle.svg"
    }, {
      numb: "i1",
      name: "cheese-1",
      src: "../../assets/icons/cheese.svg"
    }, {
      numb: "i2",
      name: "fruit-1",
      src: "../../assets/icons/fruit.svg"
    }, {
      numb: "i3",
      name: "noodle-1",
      src: "../../assets/icons/noodle.svg"
    }, {
      numb: "i4",
      name: "Vector-1",
      src: "../../assets/icons/Vector.svg"
    }, {
      numb: "i5",
      name: "bottle-2",
      src: "../../assets/icons/bottle.svg"
    }, {
      numb: "i6",
      name: "cheese-2",
      src: "../../assets/icons/cheese.svg"
    }, {
      numb: "i7",
      name: "fruit-2",
      src: "../../assets/icons/fruit.svg"
    }, {
      numb: "i8",
      name: "noodle-2",
      src: "../../assets/icons/noodle.svg"
    }, {
      numb: "i9",
      name: "Vector-2",
      src: "../../assets/icons/Vector.svg"
    }, ],
    top: "-100",
    participants_number: 160,
    _t: {
      participants: i18n.participants,
      discover_the: i18n.discover_the,
      new_lottery: i18n.new_lottery,
      spin_to: i18n.spin_to,
      you_win: i18n.you_win,
      pick_up_your_item: i18n.pick_up_your_item,
      you_just: i18n.you_just,
      unlocked_at: i18n.unlocked_at,
      items_sold: i18n.items_sold,
      your_price_will: i18n.your_price_will,
      get: i18n.get
    }
  },
  methods: {
    animate_state_change: function () {
      this.setData({
        hander_ball_move: "hander_ball_move",
        hander_move: "hander_move",
        hander_top_move: "hander_top_move"
      })
      setTimeout(() => {
        this.setData({
          showid1: "i6",
        })
      }, 300)
      setTimeout(() => {
        this.setData({
          showid2: "i7",
        })
      }, 600)
      setTimeout(() => {
        this.setData({
          showid3: "i8",
        })
      }, 900)
      // let a=0,b=1,c=2;
      // setInterval(()=>{
      //   a=Math.floor(Math.random()*30+1)
      //   b=Math.floor(Math.random()*30+1)
      //   c=Math.floor(Math.random()*30+1)
      //   this.setData({
      //     showid1:'i'+a,
      //     showid2:'i'+b,
      //     showid3:'i'+c,
      //   })
      // },30)
    },
    animationend: function () {
      setTimeout(() => {
        this.setData({
          showid1: "i0",
          showid2: "i0",
          showid3: "i0",
        })
      }, 5000)
      this.setData({
        hander_ball_move: "",
        hander_move: "",
        hander_top_move: ""
      })
    },
    hide_lottery_send: function (event) {
      this.triggerEvent("deliver")
    }
  },
})