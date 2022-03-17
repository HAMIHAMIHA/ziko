Component({
  properties: {
    _t: Object,
  },
  options: {
    addGlobalClass: true
  },
  ready: function () {
    // let self = this;
    // console.log('recipe show');
    // // data.items = get api
    // _doAppendMasonry(self, self.data.items);
  },
  methods: {
    setRecipes: function(recipes) {
      let self = this;
      self.selectComponent('#masonry').append(recipes).then(() => {
        console.debug('Recipe append completed')
      })
    },
    updateRecipes: function(recipes) {
      let self = this;
      self.selectComponent('#masonry').start(recipes).then(() => {
        console.log('refresh completed')
      })
    }
  }
})
