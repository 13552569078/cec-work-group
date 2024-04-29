<!--/*
* @Author: dingli
* @Desc: 场景管理页面
* @Date:
*/-->
<template>
  <label-management-list :group-type="1" title="场景" />
</template>
<script>
import LabelManagementList from './list.vue'
export default {
  name: '',
  components: { LabelManagementList },
  data() {
    return {};
  },
  created() {
    this.div = document.createElement('div')
    this.div.className = 'list-tabs-bg'
    this.div.id = 'list-tabs-bg-flow-index'
    this.$nextTick(() => {
      document.getElementsByClassName('page-content-wrapper')[0].append(this.div)
    })
  },
  destroyed() {
    try {
      document.getElementsByClassName('page-content-wrapper')[0].removeChild(this.div)
    } catch (error) {
      console.log(error)
    }
  }
};
</script>
<style scoped lang="scss">
</style>
