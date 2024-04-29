<!--/*
* @Author: dingli
* @Desc: 体征资源-详情页
* @Date:
*/-->
<template>
  <detail systype="tizheng" :showthird="false" :shop-code="shopCode" :pack-version="packVersion" :is-snapshoot="isSnapshoot" />
</template>
<script>
import detail from '@/views/home/components/detail'
export default {
  name: 'Detail',
  components: { detail },

  data() {
    return {
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
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
