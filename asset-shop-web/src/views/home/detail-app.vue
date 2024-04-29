<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-25
-->
<!--/*
* @Author: dingli
* @Desc: 资源详情
* @Date: 2022-1-24
*/-->
<template>
  <detail
    :shop-code="shopCode"
    :pack-version="packVersion"
    :pack-version-id="packVersionId"
    :is-snapshoot="isSnapshoot" />
</template>
<script>
import detail from './components/detail-app'
export default {
  name: 'Detail',
  components: { detail },

  data() {
    return {
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      packVersionId: this.$route.query.packVersionId,
      isSnapshoot: this.$route.path.includes('/snapshoot')
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
