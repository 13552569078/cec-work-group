<!--/*
* @Author:
* @Desc:
* @Date:
*/-->
<template>
  <component :is="componentId"></component>
</template>
<script>
import flowDetail from '@/views/asset-management/flow-asset/components/edit.vue'
import objectDetail from '@/views/asset-management/object-asset/add.vue'
import scriptDetail from '@/views/asset-management/technology-asset/script-asset'
import tiDetail from '@/views/asset-management/statistics-asset/ti-asset/'
import apiDetail from '@/views/asset-management/technology-asset/interface-asset'
import pageDetail from '@/views/asset-management/technology-asset/page-asset'
import modeDetail from '@/views/asset-management/mode-asset/mode-asset'
export default {
  name: '',
  components: { flowDetail, objectDetail, scriptDetail, tiDetail, apiDetail, pageDetail, modeDetail },
  data() {
    return {};
  },
  computed: {
    componentId() {
      const assetType = this.$route.query.assetType
      const subtype = this.$route.query.subtype
      switch (assetType) {
        // 2技术、3对象、5流程/1数据资源
        case 1:
          return 'tiDetail'
        case 2:
          if (+subtype === 22) { // 接口
            return 'apiDetail'
          } else if (+subtype === 23) { // 页面
            return 'pageDetail'
          } else if (+subtype === 26) { // 脚本
            return 'scriptDetail'
          }
          break;
        case 3: // 对象资源
          return 'objectDetail'
        case 5: // 流程资源
          return 'flowDetail'
        case 7: // 模型资源
          return 'modeDetail'
        default:
          break;
      }
      return ''
    }
  },
  methods: {}
};
</script>
<style scoped lang="scss">
</style>
