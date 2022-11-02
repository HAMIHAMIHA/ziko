const {
  changeFocus,
  navigateBack,
  showLoading
} = require("../../../utils/common.js");
const {
  findIndex
} = require("../../../utils/util.js");

const app = getApp();
const address_type = ["office", "home", "other"];
const validate_keys = ['type', 'area', 'city', 'detailedAddress'];
let all_areas = [];

const _getAddressAreas = (page, area_id) => {
  app.api.getAreas().then(res => {
    const area = res[findIndex(res, area_id, 'id')];
    const areas = page.data._areas;

    // Prefill the area
    for (const firstIndex in areas) {
      for (const secondIndex in areas[firstIndex].children) {
        for (const thirdIndex in areas[firstIndex].children[secondIndex].children) {
          if (areas[firstIndex].children[secondIndex].children[thirdIndex].value == area_id) {
            page.setData({
              multiIndex: [parseInt(firstIndex), parseInt(secondIndex), parseInt(thirdIndex)],
            })
            break;
          }
        }
      }
    }

    page.setData({
      area,
      areaSelectedData: {
        value: area.id,
        label: area.name,
      }
    })

    _loadPicker(page)
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
    picker_selected = `${address_type.indexOf(address.type)}`;
    page.setData({
      default: address.default ? address.default : false,
    })
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
  for (var i in validate_keys) {
    (data[validate_keys[i]] == null || data[validate_keys[i]] === '') ? error += `error-field-${i} `: '';

    if (!page.data.areaSelected) {
      error += 'error-field-1 ';
    }
  }

  page.setData({
    error: error
  })

  return error;
}

// Create address data for api
const _generateUserAddress = (page, action, new_address) => {
  let addresses = app.db.get('userInfo').customer.addresses;

  if (action == 'delete') {
    let addr_index = page.data._count;
    addresses.splice(addr_index, 1);
  } else {
    if (page.options.id) {
      if (new_address.default == true) {
        for (const i in addresses) {
          addresses[i].default = false;
        }
      }
      addresses[page.data._count] = new_address;
    } else {
      if (addresses && addresses.length > 0) {
        if (new_address.default == true) {
          for (const i in addresses) {
            addresses[i].default = false;
          }
        }

        addresses.push(new_address);
      } else {
        addresses = [new_address];
      }
    }
  }

  return addresses;
}

//Get Areas
const _getAreas = (parent_id) => {
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
      if (item.children && "length" in item.children) _formatAreas(item.children, index - 1)
      else item.children = [{
        value: item.value,
        label: item.label
      }]
    }
  }
}

