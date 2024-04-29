# 大屏基于Vite的项目模板

## 内置如下库：
- hongluan-ui
- hongluan-business-ui
- @hongluan-ui/icons
- @hongluan-ui/styles
- hongluan-hooks
- fx-front-framework
- hongtu相关（地图）

## Vue
- 直接使用setup语法开发，已经内置DefineOptions插件


## @hongluan-ui/styles
- 项目整体使用了pro主题库，SCSS配置文件在src/assets/styles/config.scss。
- 在src/assets/styles/layout.scss和pages.scss中做了一些整体样式定制，可根据需求改动

## 路由
- 参见src/router/index.ts配置方法

## 常见问题
- 从私库安装报 E401 错误（无权限） ，请尝试：  
1、用公司 LDAP 账号登录，如登录失败，请与运维鲍德录联系开通权限
2、如运维开通权限后，安全依然报 401，请检查 npm 版本，升级到最新（至少 8.7.0）：npm i npm -g


```shell
npm i --force

npm run serve

npm run build
```

![demo](https://code.cestc.cn/jcyzh/at/front/templates/v-webpack-template/-/raw/dev/demo.jpg)
