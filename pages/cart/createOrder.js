const app = getApp();

// Make payment by wechat pay
const makePayment = res => {
  let order_id = res.id;

  const callback = {
    success: res => {
      // TEMP
      wx.redirectTo({
        url: `${app.routes.order}?id=${order_id}&type=paid`,
      })
      /*
      wx.requestPayment({
        timeStamp: `${res.timestamp}`,
        nonceStr: `${res.nonce_str}`,
        package: `prepay_id=${res.prepay_id}`,
        signType: 'MD5',
        paySign: res.signature,
        success (res) { 
          app.db.set('cart', []);
          wx.redirectTo({
            url: app.routes.orders + '?type=paid&id=' + order_id,
          })
        },
        fail (res) {
          console.debug('payment error', res);
          wx.showModal({
            confirmText: app.globalData.i18n.ok,
            content: app.globalData.i18n.payment_failed_message,
            showCancel: false,
            title: app.globalData.i18n.payment_failed_title
          })
        }
      })
      */
    }
  }


  callback.success('');
  // app.api.orderPrePay(order_id, callback, app.globalData.i18n.loading);
}

// Create order to the backoffice
const  createOrder = function(page, offer) {
    let order = {
    address: page.data.address,
    comment: page.data.comment,
    customer: app.db.get('userInfo').user.id,
    channel: "wechat_miniprogam",
    deliverInStore: page.data.deliver,
    firstOrder: true,
    orderProducts: order_products,
    paymentStatus: "unpaid",
    store: "6139b3f8e6901981261453ac",
    totalSpent: page.data.total,
    balance: page.data.total,
  }

  // Create order, callback to connect to wechat pay
  const createOrderCallback = {
    success: res => {
      makePayment(res);
    }
  }

  app.api.createOrder(order, createOrderCallback, app.globalData.i18n.loading)
}

module.exports = {
  createOrderData: (page, value) => {
    let cart_items = page.data.cart_items;

    const callback = {
      success: res => {
        createOrder(page, products, skus);
      }
    }

    makePayment({id: 'id'});
    // app.api.productCategoriesGet(suffix, callback, app.globalData.i18n.loading);
  }
}