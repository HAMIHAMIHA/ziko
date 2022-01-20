import { findIndex } from "../../utils/util";

let fees = [];

/**
getDeliveryFee = function(offer, order) {
  const that = this;

  return new Promise((resolve, reject) => {
      if (order.type === 'daily') {
          return resolve(0);
      }
      let feesAmount = -1;
      let upToMax = -1;
      const [productAmount, totalValue] = that.getProductAmount(order, offer);
      that.getMostAccurateFee(order.customerAddress.area, offer.fees).then((correctArea) => {
          console.log('correctArea FOUND');
          console.log(correctArea);
          for (const i in offer.fees) {
              if (offer.fees[i].area.equals(correctArea.id)) {
                  for (const j in offer.fees[i].rules) {
                      const rule = offer.fees[i].rules[offer.fees[i].rules.length - j - 1];
                      switch (rule.type) {
                      case 'flat':
                          if (rule.fee < feesAmount || feesAmount === -1) {
                              feesAmount = rule.fee;
                          }
                          break;

                      case 'free_after_quantity':
                          if (productAmount >= rule.quantity) {
                              feesAmount = 0;
                          }
                          break;

                      case 'free_after_value':
                          if (totalValue >= rule.quantity) {
                              feesAmount = 0;
                          }
                          break;

                      case 'up_to':
                          if (upToMax === -1) {
                              upToMax = rule.quantity;
                              feesAmount = rule.fee;
                          } else if (upToMax > rule.quantity && productAmount < rule.quantity) {
                              upToMax = rule.quantity;
                              feesAmount = rule.fee;
                          }

                          break;
                      default:
                          console.log('Delivery fee rule have no type');
                      }
                      if (feesAmount === 0) {
                          break;
                      }
                  }
                  break;
              }
          }
          resolve(feesAmount);
      }).catch((err) => {
          // TODO REMOVE THAT
          resolve(1);
          // reject(err);
      });
  });
}
 */

const _findClosestRule = (fees, area, area_list) => {
  let area_index = findIndex(area_list, area, 'id');
  let area_detail = area_list[area_index];

  let fee_index = fees.findIndex(item => item.area.id == area);

  // Rule found for area
  if (fee_index > -1) {
    return fee_index;
  }

  // Find rule for area's parent
  if (area_detail.parent) {
    return _findClosestRule(fees, area_detail.parent, area_list);
  }

  // In case rule not found
  return null;
}

const _calculateFee = (fee_detail, cart) => {
  // Check if free value exist and reched
  let free_values = fee_detail.rules.filter(item => item.type == 'free_after_value');

  for (var i in free_values) {
    let rule = free_values[i];
    console.log('free rule', rule);
    console.log('total', cart.total);
    if (cart.total >= rule.quantity) {
      console.log('free val');
      return 0;
    }
  }

  // Rules other than free value (by Antoine)
  let rules = fee_detail.rules.filter(item => item.type != 'free_after_value');
  let max = 0;
  let fee = 0;

  console.log('rules',rules);
  console.log('cart', cart.count);
  rules.forEach( rule => {
    console.log('qty rule', rule);
    let quantity = rule.quantity ? rule.quantity : 0;
    console.log(max);
    console.log(quantity);
    if (max <= quantity && quantity <= cart.count ) {
      console.log(rule);
      max = quantity;
      fee = rule.fee ? rule.fee : 0;
    }
  })
  console.log(fee);
  return fee;
}

export const getDeliveryFee = function(page, area, area_list) {
  fees = page.data._offer.fees;
  let fee_index = _findClosestRule(fees, area, area_list);
  page.setData({
    delivery_fee: _calculateFee(fees[fee_index], page.data.cart)
  })
}