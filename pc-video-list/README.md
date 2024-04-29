# PC端基于Vite的项目模板

## 内置如下库：
- hongluan-ui
- hongluan-business-ui
- @hongluan-ui/icons
- @hongluan-ui/styles
- hongluan-hooks
- fx-front-framework
- jczh-api-library（npm公网、私库都发布了；私库地址：http://nexus.cestc.cn:31111/repository/aqyjnpm_group）

## Vue
- 直接使用setup语法开发，已经内置DefineOptions插件

## 分支说明

### 1、dev-user 分支

- 供普通用户（应用管理员）使用的项目，对接鸿灵普通用户 api。
- 适用项目如：协同标绘、协同会商、值班排班...

### 2、dev-admin 分支

- 供管理员（超级管理员）使用的项目，对接鸿灵管理员 api。
- 适用项目如：统一配置中心，监测中枢、预警中枢...

### 3、dev-layout 分支

- 不带鸿灵操作的干净layout demo

## @hongluan-ui/styles
- 项目整体使用了pro主题库，SCSS配置文件在src/assets/styles/config.scss。
- 在src/assets/styles/layout.scss和pages.scss中做了一些整体样式定制，可根据需求改动

## 用户登录相关
- 设置鸿灵 clientType：设置为你自己项目的名称即可，用于给鸿灵请求做标识，方便排查鸿灵接口请求问题。  
![demo](https://code.cestc.cn/jcyzh/at/front/pc-webpack-template/-/raw/dev-admin/clientType.jpg)
- 默认会跳转到login页面，开发阶段可在router中进行修改
- 采取token登录，内置了相应的src/views/login/index.vue和api模块
- 登录后默认跳转路径请更改src/views/login/index.vue中的跳转路径

## 示例
- 内置了一个src/views/landing/monitor.vue页面
- 地址：http://localhost:8345/landing/index

## 路由
- 参见src/router/index.ts配置方法

## 常见问题
- 从私库安装报 E401 错误（无权限） ，请尝试：  
1、npm login --registry http://nexus.cestc.cn:31111/repository/aqyjnpm_group  
2、用公司 LDAP 账号登录，如登录失败，请与运维鲍德录联系开通权限
3、如运维开通权限后，安全依然报 401，请检查 npm 版本，升级到最新（至少 8.7.0）：npm i npm -g


```shell
npm i --force

npm run serve

npm run build
```

![demo](https://code.cestc.cn/jcyzh/at/front/pc-webpack-template/-/raw/dev-admin/demo.png)
