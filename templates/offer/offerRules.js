import db from "../../utils/db.config";

export const getNewFreefall = (offer, product, new_amount) => {
  let cart = db.get('cart') ? db.get('cart') : {};
  let cart_offer = cart[offer] ? cart[offer] : { count: 0, products: {}, total: 0, reducedTotal: 0 };
  let old_amount = cart_offer.products[product._id] ? cart_offer.products[product._id].amount : 0;

  let new_price;
  // Free fall price change
  let reduce = Math.floor((product.stock - product.actualStock + new_amount) / product.freeFall.quantityTrigger) * product.freeFall.dropAmount;
  new_price = Math.max((product.price - reduce), product.freeFall.lowestPrice);

  let prev_price = 0;
  if (cart_offer.products[product._id]) {
    prev_price = cart_offer.products[product._id].price * old_amount
    cart_offer.products[product._id].price = new_price;
  } else {
    prev_price = product.price * old_amount
    cart_offer.products[product._id] = { price: new_price, amount: new_amount };
  }

  cart_offer.reducedTotal += (new_price * new_amount) - prev_price;

  cart[offer] = cart_offer;
  db.set('cart', cart)
}

// Specials
export const checkOfferSpecial = (page, offer) => {
  const _setGift = (gift) => {
    const special = {
      discount: () => {
        page.setData({
          discount: (100 - gift.conditionValue) / 100
        })
      },
      free_delivery: () => {
        page.setData({
          free_delivery: true
        })
      },
    }

    return special[gift.type] ? special[gift.type]() : '';
  }

  offer.miniprogram.zikoSpecials.forEach( s => {
    const _checkCondition = (special) => {
      const conditionReached = {
        first_order: () => {
          return offer.orders < special.conditionValue;
        },
        number_of_order: () => {
          return offer.orders >= special.conditionValue;
        },
        order_for_amount: () => {
          return (page.data._pay_set.reducedTotal - page.data.voucher) >= special.conditionValue;
        },
        x_total_sold_items: () => {
          let sold = [...page.data._offer.miniprogram.packs, ...page.data._offer.miniprogram.items].reduce((p1, p2) => {
            return ( p1.stock - p1.actualStock + p2.stock - p2.actualStock )
          });
          return sold >= special.conditionValue;
        },
        item_x_in_cart: () => {
          let idx = -1;
          Object.values(db.get('cart')[offer.id].products).forEach( (p, i) => {
            if (p.shortName === s.conditionPack && (s.conditionValue > 0 && p.amount >= s.conditionValue)) {
              idx = i;
              return;
            }
          })
          return idx != -1;
        },
      }


      if (conditionReached[special.conditionType]()) {
        _setGift(special.gift)
      }
    }

    _checkCondition(s);
  });
}

export const checkOfferTicket = (page, offer) => {
  let cart = db.get('cart')[offer.id] ? db.get('cart')[offer.id] : null;
  if (!cart) return; // Don't check for tickets if there is no item in cart

  const _checkCondition = {
    buy_for: (condition) => {
      let item_count = 0;
      Object.values(cart.products).forEach( p => {
        item_count += p.amount;
      })

      return Math.floor(item_count / offer.miniprogram.lottery[condition]);
    },
    spend: (condition) => {
      if (cart.reducedTotal) {
        return Math.floor(cart.reducedTotal / offer.miniprogram.lottery[condition]);
      } else {
        return Math.floor(cart.total / offer.miniprogram.lottery[condition]);
      }
    }
  }

  let total_tickets = 0;
  total_tickets += _checkCondition[offer.miniprogram.lottery.conditionType]('conditionValue');

  if (offer.miniprogram.lottery.extraConditionType) {
    total_tickets += _checkCondition[offer.miniprogram.lottery.extraConditionType]('extraConditionValue');
  }

  page.setData({
    '_pay_set.tickets': total_tickets,
  })
}