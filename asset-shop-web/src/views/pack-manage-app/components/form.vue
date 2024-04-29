<!--/*
* @Author: dingli
* @Desc: 上下架管理-未上架
* @Date: 2022-2-9
*/-->
<template>
  <div v-loading="!!loading" cestc-loading-background="rgba(255, 255, 255, 0.2)" :cestc-loading-text="loading" class="cls-form refScrollDom">
    <div class="main">
      <div data-section="register" style="opacity:0;height:0;">register</div>
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
            <Register ref="refRegister" :shop-code="shopCode" :disabled="disabled" />
            <div data-section="public" style="opacity:0;height:0;">public</div>
            <PublicInfo v-if="!hidePublicInfo" ref="refPublicInfo" :shop-code="shopCode" />
          </div>
        </div>
      </div>
      <Anchor :scrolldom="scrollDom" :hidepulick="hidePublicInfo" class="cls-anchor" />
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
import { APP_PACK_STATUS } from '@/utils/enum'
import { bus } from '@/utils'
import { createPackApp, updatePackApp, deletePackCommon, changeStatusCommon, queryPackDetailApp } from '@/api'
import Register from './register.vue'
import PublicInfo from './public-info.vue'
import Anchor from './anchor.vue'
import topInfo from '@/views/pack-manage/common/top.vue'
export default {
  name: '',
  components: { topInfo, Register, PublicInfo, Anchor },
  data() {
    return {
      loading: '',
      packName: '',
      topInfoTime: '--',
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode,
      packVersionId: '',
      hidePublicInfo: false,
      PACK_STATUS: APP_PACK_STATUS,
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
        console.log(nv, ov, '----packVersionId--')
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
  created() {
    bus.$on('-bus-packappform-change-', this.formDataChange)
  },
  mounted() {
    this.scrollDom = document.querySelector('.refScrollDom')
  },
  destroyed() {
    bus.$off('-bus-packappform-change-', this.formDataChange)
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
        const registerData = this.$refs.refRegister.getFormData()
        const publicData = this.$refs.refPublicInfo && this.$refs.refPublicInfo.getFormData()
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
        const params = { ...registerData, ...publicData }
        params.shopCode = this.shopCode || ''
        params.packVersionId = this.packVersionId || ''
        this.loading = '保存中...'
        const sendFn = this.actionType === 'new' ? createPackApp : updatePackApp
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
        let initFlag
        const navList = [...this.navList]
        navList.forEach(d => {
          if (d.key === 'current') {
            if (d.version !== params.packVersion) {
              d.versionId = this.packVersionId
              d.version = params.packVersion || d.version || ''
              // 保存过一次后离开再回来页面可以获取保存的数据
              initFlag = d.init
            }
            const currentAppStatus = +params.appStatus
            if (+d.state === 10 && currentAppStatus === 3) {
              initFlag = true
              d.state = 0
            } else if (+d.state === 0 && currentAppStatus !== 3) {
              initFlag = true
              d.state = 10
            }
            d.versionId = this.packVersionId
            d.init = false
          }
        })
        if (initFlag) {
          this.$store.dispatch('publicManage/setNavlist', navList)
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
        }, 400)
      })
    },
    // 点击提交
    async clickSubmit() {
      try {
        const registerData = this.$refs.refRegister.validateForm()
        const publicData = this.$refs.refPublicInfo && this.$refs.refPublicInfo.validateForm()
        console.log(registerData, publicData)
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
        // 15更新未提交、20升级未提交、0上架未提交、3上架失败
        if (this.detailData) {
          const packStatus = +(this.detailData && this.detailData.packStatus || '')
          if (packStatus === 15) {
            params.status = 4
          } else if (packStatus === 20) {
            params.status = 3
          }
        }
        // 资源状态非已上线 提交的是 注册申请
        if (+registerData.appStatus !== 3 && +params.status === 1) {
          params.status = 0
        }
        await changeStatusCommon(params)
        this.$message.success('提交成功')
        // 上架、注册成功后 更新左侧
        this.refreshPage()
      } catch (e) {
        console.error(e)
      }
    },
    // 删除
    clickDelete() {
      this.$confirm('请确认是否删除该应用的编目信息？', {
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
            path: '/packManage/app',
            query: {
              assetType: 99
            }
          })
        })
      }).catch(() => {})
    },
    // 刷新当前页
    async refreshPage() {
      if (!this.$route.params.shopCode) {
        this.$router.push({
          path: `/packManage/app/config/${this.shopCode}`,
          query: this.$route.query,
          replace: true
        })
      } else {
        await this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode, type: 99 })
      }
    },
    formDataChange(data) {
      if (!data.appStatus) return
      const hidePublicInfo = this.hidePublicInfo
      this.hidePublicInfo = +data.appStatus !== 3
      if (!this.hidePublicInfo && hidePublicInfo !== this.hidePublicInfo) {
        this.$nextTick(() => {
          this.$refs.refPublicInfo.regirterformDataChange(data)
        })
      }
    },
    async getDetail(id) {
      const packVersionId = id || this.packVersionId
      if (!packVersionId) return
      try {
        const { data } = await queryPackDetailApp({ packVersionId })
        this.shopCode = data.shopCode
        this.packName = data.packName || ''
        const packStatus = +data.packStatus
        console.log(`${packStatus}---数据packStatus，${this.topInfo.state}-当前state, ${data.buildChannel}-渠道`)
        // 上架 时【资源状态】自动改为已上线
        if (+this.topInfo.state === 0) {
          data.appStatus = 3
        }
        this.detailData = data
        this.hidePublicInfo = +data.appStatus !== 3
        if (this.actionType !== 'new') {
          this.topInfoTime = data.updateTime
        }
        this.$refs.refRegister.backFill(data)
        this.$refs.refPublicInfo && this.$refs.refPublicInfo.backFill(data)
        // 10注册未提交、0上架未提交、20升级未提交、15更新未提交
        this.disabled = !([10].includes(packStatus))
        if (packStatus === 0) {
          this.disabled = false
          if (this.navList.length === 2) {
            this.disabled = true
          }
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
