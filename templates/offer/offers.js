const app = getApp();

// Clear countdown timer interval
export const _clearCountdown = (page, countdown_timer) => {
  let timer = page.selectComponent('#countdown');
  timer.setTimer(countdown_timer, false);
  return [];
}

// Get page translations
export const _getTranslations = (page, community) => {
  let i18n = app.globalData.i18n;

  // Change offer page nav title
  wx.setNavigationBarTitle({
    title: i18n.offer
  })

  // Set page content translation
  page.setData({
    _t: {
      available: i18n.available,
      left_unit: i18n.left_unit,
      minimum: i18n.minimum,
      only_left: i18n.only_left,
      orders_unit: i18n.orders_unit,
      our_selected_packs: i18n.our_selected_packs,
      pay: i18n.pay,
      price_rules: i18n.price_rules,
      products: i18n.products,
      receipes: i18n.receipes,
      related_receipes: i18n.related_receipes,
      remaining_time: i18n.remaining_time,
      single_items: i18n.single_items,
      total_units_available: i18n.total_units_available,
      units: i18n.units[community],
      viewers: i18n.viewers,
    }
  })
}

// Get offer products


// Get offer messages


// Get offer receipes
export const updateReceipes = (page) => {
  // var receipecomp = page.selectComponent("#receipes-component");
  // // TODO
  // if (data) {
  //   receipecomp.onReachBottom();
  // }
}