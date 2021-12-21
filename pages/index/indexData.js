// TODO waiting for offical image
export const map_filters = [
  {
    name: "kitchen",
    width: 135,
    height: 60,
    xPos: 25,
    yPos: 45
  }, {
    name: "baby",
    width: 115,
    height: 55,
    xPos: 235,
    yPos: 50
  }, {
    name: "pet",
    width: 135,
    height: 60,
    xPos: 220,
    yPos: 555
  }
]

export const list_filtes = [
  {
    class_name: "zikoland",
    filter_group: "all",
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
  id: '4',
  community: "cellar",
  lottery: true,
  specials: true,
  started: true,
  startTime: "2021-10-21 14:00",
  endTime: "2021-12-20 19:00"
}]