<!--/*
* @Author: dingli
* @Desc: 已上架信息
* @Date: 2022-2-11
*/-->
<template>
  <div class="cls-form">
    <div class="main refScrollDom">
      <div>
        <topInfo
          :ishistory="false"
          :pack-name="packName"
          :version="topInfo.version"
          :time="topInfoTime"
          :state="topInfo.state"
          :btn-list="btnList"
          @clickBtns="clickBtns"
        />
        <div class="">
          <div v-show="[1, 6, 11, 16, 21].indexOf(topInfo.state)===-1" class="opinion">审核意见：{{ topInfo.auditMsg||'--' }}</div>
          <div v-if="[5, 6, 7].indexOf(topInfo.state)!==-1" class="cls-unpackinfo bg-white">
            <h3 class="info-title" data-section="unpackInfo">下架申请信息</h3>
            <c-row :gutter="24">
              <c-col :span="8">
                <p data-label="下架方式" class="cls-unpackinfo-item">{{ topInfo.unpackTime?`定时下架 ${topInfo.unpackTime}`:'立即下架' }}</p>
              </c-col>
              <c-col :span="12">
                <p data-label="订阅次数" class="cls-unpackinfo-item">{{ `${(topInfo.subNum||0)}次` }}</p>
              </c-col>
              <c-col :span="12">
                <p data-label="下架原因" class="cls-unpackinfo-item mt20">{{ topInfo.unpackReason||'--' }}</p>
              </c-col>
            </c-row>
          </div>
          <div v-if="pagekey==='api'" class="content">
            <FormApi ref="refApiInfo" isview :shop-code="shopCode" />
            <FormPublic ref="refPublicInfo" isview />
            <FormSubscribe ref="refFormSubscribe" isview />
          </div>
          <div v-if="pagekey==='supportApp'" class="content">
            <FormBasicSupportapp ref="refBasicInfoSupportapp" isview />
            <FormInfoSupportapp ref="refPublicInfoSupportapp" isview :shop-code="shopCode" />
            <FormSubscribeSupportapp ref="refFormSubscribeSupportapp" isview />
          </div>
        </div>
      </div>
      <div class="footer">
        <Anchor :scrolldom="scrollDom" class="cls-anchor" />
      </div>
    </div>
    <dialogUnpack
      :visible="dialogFlag"
      :asset-type="assetType"
      @close="closeDialog"
      @ok="okDialog" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { API_PACK_STATUS } from '@/utils/enum'
