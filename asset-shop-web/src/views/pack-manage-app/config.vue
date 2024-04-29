<!--/*
* @Author: dingli
* @Desc: 上下架管理-详情
* @Date: 2022-2-9
*/-->
<template>
  <div class="pack-manage-setting">
    <leftnav class="leftnav" />
    <div style="min-width:1280px;">
      <from-com v-if="activeNav==='current'" class="main" />
      <view-com v-if="activeNav==='public'" class="main" />
      <view-com v-if="activeNav==='public-1'" class="main" />
      <history v-if="activeNav==='history'" class="main" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { bus } from '@/utils'
import Leftnav from './components/left.vue'
import History from './components/history.vue'
import FromCom from './components/form.vue'
import ViewCom from './components/view.vue'
export default {
  name: '',
  components: { Leftnav, History, FromCom, ViewCom },
  data() {
    return {
      needLeaveTip: false,
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode
    }
  },
  computed: {
    ...mapState({
      activeNav: state => state.publicManage && state.publicManage.active || ''
    })
  },
  created() {
    bus.$on('-bus-packappform-leave-validate-', this.formDataLeaveValidate)
    this.init()
  },
  beforeRouteLeave(to, from, next) {
    if (!this.needLeaveTip) {
      next(true)
      return
    }
    if (this.activeNav !== 'current') {
      next(true)
      return
    }
    this.$confirm('页面信息尚未保存或提交，确定要离开吗？', {
      title: '提示',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      confirmButtonIsLeft: false,
      iconClass: 'c-ioc-icon-warning',
      type: 'warning'
    }).then(() => {
      next(true)
    }).catch(() => {
      next(false)
    })
  },
  destroyed() {
    this.$store.dispatch('publicManage/setActiveNav', '')
    this.$store.dispatch('publicManage/setNavlist', [])
    bus.$off('-bus-packappform-leave-validate-', this.formDataLeaveValidate)
  },
  methods: {
    init() {
      this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode, type: 99 })
    },
    shopCodeChange(shopCode) {
      if (this.shopCode !== shopCode) {
        this.shopCode = shopCode
        this.init()
      }
    },
    formDataLeaveValidate(flag) {
      console.log(flag, '------formDataLeaveValidate')
      this.needLeaveTip = flag
    }
  }
}
</script>
<style scoped lang="scss">
.pack-manage-setting {
  display: flex;
  height: 100%;
  border-top: 20px solid transparent;
  justify-content: center;
  min-width: 1550px;
  overflow: auto;
  .leftnav {
    margin-right: 20px;
    flex-shrink: 0;
    width: 220px;
    background: white;
  }
  .main {
    min-width: 1280px;
    height: 100%;
    padding-bottom: 10px;
    overflow: auto;
  }
}
</style>
