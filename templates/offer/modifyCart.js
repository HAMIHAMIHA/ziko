import { checkOfferTicket, getRulePrice } from "./offerRules";

const app = getApp();

export const modifyCartItems = (page, event, checkout = false) => {
  const offer = page.data._offer;
  const type = event.mark.type;
  const new_amount = event.detail.amount;
  const product = offer.miniprogram[type][event.currentTarget.dataset.idx];

  // Saving values needed later
  let old_amount = -1, new_price;

  // Free fall price change
  if (product.freeFall && product.freeFall.quantityTrigger) {
    [old_amount, new_price] = getRulePrice("free_fall", offer.id, product, new_amount);
  }

  // Check for multiple price
  if (product.multipleItem && product.multipleItem.length > 0) {
    [old_amount, new_price] = getRulePrice("multiple", offer.id, product, new_amount)
  }

  // Create empty array for offer if not in cart
  let current_cart = app.db.get('cart') ? app.db.get('cart') : {};
  let cart_offer = current_cart[offer.id] ? current_cart[offer.id] : { count: 0, products: {}, total: 0, reducedTotal: 0 };

  // If old_amount is not already found
  if (old_amount < 0) {
    old_amount = cart_offer.products[product._id] ? cart_offer.products[product._id].amount : 0;
  }

  // Set up values for product in cart
  cart_offer.count += (new_amount - old_amount);
  cart_offer.total += (product.price * (new_amount - old_amount));
  cart_offer.products[product._id] = {
    amount: new_amount,
    type: type,
    price: new_price ? new_price : product.price,
    shortName: product.shortName,
    index_in_offer: event.currentTarget.dataset.idx, 
  };

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

  // Add to checkout page total
  if (checkout) {
    let total = page.data._pay_set.reducedTotal ? page.data._pay_set.reducedTotal : page.data._pay_set.total;
    let deilvery = Math.max(0, page.data.delivery_fee);
    page.setData({
      '_pay_set.finalFee': total + deilvery,
    })
  }

  // Lottery
  if (offer.miniprogram.lotteryEnable) {
    checkOfferTicket(page, offer);
  }
}

export const checkoutItems = (offer_id) => {
  wx.navigateTo({
    url: `${app.routes.cart}?id=${offer_id}`,
  })
}