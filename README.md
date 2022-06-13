# Ziko miniprogram ![](https://img.shields.io/badge/Version-1.1-informational?style=flat&logoColor=white&color=orange) <img src="https://git.mediasia-group.com/ziko/ziko-backoffice/-/raw/master/src/images/zikoland_logo.png" alt="ziko logo" align="right" height="60" />
![](https://img.shields.io/badge/-JavaScript-informational?style=flat&logo=javascript&logoColor=white&color=blue) ![](https://img.shields.io/badge/-CSS-informational?style=flat&logo=CSS3&logoColor=white&color=blue)

<details>
<summary>Table of content</summary>

-   [Abstract](#abstract)
    -   [Pages](#pages)
-   [Pre-Reqirements](#pre-requirements)
-   [Create Project](#create-project)
-   [Debugging](#debugging)
-   [Pre Production](#pre-production)
-   [Productions](#productions)
    -   [First Production](#first-production)
    -   [Later Productions](#later-productions)
</details>

## ABSTRACT
This is the supporting miniprogram for the project Ziko.
For the backend see [Ziko Backend](https://git.mediasia-group.com/ziko/ziko-backend)
For the backoffice see [Ziko Backoffice](https://git.mediasia-group.com/ziko/ziko-backoffice)
Ziko is an online platform providing flash sales for its users on both Wechat groups and its own Wechat Miniprogram.


##### Pages
```
const routes = {
  home: "/pages/index/index",
  account: "/pages/account/index/index",
  account_info: "/pages/account/information/information",
  fapiao: "/pages/account/fapiao/fapiao",
  address: "/pages/address/index/index",
  address_detail: "/pages/address/detail/detail",
  address_areas: "/pages/address/areas/areas",
  cart: "/pages/cart/cart",
  contacts: "/pages/contacts/index/index",
  contact: "/pages/contacts/detail/detail",
  lottery: "/pages/lottery/index/index",
  lottery_detail: "/pages/lottery/detail/detail",
  offer_bourse: "/pages/offer/cellar/bourse/bourse",
  offer_cellar: "/pages/offer/cellar/cellar/cellar",
  offer_regular: "/pages/offer/regular/regular",
  orders: "/pages/orders/index/index",
  order: "/pages/orders/detail/detail",
  product: "/pages/product/product",
  recipes: "/pages/recipes/index/index",
  recipe: "/pages/recipes/detail/detail",
  vouchers: "/pages/vouchers/index/index",
  vouchers_select: "/pages/vouchers/select/select"
}

```        


## PRE-REQUIREMENTS
1. **[Wechat Devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)**.
2. **Miniprogram appid** If miniprogram registration cannot be done rightaway. _Test Account_ can be used to begin development.
3. **Developer Access**
4. **Add API** to the [Miniprogram backoffice](mp.weixin.qq.com): 开发 -> 开发管理 -> 开发设置 -> 服务器域名 -> 修改 -> add api used. (The domain must be secure)


## CREATE PROJECT
1. Create a **new Miniprogram project** in Wechat Devtools
    - Create new project -> Fill in project information (Select "_Test Account_" under AppID if no appid yet) -> "Use no cloud service" -> Choose a template if needed
2. Set up pages, navbar, and tabbar in **app.json**. Page files will be automatically created after saving. Check the [offical document](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html) for complete app.json setting.


## DEBUGGING
**IMPORTANT: The project will not compile on the phone if package exceeds 2048KB**
1. **Wechat Devtools simulator** is enabled by default. If not enabled: in the top menu -> Interface -> Simulator (cmd + shift + D). The simulator content will updated everytime a file is saved.
2. **On developer's phone**, have Wechat opened. In the Devtools -> Preview -> Compile and Preview (cmd + shift + P).


## PRE-PRODUCTION
```
"appid": "wx06b0ecf1ae06ca36"
API_URL = 'https://api-ziko.dev.mediasia.cn/';
```
1. Make sure **appid** in *project.config.json* is not a Test account, and **api_url** is setup in backoffice
2. **Upload project** to [Miniprogram backoffice](mp.weixin.qq.com) from Weixin Devtools
    - Click "Upload" button at the top right of the Devtools -> Fill version number and description -> Upload
3. **Set to beta version** in the backoffice.


##  PRODUCTIONS
###  FIRST PRODUCTION
```
"appid": "[prod_appid]"
API_URL = "[prod_api]";
```
1. **Make a copy** of the project on your machine.
2. Create and switch to **prod branch**.
3. Change **appid** and **all api_url used** in the Miniprogram and push.
    - *project.config.json* -> change `"appid": "wx06b0ecf1ae06ca36"` -> `"appid": "[prod_appid]"`
4. **Upload project** from Devtools to [Miniprogram backoffice](mp.weixin.qq.com).
5. Uploaded version can be find in the backoffice -> 管理 -> 版本管理 -> new version

_You should now have two copies that are identical except for appid, and all api_url._


### LATER PRODUCTIONS
1. Switch to **prod branch**
2. **Merge dev branch** changes to prod branch. Make sure **appid** in _project.config.json_ and **api_url** are correct and push. 
3. **Upload** to Miniprogram backoffice and **make publish request**.
4. **Publish** once request went through.