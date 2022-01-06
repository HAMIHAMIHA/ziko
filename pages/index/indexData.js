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
    name: "garden",
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
    height: 300,
    xPos: 76,
    yPos: 370,
    shape: "polygon(0% 46%, 94% 95%, 108% 87%, 100% 11%, 81% 0)",
  }, {
    name: "baby",
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
    icon: "ziko_sides"
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
  }, {
    class_name: "ziko-baby gradient-text",
    filter_group: "baby",
    icon: "ziko-baby_sides"
  }
]

// TEMP offer data
export const offer_data = [{
  id: '01',
  name: "Octoberfest with a very",
  community: "kitchen",
  started: true,
  orders: "12",
  viewers: "21",
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 13:00",
  items: 2
}, {
  id: '02',
  name: "Octoberfest with a very",
  community: "cellar",
  started: true,
  priceRule: "regular",
  orders: "12",
  viewers: "21",
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 16:00",
  items: 1
}, {
  id: '06',
  name: "Octoberfest with a very",
  community: "pet",
  started: true,
  orders: "16",
  viewers: "51",
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 19:30",
  items: 2
}, {
  id: '07',
  name: "Octoberfest with a very",
  community: "garden",
  started: true,
  orders: "2",
  viewers: "51",
  startTime: "2021-09-21 14:00",
  endTime: "2021-12-20 19:00",
  items: 2
}, {
  id: '3',
  name: "Octoberfest with a very",
  community: "kitchen",
  started: true,
  orders: "12",
  viewers: "21",
  startTime: "2021-10-21 14:00",
  endTime: "2021-12-20 19:00"
}, {
  id: '02',
  name: "Octoberfest with a very",
  community: "cellar",
  started: false,
  orders: "12",
  viewers: "21",
  priceRule: "regular",
  startTime: "2021-10-21 14:00",
  endTime: "2021-12-20 19:00"
}]