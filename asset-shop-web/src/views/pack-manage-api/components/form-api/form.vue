<!--/*
* @Author: dingli
* @Desc: 表单
* @Date:
*/-->
<template>
  <div v-loading="!!loading" cestc-loading-background="rgba(255, 255, 255, 0.2)" :cestc-loading-text="loading" class="cls-form refScrollDom">
    <div class="main">
      <div>
        <topInfo
          :ishistory="false"
          :pack-name="packName"
          :version="topInfo.version"
          :time="topInfoTime"
          :state="topInfo.state"
          :btn-list="[]"
        />
        <div class="">
          <div class="content">
            <FormApi ref="refApiInfo" :disabled="disabled" :shop-code="shopCode" />
            <FormPublic ref="refPublicInfo" :disabled="disabled" :shop-code="shopCode" />
            <FormSubscribe ref="refFormSubscribe" :shop-code="shopCode" />
          </div>
        </div>
      </div>
      <Anchor :scrolldom="scrollDom" class="cls-anchor" />
      <div class="footer">
        <c-button type="primary" @click="clickSubmit">提交</c-button>
        <c-button type="" @click="clickSave">保存</c-button>
        <c-button v-show="showDelBtn" type="" @click="clickDelete">删除</c-button>
      </div>
      <div class="footer2"></div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { API_PACK_STATUS } from '@/utils/enum'
