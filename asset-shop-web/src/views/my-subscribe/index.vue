<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="my-apply-manage">
    <leftnav class="leftnav" :title="leftnavData.title" :list="leftnavData.list" />
    <div class="apply-main">
      <breadcrumb :list="levelList" />
      <router-view />
    </div>
  </div>
</template>
<script>
import Leftnav from '@/components/left-nav'
import breadcrumb from '@/components/breadcrumb'
function initDataFn() {
  let routeObj = this.$store.getters.routes.find(r => r.path === '/subscribe')
  if (!routeObj) {
    this.$store.getters.routes.find(r => {
      if (r.path === '/mine') {
        routeObj = r.children.find(r => r.path === '/subscribe')
      }
      return r.path === '/mine'
    })
  }
  // 左侧导航展示信息
  const LEFT_NAV = {
    title: routeObj.meta.title,
    list: []
  }
  LEFT_NAV.list = routeObj.children.filter(d => !d.hidden).map(d => ({
    ...d,
    path: d.path ? `/subscribe/${d.path}` : '/subscribe',
    title: d.meta.title,
    key: d.meta.key
  }))
  return { LEFT_NAV }
}
export default {
  name: '',
  components: { Leftnav, breadcrumb },
  data() {
    const data = initDataFn.apply(this)
    return {
      leftnavData: data.LEFT_NAV
    }
  },
  computed: {
    levelList() {
      let arr = this.$route.matched || []
      arr = arr.filter(r => !r.path.includes('/mine'))
      arr = arr.map(r => ({ path: r.path, title: r.meta.title }))
      arr[0].path = ''
      arr[arr.length - 1].path = ''
      return arr
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>
<style scoped lang="scss">
.my-apply-manage {
  display: flex;
  height: 100%;
  border-top: 20px solid transparent;
  justify-content: center;
  overflow: auto;
  .leftnav {
    margin-right: 20px;
    flex-shrink: 0;
    width: 220px;
    background: white;
  }
}
.apply-main {
  height: 100%;
  width: 1280px;
  padding-bottom: 10px;
  overflow: hidden;
}
.breadcrumb{
    align-items: center;
    height: 64px;
    background: #fff;
    display: flex;
    padding-left: 20px;
}
</style>
