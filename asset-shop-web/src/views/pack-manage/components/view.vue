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
                <p data-label="申请使用数量" class="cls-unpackinfo-item">{{ `${(topInfo.subNum||0)}次` }}</p>
              </c-col>
              <c-col :span="12">
                <p data-label="下架原因" class="cls-unpackinfo-item mt20">{{ topInfo.unpackReason||'--' }}</p>
              </c-col>
            </c-row>
          </div>
          <div class="content">
            <step1 ref="refStep1" isview />
            <step2 ref="refStep2" isview />
            <step3 ref="refStep3" isview />
          </div>
        </div>
      </div>
      <div class="footer">
        <Anchor :scrolldom="scrollDom" class="cls-anchor" />
      </div>
    </div>
    <dialogUnpack
      :visible="dialogFlag"
      :asset-type="5"
      @close="dialogFlag=false"
      @ok="okDialog" />
  </div>
</template>
<script>
import Anchor from '@/components/anchor'
import { mapState } from 'vuex'
import step1 from './step1.vue'
import step2 from './step2.vue'
import step3 from './step3.vue'
import { PACK_STATUS } from '@/utils/enum'
import { queryPackDetail, deletePackCommon, createActiveCommon, changeStatusCommon, unpackApplyCommon } from '@/api/index'
import topInfo from '@/views/pack-manage/common/top.vue'
import dialogUnpack from '@/views/pack-manage/common/dialog-unpack.vue'
export default {
  name: '',
  components: { topInfo, step1, step2, step3, Anchor, dialogUnpack },
  data() {
    return {
      scrollDom: null,
      topInfoTime: '--',
      packName: '',
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode,
      formData: {},
      step: '1',
      info: {},
      packVersionId: '',
      actionType: 'new',
      PACK_STATUS,
      dialogFlag: false
    }
  },
  computed: {
    ...mapState({
      publicManage: state => state.publicManage,
      active: state => state.publicManage && state.publicManage.active || ''
    }),
    topInfo() {
      const currentNav = this.publicManage.navList.find(d => d.key === this.active)
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
    }
  },
  mounted() {
    this.scrollDom = document.querySelector('.refScrollDom')
  },
  methods: {
    packVersionIdChange(id) {
      this.packVersionId = id
    },
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
    okDialog(formData) {
      const params = { unpackReason: formData.unpackReason, packVersionId: this.packVersionId, optStatus: 0 }
      if (+formData.unpackType === 1) {
        params.unpackTime = formData.unpackTime
      }
      if (this.publicManage.navList.length === 2) {
        params.optStatus = 1
      }
      unpackApplyCommon(params).then(() => {
        this.dialogFlag = false
        // 下架成功后刷新列表页
        this.refreshPage(true)
      })
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
    // 刷新当前页
    async refreshPage(isChange) {
      const list = await this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode, isList: true })
      if (isChange) {
        const key = list[list.length - 1].key
        this.$store.dispatch('publicManage/setActiveNav', key)
      }
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
    clickPackAgain() {
      // 已下架-重新上架
      const params = { packVersionId: this.packVersionId, optType: 2 }
      this.createActiveVersion(params)
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
          this.dialogFlag = true
        }).catch(() => {})
      } else {
        this.dialogFlag = true
      }
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
            path: '/packManage/asset',
            query: {
              assetType: this.$route.query
            }
          })
        })
      }).catch(() => {})
    },
    async clickAgain() {
      const params = {}
      try {
        const state = +this.topInfo.state
        if (state === 7) {
          // 下架失败
          this.dialogFlag = true
          return
        } else if (state === 3) {
          // 上架失败
          params.status = 11
        } else if (state === 17) {
          // 更新失败
          params.status = 14
        } else if (+this.topInfo.state === 23) {
          // 升级失败
          params.status = 13
        } else if (state === 12) {
          // 注册失败
          params.status = 10
        }
        this.changeStatus(params)
      } catch (e) {
        console.error(e)
      }
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
    changeStatus(data) {
      const params = { ...data, packVersionId: this.packVersionId }
      changeStatusCommon(params).then(() => {
        this.$message.success('操作成功')
        // 撤销成功后刷新当前页面
        this.refreshPage()
      })
    },
    async init() {
      try {
        const { data } = await queryPackDetail(this.packVersionId)
        this.packName = data.packName
        this.topInfoTime = +this.topInfo.state === 4 ? data.packTime : data.updateTime
        this.$nextTick(() => {
          const arr = ['assetName', 'assetCode', 'assetVersion', 'packName', 'packVersion', 'packDesc', 'packVersionDesc']
          arr.forEach(k => {
            data[k] = data[k] || '--'
          })
          this.$refs.refStep1.initForm(data)
          this.$refs.refStep2.initForm(data)
          this.$refs.refStep3.initForm(data)
        })
      } catch (e) {
        //
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
  position: relative;
  .steps-wrap {
    padding-left: 116px;
    padding-right: 116px;
    height: 110px;
    border-bottom: 1px solid #EDEDED;
  }
  .content {
    margin-bottom: 20px;
  }
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
</style>
