import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import fs from 'fs'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Components from 'unplugin-vue-components/vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import { EnvUtils } from 'fx-front-utils'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const envkeys = EnvUtils.getEnvVarKeys(env)

  return {
    base: mode !== 'development' ? `/${env.PROD_PREFIX}/` : "/",
    resolve: {
      alias: {
        "normalize-wheel-es": "normalize-wheel-es/dist/index.mjs",
        "async-validator": "async-validator/dist-web/index.js",
        "@": path.resolve(__dirname, "src"),
        "@apis": path.resolve(__dirname, "src/apis"),
        "@common": path.resolve(__dirname, "src/common"),
        "@image": path.resolve(__dirname, "src/assets/image"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@vuex": path.resolve(__dirname, "src/vuex")
      }
    },
    server: {
      https: false,
      port: 8349,
      client: {
        overlay: false,
      },
      proxy: {
        '/mapbox-component-srv': {
          target: 'http://www.jczhdev.etcc.group',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/apiProxy/, '')
        }
      },
      host: '0.0.0.0' // 启动暴露ip地址
    },

    plugins: [
      eslint(),
      EnvironmentPlugin(envkeys),
      DefineOptions(),
      Components({
        resolvers: [
          (name) => {
            if (name.startsWith('Hl'))
              return { importName: name, path: 'hongluan-ui' }
          },
          (name) => {
            if (name.startsWith('Hb'))
              return { importName: name, path: 'hongluan-business-ui' }
          },
          (name) => {
            if (name.startsWith('Fx'))
              return { importName: name, path: 'fx-front-framework' }
          },
          (name) => {
            if (name.startsWith('Two') || name.startsWith('Fill') || name.startsWith('File'))
              return { importName: name, path: '@hongluan-ui/icons' }
          },
          (name) => {
            if (name.startsWith('X'))
              return { importName: name, path: '@hongtu-next/core' }
          },
        ]
      }),
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            injectBuildTime: `<meta time="${new Date().toLocaleString('zh-CN', { hour12: false })}">`,
          },
        }
      })
    ],
    build: {
      outDir: 'video-list',
      assetsDir: "./static",
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
    },



  }
})
