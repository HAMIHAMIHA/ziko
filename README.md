# PROJECT NAME MINIPROGRAM
Miniprogram relies on [Wechat Devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) and [Miniprogram backoffice](mp.weixin.qq.com). Make sure they are ready before going into development.

## PROJECT PRE-REQUIREMENTS
1. Download and install **[Wechat Devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)**.
2. Get **miniprogram appid**.
    - If there is no miniprigran_appid available. Go to [Miniprogram backoffice](mp.weixin.qq.com) and register account for a miniprogram.
    - If miniprogram registration cannot be done rightaway. _Test Account_ can be used to begin development.
3. Add **developer** and **api url** in [Miniprogram backoffice](mp.weixin.qq.com). Scan with Wechat to login to the appid miniprogram account. (Test Account will be showing as [some_wechat_id]小程序测试账号 in the list.)
    - Add Developer (with Miniprogram account only):
        - **IMPORTANT:** Dev member must have Settings -> Friends' Permissions -> **Methods for Finding Me -> Weixin Id ON** in Wechat
        - 管理 -> 成员管理 -> 项目成员 -> 编辑 (Need admin access) -> Add user by wechat_id.
    - Set api url:
        -  **IMPORTANT:** The domain must be HTTPS or WSS
        - WITH MINIPROGRAM ACCOUNT: 开发 -> 开发管理 -> 开发设置 -> 服务器域名 -> 修改
        - WITH TEST ACCOUNT: 服务器域名 -> 修改

-----

## PROJECT START
1. Create a **new Miniprogram project** in Wechat Devtools
    - Create new project -> Fill in project information (select "Test Account" under AppID if no appid yet) -> "Use no cloud service" -> Choose a template if needed
2. Set up pages, navbar, and tabbar in **app.json**. Page files will be automatically created after saving. Check the [offical document](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html) for complete app.json setting.
```
{
  "pages": [
    "pages/index/index",
    "pages/[folders]/[pageName]",
    ...
  ],
  "window": {
    "backgroundTextStyle": "dark",
    "navigationBarBackgroundColor": "#11141B",
    "navigationBarTitleText": "Zikoland",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "borderStyle": "white",
    "color": "#CBCFDE",
    "backgroundColor": "#ffffff",
    "selectedColor": "#11141B",
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
  }
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

-----
## DEBUGGING
**IMPORTANT: The project will not compile if it exceeds 2048KB**
1. **Wechat Devtools simulator** is enabled by default. If not enabled: in the top menu -> Interface -> Simulator (cmd + shift + D). Make sure `"lazyCodeLoading": "requiredComponents"` is removed from _app.json_. The simulator content will updated everytime a file is saved.
2. **On developer's phone**, make sure Wechat is opened. In the Devtools -> Preview -> Compile and Preview (cmd + shift + P).

-----
## PRE-PRODUCTION
```
"appid": "wx06b0ecf1ae06ca36"
API_URL = 'https://api-ziko.dev.mediasia.cn/';
```
1. Make sure **appid** in *project.config.json* is not a Test account, **api_url** is setup in backoffice
2. **Upload project** to [Miniprogram backoffice](mp.weixin.qq.com) from Weixin Devtools
    - Click "Upload" button at the top right of the Devtools -> Fill version number and description -> Upload
3. **Set to beta version** in the backoffice.
    - 管理 -> 版本管理 -> find the version needed -> down arrow -> 选为体验版本 -> change default route to home page route set in _app.json_

-----
##  FIRST PRODUCTION
```
"appid": "[miniprogram_appid]"
API_URL = [prod_api];
```
1. **Make a copy** of the project on your machine.
2. Create and switch to **prod branch**.
3. Change **appid** and **all api_url used** in the Miniprogram and push.
    - *project.config.json* -> change `"appid": "wx06b0ecf1ae06ca36"` -> `"appid": "[prod_appid]"`
4. **Upload project** from Devtools to [Miniprogram backoffice](mp.weixin.qq.com).
5. **Make publish request** in the backoffice when ready.
    - 管理 -> 版本管理 -> find the version needed 提交审核 -> Confirm -> Fillin version description -> Upload preview videos if needed.
    - **IMPORTANT:** Some project need to requset for extra eligibilities before publish. Check 开发 -> 开发管理 -> 接口设置 in the backoffice.
    - _Offically the request result comes back in 5-7 working days, usually will see a result in 2-3 hours._
6. **Publish** the project from the backoffice once the request went through.
    - 管理 -> 版本管理 -> 审核版本 -> 发布 -> Choose if publish to all or part of users.

_You should now have two copies that are identical except for appid, and all api_url._

-----
## LATER PRODUCTIONS
1. Switch to **prod branch**
2. **Merge dev branch** changes to prod branch. Make sure **appid** in _project.config.json_ and **api_url** are correct and push. 
3. **Upload** to Miniprogram backoffice and **make publish request**.
4. **Publish** once request went through.
