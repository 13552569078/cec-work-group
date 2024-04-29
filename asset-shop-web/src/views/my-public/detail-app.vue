<!--
 * @Description:
 * @Author:
 * @Date:
-->

<template>
  <div class="apply-main">
    <breadcrumb :list="levelList" />
    <div class="content">
      <detail
        :shop-code="shopCode"
        :pack-version="packVersion"
        :pack-version-id="packVersionId"
        :hidebtn="true"
        :is-snapshoot="false"
        :showsnapshootinfo="false"
        :hideappraise="false"
        :showfooter="false" />
    </div>
  </div>
</template>
<script>
import breadcrumb from '@/components/breadcrumb'
import detail from '@/views/home/components/detail-app.vue'
export default {
  name: '',
  components: { detail, breadcrumb },
  data() {
    return {
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      packVersionId: this.$route.query.packVersionId,
      appName: this.$route.query.appName,
      applyId: this.$route.query.applyId,
      levelList: [
        { path: '', title: '我的上架' },
        { path: '/myPublic/app', title: '应用资源' },
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
    top: 128px !important;
  }
  .tab-wrapper {
    .right-btns {
      right: 20px;
    }
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
