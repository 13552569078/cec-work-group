<!--/*
* @Author: dingli
* @Desc: 上下架管理-详情
* @Date:
*/-->
<template>
  <div class="pack-manage-setting">
    <leftnav class="leftnav" />
    <div style="min-width:1280px;">
      <component :is="componentId" class="main"></component>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import leftnav from './components/left.vue'
import History from './components/history.vue'
import FormApi from './components/form-api/form.vue'
import FormSupportapp from './components/form-supportapp/form.vue'
import ViewCom from './components/view.vue'
export default {
  name: '',
  components: { leftnav, History, FormApi, FormSupportapp, ViewCom },
  data() {
    return {
      needLeaveTip: false,
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode
    }
  },
  computed: {
    ...mapState({
      activeNav: state => state.publicManage && state.publicManage.active || ''
    }),
    componentId() {
      if (this.activeNav.indexOf('public') !== -1) return 'ViewCom'
      if (this.activeNav === 'history') return 'History'
      if (this.activeNav === 'current') {
        if (this.$route.path.indexOf('supportAppConfig') !== -1) return 'FormSupportapp'
        return 'FormApi'
      }
      return ''
    }
  },
  created() {
    this.init()
  },
  destroyed() {
    this.$store.dispatch('publicManage/setActiveNav', '')
    this.$store.dispatch('publicManage/setNavlist', [])
  },
  methods: {
    init() {
      this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode, isApi: true })
    },
    shopCodeChange(shopCode) {
      if (this.shopCode !== shopCode) {
        this.shopCode = shopCode
        this.init()
      }
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
