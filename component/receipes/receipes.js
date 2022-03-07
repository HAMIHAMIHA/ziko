import mock from './mock.js'

let _doAppendMasonry = (page, items) => {
    // 获取接口数据后使用瀑布流组件append方法，当append完成后调用then，是否可触底价在的标志位可以在这里处理
    page.selectComponent('#masonry').append(items).then(() => {
      console.debug('Receipe append completed')
    })
  }

Component({
  properties: {
  },
  data: {
    items: mock,
  },
  options: {
    addGlobalClass: true
  },
  ready: function () {
    let self = this;
    console.log('receipe show');
    // data.items = get api
    _doAppendMasonry(self, self.data.items);
  },
  methods: {
    filterRecipes: function(e) {
      // e.filter
    //     _doAppendMasonry(self, new_data);
    }
  }
})
