## 使用说明
1. 获取代码、安装依赖以及启动项目
```bash
git clone git@gitlab.cestc.com.cn:EnablingPlatform/AssetCenter/asset-center-web.git
cd asset-center-web
git checkout update/dev
npm i
npm run start
```

2. vscode安装Eslint插件（扩展搜索安装Eslint），并且settings.json里包含如下配置代码
```bash
"vetur.format.defaultFormatterOptions": {
    "prettier": {
        "semi": false,
        "singleQuote": true,
        "eslintIntegration": true
    },
    "js-beautify-html": {
        "wrap_attributes": "aligned-multiple",
        "wrap-line-length": 100
    }
},
"javascript.format.insertSpaceBeforeFunctionParenthesis": false,
"vetur.format.defaultFormatter.js": "vscode-typescript",
"vetur.format.defaultFormatter.html": "js-beautify-html",
"eslint.codeAction.showDocumentation": {
    "enable": true
},
"eslint.validate": [
    "javascript",
    "javascriptreact",
    {
        "language": "vue",
        "autoFix": true
    }
],
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}
```

3. 安装koroFileHeader插件（扩展搜索安装koroFileHeader），并且settings.json里包含如下配置代码：
```bash
"fileheader.configObj": {
    "autoAdd": false, // 保存自动添加注释，默认开启,
    "language": {
        "js": {
            "head": "/**",
            "middle": " * @",
            "end": " */"
        },
        "css": {
            "head": "/**",
            "middle": " * @",
            "end": " */"
        }
    },
    "annotationStr": {
        "head": "/**", // 自定义注释头部
        "middle": " * @", // 自定义注释中间部分(注意空格,这也是最终生成注释的一部分)
        "end": " */", // 自定义注释尾部
        "use": true // 是否使用自定义注释符号
    },
    "dateFormat": "YYYY-MM-DD"
},
// 头部注释
"fileheader.customMade": {
    "Description": "",
    "Author": "wyh19",
    "Date": "Do not edit"
},
// 在光标处插入函数注释
"fileheader.cursorMode": {
    "param": ""
}
```

4. 打开vue、js等文件，尝试格式化代码，检查是否会修改代码和引起Eslint报错，如果没有说明第二步配置正确了

5. 新建真实的业务项目，拷贝ioc_vue_template目录下除.git和node_modules外的所有文件至业务项目下，安装依赖启动项目，检查功能是否完备。

6. 根据下面要讲的配置和修改，对项目作出基本的修改

## 如何配置和修改
首先遵循一个原则：**尽量不要直接修改框架的代码!**应该将框架建议的修改文件去修改作为第一方案，下面列出建议修改的文件列表：  
1. @/settings.js 项目的基本配置，主要配置项目标题、是否启用动态路由、是否使用框架的登录页，以及不使用框架登录页时使用的外链登录页地址、状态码等
2. @/alter  改目录设计的目的就是为了将框架内部的自定义逻辑抛出至此目录下完成，目前已内置了route的修改逻辑，实际项目中需修改route文件中的函数。
3. @utils/extensions.js utils目录下提供了一些工具函数，为了避免项目开发时自己添加的工具函数会和框架升级产生冲突，设计了extensions.js，将项目中的工具函数尽量增加在这里，如果有常用的函数建议固化到框架中，则通知框架维护者进行维护。
4. @router/index.js  可在constantRoutes变量定义时编写静态路由。注意：自定义的静态路由不能在数组的第一个和最后一个位置。
5. @/styles/variabels.scss 可修改一些样式参数，主要是主题色、navbar的高度、sidebar的宽度，以及菜单的一些样式
6. @/styles/fx-asset-ui-cover.scss 用于在项目中覆盖组件原生的样式。建议组件内部尽量用穿透的方式实现，统一覆盖的地方再来该文件进行统一覆盖
7. @/assets 该目录下，不要删除frame下的资源，可以覆盖实现主题的修改。业务代码相关的资源放在business目录下。
8. @/views/power-views 动态路由对应的页面组件在该目录下编写
9. @/public/static/config.js 该文件配置项目所需的资源链接

## 打包命令说明

|  前端环境  | 打包命令  |
|  ----  | ----  |
| 本地开发  | npm run start |
| 开发环境  | npm run build:dev |
| 测试环境  | npm run build:test |
| 生产部署环境  | npm run build:stage |


## 分支管理

> 公用开发分支：update/dev 提测分支使用提测分支使用：release，例如：release/v1.0.0

## git提交规范

> <p style="color: #f00">本地开发分支在 commit 之前必须先 git pull 拉取远方分支，解决冲突，确保运行正常之后再 git push</p> 

#### 1.git commit 示例

*建议：多commit，每开发/修改一个功能（页面）commit一次，如果一次提交多个功能和页面，描述要多写*

#### 2.格式

```
type(scope):body
```

#### 3.type

- add:新功能（增）
- delete: 删除（删）
- fix：修补bug（改）

#### 4.scope

scope 载体，增删改的对象（文件名/模块名/父级目录名等）最外层可以写project

#### 5.body
commit的简短描述，建议使用中文


#### 6.示例
```
add(until.js):添加深拷贝功能
add(/views):添加login模块
add(project):添加登陆模块

delete(until.js):删除深拷贝功能
delete(/views):删除 login模块
delete(project):删除images文件夹

fix(until.js):修复xxx功能bug
fix(/views):重构登陆模块
fix(project):替换图片a
```


## 其它信息

> UI设计: https://lanhuapp.com/web/#/item/project/stage?pid=45d727cc-84a8-41df-bab5-ecbf9a873b3c

> 后端接口: http://172.15.33.102:8081/xiaoyaoji/dashboard?v=2.1.5

> UI组件库: http://172.15.33.108/fx-asset-ui/#/zh-CN/component/ui-standard-2.0

> 后端接口前端配置方案：https://www.yuque.com/ioc-fe/my09g7/zwn6xe

> css中类名命名建议：https://www.yuque.com/ioc-fe/un1bfu/fkqgd4


## 使用的主要第三方库

| 工程架子 | 开发框架 | UI组件库 | 流程图编辑器 | 富文本编辑器 |
| --------- | --------- | --------- | --------- | --------- |
| Magic-pc | Vue.js | Cestc-ui | G6 | TinyMC |
| V0.0.1 | V2.6.10 | V0.2.5 | V3.5.2 | V5.5.1 |

