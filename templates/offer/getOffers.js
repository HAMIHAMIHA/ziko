import { getUserInfo, showLoading } from "../../utils/common";
import { communities } from "../../utils/constants";
import { findIndex } from "../../utils/util";
import { checkOfferTicket, getBoursePrice, getRulePrice } from "./offerRules";

const app = getApp();
let lotteries = [];
let purchase_timer;

// Clear countdown timer interval
export const _clearCountdown = (page, countdown_timer) => {
  let timer = page.selectComponent('#countdown');
  timer.setTimer(countdown_timer, false);
  return [];
}

// Get page translations
export const _getTranslations = (page, community) => {
  let i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.offer
  })

  // Set page content translation
  page.setData({
    _language: app.db.get('language'),
    _t: {
      bourse_payment_message: i18n.bourse_payment_message,
      items: i18n.items,
      item_unit: i18n.item_unit,
      item_quantity: i18n.item_quantity,
      lower_price_together: i18n.lower_price_together,
      minimum: i18n.minimum,
      next_lottery_in: i18n.next_lottery_in,
      no_recipes: i18n.no_recipes,
      offer_special_names: i18n.offer_special_names,
      offer_special_details: i18n.offer_special_details,
      order_unit: i18n.order_unit,
      orders: i18n.orders,
      orders_unit: i18n.orders_unit,
      our_selected_packs: i18n.our_selected_packs,
      pay: i18n.pay,
      price_rules: i18n.price_rules,
      products: i18n.products,
      recipes: i18n.recipes,
      related_recipes: i18n.related_recipes,
      remaining_time: i18n.remaining_time,
      single_items: i18n.single_items,
      total_units_available: i18n.total_units_available,
      viewers: i18n.viewers,
    },
    _t_product: {
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      available: i18n.available,
      only_left: i18n.only_left,
      products_left: i18n.products_left,
      storage_types: i18n.storage_types,
      units: i18n.units[community],
      freefall: i18n.freefall,
      multiple: i18n.multiple,
    },
    _t_lottery: {
      extra_ticket: i18n.extra_ticket,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      rmb: i18n.rmb,
      ticket: i18n.ticket,
    },
    _t_prize: {
      _language: app.db.get('language'),
      extra_ticket: i18n.extra_ticket,
      draw: i18n.draw,
      item_quantity: i18n.item_quantity,
      locked: i18n.locked,
      lottery_prizes: i18n.lottery_prizes,
      lottery_stages: i18n.lottery_stages,
      no_winner_yet: i18n.no_winner_yet,
      offer_special_details: i18n.offer_special_details,
      offer_special_names: i18n.offer_special_names,
      orders: i18n.orders,
      quantity_bottle_sold: i18n.quantity_bottle_sold,
      terms_and_conditions: i18n.terms_and_conditions,
      unlocked: i18n.unlocked,
      winner: i18n.winner,
      you_win: i18n.you_win,
    },
    _t_recipes: {
      _language: app.db.get('language'),
      baking: i18n.baking,
      minutes: i18n.minutes,
      preparation: i18n.preparation,
    }
  })
}

// Get recipes
const _getRecipes = (page, offer) => {
  let recipes = [];
  const recipeCallback = res => {
    recipes = recipes.concat(res);
    page.setData({
      recipes: recipes,
    })
    page.selectComponent('#recipes-component').updateRecipes(recipes);
  }

  // Products search
  let products = [];
  let _updateProducts = item => {
    let p_idx = products.findIndex( p => { p === item.product.id });
    if (p_idx === -1) {
      products.push(item.product.id);
    }
  }

  // Packs product
  if (offer.miniprogram.packs.length > 0) {
    offer.miniprogram.packs.forEach( item => {
      item.products.forEach(_updateProducts)
    })
  }

  // Single items
  if (offer.miniprogram.items.length > 0) {
    offer.miniprogram.items.forEach(_updateProducts)
  }

  if (products.length === 0) {
    page.setData({
      recipes: []
    })
    return;
  }
  let suffix = `?status=available&sort=["createdAt","DESC"]&filter={"products":{"$in":["${products.join('","')}"]}}`;
  // Get pinned recipes
  app.api.getRecipes({ detail: `${suffix}&pinTop=true` }).then( res => {
    recipes = res;
    // Get rest of recipes
    app.api.getRecipes({ detail: `${suffix}&pinTop=false` }).then(recipeCallback)
  })
}

