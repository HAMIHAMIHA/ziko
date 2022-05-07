Component({
  properties: {
    _t: Object,
  },
  options: {
    addGlobalClass: true
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
        console.debug('recipes refresh completed')
      })
    }
  }
})
