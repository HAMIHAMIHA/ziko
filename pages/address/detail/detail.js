const { changeFocus, navigateBack, showLoading } = require("../../../utils/common.js");
const { findIndex } = require("../../../utils/util.js");

const app = getApp();
const address_type = ["office", "home", "other"];
// const validate_keys = ['type', 'contact', 'city', 'detailedAddress', 'phone'];
// const validate_keys = ['type', 'city', 'detailedAddress'];//__change
const validate_keys = {
  type: address_type,
}
let all_areas = [];

const _getAddressAreas = (page, area_id) => {
  app.api.getAreas().then(res => {
    page.setData({
      area: res[findIndex(res, area_id, 'id')]
    })
  });
}

// Get user profile
async function getUserInfo(page) {
  showLoading(true);
  let user = await app.sessionUtils.refreshUserInfo(null);

  // Set default address info
  let count = Math.max(user.addresses?.length, 0);
  let address = {};
  let picker_selected = '';

  // Set address info if edit
  if (page.options.id) {
    count = findIndex(user.addresses, page.options.id, '_id');
    address = user.addresses[count];
    _getAddressAreas(page, address.area);
    picker_selected = `${address_type.indexOf(address.type)}`
  } else {
    address.contact = user.name;
  }

  showLoading(false);

  page.setData({
    _count: count,
    _picker_selected: picker_selected,
    address: address
  })
}

// Check if input empty
const _validateInputs = (page, data) => {
  let error = '';
  console.log("validate_keys",validate_keys,"data",data)
  for (var i in validate_keys) {
    console.log(i, data[validate_keys[i]]);
    (data[validate_keys[i]] == null || data[validate_keys[i]] === '') ? error += `error-field-${i} ` : '';
  }

  // if (!page.data.area || JSON.stringify(page.data.area) == "{}") {
  //   error += 'error-field-5 ';
  // }
  if (!page.data.city) {
    error += 'error-field-5 ';
  }

  page.setData({
    error: error
  })
  console.error("show-error",error)
  return error;
}

// Create address data for api
const _generateUserAddress = (page, action, new_address) => {
  console.log("generate-user-address",)
  let address = app.db.get('userInfo').customer.addresses;
  console.log("user address", address)

  if (action == 'reset') {
    let addr_index = page.data._count;
    address.splice(addr_index, 1)
  } else {
    if (page.options.id) {
      address[page.data._count] = new_address;
    } else {
      address ? address.push(new_address) : address = [new_address];
    }
  }

  return address;
}

  //Get Province
  const _getAreas = (parent_id) => {//__need
    let new_areas = [];
    const filtered_areas = all_areas.filter((e) => e.parent === parent_id);
    if (filtered_areas.length) {
      for (const line of filtered_areas) {
        let childs = _getAreas(line.id)
        new_areas.push({
          value: line.id,
          label: line.name,
          children: childs.length ? childs : undefined,
        })
      }
    }
    return new_areas;
  }
  const _formatAreas = (areas, index) => {
    if (index > 1) {
      for (const item of areas) {
        if (item.children && "length" in item.children ) _formatAreas(item.children, index - 1)
        else item.children = [{
          value: item.value,
          label: item.label
        }]
      }
    }
  }

  const _find_current = (current_id) => {
    if (!current_id) return [0];
    // Find area and all ancestors
    let selected_rev = [all_areas[findIndex(all_areas, current_id, 'id')]];
    let area = selected_rev[0];
    while (area.parent) {
      selected_rev.push(all_areas[findIndex(all_areas, area.parent, 'id')]);
      area = selected_rev[selected_rev.length - 1];
    }
    // Find index of all selected options
    let selected = [];
    for (var i = selected_rev.length - 1; i >= 0; i--) {
      const filtered_areas = all_areas.filter((e) => e.parent === selected_rev[i].parent)
      selected.push(findIndex(filtered_areas, selected_rev[i].id, 'id'));
    }
    return selected;
  }

  const getAddressAreaList = page => {//__need
    const callback = res => {
      all_areas = res;
      let areas = _getAreas();
      _formatAreas(areas, 3);
      console.log("details_areas:",JSON.stringify(areas));

      page.setData({
        _temp : res,
        _areas: areas,
        _selected: _find_current(page.options.id) // TEMP need for when already selected
      })
      _loadPicker(page);
    }
    app.api.getAreas().then(callback);
  }
function _loadPicker(page) {
  let state = {
    arr: [],
    arr1: [],
    arr2: [],
    arr3: [],
    multiIds: []
  }
  page.data._areas.map((v, vk) => {
    console.log("v, vk", v, vk)
    state.arr1.push(v.label);
    if (page.data.multiIndex[0] === vk) {
      state.multiIds[0] = v;
    }
    if (state.arr2.length <= 0) {
      v.children.map((c, ck) => {
        state.arr2.push(c.label);
        if (page.data.multiIndex[1] === ck) {
          state.multiIds[1] = c;
        }
        if (state.arr3.length <= 0 && c.length === 0) {
          c.children.map((t, tk) => {
            state.arr3.push(t.label);
            if (this.data.multiIndex[2] === tk) {
              state.multiIds[2] = t;
            }
          });
        }
      });
    }
  });
  state.arr[0] = state.arr1;
  state.arr[1] = state.arr2;
  state.arr[2] = state.arr3;
  page.setData({
    newArr: state.arr,
    multiIds: state.multiIds,
  });
}

