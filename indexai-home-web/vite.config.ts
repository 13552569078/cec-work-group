import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import pxtovw from 'postcss-px-to-viewport'
import viteSvgIcons from 'vite-plugin-svg-icons'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// const loder_pxtovw = pxtovw({
//   //这里是设计稿宽度 自己修改
//   viewportWidth: 1920,
//   viewportUnit: 'vw'
// })
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  return defineConfig({
    base: `/${loadEnv(mode, process.cwd()).VITE_PUBLIC_PATH}`,
    plugins: [
      AutoImport({
        imports: ['vue', 'pinia', 'vue-router'], // 自动导入vue、pinia和vue-router相关api
        dts: 'src/auto-import.d.ts' // 生成 `auto-import.d.ts` 全局声明
      }),
      Components({
        // 指定自动导入的组件位置，默认是 src/components
        dirs: ['src/components']
      }),
      vue(),
      viteSvgIcons({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        svgoOptions: command === 'build',
        symbolId: 'icon-[dir]-[name]'
      }),
      // On-demand Import
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:math";@import '/@/styles/variables.scss';@import '/@/styles/mixin.scss';`
        }
      }
      // postcss: {
      //   plugins: [loder_pxtovw]
      // }
    },
    resolve: {
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/'
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/'
        }
      ]
    },
    server: {
      host: '0.0.0.0',
      port: 9985,
      proxy: {
        '/robot': {
          target: 'http://10.32.132.248:33091',
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/robot/, '')
        },
        '/base': {
          target: 'http://10.32.132.80:31036',
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/base/, '')
        },
        '/api': {
          target: 'http://39.106.32.124:1020',
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/home': {
          target: 'http://172.26.73.18:9090',
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/home/, '')
        }
      }
    },
    build: {
      outDir: 'onepic',
      target: 'es2015',
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: loadEnv(mode, process.cwd()).VITE_DROP_CONSOLE === 'false' ? false : true
        }
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 2000
    }
  })
}
