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
    _folders: {
      recipe_picture: app.folders.recipe_picture
    }
  },

  options: {
    addGlobalClass: true
  }
})