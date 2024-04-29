/* eslint-disable */
// const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: isProduction ? `/${process.env.PROD_PREFIX}` : "/",
  outputDir: 'dist',
  assetsDir: "./static",
  transpileDependencies: ["@vue/reactivity"],
  parallel: false,
  pages: {
    index: {
      entry: "src/main",
      template: "public/index.html",
      filename: "index.html",
      title: process.env.TITLE_SWAN_DUTY_SCHEDULE
    }
  },
  lintOnSave: !isProduction ? "error" : false,
  productionSourceMap: !isProduction,
  devServer: {
    host: "127.0.0.1",
    port: 8346,
    https: false,
    open: true,
    headers: {
      "Access-Control-Allow-Origin": "127.0.0.1"
    },
    proxy: {
      '/ucenterProxyApis': {
        target: 'https://www.jczhtest.etcc.group/swan-gateway/swan-ucenter/',
        changeOrigin: true,
        pathRewrite: {
          '^/ucenterProxyApis': ''
        },
      },
      '/linkage-command-op-server': {
        target: 'https://www.jczhtest.etcc.group/swan-gateway/',
        changeOrigin: true,
        pathRewrite: {
          '^/linkage-command-op-server': ''
        },
      },
    }
  },
  css: {
    extract: !!isProduction,
    sourceMap: !isProduction
  },
  configureWebpack: () => {
    let baseConfig = {};
    baseConfig = {
      resolve: {
        // 第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
        mainFields: ["jsnext:main", "browser", "main"],
        alias: {
          "normalize-wheel-es": "normalize-wheel-es/dist/index.mjs",
          "async-validator": "async-validator/dist-web/index.js",
          "@apis": path.resolve(__dirname, "src/apis"),
          "@common": path.resolve(__dirname, "src/common"),
          "@image": path.resolve(__dirname, "src/assets/image"),
          "@utils": path.resolve(__dirname, "src/utils"),
          "@vuex": path.resolve(__dirname, "src/vuex")
        },
        fallback: {
          "fs": false,
          "path": false,
        },
      },
      plugins: [
        require('unplugin-vue-define-options/webpack')(),
        require('unplugin-vue-components/webpack')({
          resolvers: [
            name => {
              if (name.startsWith('Hl')) { return { importName: name, path: 'hongluan-ui' }; }
            },
            name => {
              if (name.startsWith('Hb')) { return { importName: name, path: 'hongluan-business-ui' }; }
            },
            (name) => {
              if (name.startsWith('Two') || name.startsWith('Fill') || name.startsWith('File'))
                return { importName: name, path: '@hongluan-ui/icons' }
            },
            name => {
              if (name.startsWith('Fx')) { return { importName: name, path: 'pc-fx-framework' }; }
            }
          ]
        }),
      ],
    };
    if (isProduction) {
      // 为生产环境修改配置...
      const newPlugins = [
        // 压缩代码
        new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // true 不删除源文件 false 删除源文件
        })
      ];
      baseConfig.plugins.push(...newPlugins);
    }
    // 为开发环境修改配置...
    const newPlugins = [

    ];
    baseConfig.plugins.push(...newPlugins);
    return baseConfig;
  },
  chainWebpack: config => {
    config.plugin("define").tap(args => {
      args[0]["process.env"].PROD_PREFIX = JSON.stringify(process.env.PROD_PREFIX);
      args[0]["process.env"].TITLE_CENTRE_CONFIG = JSON.stringify(process.env.TITLE_CENTRE_CONFIG);
      args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL);
      args[0]["process.env"].HONGLING_BASE_URL = JSON.stringify(process.env.HONGLING_BASE_URL);
      args[0]["process.env"].API_PREFIX_CENTRE_CONFIG = JSON.stringify(process.env.API_PREFIX_CENTRE_CONFIG);
      args[0]["process.env"].FILE_SERVICE = JSON.stringify(process.env.FILE_SERVICE);
      args[0]["process.env"].FILE_VIEW = JSON.stringify(process.env.FILE_VIEW);
      args[0]["process.env"].SWAN_TENANT_ID_SETTINGS_PORTAL = JSON.stringify(process.env.SWAN_TENANT_ID_SETTINGS_PORTAL);
      args[0]["process.env"].SWAN_SYSTEM_ID_SETTINGS_PORTAL = JSON.stringify(process.env.SWAN_SYSTEM_ID_SETTINGS_PORTAL);
      // 
      args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL);
      args[0]["process.env"].API_PREFIX_EVENT_HANDLE_STRATEGY = JSON.stringify(process.env.API_PREFIX_EVENT_HANDLE_STRATEGY);
      args[0]["process.env"].API_PREFIX_SWAN_UCENTER = JSON.stringify(process.env.API_PREFIX_SWAN_UCENTER);
      args[0]["process.env"].PORTAL_URL = JSON.stringify(process.env.PORTAL_URL);
      args[0]["process.env"].SWAN_TENANT_ID_SWAN_EVENT_HANDLE = JSON.stringify(process.env.SWAN_TENANT_ID_SWAN_EVENT_HANDLE);
      args[0]["process.env"].SWAN_SYSTEM_ID_SWAN_EVENT_HANDLE = JSON.stringify(process.env.SWAN_SYSTEM_ID_SWAN_EVENT_HANDLE);
      args[0]["process.env"].TITLE_INTELLIGENT_EVENT_SCHEDULING = JSON.stringify(process.env.TITLE_INTELLIGENT_EVENT_SCHEDULING);

      args[0]["process.env"].API_PREFIX_USER_CENTER = JSON.stringify(process.env.API_PREFIX_USER_CENTER);
      args[0]["process.env"].CLIENT_ID_EVENT_HANDLE = JSON.stringify(process.env.CLIENT_ID_EVENT_HANDLE);
      args[0]["process.env"].CALLBACK_URL_CENTRE_CONFIG = JSON.stringify(process.env.CALLBACK_URL_CENTRE_CONFIG);
      args[0]["process.env"].LOGIN_URL_USER_CENTER = JSON.stringify(process.env.LOGIN_URL_USER_CENTER);

      return args;
    })
  }
};
