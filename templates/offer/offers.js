const app = getApp();

// Clear countdown timer interval
export const _clearCountdown = (page, countdown_timer) => {
  let timer = page.selectComponent('#countdown');
  timer.setTimer(countdown_timer, false);
  return [];
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