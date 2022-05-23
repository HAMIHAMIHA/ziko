import db from "../../utils/db.config";

// Calculate new total
const _getNewTotal = (cart_offer, product, amounts, new_price) => {
  let prev_price = 0;
  if (cart_offer.products[product._id]) {
    prev_price = cart_offer.products[product._id].price * amounts.old
    cart_offer.products[product._id].price = new_price;
  } else {
    prev_price = product.price * amounts.old
    cart_offer.products[product._id] = { price: new_price, amount: amounts.new };
  }
  cart_offer.reducedTotal = cart_offer.reducedTotal ? cart_offer.reducedTotal + (new_price * amounts.new) - prev_price : cart_offer.total + (new_price * amounts.new);
  return cart_offer;
}

// Multiple / Free fall
export const getRulePrice = (rule, offer, product, amount = -1) => {
  const cart = db.get('cart') ? db.get('cart') : {};
  const cart_offer = cart[offer] ? cart[offer] : { count: 0, products: {}, total: 0, reducedTotal: 0 };
  let amounts = { old: cart_offer.products[product._id] ? cart_offer.products[product._id].amount : 0 };
  amounts.new = amount >= 0 ? amount : amounts.old;

  // Merge rules
  let new_price = 0;
  const _rule_check = {
    free_fall: () => {
      // Free fall price change
      let reduce = Math.floor((product.stock - product.actualStock + amounts.new) / product.freeFall.quantityTrigger) * product.freeFall.dropAmount;
      new_price = Math.max((product.price - reduce), product.freeFall.lowestPrice);
    },
    multiple: () => {
      // Find max multiple reached
      let m_val = 0;
      product.multipleItem.forEach( m => {
        if (amounts.new >= m.quantity && m_val < m.quantity) {
          new_price = m.unitPrice;
          return;
        }
      })
    }
  }
  _rule_check[rule]();

  // Update local storage
  cart[offer] = _getNewTotal(cart_offer, product, amounts, new_price);
  db.set('cart', cart);

  // Return value if needed
  return [amounts.old, new_price];
}

export const getBoursePrice = (offer, product, amount = -1) => {
  const cart = db.get('cart') ? db.get('cart') : {};
  const cart_offer = cart[offer.id] ? cart[offer.id] : { count: 0, products: {}, total: 0, reducedTotal: 0 };
  let amounts = { old: product && cart_offer.products[product] ? cart_offer.products[product].amount : 0 };
  amounts.new = amount >= 0 ? amount : amounts.old;

  // Find current bourse price
  let new_price = offer.miniprogram.items[0].price; // Set orignal price in case 0 is not in calculation
  let new_total_sold = offer.addon_sold + cart_offer.count - amounts.old + amounts.new;
  offer.miniprogram.bourses.forEach( b => {
    if (new_price > b.unitPrice && new_total_sold >= b.from) {
      new_price = b.unitPrice;
    }
  })

  // Changing unit price for each product in cart and total price for order
  let cart_total = 0;
  offer.miniprogram.items.forEach( p => {
    let cart_product = cart_offer.products[p._id] ? cart_offer.products[p._id] : { amount: 0, price: p.price };
    if (p._id === product) {
      cart_total = cart_total + new_price * amounts.new;
    } else {
      cart_total += new_price * cart_product.amount;
    }

    cart_product.price = new_price;
    cart_offer.products[p._id] = cart_product;
  });

  offer.miniprogram.packs.forEach( p => {
    let cart_product = cart_offer.products[p._id] ? cart_offer.products[p._id] : { amount: 0, price: p.price };
    if (p._id === product) {
      cart_total = cart_total + p.price * amounts.new;
    } else {
      cart_total += p.price * cart_product.amount;
    }

    cart_offer.products[p._id] = cart_product;
  })

  cart_offer.reducedTotal = cart_total;
  cart[offer.id] = cart_offer;
  db.set('cart', cart);

  if (product && cart_offer.products[product].type === 'packs') {
    return [amounts.old, product.price];
  }
  return [amounts.old, new_price];
}

// Specials
export const checkOfferSpecial = (page, offer) => {
  const _setGift = (gift) => {
    const special = {
      discount: () => {
        page.setData({
          discount: (100 - gift.discountAmount) / 100
        })
      },
      free_delivery: () => {
        page.setData({
          free_delivery: true,
          '_pay_set.finalFee': page.data._pay_set.reducedTotal ? page.data._pay_set.reducedTotal : page.data._pay_set.total,
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
          return (page.data._pay_set.reducedTotal - page.data.voucher.amount) >= special.conditionValue;
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
            if (p.shortName === special.conditionPack) {
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

// Calcualte possible tickets with items in cart
export const checkOfferTicket = (page, offer) => {
  let cart = db.get('cart')[offer.id] ? db.get('cart')[offer.id] : null;
  if (!cart) return; // Don't check for tickets if there is no item in cart

  // Same check for but item or pack
  const _compareProduct = (condition) => {
    let item_count = 0;
    Object.values(cart.products).forEach( p => {
      item_count += p.amount;
    })

    return Math.floor(item_count / offer.miniprogram.lottery[condition]);
  }

  // Check for possible price for the offer
  const _checkSpent = (condition) => {
    if (cart.reducedTotal) {
      return Math.floor(cart.reducedTotal / offer.miniprogram.lottery[condition]);
    } else {
      return Math.floor(cart.total / offer.miniprogram.lottery[condition]);
    }
  }

  const _checkCondition = {
    buy: (condition) => {
      return _compareProduct(condition);
    },
    pack_bought: (condition) => {
      return _compareProduct(condition);
    },
    buy_for: (condition) => {
      return _compareProduct(condition);
    },
    first_order: (condition) => {
      return condition > offer.orders;
    },
    spend: (condition) => {
      return _checkSpent(condition);
    },
    spend_for: (condition) => {
      return _checkSpent(condition);
    },
  }

  let total_tickets = 0;
  if (_checkCondition[offer.miniprogram.lottery.conditionType]) {
    total_tickets += _checkCondition[offer.miniprogram.lottery.conditionType]('conditionValue');
  }

  if (offer.miniprogram.lottery.extraConditionType && _checkCondition[offer.miniprogram.lottery.extraConditionType]) {
    total_tickets += _checkCondition[offer.miniprogram.lottery.extraConditionType]('extraConditionValue');
  }

  page.setData({
    '_pay_set.tickets': total_tickets,
  })
}

// Voucher check
export const checkVouchers = (page, vouchers, community) => {
  let vouchers_filtered = vouchers.filter(v => {
    let c_idx = v.communities.findIndex( c => c === community );
    return v.amount <= page.data._pay_set.finalFee && c_idx > -1 && v.status != 'used' && v.offer != page.data._offer.id;
  });

  page.setData({
    voucher_count: vouchers_filtered.length
  })
}