import { queryPackDetailApi, queryPackDetailSupportApp, changeStatusCommon, unpackApplyCommon, deletePackCommon, checkNewestVersionCommon, createActiveCommon } from '@/api/index'
import FormApi from './form-api/form-api.vue'
import FormPublic from './form-api/form-public.vue'
import FormSubscribe from './form-api/form-subscribe.vue'
import Anchor from '@/components/anchor'
import FormBasicSupportapp from './form-supportapp/form-basic.vue'
import FormInfoSupportapp from './form-supportapp/form-info.vue'
import FormSubscribeSupportapp from './form-supportapp/form-subscribe.vue'
import topInfo from '@/views/pack-manage/common/top.vue'
import dialogUnpack from '@/views/pack-manage/common/dialog-unpack.vue'
export default {
  name: '',
  components: { dialogUnpack, topInfo, FormApi, FormPublic, FormSubscribe, Anchor, FormBasicSupportapp, FormInfoSupportapp, FormSubscribeSupportapp },
  data() {
    return {
      assetType: this.$route.path.indexOf('supportAppConfig') !== -1 ? 27 : 22,
      pagekey: this.$route.path.indexOf('supportAppConfig') !== -1 ? 'supportApp' : 'api',
      topInfoTime: '--',
      packName: '',
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode,
      packVersionId: '',
      info: {},
      actionType: 'new',
      PACK_STATUS: API_PACK_STATUS,
      scrollDom: null,
      dialogFlag: false,
      formData: {
        optStatus: 0
      },
      packValidateFlag: false,
      detailData: {}
    }
  },
  computed: {
    ...mapState({
      publicManage: state => state.publicManage
    }),
    topInfo() {
      const active = this.publicManage.active
      const currentNav = this.publicManage.navList.find(d => d.key === active)
      if (currentNav) {
        this.packVersionIdChange(currentNav.versionId)
        return {
          ...currentNav,
          state: +currentNav.state,
          version: currentNav.version,
          auditMsg: currentNav.auditMsg
        }
      }
      return {
        state: 0,
        version: '',
        auditMsg: ''
      }
    },
    btnList() {
      const state = +this.topInfo.state
      const btnList = {
        update: { show: false, label: '更新', key: 'update' },
        upgrade: { show: false, label: '升级', key: 'upgrade' },
        unpack: { show: false, label: '下架', key: 'unpack' },
        packAgain: { show: false, label: '重新上架', key: 'packAgain' },
        again: { show: false, label: '重新申请', key: 'again' },
        backout: { show: false, label: '撤销', key: 'backout' },
        del: { show: false, label: '删除', key: 'del' }
      }
      // 1-上架审核中、3-上架失败、4-已上架、5-已下架、6-下架审核中、7-下架失败、16-更新审核中、17-更新失败、21升级审核中、23升级失败
      switch (state) {
        case 1: btnList.backout.show = true; break
        case 3: btnList.again.show = true; btnList.del.show = true; break
        case 4: btnList.unpack.show = true; btnList.upgrade.show = true; btnList.update.show = true; break
        case 5: btnList.packAgain.show = true; btnList.upgrade.show = true; break
        case 6: btnList.backout.show = true; break
        case 7: btnList.again.show = true; btnList.del.show = true; break
        case 16: btnList.backout.show = true; break
        case 17: btnList.again.show = true; btnList.del.show = true; break
        case 21: btnList.backout.show = true; break
        case 23: btnList.again.show = true; btnList.del.show = true; break
        default: break
      }
      if (this.pagekey === 'api') {
        btnList.upgrade.show = false
      }
      return Object.values(btnList).filter(d => d.show)
    }
  },
  watch: {
    'packVersionId': {
      handler(nv, ov) {
        if (nv && nv !== ov) {
          this.init()
        }
      },
      immediate: true
    },
    shopCode(nv, ov) {
      if (nv && !ov) {
        this.$emit('shopCodeChange', nv)
      }
    }
  },
  mounted() {
    this.scrollDom = document.querySelector('.refScrollDom')
  },
  methods: {
    clickBtns(k) {
      switch (k) {
        case 'update': this.clickUpdate(); break
        case 'upgrade': this.clickUpgrade(); break
        case 'unpack': this.clickBackout(); break
        case 'packAgain': this.clickPackAgain(); break
        case 'again': this.clickAgain(); break
        case 'backout': this.clickCancel(); break
        case 'del': this.clickDelete(); break
        default: break
      }
    },
    packVersionIdChange(id) {
      this.packVersionId = id
    },
    closeDialog() {
      this.formData.optStatus = 0
      this.dialogFlag = false
    },
    okDialog(data) {
      const params = { unpackReason: data.unpackReason, packVersionId: this.packVersionId, optStatus: this.formData.optStatus }
      if (+data.unpackType === 1) {
        params.unpackTime = data.unpackTime
      }
      unpackApplyCommon(params).then(() => {
        this.dialogFlag = false
        // 下架成功后刷新列表页
        this.refreshPage(true)
      })
    },
    clickDelete() {
      this.$confirm('请确认是否删除该编目信息？', {
        title: '提示',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonIsLeft: false,
        iconClass: 'c-ioc-icon-warning',
        type: 'warning'
      }).then(() => {
        deletePackCommon(this.packVersionId).then(res => {
          // 删除成功后返回列表页面
          this.$router.push({
            path: '/packManage/api',
            query: this.$route.query
          })
        })
      }).catch(() => {})
    },
    async clickAgain() {
      const params = {}
      try {
        if (this.publicManage.navList.length === 2) {
          const { data } = await checkNewestVersionCommon(this.packVersionId)
          const h = this.$createElement
          if (+data.checkStatus === 0) {
            const msg = h('p', null, [
              h('p', { style: '' }, '当前资源版本已更新'),
              h('p', { style: '' }, `版本号：${data.packVersion.packVersion || '--'}`),
              h('p', { style: '' }, `版本说明：${data.packVersion.packVersionDesc || '--'}`)
            ])
            const confirmRes = await this.$confirm(msg, {
              title: '提示',
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              confirmButtonIsLeft: false,
              showClose: false,
              showCancelButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              iconClass: 'c-ioc-icon-warning',
              type: 'warning'
            })
            if (confirmRes !== 'confirm') return
            // 更新为最新版本的参数
            params.optData = 1
            // 下架失败 参数optStatus=2更新至最新
            this.formData.optStatus = 2
          }
        }
        if (+this.topInfo.state === 7) {
          // 下架失败
          this.dialogFlag = true
          return
        } else if (+this.topInfo.state === 3) {
          // 上架失败
          params.status = 11
        } else if (+this.topInfo.state === 17) {
          // 更新失败
          params.status = 14
        } else if (+this.topInfo.state === 23) {
          // 升级失败
          params.status = 13
        }
        this.changeStatus(params)
      } catch (e) {
        console.error(e)
      }
    },
    clickCancel() {
      this.$confirm('该申请尚在审核中，请确认是否撤销？', {
        title: '提示',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonIsLeft: false,
        iconClass: 'c-ioc-icon-warning',
        type: 'warning'
      }).then(() => {
        this.changeStatus({ status: 2 })
      }).catch(() => {})
    },
    changeStatus(data) {
      const params = { ...data, packVersionId: this.packVersionId }
      changeStatusCommon(params).then(() => {
        this.$message.success('操作成功')
        // 撤销成功后刷新当前页面
        this.refreshPage()
      })
    },
    // 刷新当前页
    async refreshPage(isChange) {
      const list = await this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode, isApi: true, isList: true })
      if (isChange) {
        const key = list[list.length - 1].key
        this.$store.dispatch('publicManage/setActiveNav', key)
      }
    },
    clickPackAgain() {
      // 已下架-重新上架
      const params = { packVersionId: this.packVersionId, optType: 2 }
      this.createActiveVersion(params)
    },
    clickUpdate() {
      // 已上架-更新
      const params = { packVersionId: this.packVersionId, optType: 1 }
      this.createActiveVersion(params)
    },
    clickUpgrade() {
      // 已上架-升级、已下架-升级
      const params = { packVersionId: this.packVersionId, optType: 4 }
      this.createActiveVersion(params)
    },
    async createActiveVersion(params) {
      // 创建活跃版本
      try {
        if (this.publicManage.navList.length === 2) {
          const confirmRes = await this.$confirm('即将取消并覆盖尚在流程中的数据，是否继续？', {
            title: '提示',
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            confirmButtonIsLeft: false,
            iconClass: 'c-ioc-icon-warning',
            type: 'warning'
          })
          if (confirmRes !== 'confirm') return
          // 覆盖已有活跃数据
          params.optStatus = 1
        }
        // 新增活跃版本
        await createActiveCommon(params)
        this.refreshPage(true)
      } catch (e) {
        console.error(e)
      }
    },
    clickBackout() {
      // 已上架-下架申请
      // 校验是否存在其他活跃数据
      if (this.publicManage.navList.length === 2) {
        this.$confirm('即将取消并覆盖尚在流程中的数据，是否继续？', {
          title: '提示',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          confirmButtonIsLeft: false,
          iconClass: 'c-ioc-icon-warning',
          type: 'warning'
        }).then(() => {
          // optStatus=1覆盖
          this.formData.optStatus = 1
          this.dialogFlag = true
        }).catch(() => {})
      } else {
        this.dialogFlag = true
      }
    },
    async apiDetail() {
      try {
        const { data } = await queryPackDetailApi({ packVersionId: this.packVersionId })
        this.assetType = data.assetSubtype
        this.topInfoTime = +this.topInfo.state === 4 ? data.packTime : data.updateTime
        this.packName = data.packName
        this.shopCode = data.shopCode
        this.detailData = data
        console.log(data, '---')
        this.$nextTick(() => {
          this.$refs.refApiInfo.backFill(data)
          this.$refs.refPublicInfo.backFill(data)
          this.$refs.refFormSubscribe.backFill(data)
        })
      } catch (e) {
        console.error(e)
      }
    },
    async supportAppDetail() {
      try {
        const { data } = await queryPackDetailSupportApp({ packVersionId: this.packVersionId })
        this.assetType = data.assetSubtype
        this.topInfoTime = +this.topInfo.state === 4 ? data.packTime : data.updateTime
        this.packName = data.packName
        this.shopCode = data.shopCode
        this.detailData = data
        console.log(data, '---')
        this.$nextTick(() => {
          this.$refs.refBasicInfoSupportapp.backFill(data)
          this.$refs.refPublicInfoSupportapp.backFill(data)
          this.$refs.refFormSubscribeSupportapp.backFill(data)
        })
      } catch (e) {
        console.error(e)
      }
    },
    init() {
      if (this.pagekey === 'api') {
        this.apiDetail()
      } else if (this.pagekey === 'supportApp') {
        this.supportAppDetail()
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.bg-white {
  padding: 20px 40px;
  margin-bottom: 20px;
  background: white;
  .info-title {
    margin-left: -20px;
  }
}
.cls-form {
  height: 100%;
  position: relative;
  .main {
    width: 1280px;
    height: 100%;
    overflow: auto;
  }
  .opinion {
    position: relative;
    margin-bottom: 20px;
    padding-left: 44px;
    height: 54px;
    line-height: 54px;
    background: #EBF9FF;
    border: 1px dashed $primaryColor;
    &::before {
      content: '';
      width: 20px;
      height: 20px;
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: url(~@/assets/imgs/opinion.png) no-repeat center ;
      background-size: 100%;
    }
  }
}
.footer {
  position: fixed;
  bottom: 16px;
  right: 0;
  // width: 100%;
  z-index: 99;
}
.cls-anchor {
  position: absolute;
  right: 20px;
  bottom: 60px;
}
.cls-unpackinfo {
  .cls-unpackinfo-item {
    &::before {
      content: attr(data-label);
      display: block;
      color: #8a8a8a;
      margin-bottom: 10px;
    }
  }
}
.mt20 {
  margin-top: 20px;
}
.mt40 {
  margin-top: 40px;
}
</style>
