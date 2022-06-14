const { showLoading, showToast } = require("../../utils/common");

const app = getApp();

const notification = {
  [app.subscribe.lottery_draw]: "shouldNotifyLottery",
  [app.subscribe.special_gift]: "shouldNotifySpecial",
  [app.subscribe.delivered]: "shouldNotifyDelivery",
}

const _createOrderData = (page, value) => {
  let page_data = page.data;
  let offer = page_data._offer;

  let packs = [];
  let items = [];
  for (var i in page_data.products) {
    let product = page_data.products[i];
    if (product.amount == 0) continue;

    // Set up singleItems list for order
    if (product.type == 'items') {
      items.push({
        _id: product._id,
        amount: product.amount,
        price: product.price,
        shortName: product.shortName,
        weight: product.weight,
        product: product.product.id,
      })
    } else {
      // Set up products list in pack
      let pack_products = [];
      for (var p in product.products) {
        let pack_product = product.products[p];
        pack_products.push({
          product: pack_product._id,
          quantity: pack_product.quantity,
          weight: pack_product.weight,
        })
      }
      // Set up packs list for order
      packs.push({
        _id: product._id,
        name: product.name,
        shortName: product.shortName,
        amount: product.amount,
        products: pack_products,
        price: product.price,
      })
    }
  }

  let error = '';
  // Check for address
  if (page_data.address_selected < 0) {
    error += ' error-field-0'
  };

  // Check for contact
  if (page_data.contact_selected < 0) {
    error += ' error-field-1'
  };

  // Check for date
  if (!page_data.delivery_dates[page_data.delivery_date]) {
    error += ' error-field-2'
  };

  // Remove error
  page.setData({
    error: error
  })

  if (error) return;

  let selected_address = page_data.user.addresses[page_data.address_selected];
  let selected_contact = page_data.user.contacts[page_data.contact_selected];
  let order = {
    customerDaily: null,
    customerAddress: {
      type: selected_address.type,
      city: selected_address.city,
      zipCode: selected_address.zipCode,
      area: selected_address.area,
      detailedAddress: selected_address.detailedAddress,
      contact: selected_contact.name,
      phone: value.phone,
    },
    comment: value.comment,
    deliveryDate: new Date(page_data.delivery_dates[page_data.delivery_date]),
    deliverySelection: "auto",
    vouchers: page_data.voucher && page_data.voucher.id ? [page_data.voucher.id] : null,
    voucherSelection: "manual",
    packs: packs,
    singleItems: items,
    status: "available",
    fapiao: page_data.fapiao ? page_data.fapiao : false,
    paymentMethod: "wechat",
  }

  return order;
}

// Make payment by wechat pay
export const makePayment = (page, res, nav_back) => {
  let order_id = res.id;

  const callback = res => {
    showLoading(false);

    // TEMP
    // if (nav_back) {
    //   wx.redirectTo({
    //     url: `${app.routes.order}?id=${order_id}&type=paid`,
    //   })
    // } else {
    //   page.options.type = 'paid';
    //   page.onShow();
    // }
    // return;

    wx.requestPayment({
      timeStamp: `${res.timestamp}`,
      nonceStr: `${res.nonce_str}`,
      package: `prepay_id=${res.prepay_id}`,
      signType: 'MD5',
      paySign: res.signature,
      success (res) { 
        if (nav_back) {
          wx.redirectTo({
            url: `${app.routes.order}?id=${order_id}&type=paid`,
          })
        } else {
          page.options.type = 'paid';
          page.onShow();
        }
      },
      fail (res) {
        console.debug('payment error', res);
        showToast(app.globalData.i18n.payment_cancelled);

        page.setData({
          '_pay_set.pay_disabled': false
        })

        if (nav_back) {
          setTimeout( () => {
            wx.navigateBack({
              delta: 0,
            })
          }, 3000)
        }
      }
    })
  }

  app.api.orderPrePay(order_id).then(callback);
}

// Create order to the backoffice
export const createOrder = (page, value) => {
  let offer_id = page.data._offer.id;
  let order = _createOrderData(page, value);

  if (!order) return;

  page.setData({
    '_pay_set.pay_disabled': true
  })

// return;
  const _createOrder = () => {
    showLoading(true);

    app.globalData.pause_lottery_check = true;

    // Create order, callback to connect to wechat pay
    const createOrderCallback =  res => {
      // Remove from cart
      let cart = app.db.get('cart');
      delete cart[offer_id];
      app.db.set('cart', cart);

      makePayment(page, res, true);
    }
    app.api.createOrder(offer_id, order).then(createOrderCallback).catch( error => {
      let message = error.message.replace('missing pack', app.globalData.i18n.missing_pack).replace('missing item', app.globalData.i18n.missing_item);
      showToast(message);
      showLoading(false);

      page.setData({
        '_pay_set.pay_disabled': false
      })
    });
  }

  // Check if subscription needed
  // Delivery
  let subscribe = [app.subscribe.delivered];
  // Special
  if (page.data._offer.miniprogram.zikoSpecials.filter(s => { return s.conditionType === 'x_total_sold_items' || s.conditionType === "number_of_order"; }).length > 0) {
    subscribe.push(app.subscribe.special_gift);
  }

  // Lottery
  if (page.data._offer.miniprogram.lotteryEnable) {
    subscribe.push(app.subscribe.lottery_draw);
  }
  // Request subscription before checkout if lottery / special included
  wx.requestSubscribeMessage({
    tmplIds: subscribe,
    complete: (res) => {
      // Get subscription
      Object.keys(res).forEach( i => {
        if (i === 'errMsg') return;
        order[notification[i]] = res[i] === 'accept';
      })

      _createOrder();
    }
  })
}
