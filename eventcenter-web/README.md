# eventcenter-web

事件中心web端

## 规范

### 代码书写规范

规范 esLint

### Git协作规范

#### git 分支规范

>  假设协作分支为 dev 分支

**开始开发**
1. 首先拉取 dev 分支, 然后基于 dev 分支新建自己的分支, 分支命名规则 feature-[定制项目如:huangling]-[版本号]

  ```shell
  ## 在dev 分支上进行操作
  git checkout -b feature-v3.x.x
  ```

2. 在自己的分支上进行内容更改, 提交

  ```shell
  git add . -A
  git commit 'update: your update detail'
  ```

**推送到远程**
1. 正常情况下, 可以不限制的推送到自己的远程分支 feature-[定制项目如:huangling]-[版本号]

```shell
git push feature-v3.x.x
// 如果有冲突对于 **自己的分支** 是可以执行 git push -f
// **dev 分支不可以执行 -f**
```

**合并到 dev 分支**
(建议操作 rebase)
1. 自己的分支如果有未提交的代码, 需要先进行提交

```shell
git add . -A
git commit 'update: your update detail'
```

2. 切换到 dev 分支, 拉取最新代码

```shell
git checkout dev
git pull
```

3. 切换到自己的分支, 执行 git rebase dev

```shell
git checkout feature-v3.x.x
git rebase dev  ## 如果有冲突需要进行解决
## rebase 后, 可能出现本地远程分支与自己的当前分支不同的情况, 如果以本地分支为准的话可以执行
git push -f ## 只能在个人分支上操作!!!
```

4. 切换到 dev 分支, 执行 git merge feature-[定制项目如:huangling]-[版本号]

```shell
git checkout dev
git merge feature-v3.x.x ## 前边如果处理顺利, 此处应该不会出现 merge 的提示
git push
```

如果实在不清楚 git 的原理, 或者冲突很多, 可以直接执行 merge 操作, 但是不建议, 会导致 dev 分支分支较多.
(不推荐操作 merge)
1. 自己的分支如果有未提交的代码, 需要先进行提交

```shell
  git add . -A
  git commit 'update: your update detail'
```

2. 切换到 dev 分支, 拉取最新代码

```shell
git checkout dev
git pull
```

3. 切换到自己的分支, 执行 git merge feature-[定制项目如:huangling]-[版本号]

```shell
git checkout feature-v3.x.x
git merge dev # 解决冲突
```

4. 切换到 dev, 进行合并, 推送

```shell
git checkout dev
git merge feature-v3.x.x
git push
```


#### git 提交规范
https://segmentfault.com/a/1190000017205604

### 命名约定

- components 目录, 所有的文件和文件夹 采用 pascal(帕斯卡) 命名的方式, 即 `YourDir/YourComponent.vue` 的方式

- views 目录, 所有的文件和文件夹 采用 kebab 的方式, 即 `your-dir/your-component.vue` 的方式

> view 中大多为路由中使用, 路径地址是不区分大小写的, 所以采用 小写+- 的方式

- router 中的命名规则, 尽量跟后端的接口命名统一, 比如后端的接口为 `api/account`, 那么我们的文件夹命名就为 `account`

## 开发

```bash
npm config set registry=https://registry.npm.taobao.org

# 克隆项目
git clone ssh://xxxx.git

# 进入项目目录
cd xxxx

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527   （具体端口号以实际提示为准）


## 工程结构说明
``` bash
├── build                      // 构建相关  
├── dist                       // 配置相关
│   ├── static                 // 打包结果
├── mock                       // 项目mock 模拟数据
├── plop-templates             // vue组件快速构建模板
├── pubic                      // 应用入口文件模板
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局 filter
│   ├── icons                  // 项目所有 svg icons
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── vendor                 // 公用vendor
│   ├── views                  // view
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口 加载组件 初始化等
│   └── permission.js          // 权限管理
├── tests                       // 测试脚本
├── .editorconfig               // 跨语言、跨IDE的通用编码配置
├── .env.develupment            // 测试环境配置
├── .env.production             // 生产环境配置
├── .env.staging                //
├── .eslintignore               // eslint白名单
├── .eslintrc.js                // eslint配置
├── .gitignore                  // git免跟踪文件清单
├── .travis.yml                 // Travis CI用到的配置
├── babel.config.js             // babel配置
└── jest.config.js              // jest自动化测试配置
└── jsconfig.json               // 目录中存在此类文件表示该目录是JavaScript项目的根目录。 文件本身可以选择列出属于项目的文件，要从项目中排除的文件，以及编译器选项
└── plopfile.js                 // vue组件快速构建模板配置
└── postcss.config.js           // postcss配置
└── vue.config.js               // webpack配置
```

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)


## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |