import { findIndex } from "../../utils/util";

let fees = [];

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
    if (cart.total >= rule.quantity) {
      return 0;
    }
  }

  // Rules other than free value (modified from Antoine's code)
  let rules = fee_detail.rules.filter(item => item.type != 'free_after_value');
  let max = 0;
  let fee = fee_detail.rules.filter(item => item.type === 'flat')[0].fee;

  rules.forEach( rule => {
    let quantity = rule.quantity ? rule.quantity : 0;
    if (max <= quantity && quantity <= cart.count) {
      max = quantity;
      fee = rule.fee ? rule.fee : 0;
    }
  })

  return fee;
}

export const getDeliveryFee = function(page, area, area_list) {
  fees = page.data._offer.fees;
  let fee_index = _findClosestRule(fees, area, area_list);
  let new_fee = _calculateFee(fees[fee_index], page.data.cart);

  console.log(new_fee);
  let total = page.data._pay_set.reducedTotal ? page.data._pay_set.reducedTotal : page.data._pay_set.total;

  page.setData({
    '_pay_set.finalFee': total + new_fee,
    delivery_fee: new_fee
  })
}