const getAddressAreaList = page => {
  console.log("getAddressAreaList")
  const callback = res => {
    all_areas = res;
    let areas = _getAreas();
    _formatAreas(areas, 3);
    console.log("details_areas:", areas);

    page.setData({
      _temp: res,
      _areas: areas,
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

  page.data._areas.map((firstLayer, firstIndex) => {
    state.arr1.push(firstLayer.label);
    if (page.data.multiIndex[0] === firstIndex) {
      state.multiIds[0] = firstLayer;
    }
    if (state.arr2.length <= 0) {
      firstLayer.children.map((secondLayer, secondIndex) => {
        state.arr2.push(secondLayer.label);
        if (page.data.multiIndex[1] === secondIndex) {
          state.multiIds[1] = secondLayer;

          state.arr3 = [];
          secondLayer.children.map((thirdLayer, thirdIndex) => {
            state.arr3.push(thirdLayer.label);
            if (page.data.multiIndex[2] === thirdIndex) {
              state.multiIds[2] = thirdLayer;
            }
          });
        }
        if (state.arr3.length <= 0) {
          secondLayer.children.map((thirdLayer, thirdIndex) => {
            state.arr3.push(thirdLayer.label);
            if (page.data.multiIndex[2] === thirdIndex) {
              state.multiIds[2] = thirdLayer;
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
    default: false,
    areaSelected: false,
  },

  onShow: function () {
    const self = this;
    const i18n = app.globalData.i18n;

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
      areaSelected: self.options.id ? true : false,
      options_judge: self.options.id,
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
        any_special_requests: i18n.any_special_requests,
        please_select: i18n.please_select,
        please_select_your_area: i18n.please_select_your_area,
        please_select_your_city: i18n.please_select_your_city,
        please_enter_your_address: i18n.please_enter_your_address,
        please_enter_your_zip_code: i18n.please_enter_your_zip_code,
        any_special_requests: i18n.any_special_requests,
        select: i18n.select,
        set_default_address: i18n.set_as_default_address,
        tips: i18n.tips,
        delete_it_or_not: i18n.delete_it_or_not,
        confirm: i18n.confirm,
        update: i18n.update,
      },
      _routes: {
        address_areas: app.routes.address_areas,
      }
    })
    getAddressAreaList(self);
    getUserInfo(self);
  },

  // Change picker result
  bindPickerChange: function (e) {
    const self = this;

    let new_index = e.detail.value;

    self.setData({
      'address.type': address_type[new_index],
      _picker_selected: new_index,
    })
  },

  // Change input focus
  next: function (e) {
    changeFocus(this, e);
  },

  // Save address info
  updateAddress: function (e) {
    const self = this;
    let action = e.type; //提交类型
    console.log(action)
    console.log(e.detail.value, "detail value")
    // Go back to address page if cancel
    if (action == 'reset' && !self.options.id) {
      navigateBack(app.routes.address, false);
      return;
    }

    // Stop if saving but inputs empty
    if (action != 'reset' && e.detail.target.dataset.type != 'delete' && _validateInputs(self, e.detail.value)) return;

    // Go back to address page if delete new address
    if (action != 'reset' && e.detail.target.dataset.type == 'delete') {
      wx.showModal({
        title: self.data._t.tips,
        content: self.data._t.delete_it_or_not,
        cancelText: self.data._t.cancel,
        confirmText: self.data._t.confirm,
        success(res) {
          if (res.confirm) {
            showLoading(true);
            let address_list = _generateUserAddress(self, 'delete', []);
            app.sessionUtils.updateUserInfo({
              addresses: address_list
            }, app.routes.address);
            showLoading(false);
            wx.navigateTo(app.routes.address);
            return;
          } else if (res.cancel) {
            console.log('Cancel')
          }
        }
      })

      return;
    } else { // Save address
      showLoading(true);

      // Add address to addrss list
      // let address = e.detail.value;
      const {
        detailedAddress,
        type,
        zipCode,
        city,
        comment
      } = e.detail.value;
      const {
        default: defaultData,
        areaSelectedData
      } = self.data;
      const addressType = address_type[type]?.toLowerCase();
      const area = areaSelectedData.value;
      const address = {
        area,
        detailedAddress,
        type: addressType,
        zipCode,
        city,
        default: defaultData,
        comment
      }
      console.log(address, "address")
      // address ? address.type = self.data.address.type : '';
      // address ? address.area = self.data.area.id : '';
      let address_list = _generateUserAddress(self, action, address);
      console.log("address_list", address_list)

      app.sessionUtils.updateUserInfo({
        addresses: address_list
      }, app.routes.address);
      showLoading(false);
      wx.navigateTo(app.routes.address);
    }
  },

  select: function (e) {
    const self = this;
    let selected = self.data._selected;

    // Get area data
    let area = self.data._areas;
    for (var i = 0; i < selected.length; i++) {
      area = i == 0 ? area[selected[i]] : area.children[selected[i]];
    }

    // Set area data to address detail page
    let pages = getCurrentPages();
    let prev = pages[pages.length - 2];

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

  setDefault: function () {
    const self = this;

    self.setData({
      default: !self.data.default,
    })
  },

  _selectArea: function () {
    const self = this;
    const [index1, index2, index3] = self.data.multiIndex;
    console.log("index1", index1, index2, index3)
    const areaSelectedData = self.data._areas[index1]?.children[index2]?.children[index3]
    self.setData({
      areaSelectedData
    });
  },

  bindAreaChange(e) {
    const self = this
    console.log('bindAreaChange', e)
    self.setData({
      areaSelected: true,
    })
    
    let data = {
      newArr: self.data.newArr,
      multiIndex: self.data.multiIndex,
      multiIds: self.data.multiIds,
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    let searchColumn = () => {
      let arr1 = [];
      let arr2 = [];
      self.data._areas.map((firstLayer, firstIndex) => {
        if (data.multiIndex[0] === firstIndex) {
          data.multiIds[0] = {
            ...firstLayer,
          };
          firstLayer.children.map((secondLayer, secondIndex) => {
            arr1.push(secondLayer.label);
            if (data.multiIndex[1] === secondIndex) {
              data.multiIds[1] = {
                ...secondLayer,
              };
              secondLayer.children.map((thirdLayer, thirdIndex) => {
                arr2.push(thirdLayer.label);
                if (data.multiIndex[2] === thirdIndex) {
                  data.multiIds[2] = {
                    ...thirdLayer,
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
        // Switch to the default value
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        searchColumn();
        break;
      case 1:
        data.multiIndex[2] = 0;
        searchColumn();
        break;
    }
    self._selectArea();
    self.setData(data);
  },
})