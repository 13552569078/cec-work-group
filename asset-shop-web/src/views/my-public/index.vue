<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="my-apply-manage">
    <leftnav class="leftnav" :title="leftnavData.title" :list="leftnavData.list" />
    <div class="apply-main">
      <router-view />
    </div>
  </div>
</template>
<script>
import Leftnav from '@/components/left-nav'
import { LEFT_NAV } from './config.js'
export default {
  name: '',
  components: { Leftnav },
  data() {
    return {
      leftnavData: LEFT_NAV
    }
  },
  computed: {
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
  overflow: auto;
}
.breadcrumb{
    align-items: center;
    height: 64px;
    background: #fff;
    display: flex;
    padding-left: 20px;
}
</style>
