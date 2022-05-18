# PROJECT NAME MINIPROGRAM

## PROJECT PRE-REQUIREMENTS
1. [Weixin Devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. Miniprogram appid. _Test account_ can be used to start developing first.
3. In [Miniprogram backoffice](mp.weixin.qq.com) set up the api url

-----

## PROJECT START
1. Create a new Miniprogram project in Weixin Devtools
2. Set up navbar, tabbar, and pages in *app.json*
```
{
  "pages": [
    "pages/index/index",
    "pages/[folders]/[pages]"
  ],
  "tabBar": {
    "borderStyle": "[black/white]",
    "color": "#[unselected_text_color_in_hex]",
    "backgroundColor": "#[background_color_in_hex]",
    "selectedColor": "#[selected_text_color_in_hex]",
    "list": [
      {
        "pagePath": "[page_path_same_as_in_pages]",
        "iconPath": "[icon_location]/[unselected_icon_name.png]",
        "selectedIconPath": "[icon_location]/[selected_icon_name.png]",
        "text": "[TAB NAME]"
      }, {
        [max_5_tabs]
      }
    ]
  },
  "window": {
    "backgroundTextStyle": "[dark/light]",
    "navigationBarBackgroundColor": "[hex color]",
    "navigationBarTitleText": "[PROJECT NAME]",
    "navigationBarTextStyle": "[black/white]"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

-----
## PRE-PRODUCTION
- Make sure appid in *project.config.json* is not a Test account
```
"appid": "[miniprogram_appid]"
```
- Upload project to [Miniprogram backoffice](mp.weixin.qq.com) from Weixin Devtools
- Set project to beta version in the backoffice.

-----
##  FIRST PRODUCTION
1. Make a copy of the project on your machine.
2. Create a *prod* branch.
3. Change appid and api_url used in the Miniprogram and push.
4. Upload project to [Miniprogram backoffice](mp.weixin.qq.com).
5. Make publish request when ready. *Some project need to requset for certain eligibilities before publish.*
*You should now have two copies that are identical except for appid, and api_url.*

-----
# LATER PRODUCTIONS
1. Switch to *prod* branch
2. Merge *dev* branch changes to *prod* branch. **Make sure appid in *project.config.json* and app_url is the ones used for prod** and push. 
3. Upload to Miniprogram backoffice and request for make publish request.

-----
## APPID AND API URL
#### Pre-Production
*project.config.json:*
```
"appid": "wx06b0ecf1ae06ca36"
```
*properties.js:*
```
const API_URL = "https://api-ziko.dev.mediasia.cn/";
```

#### Production
*project.config.json:*
```
"appid": ""
```
*properties.js:*
```
const API_URL = ""
```

-----
## OTHER USEFUL STUFF
1. Create *properties.js* under /utils to keep all API settings and import in *app.js*
```
 export const API_URL = "[api_url]";
```
2. Create *routes.js* page saving all page routes.
3. Set up basic style in *app.wxss*
    - Create default variables `--variable_name` to be used in all .wxss files as `var(--variable_name)`
    - Use `--env-` for IPhone compatibility
```
/* 兼容 iOS < 11.2 */
@supports (padding: constant(safe-area-inset-bottom)) {
  page {
    --env-: constant( safe-area-inset-bottom, 0px);
  }
}

 /* 兼容 iOS > 11.2 */
@supports (padding: env(safe-area-inset-bottom)) {
  page {
    --env-: env(safe-area-inset-bottom);
  }
}
```
3. Copy */internationalize*, *db.config.js* from previous project