Page({
  data: {
    city: String,
    multiIndex: [0, 0, 0],
    multiIds: [],
    newArr: [],
  },
  onLoad: function () {
  // onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    if (self.options.back) return;

    showLoading(true);

    // Change page nav title
    wx.setNavigationBarTitle({
      title: self.options.id ? i18n.edit_address : i18n.add_address
    })

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    // Format picker values based on langauge
    let address_picker = [];
    for (var type in address_type) {
      let type_variable = address_type[type];
      address_picker.push(i18n.address_type[type_variable]);
    }

    // Set page translation
    self.setData({
      _picker: {
        address_type: address_picker
      },
      _t: {
        address: i18n.address,
        address_type: i18n.address_type,
        area: i18n.area,
        contact: i18n.contact,
        city: i18n.city,
        comment: i18n.address_comment,
        delete: i18n.delete,
        phone_no: i18n.phone_no,
        save: i18n.save,
        type: i18n.type,
        zipcode: i18n.zipcode,
        cancel: i18n.cancel,
        province: i18n.province,
        any_special_requests:i18n.any_special_requests,
        please_select:i18n.please_select,
        please_select_your_province:i18n.please_select_your_province,
        please_select_your_city:i18n.please_select_your_city,
        please_enter_your_address:i18n.please_enter_your_address,
        please_enter_your_zip_code:i18n.please_enter_your_zip_code,
        any_special_requests:i18n.any_special_requests,
        options_judge:self.options.id,
        select: i18n.select,
        set_default_address: i18n.set_as_default_address,
      },
      _routes: {
        address_areas: app.routes.address_areas,
      }
    })
    getAddressAreaList(self);
    getUserInfo(self);
  },

  // Change picker result
  bindPickerChange: function(e) {
    const self = this;

    let new_index = e.detail.value;

    self.setData({
      'address.type': address_type[new_index],
      _picker_selected: new_index,
    })
  },

  // Change input focus
  next: function(e) {
    changeFocus(this, e);
  },

  // Save address info
  updateAddress: function(e) {
    const self = this;
    let action = e.type; //提交类型
    console.log(action)
    console.log(e.detail.value, "detail value")
    // Go back to address page if delete new address
    if (action == 'reset' && !self.options.id) {
      navigateBack(app.routes.address, false);
      return;
    }

    // Stop if saving but inputs empty
    // __text

    showLoading(true);

    // Add address to addrss list
    // let address = e.detail.value;
    const { detailedAddress, type, zipCode } = e.detail.value;
    const city = this.data;
    const defaultData = this.data.default;
    const addressType = this.data._picker.address_type[type];
    const address = {detailedAddress, type: addressType, zipCode, city, default: defaultData}
    console.log(address, "address")
    // address ? address.type = self.data.address.type : '';
    // address ? address.area = self.data.area.id : '';
    let address_list = _generateUserAddress(self, action, address);
    console.log("address_list", address_list)

    app.sessionUtils.updateUserInfo({ addresses: address_list }, app.routes.address);
  },


  select: function(e) {//__need
    const self = this;

    let selected = self.data._selected;

    // Get area data
    let area = self.data._areas;
    for (var i = 0; i < selected.length; i++) {
      area = i == 0 ? area[selected[i]] : area.children[selected[i]];
    }

    // Set area data to address detail page
    let pages = getCurrentPages();
    let prev = pages[pages.length -2];

    prev.setData({
      area: all_areas[findIndex(all_areas, area.value, 'id')]
    })

    // Set to prevent page filled items refresh in address page
    let options = prev.options;
    options.back = true;
    prev.options = options;

    // Go back to address page
    wx.navigateBack({
      delta: 1,
    })
  },
  setDefault: function() {
    const self = this;

    self.setData({
      default: !self.data.default,
    })
  },
  _selectProvince: function () {
    const [index1, index2, index3] = this.data.multiIndex;
    console.log("index1", index1, index2, index3)
    const province = this.data._areas[index1]?.children[index2]?.children[index3]
    this.setData({province});
  },
  bindProvinceChange(e) {
    console.log('bindProvinceChange', e)
    let data = {
      newArr: this.data.newArr,
      multiIndex: this.data.multiIndex,
      multiIds: this.data.multiIds,
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    let searchColumn = () => {
      let arr1 = [];
      let arr2 = [];
      this.data._areas.map((v, vk) => {
        if (data.multiIndex[0] === vk) {
          data.multiIds[0] = {
            ...v,
          };
          v.children.map((c, ck) => {
            arr1.push(c.label);
            if (data.multiIndex[1] === ck) {
              data.multiIds[1] = {
                ...c,
              };
              c.children.map((t, vt) => {
                arr2.push(t.label);
                if (data.multiIndex[2] === vt) {
                  data.multiIds[2] = {
                    ...t,
                  };
                }
              });

            }
          });
        }
      });
      data.newArr[1] = arr1;
      data.newArr[2] = arr2;
    };
    switch (e.detail.column) {
      case 0:
        // 每次切换还原初始值
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        // 执行函数处理
        searchColumn();
        break;
      case 1:
        data.multiIndex[2] = 0;
        searchColumn();
        break;
    }
    this._selectProvince();
    this.setData(data);
  },


})