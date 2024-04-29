<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive :include="keepAliveComponents"> -->
      <component :is="Component" />
      <!-- </keep-alive> -->
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { useStore } from '/@/store';

export default defineComponent({
  name: 'RouterTransition',
  props: {
    notNeedKey: {
      type: Boolean,
      default: false
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    // const store = useStore();
    // 需要缓存的路由组件
    const keepAliveComponents = ''
    // computed(() => store.state.asyncRoute.keepAliveComponents)

    return {
      keepAliveComponents
    }
  }
})
</script>
