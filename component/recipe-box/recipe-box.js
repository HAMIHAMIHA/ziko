const app = getApp();

Component({
  properties: {
    item: Object,
    _t: Object,
  },
  data: {
    _routes: {
      recipe: app.routes.recipe
    },
  },

  options: {
    addGlobalClass: true
  }
})