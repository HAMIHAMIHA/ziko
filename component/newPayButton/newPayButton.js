const app = getApp();
let i18n = app.globalData.i18n;

Component({
  properties:{

  },
  data:{
    _t:{
      total: i18n.total,
      lottery_tickets_you_can_get:i18n.lottery_tickets_you_can_get,
      you_are_still:i18n.you_are_still,
      pay:i18n.pay
    },
    voucher:{
      community:"kitchen",
      community2:"",
      createdAt:"2022/08/12 12:00",
      price:1000,
      amount:100,
      amount_before:1500,
      expire_on:"In 3 hours"
    },
  },
  methods:{
  }
})