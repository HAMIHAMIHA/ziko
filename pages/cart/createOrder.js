const { showLoading, showToast } = require("../../utils/common");
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

  // Check for date
  if (!page_data.delivery_dates[page_data.delivery_date]) {
    error += ' error-field-1'
  };

  // Remove error
  page.setData({
    error: error
  })

  if (error) return;

  let selected_address = page_data.user.addresses[page_data.address_selected];
  let order = {
    customerDaily: null,
    customerAddress: {
      type: selected_address.type,
      city: selected_address.city,
      zipCode: selected_address.zipCode,
      area: selected_address.area,
      detailedAddress: selected_address.detailedAddress,
      phone: value.phone,
      contact: value.contact,
    },
    comment: value.comment,
    deliveryDate: new Date(page_data.delivery_dates[page_data.delivery_date]),
    deliverySelection: "auto",
    vouchers: [],
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
export const makePayment = res => {
  let order_id = res.id;

  const callback = res => {
    showLoading(false);

    wx.requestPayment({
      timeStamp: `${res.timestamp}`,
      nonceStr: `${res.nonce_str}`,
      package: `prepay_id=${res.prepay_id}`,
      signType: 'MD5',
      paySign: res.signature,
      success (res) { 
        wx.redirectTo({
          url: `${app.routes.order}?id=${order_id}&type=paid`,
        })
      },
      fail (res) {
        console.debug('payment error', res);
        showToast(app.globalData.i18n.payment_cancelled);
        
        setTimeout( () => {
          wx.navigateBack({
            delta: 0,
          })
        }, 1000)
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

  showLoading(true);
  // Create order, callback to connect to wechat pay
  const createOrderCallback =  res => {
    // Remove from cart
    let cart = app.db.get('cart');
    delete cart[offer_id];
    app.db.set('cart', cart);

    makePayment(res);
  }
  app.api.createOrder(offer_id, order).then(createOrderCallback);
}
