// Data for map clickable area
export const map_filters = [
  {
    name: "kitchen",
    width: 375,
    height: 245,
    xPos: 0,
    yPos: 0,
    shape: "polygon(0 0, 100% 0, 100% 44%, 35% 100%, 0 70%)",
  }, {
    name: "farm",
    width: 220,
    height: 252,
    xPos: 155,
    yPos: 130,
    shape: "polygon(100% 0, 100% 100%, 0 50%)",
  }, {
    name: "cellar",
    width: 281,
    height: 300,
    xPos: 0,
    yPos: 200,
    shape: "polygon(0 0, 100% 54%, 13% 100%, 0 93%)",
  }, {
    name: "pet",
    width: 299,
    height: 320,
    xPos: 76,
    yPos: 353,
    shape: "polygon(0% 46%, 94% 95%, 108% 87%, 100% 11%, 81% 0)",
  }, {
    name: "pet",
    width: 340,
    height: 191,
    xPos: 0,
    yPos: 477,
    shape: "polygon(0 1%, 100% 100%, 0 100%)",
  }
]


// Class name and icon for top slider filter
export const list_filtes = [
  {
    class_name: "zikoland",
    filter_group: "",
    icon: "ziko_right"
  }, {
    class_name: "ziko-kitchen gradient-text",
    filter_group: "kitchen",
    icon: "ziko-kitchen_sides"
  }, {
    class_name: "ziko-garden gradient-text",
    filter_group: "garden",
    icon: "ziko-garden_sides"
  }, {
    class_name: "ziko-cellar gradient-text",
    filter_group: "cellar",
    icon: "ziko-cellar_sides"
  }, {
    class_name: "ziko-pet gradient-text",
    filter_group: "pet",
    icon: "ziko-pet_sides"
  }
]

// TEMP offer data
export const offer_data = [{
  id: '01',
  community: "kitchen",
  lottery: true,
  specials: true,
  started: true,
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 13:00",
  items: 2
}, {
  id: '02',
  community: "cellar",
  lottery: true,
  specials: false,
  started: true,
  priceRule: "regular",
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 16:00",
  items: 1
// }, {
//   id: '03',
//   community: "cellar",
//   lottery: false,
//   specials: true,
//   started: true,
//   priceRule: "bourse",
//   startTime: "2021-09-21 14:00",
//   endTime: "2021-12-20 19:00",
//   items: 2
// }, {
//   id: '04',
//   community: "cellar",
//   lottery: true,
//   specials: true,
//   started: true,
//   priceRule: "freeFall",
//   startTime: "2021-09-21 14:00",
//   endTime: "2021-12-20 19:00",
//   items: 2
// }, {
//   id: '05',
//   community: "cellar",
//   lottery: false,
//   specials: true,
//   started: true,
//   priceRule: "multiple",
//   startTime: "2021-09-21 14:00",
//   endTime: "2021-12-20 19:00",
//   items: 2
}, {
  id: '06',
  community: "pet",
  lottery: true,
  specials: true,
  started: true,
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 19:30",
  items: 2
}, {
  id: '07',
  community: "garden",
  lottery: false,
  specials: true,
  started: true,
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 19:00",
  items: 2
}, {
  id: '3',
  community: "kitchen",
  lottery: false,
  started: true,
  specials: true,
  startTime: "2021-10-21 14:00",
  endTime: "2021-12-20 19:00"
}, {
  id: '02',
  community: "cellar",
  lottery: true,
  specials: false,
  started: true,
  priceRule: "regular",
  startTime: "2021-10-21 14:00",
  endTime: "2021-12-20 19:00"
}]