// Modify for pack product info string
export const packProductDetail = function(offer) {
  let units = app.globalData.i18n.units[offer.community];
  let item_unit = app.globalData.i18n.item_unit;
  let items_unit = app.globalData.i18n.items_unit;

  offer.total = 0;
  offer.sold = 0;
  offer.miniprogram.packs.map( item => {
    let details = [];
    offer.total += item.stock;
    offer.sold += (item.stock - item.actualStock);

    item.products.forEach( product => {
      details.push(
        `${product.product.name[app.db.get('language')]} ${ product.quantity ? product.quantity : '' }${ product.quantity && product.weight ? 'x' : '' }${ product.weight ? `${product.weight}` : '' }${ product.weight ? units : product.quantity == 1 ? item_unit : items_unit }`
      );
    })
    item.products_info = details.join(', ');
  })
  return offer;
}

// Get Offer
export const getOffer = function(page, offer_id) {
  const callback = res => {
    let offer = res[0];

    // Banner
    offer.media.map( m => m.uri = `${app.folders.offer_media}${m.uri}` )
    let banner = {};
    if (offer.banner) {
      if (offer.banner[app.db.get('language')]) {
        banner = offer.banner[app.db.get('language')];
      } else if (app.db.get('language') === 'zh' && offer.banner.en) {
        banner = offer.banner.en;
      } else if (app.db.get('language') === 'en' && offer.banner.zh) {
        banner = offer.banner.zh;
      }
    }
    banner.uri = `${app.folders.offer_banner}${banner.uri}`;
    offer.media = [banner, ...offer.media];

    offer.community = communities[offer.community.id];
    offer = packProductDetail(offer);

    // Add to total
    offer.miniprogram.items.forEach( i => {
      offer.total += i.stock;
      offer.sold += (i.stock - i.actualStock);
    })

    offer.sold = 0;
    // Product / Pack name
    let offer_products = [...offer.miniprogram.items, ...offer.miniprogram.packs];
    let product_name_list = {};

    offer_products.forEach( p => {
      offer.sold += (p.stock - p.actualStock);

      // Check for and Change all free fall product price 
      if (p.freeFall && p.freeFall.quantityTrigger) {
        getRulePrice("free_fall", offer.id, p);
      }

      // Check for multiple price
      if (p.multipleItem && p.multipleItem.length > 0) {
        getRulePrice("multiple", offer.id, p)
      }      

      // Get list of product names for special and lottery message
      let p_name = '';
      if (p.products) {
        p_name = `${p.name[app.db.get('language')]}`;
      } else {
        p_name = `${p.product.name[app.db.get('language')]}`;
      }
      product_name_list[p.shortName] = p_name;
    })

    // Check for bourse unit price
    if (offer.type === 'bourse') {
      getBoursePrice(offer, null);
      page.setBourseGraph(offer);
    }

    // Cellar Lottery detail
    if (offer.miniprogram.lotteryEnable && offer.miniprogram.lottery.draws.length > 0) {
      offer.miniprogram.lottery.draws.sort( (a, b) => {
        return a.conditionValue - b.conditionValue;
      })

      offer.last_val = offer.miniprogram.lottery.draws[offer.miniprogram.lottery.draws.length - 1].conditionValue;
      if ( offer.miniprogram.lottery.draws[0].conditionType === "number_of_order" ) {
        offer.lottery_progress = Math.round(offer.orders / offer.last_val * 100);
      } else {
        offer.lottery_progress = Math.round(offer.sold / offer.last_val * 100);
      }

      let prev = 0; // Used to calculate position for tag
      offer.miniprogram.lottery.draws.forEach( draw => {
        let winners = [];
        lotteries.forEach( l => {
          if (l.offerDrawId === draw._id){
            l.winners.forEach( w => {
              if (w.order && w.order.customer && winners.findIndex( winner => { return winner.id === w.order.customer.id }) === -1) {
                winners.push(w.order.customer);
              }
            })
          }
        });
  
        // Set size of axis mark
        draw.position = Math.round(draw.conditionValue / offer.last_val * 100);
        prev = draw.conditionValue;
  
        draw.winners = winners
        draw.unlocked = ((draw.conditionType === "number_of_order" && offer.orders >= draw.conditionValue) ||  (draw.conditionType === "x_item_sold" && offer.sold >= draw.conditionValue));
      })

      offer.miniprogram.lottery.draws = [{
        conditionValue: 0,
        position: 0,
        _id: '000'
      }, ...offer.miniprogram.lottery.draws]
    }

    getUserInfo(page);

    // Set page data
    page.setData({
      _current_user: app.db.get('userInfo').customer.id,
      _offer_setting: {
        folders: {
          product_picture: app.folders.product_picture
        },
        language: app.db.get('language'),
        routes: {
          product: app.routes.product
        },
      },
      _pay_set: {
        cart: app.db.get('cart')[offer.id] ? app.db.get('cart')[offer.id].count : 0,
        minimum: {
          price: offer.minimumOrderAmount,
          items: offer.minimumCartItems,
        },
        total: app.db.get('cart')[offer.id] ? app.db.get('cart')[offer.id].total : 0,
        reducedTotal: app.db.get('cart')[offer.id] ? app.db.get('cart')[offer.id].reducedTotal : 0,
      },
      _offer: offer,
      _product_names: product_name_list,
      cart: app.db.get('cart')[offer.id],
    })

    // Lottery Ticket amount check
    if (offer.miniprogram.lotteryEnable) {
      checkOfferTicket(page, offer);
    }

    // Change page translation
    _getTranslations(page, offer.community);

    // Count down
    page.startCountdown();

    // Set products height on load
    wx.createSelectorQuery().select('#products').boundingClientRect().exec( res => {
      page.setData({
        "_setting.height": `${res[0].height}px`,
      })
    })

    // Hide loading modal
    showLoading(false);

    // Update quantity button setting
    let quantity_changers = page.selectAllComponents('.product-quantity');
    quantity_changers.forEach( changer => {
      let products = [...offer.miniprogram.packs, ...offer.miniprogram.items];
      let product_id = changer.data.product_id;
      let product = products[findIndex(products, product_id, '_id')];
      changer.updateData(app.db.get('cart')[offer.id], product);
    });

    // Get related recipes
    _getRecipes(page, offer);

    // Start interval for updating user purchase
    startBuyerInterval(page, offer_id);
  }

  showLoading(true);
  // Update number of views for offer before getting offer
  app.api.setOfferView(offer_id).then(res => {
    app.api.getLotteries(`offer=${offer_id}`).then( res => {
      lotteries = res;
      app.api.getOffers(`?id=${offer_id}`).then(callback);
    });
  });
}

