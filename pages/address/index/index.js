const app = getApp();
const routes = app.routes;

Page({
  data: {
    address: [
      {id: 1},
      {id: 2}
    ],
    _routes: {
      address_detail: routes.address_detail
    }
  }
})