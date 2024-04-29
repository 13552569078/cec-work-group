<!--
 * @Description:
 * @Author:
 * @Date:
-->

<template>
  <div class="apply-main">
    <breadcrumb :list="levelList" />
    <div class="content">
      <component
        :is="componentName"
        :shop-code="shopCode"
        :pack-version="packVersion"
        :hidebtn="true"
        :is-snapshoot="false"
        :showsnapshootinfo="false"
        :pack-version-id="packVersionId"
        :showfooter="false" />
    </div>
  </div>
</template>
<script>
import breadcrumb from '@/components/breadcrumb'
import detail from '@/views/home/components/detail.vue'
import DetailApi from '@/views/home/components/detail-api.vue'
import DetailSupportapp from '@/views/home/components/detail-supportapp.vue'
import { ASSET_TITLE } from '@/utils/enum'
export default {
  name: '',
  components: { detail, breadcrumb, DetailApi, DetailSupportapp },
  data() {
    let componentName = [22, 14, 7, 72].includes(+this.$route.query.assetType) ? 'DetailApi' : 'detail'
    if (+this.$route.query.assetType === 27) {
      componentName = 'DetailSupportapp'
    }
    return {
      componentName,
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      packVersionId: this.$route.query.packVersionId,
      levelList: [
        { path: '', title: '我的上架' },
        { path: '/myPublic', title: ASSET_TITLE },
        { path: '', title: '资源详情' }
      ],
      formData: {},
      activeStep: 0,
      applyHistory: [],
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {}
  }
}
</script>
<style scoped lang="scss">
.my-apply-manage {
  display: flex;
  height: 100%;
  .leftnav {
    flex-shrink: 0;
    width: 320px;
  }

  .apply-main {
    height: 100%;
    max-width: 1280px;
    padding-bottom: 10px;
    overflow: hidden;
  }
}
.content{
  height: calc(100% - 67px);
  padding-top: 20px;
  overflow:hidden auto;
}
::v-deep.detail {
  overflow:hidden auto;
  .fixtop {
    top: 128px;
  }
}
::v-deep.detail {
  .top {
    padding-top: 1px;
    padding-right: 20px;
    padding-left: 20px;
  }
  .width {
    width: 100%
  }
  .tab-wrapper .c-tabs__nav {
    margin-left: 20px;
  }
}
</style>