// Switch tabs
export function switchTabs(page, tab) {
  const _getHeight = () => {
    return new Promise((resolve) => {
      if (tab === "recipe") {
        wx.createSelectorQuery().select('#recipes').boundingClientRect().exec( res => {
          resolve(res[0].height);
        })
      } else {
        wx.createSelectorQuery().select('#products').boundingClientRect().exec( res => {
          resolve(res[0].height);
        })
      }
   })
  }

  let left = (tab === "recipe") ? "-100vw" : "0";
  _getHeight().then( res => {
    page.setData({
      "_setting.currentTab": tab,
      "_setting.height": `${res}px`,
      "_setting.left": left
    })
  });
}

// Get offer messages
export function getOfferBuyers(page, offer_id) {
  let _t = app.globalData.i18n;
  let offer = page.data._offer;
  let messages = page.data.messages;

  const callback = res => {
    // Set up messages
    if (messages.length < res.length) {
      let new_messagaes = res.slice(messages.length, res.length);
      new_messagaes.forEach( order => {
        let message = `${order.name}${ _t.ordered }`;
        let cart = [];
        order.cart.forEach( c => {
          cart.push(`${ _t[c.type] } ${ c.shortName }`);
        })
        message += cart.join(', ');
        messages.push(message);
      })

      if (messages.length > 0) {
        page.selectComponent('#scroll_messages').show(messages);
      }
    }

    // Check if there is a new purchase and update offer page contents
    // if (res.length === offer.orders) return;

    let new_purchases = res.slice((offer.orders - 1), res.length); // Only check purchases not included in offer data

    // Update offer orders amount
    offer.orders = res.length;

    let new_sold = 0;
    new_purchases.forEach( order => {
      order.cart.forEach( item => {
        // Change stock amount in offer
        let list_name = 'packs';
        if (item.type === 'item') {
          list_name = 'items';
        }
        let item_idx = offer.miniprogram[list_name].findIndex( i => i.shortName === item.shortName );
        offer.miniprogram[list_name][item_idx].actualStock -= item.amount;

        // Calculate newly sold amount
        new_sold += item.amount;

        // Check if winner of lottery
        // TODO
      });
      offer.sold += new_sold; // Update offer total sold
    })

    // Check for bourse unit price
    if (offer.type === 'bourse') {
      getBoursePrice(offer, null);
      page.setBourseGraph(offer);
    }

    // Set next lottery or special
    // Save special and lottery with number sold condition and number order condition to one list
    let gift_list = offer.miniprogram.zikoSpecials.filter(s => { return s.conditionType === 'first_order' || s.conditionType === 'x_total_sold_items' || s.conditionType === "number_of_order"; });
    console.log('special', offer.miniprogram.zikoSpecials)
    console.log('special count down', gift_list);
    if (offer.miniprogram.lotteryEnable) {
      console.log('lottery', offer.miniprogram.lottery.draws);
      gift_list = gift_list.concat(offer.miniprogram.lottery.draws.slice(1))
    }

    console.log('all', gift_list);

    if (gift_list.length > 0) {
      // Switch position for number sold or number orders from special into lottery
      gift_list.sort( (a, b) => {
        if (b.conditionType === 'first_order') b.conditionType = "number_of_order";
        if (a.conditionType === b.conditionType) {
          return a.conditionValue - b.conditionValue;
        }
      })

      console.log('sorted', gift_list);
      // Check which ones are unlocked
      let unlocked = 0;
      let first_locked = -1;
      let text = '';

      gift_list.forEach( (d, i) => {
        if (!d.conditionType) return;
        if (d.conditionType === "number_of_order" && offer.orders >= d.conditionValue && unlocked < i) {
          unlocked++;
          d.unlocked = true;
        } else if (d.conditionType === "x_item_sold" && offer.sold >= d.conditionValue && unlocked < i) {
          unlocked++;
          d.unlocked = true;
        } else if (first_locked === -1) {
          first_locked = i;
          text = d.conditionType === "x_item_sold" ? 'items_sold' : 'orders_sold';
        }
      })

      // Set next lottery message
      let next = null;
      if (first_locked > -1) {
        next = offer.miniprogram.lottery.draws[first_locked];
        next.text = text;
      }

      page.setData({
        next_lottery: next
      })
  
      // Update lottery progress
      if (offer.miniprogram.lottery.draws[0].conditionType === "number_of_order" ) {
        offer.lottery_progress = Math.round(offer.orders / offer.last_val * 100);
      } else {
        offer.lottery_progress = Math.round(offer.sold / offer.last_val * 100);
      }
    }

    let offer_products = [...offer.miniprogram.items, ...offer.miniprogram.packs];
    offer_products.forEach( p => {
      // Check for and Change all free fall product price 
      if (p.freeFall && p.freeFall.quantityTrigger) {
        getRulePrice("free_fall", offer.id, p);
      }

      // Check for multiple price
      if (p.multipleItem && p.multipleItem.length > 0) {
        getRulePrice("multiple", offer.id, p)
      }
    })

    // Set page data
    page.setData({
      "_pay_set.reducedTotal": app.db.get('cart')[offer.id] ? app.db.get('cart')[offer.id].reducedTotal : 0,
      _offer: offer,
      cart: app.db.get('cart')[offer.id],
    })

    // Refresh components
    let lottery_list = page.selectComponent('#lottery_list');
    if (lottery_list) lottery_list.refresh(offer);
  }

  app.api.getOfferBuyers(offer_id).then(callback);
}

// Start interval for checking offer buyer update
export function startBuyerInterval(page, offer_id) {
  purchase_timer = setInterval( () => {
    getOfferBuyers(page, offer_id);
  }, 1000)
}

export function clearBuyerInterval() {
  clearInterval(purchase_timer);
}

// Stop timer on page unload
export const unloadOfferPage = (page) => {
  let pages = getCurrentPages();
  let previous_page = pages[pages.length - 2];
  (previous_page && previous_page.filterOffers) ? previous_page.filterOffers({}) : '';
}