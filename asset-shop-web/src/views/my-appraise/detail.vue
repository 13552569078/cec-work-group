<!--/*
* @Author:
* @Desc:
* @Date:
*/-->
<template>
  <component :is="componentName"></component>
</template>
<script>
import detailApp from '@/views/my-apply/detail-app.vue'
import detailAsset from '@/views/my-apply/detail-asset.vue'
export default {
  name: '',
  components: { detailApp, detailAsset },
  data() {
    return {
      assetType: this.$route.query.assetType
    }
  },
  computed: {
    componentName() {
      if (+this.assetType === 99) {
        return 'detailApp'
      }
      return 'detailAsset'
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>
<style scoped lang="scss">
</style>
