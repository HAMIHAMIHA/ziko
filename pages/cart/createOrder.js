const { communities } = require("../../utils/constants");

const app = getApp();

const _createOrderData = (page, value) => {
  let page_data = page.data;
  let offer = page_data._offer;

  let packs = [];
  let items = [];
  for (var i in page_data.products) {
    let product = page_data.products[i];

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
        price: pack_products,
      })
    }
  }

  // TODO change api purchase/:offerID
  let selected_address = page_data.address[page_data.address_selected];
  if (page_data.address_selected < 0) {
    page.setData({
      error: 'error-field-0'
    })
    return '';
  };

  page.setData({
    error: ''
  })

  let order = {
    type: communities[offer.community.id] == "cellar" ? "direct_sale" : "service",
    offer: offer.id,
    community: offer.community.id,
    channel: "miniprogram",
    customer: app.db.get('userInfo').user.id,
    customerDaily: null,
    orderDate: new Date(),
    customerAddress: {
      type: selected_address.type,
      city: selected_address.city,
      zipCode: selected_address.zipcode,
      area: '6188abcd1e1c58b45696648c', //TEMP
      detailedAddress: selected_address.address,
      phone: value.phone,
    },
    comment: value.comment,
    deliveryDate: offer.deliveryDates[page_data.delivery_date],
    deliverySelection: "auto",
    vouchers: [],
    voucherSelection: "manual",
    packs: packs,
    singleItems: items,
    paymentStatus: "pending",
    status: "available",
    fapiao: page_data.fapiao ? page_data.fapiao : false,
    paymentMethod: "wechat",
  }

  return order;
}

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

module.exports = {
  // Create order to the backoffice
  createOrder: (page, value) => {
    let order = _createOrderData(page, value);

    if (!order) return;
  
    // Create order, callback to connect to wechat pay
    const createOrderCallback = {
      success: res => {
        makePayment(res);
      }
    }
    app.api.createOrder(order, createOrderCallback);
  }
}