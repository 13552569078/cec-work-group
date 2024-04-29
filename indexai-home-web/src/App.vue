<template>
  <!-- <div class="test" style="width:100%;height:100%;" ref="screenRef">
    <el-config-provider :locale="locale">
      <slot name="app">
        <router-view>
          <template #default="{ Component }">
            <keep-alive :include="['ISearch']">
              <component :is="Component" :key="$route.fullPath" />
            </keep-alive>
          </template>
        </router-view>
      </slot>
    </el-config-provider>
  </div> -->
  <el-config-provider>
    <slot name="app">
      <router-view>
        <template #default="{ Component }">
          <keep-alive :include="['ISearch']">
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </template>
      </router-view>
    </slot>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
// import windowResize from '/@/hooks/scale/windowResize'

// import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const interval = ref()

// const detectZoom = ()=> {
//   var ratio = 0,
//     screen = window.screen,
//     ua = navigator.userAgent.toLowerCase();
//   if (window.devicePixelRatio !== undefined) {
//     ratio = window.devicePixelRatio;
//   } else if (~ua.indexOf('msie')) {
//     if (screen.deviceXDPI && screen.logicalXDPI) {
//       ratio = screen.deviceXDPI / screen.logicalXDPI;
//     }
//   } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
//     ratio = window.outerWidth / window.innerWidth;
//   }
//   if (ratio) {
//     ratio = Math.round(ratio * 100);
//   }
//   return ratio;
// }

// onMounted(() => {
//   nextTick(() => {
//     document.getElementById("app")!.style.zoom = (100 / detectZoom()).toFixed(2)
//   })
// })

// const { screenRef, calcRate, windowDraw, unWindowDraw } = windowResize()

// onBeforeUnmount(() => {
//   if (interval.value) {
//     clearInterval(interval.value)
//   }
// })

// onMounted(() => {
//   // 监听浏览器窗口尺寸变化
//   windowDraw()
//   calcRate()
// })

// onUnmounted(() => {
//   unWindowDraw();
// })
</script>

<style lang="scss">
.el-popover {
  background-color: rgba(6, 18, 79, 0.93) !important;
  color: rgba(6, 18, 79, 0.93) !important;
  border: none;
}

.el-popover[x-placement^='top'] .popper__arrow::after {
  /*el-popover上边三角表层的颜色---也就是视觉上的角*/
  border-top-color: rgba(6, 18, 79, 0.93);
}

.el-popper.is-light {
  border: rgba(73, 91, 182, 0.24) !important;
}

.el-popper.is-light .el-popper__arrow::before {
  background: rgba(6, 18, 79, 0.93) !important;
  border: 1px solid rgba(6, 18, 79, 0.93) !important;
}

.icon-wrap {
  z-index: 10;
}

.pover-con {
  font-size: 20px;
}
</style>
