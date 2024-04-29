<!--/*
* @Author: dingli
* @Desc: 上下架管理-未上架
* @Date: 2022-2-9
*/-->
<template>
  <div v-loading="!!loading" cestc-loading-background="rgba(255, 255, 255, 0.2)" :cestc-loading-text="loading" class="cls-form">
    <div class="main refScrollDom">
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
          <div v-show="[3, 7, 12, 17, 23].indexOf(topInfo.state)!==-1" class="opinion">审核意见：{{ topInfo.auditMsg||'--' }}</div>
          <div class="content">
            <step1 ref="refStep1" />
            <step2 ref="refStep2" :disabled="disabled" />
            <step3 ref="refStep3" :disabled="disabled" />
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
import Anchor from '@/components/anchor'
import { mapState } from 'vuex'
import step1 from './step1.vue'
import step2 from './step2.vue'
import step3 from './step3.vue'
import { createPack, updatePack, changeStatusCommon, deletePackCommon, queryPackDetail } from '@/api/index'
import { PACK_STATUS } from '@/utils/enum'
import topInfo from '@/views/pack-manage/common/top.vue'
export default {
  name: '',
  components: { topInfo, step1, step2, step3, Anchor },
  data() {
    return {
      loading: '',
      topInfoTime: '--',
      packName: '',
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode,
      disabled: false,
      scrollDom: null,
      info: {},
      actionType: 'new',
      PACK_STATUS
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
          version: currentNav.init ? '' : currentNav.version
        }
      }
      return {
        state: 0,
        version: ''
      }
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
    sleep() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 300)
      })
    },
    // 点击保存
    async clickSave(fromSubmit) {
      try {
        const validFlag1 = this.$refs.refStep1.validate()
        const validFlag2 = this.$refs[`refStep2`] ? this.$refs[`refStep2`].getFromData() : false
        const validFlag3 = this.$refs[`refStep3`] ? this.$refs[`refStep3`].getFromData() : false
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
        this.info.step1 = validFlag1.data
        this.info.step2 = validFlag2.data
        this.info.step3 = validFlag3.data
        this.loading = '保存中...'
        const sendFn = this.actionType === 'new' ? createPack : updatePack
        const oldData = this.oldData || {}
        const params = {
          ...oldData,
          ...this.info.step1,
          ...this.info.step2,
          ...this.info.step3,
          shopCode: this.shopCode || ''
        }
        params.packVersionId = this.packVersionId || ''
        const res = await sendFn(params)
        this.loading = ''
        this.$message.success('保存成功！')
        if (res.data) {
          this.packVersionId = res.data.packVersionId
          this.shopCode = res.data.shopCode
          if (fromSubmit !== 'submit') {
            this.refreshPage()
          }
        }
        this.actionType = 'edit'
        let initFlag
        // 更新顶部版本信息以及左侧版本信息
        const navList = [...this.navList]
        navList.forEach(d => {
          if (d.key === 'current' && d.version !== params.packVersion) {
            d.versionId = this.packVersionId
            d.version = params.packVersion
            // 保存过一次后离开再回来页面可以获取保存的数据
            initFlag = d.init
            d.init = false
          }
        })
        if (initFlag) {
          this.$store.dispatch('publicManage/setNavlist', navList)
        }
      } catch (e) {
        this.loading = ''
        console.error(e)
        return 'error'
      }
    },
    // 点击上架
    async clickSubmit() {
      try {
        const validFlag1 = this.$refs.refStep1.validate()
        const validFlag2 = this.$refs['refStep2'].validate()
        const validFlag3 = this.$refs['refStep3'].validate()
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
        this.info.step1 = validFlag1.data
        this.info.step2 = validFlag2.data
        this.info.step3 = validFlag3.data
        const isErr = await this.clickSave('submit')
        if (isErr === 'error') return
        const params = { packVersionId: this.packVersionId, status: 1 }
        // 15更新未提交、20升级未提交、0上架未提交、3上架失败
        if (this.detailData) {
          const packStatus = +(this.detailData && this.detailData.packStatus || '')
          if ([0, 3].includes(packStatus)) {
            params.status = 1
          } else if (packStatus === 15) {
            params.status = 4
          } else if (packStatus === 20) {
            params.status = 3
          }
        }
        await changeStatusCommon(params)
        // 上架成功后刷新当前页面
        this.refreshPage()
      } catch (e) {
        console.log(e, '---clickSubmit')
      }
    },
    // 刷新当前页
    async refreshPage() {
      if (!this.$route.params.shopCode) {
        this.$router.push({
          path: `/packManage/asset/config/${this.shopCode}`,
          query: this.$route.query,
          replace: true
        })
      } else {
        await this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode })
      }
    },
    // 删除
    clickDelete() {
      this.$confirm('请确认是否删除上架版本信息？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonIsLeft: false,
        iconClass: 'c-ioc-icon-warning',
        type: 'warning'
      }).then(() => {
        deletePackCommon(this.packVersionId).then(res => {
          // 删除成功后返回列表页面
          this.$router.push({
            path: `/packManage/asset`
          })
        })
      }).catch(() => {})
    },
    async getDetail(id) {
      try {
        const packVersionId = id || this.packVersionId
        if (!packVersionId) return
        const res = await queryPackDetail(packVersionId)
        this.detailData = res.data
        this.packName = res.data.packName
        this.topInfoTime = res.data.updateTime
        const packStatus = +res.data.packStatus
        this.info.step1 = res.data.packFile && { packFile: res.data.packFile } || null
        this.$nextTick(() => {
          this.oldData = res.data
          this.$refs.refStep1.initForm(res.data)
          this.$refs.refStep2.initForm(res.data)
          this.$refs.refStep3.initForm(res.data)
        })
        // 0上架未提交、20升级未提交、15更新未提交
        this.disabled = true
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

  }
}
.cls-anchor {
  position: fixed;
  right: 20px;
  bottom: 100px;
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
</style>
