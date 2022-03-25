const app = getApp();

export const modifyCartItems = (page, event) => {
  const offer = page.data._offer;
  const type = event.mark.type;
  const new_amount = event.detail.amount;

  // Create empty array for offer if not in cart
  let current_cart = app.db.get('cart') ? app.db.get('cart') : {};
  let cart_offer = current_cart[offer.id] ? current_cart[offer.id] : { count: 0, products: {}, total: 0, reducedTotal: 0 };

  // Saving values needed later
  let product = offer.miniprogram[type][event.currentTarget.dataset.idx];
  let old_amount = cart_offer.products[product._id] ? cart_offer.products[product._id].amount : 0;

  let new_price;
  // Free fall price change
  if (product.freeFall && product.freeFall.quantityTrigger) {
    let reduce = Math.floor(product.stock - product.actualStock + new_amount / product.freeFall.quantityTrigger) * product.freeFall.dropAmount;
    new_price = Math.max((product.price - reduce), product.freeFall.lowestPrice);

    let prev_price = 0;
    if (cart_offer.products[product._id]) {
      prev_price = cart_offer.products[product._id].price * old_amount
    } else {
      prev_price = product.price * old_amount
    }

    cart_offer.reducedTotal += (new_price * new_amount) - prev_price;
  }

  // Set up values for product in cart
  cart_offer.count += (new_amount - old_amount);
  cart_offer.total += (product.price * (new_amount - old_amount));
  cart_offer.products[product._id] = {
    amount: new_amount,
    type: type,
    price: new_price ? new_price : product.price,
    index_in_offer: event.currentTarget.dataset.idx, 
  };

  // Remove product from list if reduced to 0
  if (new_amount == 0) {
    delete cart_offer.products[product._id]
  }

  // Save to storage cart
  current_cart[offer.id] = cart_offer;
  app.db.set('cart', current_cart);

  // Show new total on page
  page.setData({
    cart: app.db.get('cart')[offer.id],
    '_pay_set.cart': cart_offer.count,
    '_pay_set.total': cart_offer.total,
    '_pay_set.reducedTotal': cart_offer.reducedTotal,
  })
}

export const checkoutItems = (offer_id) => {
  wx.navigateTo({
    url: `${app.routes.cart}?id=${offer_id}`,
  })
}