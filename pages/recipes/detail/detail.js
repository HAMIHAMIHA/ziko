const { showLoading } = require("../../../utils/common.js");
const { formatWeekDate, mapDeliveryDates, _checkMediaType } = require("../../../utils/util.js");

const app = getApp();

const _setPageTranslation = page => {
  const i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.recipe_detail
  })

  page.setData({
    _language: app.db.get('language'),
    _t: {
      baking: i18n.baking,
      kcal: i18n.kcal,
      preparation: i18n.preparation,
      minutes: i18n.minutes,
      related_current_offers: i18n.related_current_offers,
      see_all_offers: i18n.see_all_offers,
      servings: i18n.servings,
    },
    _t_offers: {
      coming_soon: i18n.coming_soon,
      delivery: i18n.delivery,
      empty: i18n.empty,
      get_reminder: i18n.get_reminder,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      lottery: i18n.lottery,
      no_offers: i18n.no_offers,
      offers: i18n.offers,
      orders_unit: i18n.orders_unit,
      order_unit: i18n.order_unit,
      remaining_time: i18n.remaining_time,
      specials: i18n.specials,
      viewers: i18n.viewers,
    }
  })
}

const getOffers = (page, id) => {
  app.api.getRecipeOffers(id).then(res => {
    let offers = [];
    res.forEach( offer => {
      let date_value = formatWeekDate(offer.startingDate);

      let banners = { index: 0, uri: [] };
      let other_banner = { zh: 'en', en: 'zh' };
      if (offer.banner) {
        if (offer.banner[app.db.get('language')]) {
          banners.uri.push(`${app.folders.offer_banner}${offer.banner[app.db.get('language')]?.uri}`);
        } else if (offer.banner[other_banner[app.db.get('language')]]) {
          banners.uri.push(`${app.folders.offer_banner}${offer.banner[other_banner[app.db.get('language')]].uri}`)
        }
      }

      // Media images for banner swiper
      if (offer.media.length) {
        offer.media.forEach( m => {
          banners.uri.push(`${app.folders.offer_media}${m.uri}`)
        })
      }

      // Modify offer data to fit page display
      offer.startTime = new Date(offer.startingDate).getTime();
      offer.startDate = date_value;
      offer.deliveryDates = mapDeliveryDates(offer.deliveryDates);
      offer.banners = banners;
      offer.orders = offer.orderCount;
      offers.push(offer);
    })

    page.setData({
      offers: offers,
    });

    if (offers.length) {
      let offer_comp = page.selectComponent('#list_offers');
      offer_comp.updateCards(page.data._t_offers, true);
    }

    showLoading(false);
  });
}

const getRecipeDetail = (page, id) => {
  showLoading(true);
  app.api.getRecipes({id: id}).then( res => {
    // Banner image
    res.mainPicture[app.db.get('language')].uri = `${app.folders.recipe_picture}${res.mainPicture[app.db.get('language')].uri}`;
    res.mainPicture[app.db.get('language')].type = _checkMediaType(res.mainPicture[app.db.get('language')].type);
    res.mainPicture[app.db.get('language')].pause = true;

    res.otherMedia.map( m => {
      m.uri = `${app.folders.recipe_media}${m.uri}`;
      m.type = _checkMediaType(m.type);
      m.pause = true;
    })
    res.media = [res.mainPicture[app.db.get('language')], ...res.otherMedia];

    // Autoplay if main image is video
    if (res.media[0].type === "video") {
      let play_data = {
        currentTarget: {
          dataset: { index: 0, do_pause: false }
        }
      }
      page.toggleVideo(play_data);
    }

    // Description
    // Replace for en
    res.description.en = res.description.en.replace(/\<h1/gi,  '<h1 class="h1"' );
    res.description.en = res.description.en.replace(/color:#\S{3,6}/gi,  '' );
    res.description.en = res.description.en.replace(/\<h2><\/h2>/gi,  '<h2 class="empty-line"><br/><\/h2> ' );
    res.description.en = res.description.en.replace(/\<p><\/p>/gi,  '<p class="empty-line"><br/><\/p> ' );
    res.description.en = res.description.en.replace(/\<img/gi,  '<img class="rich-img" ' );
    // Replace for zh
    res.description.zh = res.description.zh.replace(/\<h1/gi,  '<h1 class="h1"' );
    res.description.zh = res.description.zh.replace(/color:\S{3,6};/gi,  '' );
    res.description.zh = res.description.zh.replace(/\<h2><\/h2>/gi,  '<h2 class="empty-line"><br/><\/h2> ' );
    res.description.zh = res.description.zh.replace(/\<p><\/p>/gi,  '<p class="empty-line"><br/><\/p> ' );
    res.description.zh = res.description.zh.replace(/\<img/gi,  '<img class="rich-img" ' );

    page.setData({
      _recipe: res,
    })

    // Check if user liked this recipe
    app.api.getRecipeLikes({id}).then( res => {
      page.setData({
        is_fav: res.watch
      })
      getOffers(page, id);
    })
  })
}

Page({
  data: {
    _setting: {
      swiper_index: 1,
    },
    saving_new_fav: false,
  },

  onLoad: function(options) {
    const self = this;
    getRecipeDetail(self, options.id);
  },

  onShow: function() {
    const self = this;
    _setPageTranslation(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;
  },

  onHide: function() {
    // Stop all timers
    if (this.data.offers.length) {
      let offers = this.selectComponent('#list_offers');
      offers.updateCards(this.data._t_offers, false);
    }
  },

  onUnload: function() {
    // Stop all timers
    if (this.data.offers.length) {
      let offers = this.selectComponent('#list_offers');
      offers.updateCards(this.data._t_offers, false);
    }
  },

  // Set favourite status
  setFavourite: function() {
    const self = this;
    let new_like_status = !self.data.is_fav;
    self.setData({
      is_fav: new_like_status,
      saving_new_fav: true
    })
    
    app.api.setRecipeLikes(self.options.id, new_like_status).then( res => {
      self.setData({
        saving_new_fav: false
      })
    });
  },

  // Change swiper indicatior
  swiperChange: function(e) {
    const self = this;
    let data = {
      currentTarget: {
        dataset: { index: (self.data._setting.swiper_index - 1), do_pause: true }
      }
    }
    // Pause current video
    self.toggleVideo(data);

    // Play next video
    data.currentTarget.dataset.index = e.detail.current;
    data.currentTarget.dataset.do_pause = false;    
    self.toggleVideo(data);

    self.setData({
      "_setting.swiper_index": (e.detail.current) + 1,
    })
  },

  // To offer list page
  seeOffers: function() {
    app.globalData.index_type = 'list';
    wx.switchTab({
      url: app.routes.home,
    })
  },

  // Toggle video
  toggleVideo: function(e) {
    const self = this;
    let index = e.currentTarget.dataset.index;

    // Only do toggle if image type
    if (self.data._recipe.media[index].type === "image") return;

    // Change pause status
    self.setData({
      [`_recipe.media[${index}].pause`]: e.currentTarget.dataset.do_pause
    });

    // Play or pause video
    let video = wx.createVideoContext(`banner_video_${index}`);
    if (e.currentTarget.dataset.do_pause) {
      video.pause();
    } else {
      video.play();
    }
  },

  onShareAppMessage: function (res) {},
})