<!--
 * @Description: 场景管理
 * @Author: 丁利
 * @Date: 2022-04-20
-->
<template>
  <label-management-list :group-type="1" title="资源" />
</template>
<script>
import LabelManagementList from '@/views/label-management/list.vue'
export default {
  name: 'SceneManagement',
  components: { LabelManagementList },
  data() {
    return {
    }
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
}
</script>
<style lang="scss" scoped>
</style>
