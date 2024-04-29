<!--/*
* @Author: dingli
* @Desc: 资源详情
* @Date: 2022-1-24
*/-->
<template>
  <component
    :is="componentName"
    :shop-code="shopCode"
    :pack-version="packVersion"
    :is-snapshoot="isSnapshoot"
    :pack-version-id="packVersionId" />
</template>
<script>
import detail from './components/detail'
import DetailApi from './components/detail-api.vue'
import DetailSupportapp from './components/detail-supportapp.vue'
export default {
  name: 'Detail',
  components: { detail, DetailApi, DetailSupportapp },
  data() {
    let componentName = [22, 24, 14, 72, 7].includes(+this.$route.query.assetType) ? 'DetailApi' : 'detail'
    if (+this.$route.query.assetType === 27) {
      componentName = 'DetailSupportapp'
    }
    return {
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      isSnapshoot: this.$route.path.includes('/snapshoot'),
      packVersionId: this.$route.query.packVersionId,
      componentName: componentName
    }
  },

  created() {

  },
  beforeDestroy() {

  },
  methods: {

  }
}
</script>
