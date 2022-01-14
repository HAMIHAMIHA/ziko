const app = getApp();

export const modifyCartItems = (page, event) => {
  const offer = page.data._offer;
  const type = event.mark.type;
  const new_amount = event.detail.amount;

  // Create empty array for offer if not in cart
  let current_cart = app.db.get('cart') ? app.db.get('cart') : {};
  let cart_offer = current_cart[offer.id] ? current_cart[offer.id] : { count: 0, products: {} };

  // Saving values needed later
  let product_id = offer.miniprogram[type][event.currentTarget.dataset.idx]._id;
  let old_amount = cart_offer.products[product_id] ? cart_offer.products[product_id].amount : 0;

  // Set up values for product in cart
  cart_offer.count += (new_amount - old_amount);
  cart_offer.products[product_id] = {
    amount: new_amount,
    type: type, 
    index_in_offer: event.currentTarget.dataset.idx, 
  };

  // Save to storage cart
  current_cart[offer.id] = cart_offer;
  app.db.set('cart', current_cart);
}