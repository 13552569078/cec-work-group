<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="content scrollDom">
    <div class="apply-info">
      <div class="d-box-wrap">
        <h3 class="info-title">申请信息</h3>
        <c-row :gutter="24">
          <c-col :span="8" class="form-list">
            <p>申请资源主体</p>
            <span>{{ detailData.referPackName||'--' }}</span>
          </c-col>
          <c-col :span="12" class="form-list">
            <p>所属部门</p>
            <span>{{ applyExtendInfo.buildDeptName||'--' }}</span>
          </c-col>
          <c-col :span="24" class="form-list">
            <p>所属地区</p>
            <span>{{ applyExtendInfo.districtText||'--' }}</span>
          </c-col>
          <c-col :span="8" class="form-list">
            <p>联系人</p>
            <span>{{ applyExtendInfo.contactName||'--' }}</span>
          </c-col>
          <c-col :span="8" class="form-list">
            <p>联系邮箱</p>
            <span>{{ applyExtendInfo.contactEmail||'--' }}</span>
          </c-col>
          <c-col :span="8" class="form-list">
            <p>联系电话</p>
            <span>{{ applyExtendInfo.contactPhone||'--' }}</span>
          </c-col>
          <c-col :span="8" class="form-list">
            <p>使用场景</p>
            <span v-html="textAreaFilter(applyExtendInfo.appDesc)"></span>
          </c-col>
        </c-row>
      </div>
      <div v-if="pageType==='working'" class="d-box-wrap">
        <h3 class="info-title">授权信息</h3>
        <div class="form-list">
          <p>密钥key
            <!-- <i v-copy="detailData.clientId" class="copy" @click="clickCopy('ClientId')" /> -->
          </p>
          <span>{{ detailData.clientId||'--' }}</span>
        </div>
        <div class="form-list">
          <p>密钥secret
            <!-- <i v-copy="detailData.clientSecret" class="copy" @click="clickCopy('ClientSecret')" /> -->
          </p>
          <span>{{ detailData.clientSecret||'--' }}</span>
        </div>
      </div>
    </div>
    <div class="detail-wrap-box">
      <h3 class="info-title detail-title">基本信息</h3>
      <detailApi
        v-if="[22, 14, 72, 7].includes(+assetType)"
        :shop-code="shopCode"
        :pack-version="packVersion"
        :pack-version-id="packVersionId"
        :show-subscribe="pageType==='working'"
        :is-snapshoot="true"
        :hideappraise="true"
        :showsnapshootinfo="false"
        :showfooter="false" />
      <detailSupportapp
        v-if="assetType==27"
        :shop-code="shopCode"
        :pack-version="packVersion"
        :pack-version-id="packVersionId"
        :show-subscribe="pageType==='working'"
        :is-snapshoot="true"
        :hideappraise="true"
        :showsnapshootinfo="false"
        :showfooter="false" />
    </div>
  </div>
</template>
<script>
import detailApi from '@/views/home/components/detail-api.vue'
import detailSupportapp from '@/views/home/components/detail-supportapp.vue'
import { applyDetail } from '@/api/index'
export default {
  name: '',
  components: { detailApi, detailSupportapp },
  data() {
    const pageType = this.$route.path.indexOf('/invalid') === -1 ? 'working' : 'invalid'
    return {
      pageType,
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      packVersionId: this.$route.query.packVersionId,
      applyId: this.$route.query.applyId,
      assetType: this.$route.query.assetType,
      detailData: {},
      applyExtendInfo: {}
    }
  },
  created() {
    this.getApplyDetail()
  },
  methods: {
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    getApplyDetail() {
      applyDetail({ applyId: this.applyId }).then(res => {
        res.data.applyExtendInfo = res.data.applyExtendInfo ? JSON.parse(res.data.applyExtendInfo) : {}
        this.detailData = res.data
        this.applyExtendInfo = res.data.applyExtendInfo
      })
    }
  }
}
</script>
<style scoped lang="scss">
.d-box-wrap {
  padding: 20px 20px 20px 40px;
  background: #fff;
  margin-bottom: 20px;
  .info-title {
    margin-left: -20px;
  }
}
.apply-info {
  margin-top: 20px;
  &::v-deep {
    .c-form-item__label {
      color: #8a8a8a;
    }
  }
}
.content{
  height: calc(100% - 67px);
  overflow: hidden auto;
}
.copy {
  width: 16px;
  height: 16px;
  background: url(~@/assets/logo/copy.png) no-repeat center;
  background-size: 100%;
  z-index: 2;
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-image: url(~@/assets/logo/copy-hover.png);
  }
}
.form-list {
  p {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8a8a8a;
    line-height: 20px;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    align-items: center;
  }
  span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4b4b4b;
    line-height: 20px;
    display: block;
    margin-bottom: 10px;

  }
}
.margin-top-20px {
  margin-top: 20px;
}
.detail-title {
  background: white;
  margin-bottom: 0;
  padding: 20px 0 0 20px;
}
::v-deep.detail {
  max-width: 1280px;
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
