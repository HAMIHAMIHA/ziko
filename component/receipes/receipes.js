import mock from './mock.js'

var masonryListComponent;
let _doRefreshMasonry = (page, items) => {
  let self = page;
  self.masonryListComponent = self.selectComponent('#masonry');
  self.masonryListComponent.start(items).then(() => {
    console.debug('Receipe refresh completed')
  })
}

let _doAppendMasonry = (page, items) => {
    let self = page;
    masonryListComponent = self.selectComponent('#masonry')
    // 获取接口数据后使用瀑布流组件append方法，当append完成后调用then，是否可触底价在的标志位可以在这里处理
    masonryListComponent.append(items).then(() => {
      console.debug('Receipe append completed')
    })
  }

Component({
  properties: {
    items: {
      type: Object,
      value: mock,
    },
    // recipes: {
    //   type: Object,
    //   value: mock,
    // },
  },
  options: {
    addGlobalClass: true
  },
  
  ready: function () {
    let self = this;
    console.log('receipe show');
    _doAppendMasonry(self, self.data.items);
  },

  methods: {
    // onReachBottom: function(data) {
    //   let self = this;
      
    //   if (data) {
    //     _doAppendMasonry(self, data);
    //   }
    // }
  }
})
