// Data for map clickable area
export const map_filters = [
  {
    name: "kitchen",
    id: '60541eab7b87f1126ecf53e1',
    width: 375,
    height: 255,
    xPos: 0,
    yPos: 0,
    shape: "polygon(0 0, 100% 0, 100% 48%, 37% 100%, 0 70%)",
  }, {
    name: "garden",
    id: '60541eb37b87f1126ecf53e2',
    width: 220,
    height: 252,
    xPos: 155,
    yPos: 138,
    shape: "polygon(100% 0, 100% 100%, 0 50%)",
  }, {
    name: "cellar",
    id: '60541eb87b87f1126ecf53e3',
    width: 285,
    height: 330,
    xPos: 0,
    yPos: 197,
    shape: "polygon(0 0, 100% 50%, 0 100%)",
  }, {
    name: "pet",
    id: '60541ebc7b87f1126ecf53e4',
    width: 270,
    height: 250,
    xPos: 120,
    yPos: 365,
    shape: "polygon(2% 43%, 94% 100%, 100% 19%, 71% 2%)",
  // }, {
  //   name: "baby",
  //   width: 240,
  //   height: 191,
  //   xPos: 0,
  //   yPos: 477,
  //   shape: "polygon(46% 4%, 100% 42%, 19% 100%, 0 100%, 0 35%)",
  }
]

// Class name and icon for top slider filter
export const list_filter = [
  {
    key: 'all',
    id: '',
    class_name: "zikoland",
    filter_group: "",
    icon: "ziko_sides"
  }, {
    key: 'kitchen',
    id: '60541eab7b87f1126ecf53e1',
    class_name: "ziko-kitchen gradient-text",
    filter_group: "kitchen",
    icon: "ziko-kitchen_sides"
  }, {
    key: 'garden',
    id: '60541eb37b87f1126ecf53e2',
    class_name: "ziko-garden gradient-text",
    filter_group: "garden",
    icon: "ziko-garden_sides"
  }, {
    key: 'cellar',
    id: '60541eb87b87f1126ecf53e3',
    class_name: "ziko-cellar gradient-text",
    filter_group: "cellar",
    icon: "ziko-cellar_sides"
  }, {
    key: 'pet',
    id: '60541ebc7b87f1126ecf53e4',
    class_name: "ziko-pet gradient-text",
    filter_group: "pet",
    icon: "ziko-pet_sides"
  // }, {
  //   class_name: "ziko-baby gradient-text",
  //   filter_group: "baby",
  //   icon: "ziko-baby_sides"
  }
]

export const communities = {
  "60541eab7b87f1126ecf53e1": 'kitchen',
  "60541eb37b87f1126ecf53e2": 'garden',
  "60541eb87b87f1126ecf53e3": 'cellar',
  "60541ebc7b87f1126ecf53e4": 'pet',
}

export const voucher_status = {
  "all": "",
  "used": "used",
  "unused": "validated",
}

export const bourse_colors = ['#F1B85F', '#D599BD', '#6DBDB4', '#6CB3E7', '#8181E5', '#E78A94'];