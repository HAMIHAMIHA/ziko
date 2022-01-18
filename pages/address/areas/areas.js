const { findIndex } = require("../../../utils/util");

const app = getApp();

const _getAreas = (all_areas, parent_id) => {
  let new_areas = []
  const filtered_areas = all_areas.filter((e) => e.parent === parent_id)
  if (filtered_areas.length) {
    for (const line of filtered_areas) {
      let childs = _getAreas(all_areas, line.id)

      new_areas.push({
        value: line.id,
        label: line.name,
        children: childs.length ? childs : undefined,
      })
    }
  }

  return new_areas;
}

const _find_current = (current_id, all_areas) => {
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

const getAddressAreaList = page => {
  const callback = {
    success: res => {
      let areas = _getAreas(res);
      page.setData({
        _temp : res,
        _areas: areas,
        _selected: _find_current(page.options.id, res) // TEMP need for when already selected
      })
    }
  }
  app.api.getAreas(callback);
}

Page({
  onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.select_area
    })

    // Set page translation
    self.setData({
      _t: {
        area: i18n.area,
        select: i18n.select,
      },
    })

    getAddressAreaList(self);
  },

  // Change picker result
  updatePicker: function(e) {
    const self = this;

    let new_index = e.detail.value;
    let picker_level = e.currentTarget.dataset.picker_level;

    let selected = self.data._selected
    selected = selected.slice(0, picker_level);
    selected[picker_level] = new_index;

    self.setData({
      _selected: selected
    })
  },

  select: function(e) {
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
      area: self.data._areas
    })

    // Go back to address page
    wx.navigateBack({
      delta: 1,
    })
  }
})