import { bus } from '@/utils'
import { createPackApi, updatePackApi, deletePackCommon, changeStatusCommon, queryPackDetailApi, checkNewestVersionCommon, updateNewestVersionCommon } from '@/api'
import FormApi from './form-api.vue'
import FormPublic from './form-public.vue'
import FormSubscribe from './form-subscribe.vue'
import Anchor from '@/components/anchor'
import topInfo from '@/views/pack-manage/common/top.vue'
export default {
  name: '',
  components: { topInfo, FormApi, FormPublic, FormSubscribe, Anchor },
  data() {
    return {
      loading: '',
      topInfoTime: '--',
      packName: '',
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode,
      packVersionId: '',
      PACK_STATUS: API_PACK_STATUS,
      scrollDom: null,
      actionType: 'new',
      detailData: null,
      disabled: false
    }
  },
  computed: {
    ...mapState({
      navList: state => state.publicManage && state.publicManage.navList || [],
      activeNav: state => state.publicManage && state.publicManage.active || ''
    }),
    topInfo() {
      const currentNav = this.navList.find(d => d.key === 'current')
      this.changeNavList(currentNav)
      if (currentNav) {
        return {
          ...currentNav,
          state: +currentNav.state,
          version: currentNav.version
        }
      }
      return {
        state: 0,
        version: ''
      }
    },
    formDisabled() {
      return [0, 2, 3].indexOf(this.topInfo.state) === -1
    },
    showDelBtn() {
      // 上架失败不展示删除按钮
      if (this.detailData && +this.detailData.packStatus === 3) return false
      if (this.packVersionId) return true
      return false
    }
  },
  watch: {
    activeNav: {
      handler(nv, ov) {
        const currentNav = this.navList.find(d => d.key === 'current')
        console.log(currentNav, '----activeNav')
        if (currentNav) {
          this.actionType = currentNav.init ? 'new' : 'edit'
          this.packVersionId = currentNav.versionId
        }
      },
      immediate: true
    },
    packVersionId: {
      handler(nv, ov) {
        console.log(nv, ov, '----packVersionId')
        if (nv && nv !== ov) {
          this.getDetail()
        } else if (!nv) {
          const currentNav = this.navList.find(d => d.key === 'current')
          if (currentNav && currentNav.init && currentNav.baseVersionId) {
            this.getDetail(currentNav.baseVersionId)
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.scrollDom = document.querySelector('.refScrollDom')
  },
  methods: {
    changeNavList(currentNav) {
      if (currentNav) {
        this.actionType = currentNav.init ? 'new' : 'edit'
        this.packVersionId = currentNav.versionId
      }
    },
    // 点击保存
    async clickSave(fromSubmit) {
      try {
        // 接口组件不选择无意义，所以必选
        const apiInfoData = this.$refs.refApiInfo.validateForm()
        await this.sleep()
        const errDom = this.scrollDom.querySelector('.c-form-item__error')
        if (errDom) {
          this.$nextTick(() => {
            errDom.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          })
          return 'error'
        }
        const publicData = this.$refs.refPublicInfo && this.$refs.refPublicInfo.getFormData()
        const subscribeData = this.$refs.refFormSubscribe.getFormData()
        const params = { ...apiInfoData, ...publicData, subInfo: subscribeData }
        params.shopCode = this.shopCode || ''
        params.packVersionId = this.packVersionId || ''
        this.loading = '保存中...'
        console.log(this.actionType, '------')
        const sendFn = this.actionType === 'new' ? createPackApi : updatePackApi
        const res = await sendFn(params)
        this.loading = ''
        this.actionType = 'edit'
        this.$message.success('保存成功！')
        if (res.data) {
          this.packVersionId = res.data.packVersionId
          this.shopCode = res.data.shopCode
          if (fromSubmit !== 'submit') {
            this.refreshPage()
          }
        }

        // 更新顶部版本信息以及左侧版本信息
        this.packName = params.packName || ''
        let initFlag
        const navList = [...this.navList]
        navList.forEach(d => {
          if (d.key === 'current' && d.version !== params.packVersion) {
            d.versionId = this.packVersionId
            d.version = params.packVersion || d.version || ''
            // 保存过一次后离开再回来页面可以获取保存的数据
            initFlag = d.init
            d.init = false
          }
        })
        if (initFlag) {
          this.$store.dispatch('publicManage/setNavlist', navList)
        }
        if (this.actionType === 'new' && !this.shopCode) {
          this.$router.push({
            path: this.$route.path,
            query: {
              shopCode: this.shopCode
            }
          })
        }
        bus.$emit('-bus-packappform-leave-validate-', false)
      } catch (e) {
        this.loading = ''
        console.error(e)
        return 'error'
      }
    },
    sleep() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 300)
      })
    },
    // 点击提交
    async clickSubmit() {
      try {
        const apiInfoData = this.$refs.refApiInfo.validateForm()
        const publicData = this.$refs.refPublicInfo && this.$refs.refPublicInfo.validateForm()
        const subscribeData = this.$refs.refFormSubscribe.validateForm()
        console.log(apiInfoData, publicData, subscribeData)
        await this.sleep()
        const errDom = this.scrollDom.querySelector('.c-form-item__error')
        if (errDom) {
          this.$nextTick(() => {
            errDom.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          })
          return
        }
        // 提交前执行保存操作
        const isErr = await this.clickSave('submit')
        if (isErr === 'error') return

        const params = { packVersionId: this.packVersionId, status: 1 }
        const packStatus = +(this.detailData && this.detailData.packStatus || '')
        if (packStatus === 15) {
          params.status = 4
        } else if (packStatus === 20) {
          params.status = 3
        }
        // 15更新未提交、20升级未提交
        if (packStatus === 15 || packStatus === 20) {
          if (this.navList.length === 2) {
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
              // 产品定的交互，有新版本时先更新至最新版本信息，让用户再点一次提交
              await updateNewestVersionCommon({ packVersionId: this.packVersionId })
              this.getDetail()
              return
            }
          }
        }
        await changeStatusCommon(params)
        this.$message.success('已提交申请')
        // 上架、注册成功后刷新当前页面
        this.refreshPage()
      } catch (e) {
        console.error(e)
      }
    },
    // 删除
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
    // 刷新当前页
    async refreshPage() {
      if (!this.$route.params.shopCode) {
        this.$router.push({
          path: `/packManage/api/config/${this.shopCode}`,
          query: this.$route.query,
          replace: true
        })
      } else {
        await this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode })
      }
    },
    async getDetail(id) {
      const packVersionId = id || this.packVersionId
      if (!packVersionId) return
      try {
        const { data } = await queryPackDetailApi({ packVersionId })
        this.shopCode = data.shopCode
        this.packName = data.packName || ''
        const packStatus = +data.packStatus
        console.log(`${packStatus}---数据packStatus，${this.topInfo.state}-当前state, ${data.buildChannel}-渠道`)
        this.detailData = data
        if (this.actionType !== 'new') {
          this.topInfoTime = data.updateTime
        }
        this.$refs.refApiInfo.backFill(data)
        this.$refs.refPublicInfo.backFill(data)
        this.$refs.refFormSubscribe.backFill(data)
        // 10注册未提交、0上架未提交
        this.disabled = [10, 0].indexOf(packStatus) === -1
        // 已失效再重新上架时，未提交状态下表单部分内容不可编辑
        if (this.navList[0] && +this.navList[0].state === 5 && packStatus === 0) {
          this.disabled = true
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.bg-white {
  background: white;
}
.cls-form {
  position: relative;
  .top {
    margin-bottom: 20px;
    position: relative;
    height: 144px;
    padding-left: 240px;
    padding-right: 32px;
    padding-top: 32px;
    background: url(~@/assets/imgs/history-bg.png) no-repeat;
    background-size: auto cover;
    font-size: 14px;
    background-color: white;
    .icon-top {
      margin-right: 12px;
      width: 24px;
      height: 24px;
      background: url(~@/assets/imgs/icon-history.png) no-repeat;
      background-size: 100%;
    }
    .h2 {
      margin-bottom: 16px;
      line-height: 24px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #4b4b4b;
    }
    .time {
      flex: 1;
      padding-left: 12px;
      height: 40px;
      line-height: 40px;
      background: #F6F9FB;
    }
    .flex {
      display: flex;
      align-items: center;
    }
    .mb16 {
      margin-bottom: 16px;
    }
  }
  .steps-wrap {
    padding-left: 116px;
    padding-right: 116px;
    height: 89px;
    border-bottom: 1px solid #EDEDED;
  }
  .content {
    margin-bottom: 64px;
  }
  .main {
    width: 1280px;
    // overflow: auto;
  }
  .footer {
    position: fixed;
    bottom: 16px;
    padding-top: 16px;
    padding-left: 20px;
    width: 1280px;
    height: 64px;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
    background: white;
    z-index: 99;
  }
  .footer2{
    position: fixed;
    height: 16px;
    width: 1280px;
    bottom: 0;
    background: #f9fafb;
    z-index: 9999;
  }
}
.cls-anchor {
  position: fixed;
  right: 20px;
  bottom: 100px;
}
</style>
