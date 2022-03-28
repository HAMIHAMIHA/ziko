const app = getApp();

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`
}

module.exports = {
  findIndex: (list, find, key) => {
    return list.findIndex(item => item[key] == find);
  },

  formatDate: dateLong => {
    // Output date to yyyy-mm-dd format
    const date = new Date(dateLong);
    const year = date.getFullYear();
    const month = date.getMonth() + 1
    const day = date.getDate();
  
    return [year, month, day].map(formatNumber).join('-')
  },

  // Output time to hh:mm format
  formatTime: dateLong => {
    const date = new Date(dateLong)
    const hour = date.getHours()
    const minute = date.getMinutes()
  
    return [hour, minute].map(formatNumber).join(':')
  },

  formatTimer: dateLong => {
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(dateLong / (1000 * 60 * 60 * 24)) * 24;
    var hours = days + Math.floor((dateLong % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((dateLong % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((dateLong % (1000 * 60)) / 1000);

    return [hours, minutes, seconds].map(formatNumber).join(':')
  },

  formatWeekDate: dateLong => {
    const date = new Date(dateLong);
    const i18n = getApp().globalData.i18n;

    // Month, date, and day of week
    const day = i18n.days[date.getDay()];
    const mth = i18n.month[date.getMonth() + 1];
    const date_val = formatNumber(date.getDate());

    // Time in 12 hours format
    const hour = date.getHours();
    const hour_12 = hour % 12 || 12; 
    const time = [hour_12, date.getMinutes()].map(formatNumber).join(':');
    const unit = hour >= 12 ? i18n.pm : i18n.am;

    return {
      day: day,
      month: mth,
      date: date_val,
      time: getApp().db.get('language') == 'zh' ?  `${unit} ${time}` : `${time} ${unit}`,
      date_str: getApp().db.get('language') == 'zh' ? `${day} ${mth}${date_val}日` : `${day} ${date_val} ${mth},` ,
      timestamp: date.setHours(0, 0, 0, 0)
    }
  },

  mapDeliveryDates: dates => {
    let current_month = '';

    dates = dates.sort();
    return dates.map( date => {
      let res = '';

      let d = new Date(date);
      let mth = d.getMonth() + 1;
      if (mth != current_month) {
        res += `${ app.globalData.i18n.month[mth] }${ (app.db.get('language') == 'en') ? ' ' : '' }`;
        current_month = mth;
      }

      let day = d.getDate();
      res += `${ day }${ app.globalData.i18n.date_suffix[`${day}`[`${day}`.length - 1]] }`
      return res;
    }).join(', ');
  },
  
  getNewFreefall: (offer, product, new_amount) => {
    console.log(product);
    let cart = app.db.get('cart');
    let cart_offer = cart[offer] ? cart[offer] : { count: 0, products: {}, total: 0, reducedTotal: 0 };
    let old_amount = cart_offer.products[product._id] ? cart_offer.products[product._id].amount : 0;

    let new_price;
    // Free fall price change
    let reduce = Math.floor((product.stock - product.actualStock + new_amount) / product.freeFall.quantityTrigger) * product.freeFall.dropAmount;
    new_price = Math.max((product.price - reduce), product.freeFall.lowestPrice);

    let prev_price = 0;
    if (cart_offer.products[product._id]) {
      prev_price = cart_offer.products[product._id].price * old_amount
      cart_offer.products[product._id].price = new_price;
    } else {
      prev_price = product.price * old_amount
      cart_offer.products[product._id] = { price: new_price, amount: new_amount };
    }

    cart_offer.reducedTotal += (new_price * new_amount) - prev_price;

    cart[offer] = cart_offer;
    app.db.set('cart', cart)
  }
}