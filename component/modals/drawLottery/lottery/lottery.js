const app = getApp();

let lottery, lottery_winners;

Component({
  methods: {
    show: function (res) {
      // TEST DATA
      res = [
        lottery = {
          channel: "miniprogram",
          conditionType: "number_of_order",
          conditionValue: 7,
          contestants: 2,
          createdAt: "2022-11-15T03:29:11.793Z",
          customer: "6217012af06d31c51e3b7755",
          gifts: [],
          id: "63730787f029af8b29a74ddb",
          offer: {
            "name": {
              "en": "PET - lorraine",
              "zh": "PET - lorraine"
            },
            "description": {
              "en": "Bring your team together\nCreate an open, collaborative workspace for your team. Use channels to organize conversations by topic, area, or anything else.",
              "zh": "Bring your team together\nCreate an open, collaborative workspace for your team. Use channels to organize conversations by topic, area, or anything else."
            },
            "banner": {
              "en": {
                "fieldname": "file",
                "uri": "file-58a22bcc-cbc9-4ec1-a0b8-1c604370062a.jpg",
                "name": "lectra-industry-4.0-outlook.jpg",
                "size": 50762,
                "type": "image/jpeg",
                "hash": "4f7af008e878433f957cfbbda22d9566",
                "uploadedAt": "2022-11-07T10:01:15.905Z"
              },
              "zh": {
                "fieldname": "file",
                "uri": "file-11290c23-6810-48d4-accd-854754fab023.jpg",
                "name": "lectra-industry-4.0-outlook.jpg",
                "size": 50762,
                "type": "image/jpeg",
                "hash": "4f7af008e878433f957cfbbda22d9566",
                "uploadedAt": "2022-11-07T10:01:19.276Z"
              }
            },
            "wechatGroup": null,
            "miniprogram": {
              "lottery": {
                "conditionType": "order",
                "conditionValue": null,
                "extraConditionType": "spend_for",
                "extraConditionValue": 250,
                "draws": [{
                    "_id": "6368d84ba9829b860d8e44e3",
                    "gifts": [{
                      "_id": "6368d84ba9829b860d8e44e4",
                      "type": "voucher",
                      "voucherExpiration": "2022-11-23T10:04:40.005Z",
                      "voucherValue": 30,
                      "winnerNumber": 1,
                      "singleItem": null,
                      "pack": null,
                      "discountAmount": null,
                      "customImage": null
                    }],
                    "conditionType": "number_of_order",
                    "conditionValue": 3
                  },
                  {
                    "_id": "6368d84ba9829b860d8e44e5",
                    "gifts": [{
                      "custom": {
                        "zh": "111",
                        "en": "111"
                      },
                      "_id": "6368d84ba9829b860d8e44e6",
                      "type": "custom",
                      "voucherExpiration": "2022-11-23T10:04:42.322Z",
                      "voucherValue": 50,
                      "winnerNumber": 2,
                      "singleItem": null,
                      "pack": null,
                      "discountAmount": null,
                      "customImage": {
                        "fieldname": "file",
                        "uri": "file-a26debf4-2b92-48d7-b3c2-f4da55892193.jpeg",
                        "name": "AdobeStock_268120288.jpeg",
                        "size": 16149,
                        "type": "image/jpeg",
                        "hash": "2fb658157e3479befe33aa931ea6b346",
                        "uploadedAt": "2022-11-11T03:12:31.582Z"
                      }
                    }],
                    "conditionValue": 5,
                    "conditionType": "number_of_order"
                  },
                  {
                    "_id": "6368d84ba9829b860d8e44e7",
                    "gifts": [{
                      "_id": "6368d84ba9829b860d8e44e8",
                      "type": "add_on",
                      "voucherExpiration": "2022-11-23T10:04:44.539Z",
                      "voucherValue": 70,
                      "winnerNumber": 1,
                      "singleItem": "A",
                      "pack": null,
                      "discountAmount": null,
                      "customImage": null
                    }],
                    "conditionValue": 7,
                    "conditionType": "number_of_order"
                  },
                  {
                    "_id": "636dbdd9be3ad6ed8070a27e",
                    "gifts": [{
                      "_id": "636dbdd9be3ad6ed8070a27f",
                      "type": "discount",
                      "discountAmount": 50,
                      "winnerNumber": 1,
                      "singleItem": null,
                      "pack": null,
                      "voucherValue": null,
                      "voucherExpiration": null,
                      "customImage": null
                    }],
                    "conditionType": "number_of_order",
                    "conditionValue": 9
                  }
                ],
                "conditionPackId": null
              },
              "lotteryEnable": true,
              "packs": [],
              "items": [{
                "_id": "6368d84ba9829b860d8e44e1",
                "multipleItem": [],
                "product": {
                  "name": {
                    "en": "High end Tofu cat litter",
                    "zh": "High end Tofu cat litter"
                  },
                  "description": {
                    "en": "No chemical additive, flushable cat sand, formulated in Japan",
                    "zh": "No chemical additive, flushable cat sand, formulated in Japan"
                  },
                  "mainPicture": {
                    "en": {
                      "fieldname": "file",
                      "uri": "file-9cd9dee3-e30a-454a-b202-d7fd0573cfff.jpg",
                      "name": "WeChat Image_20220701094653.jpg",
                      "size": 332744,
                      "type": "image/jpeg",
                      "hash": "ff78996a12a16ff247bf0644789810a2",
                      "uploadedAt": "2022-07-01T01:47:18.976Z"
                    },
                    "zh": {
                      "fieldname": "file",
                      "uri": "file-af3f6b99-4483-48c9-bcba-27ae91bcf2a2.jpg",
                      "name": "WeChat Image_20220701094653.jpg",
                      "size": 332744,
                      "type": "image/jpeg",
                      "hash": "ff78996a12a16ff247bf0644789810a2",
                      "uploadedAt": "2022-07-01T01:47:22.175Z"
                    }
                  },
                  "technicalSheet": {
                    "en": {
                      "fieldname": "file",
                      "uri": "file-a59853f1-c907-4875-99cb-6cbbc9d0f23b.jpg",
                      "name": "WeChat Image_20220701094653.jpg",
                      "size": 332744,
                      "type": "image/jpeg",
                      "hash": "ff78996a12a16ff247bf0644789810a2",
                      "uploadedAt": "2022-07-01T01:47:24.910Z"
                    },
                    "zh": {
                      "fieldname": "file",
                      "uri": "file-3ab49928-13d7-4d0c-9096-cb143b505fee.jpg",
                      "name": "WeChat Image_20220701094653.jpg",
                      "size": 332744,
                      "type": "image/jpeg",
                      "hash": "ff78996a12a16ff247bf0644789810a2",
                      "uploadedAt": "2022-07-01T01:47:27.988Z"
                    }
                  },
                  "storageType": "dry",
                  "diet": [],
                  "status": "available",
                  "otherMedia": [],
                  "productId": "NEKP00001",
                  "price": 0,
                  "retailPrice": 49,
                  "supplier": "62be51826f9c684f588ee0ec",
                  "productType": "6061b46f97e30d267cbdeca5",
                  "createdAt": "2022-07-01T01:47:30.161Z",
                  "updatedAt": "2022-07-01T01:47:30.161Z",
                  "id": "62be52326f9c684f588ee0ed"
                },
                "stock": 500,
                "quantity": 1,
                "weight": 500,
                "weightType": "g",
                "price": 120,
                "formerPrice": 130,
                "shortName": "A",
                "actualStock": 484,
                "targetSales": null
              }],
              "zikoSpecials": [{
                "gift": {
                  "type": "free_delivery",
                  "winnerNumber": null,
                  "singleItem": null,
                  "pack": null,
                  "voucherValue": null,
                  "voucherExpiration": null,
                  "discountAmount": null,
                  "customImage": null
                },
                "_id": "6368d84ba9829b860d8e44e2",
                "conditionType": "item_x_in_cart",
                "conditionPack": "A",
                "conditionValue": null
              }],
              "bourses": [],
              "_id": "63721c8cc3c2cd3448e391c0"
            },
            "media": [{
              "fieldname": "file",
              "uri": "file-f280aae1-0f8a-48cb-b687-05da51a074eb.jpg",
              "name": "lectra-industry-4.0-pioneer.jpg",
              "size": 59877,
              "type": "image/jpeg",
              "hash": "30c1393ba3763b7d526fe46b08a1ea00",
              "uploadedAt": "2022-11-07T10:01:24.580Z"
            }],
            "deliveryDates": [
              "2022-11-17T00:00:00.000Z"
            ],
            "status": "available",
            "fees": [{
              "_id": "62033276f06d31c51e3b67e8",
              "rules": [{
                "_id": "62033276f06d31c51e3b67e9",
                "type": "flat",
                "fee": 5,
                "quantity": null
              }],
              "area": {
                "status": "available",
                "name": "China Mainland",
                "createdAt": "2021-09-29T07:58:46.125Z",
                "updatedAt": "2021-10-26T11:52:45.807Z",
                "id": "60dd98d4cb4986fb25ca11cd"
              }
            }],
            "clipboard": [],
            "internalName": "PET - lorraine",
            "offerID": "NEK9-20221114",
            "community": "60541ebc7b87f1126ecf53e4",
            "channel": "miniprogram",
            "financeType": "service",
            "supplier": "62be51826f9c684f588ee0ec",
            "ghostID": "NEK8-20221114",
            "startingDate": "2022-11-14T10:46:29.714Z",
            "endingDate": "2022-11-18T10:46:32.219Z",
            "commissionRate": 30,
            "deliveryType": "shunfeng",
            "feeTemplate": "62033276f06d31c51e3b67e7",
            "createdAt": "2022-11-14T10:46:36.576Z",
            "updatedAt": "2022-11-15T03:29:11.317Z",
            "views": 24,
            "id": "63721c8cc3c2cd3448e391bd"
          },
          offerDrawId: "6368d84ba9829b860d8e44e7",
          read: false,
          updatedAt: "2022-11-15T03:29:11.793Z",
          winner: true,

        }
      ]
      const _showDraw = () => {
        this.selectComponent('#draw_modal').show(res[0]);
      }

      lottery = res[0];

      lottery_winners = [];
      app.api.getLotteries(`offerDrawId=${res[0].offerDrawId}&offer=${res[0].offer.id}`).then(res => {
        lottery_winners = res[0].winners;
        _showDraw();
      })
    },

    showResult: function (e) {
      const self = this;

      if (lottery.winner) {
        self.selectComponent('#win_modal').showModal(lottery, lottery_winners);
      } else {
        self.selectComponent('#sorry_modal').showModal(lottery, lottery_winners);
      }
    }
  }
})