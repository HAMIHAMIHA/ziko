const app = getApp();

// Clear checkout items
export const checkoutItems = (page, single_item) => {
  let products = [];
  // TODO
  // if (single_item) products[0] = page.product;
  // else products = page.data.prodcuts();

  wx.navigateTo({
    url: app.routes.cart,
  })
}