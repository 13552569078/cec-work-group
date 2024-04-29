# asset-shop-manage-web

运营中心前端仓库

## 使用说明
1. 获取代码、安装依赖以及启动项目
```bash
git clone git@code.cestc.cn:productdevdept/generalplatform/infrastructure/web/ioc_vue_template.git
cd ioc_vue_template
git checkout custom
yarn
yarn run start
```
### 说明
```
    npm run start 本地开发运行命令
    npm run build:dev 开发环境打包命令
    npm run build:test 测试环境打包命令
    npm run build:stage 部署环境打包命令
    npm run lib:temp 生成 cestc-ioc-temp-pack 的影子目录temp-lib，供查看公用代码逻辑。temp-lib目录下代码禁止业务代码中使用。cestc-ioc-temp-pack 工具包提供基础业务逻辑代码，例如：布局，公用组件，方法，用户中心服务接口，消息通知等
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
 
1. @/settings.js 项目的基本配置，主要配置项目标题、是否启用动态路由、是否使用框架的登录页，以及不使用框架登录页时使用的外链登录页地址、状态码等
2. @/alter  动态路由的实现逻辑，如果不使用动态路由无需关注。
4. @router/index.js 默认路由表（一般不做改动），@router/system.js应用系统路由表。
5. @/styles/variabels.scss 可修改一些样式参数，主要是主题色、navbar的高度、sidebar的宽度，以及菜单的一些样式
6. @/styles/cestc-ioc-ui-cover.scss 用于在项目中覆盖组件原生的样式。建议组件内部尽量用穿透的方式实现，统一覆盖的地方再来该文件进行统一覆盖
7. @/assets 业务代码相关的资源放在business目录下。
9. @/public/static/config.js 该文件配置项目所需的接口服务及登出页面地址配置。

## 配套说明

https://ioc-fe.yuque.com/ioc-fe/my09g7/dxiaxk



