<template>
  <el-breadcrumb class="app-breadcrumb">
    <transition-group name="breadcrumb" tag="span">
      <el-breadcrumb-item v-for="(item, index) of levelList" :key="item.path">
        <span v-if="item.redirect || index == levelList.length - 1">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouteLocationMatched } from 'vue-router'
export default {
  setup() {
    const levelList = ref<RouteLocationMatched[]>([])
    const $route = useRoute()
    const router = useRouter()

    onMounted(() => {
      getBreadcrumb()
    })

    const getBreadcrumb = () => {
      // 详情页不复用主页面内容，故路由平级，面包屑进行改造、
      // only show routes with meta.title
      let matched = $route.matched.filter((item) => item.meta && item.meta.title)
      // matched = father.concat(matched);
      levelList.value = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.hide !== true
      )
    }

    const handleLink = (item: RouteLocationMatched) => {
      const { redirect, path } = item
      if (redirect) {
        // router.push(redirect);
        return
      }
      router.push(path)
    }

    watch(
      () => $route.path,
      () => {
        // if you go to the redirect page, do not update the breadcrumbs
        if ($route.path.startsWith('/redirect/')) {
          return
        }
        getBreadcrumb()
      }
    )

    return { levelList, handleLink }
  }
}
</script>
<style lang="scss" scoped>
.app-breadcrumb {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 64px;
  height: 64px;
  background: #f9fafe;
  padding-left: 28px;
  // 吸顶
  position: fixed;
  top: 58px;
  width: 100%;
  z-index: 100;
  .no-redirect {
    color: #999999;
    cursor: text;
  }
}
</style>
