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
      <div class="header-line"></div>
      <router-view />
    </div>
  </div>
</template>
<script>
import Leftnav from '@/components/left-nav'
import breadcrumb from '@/components/breadcrumb'
import { LEFT_NAV } from './config.js'
export default {
  name: '',
  components: { Leftnav, breadcrumb },
  data() {
    return {
      leftnavData: LEFT_NAV
    }
  },
  computed: {
    // activeTab() {
    //   let key = this.$route.meta.key
    //   if (!key) {
    //     this.$route.matched.find(r => {
    //       key = r.meta.key
    //       return r.meta.key
    //     })
    //   }
    //   return key
    // },
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
.header-line {
  width: 100%;
  height: 1px;
  background: #EDEDED;
}
</style>
