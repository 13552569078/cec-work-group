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
import Leftnav from './components/left.vue'
import History from './components/history.vue'
import FromCom from './components/form.vue'
import ViewCom from './components/view.vue'
export default {
  name: '',
  components: { Leftnav, History, FromCom, ViewCom },
  data() {
    return {
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode
    }
  },
  computed: {
    ...mapState({
      activeNav: state => state.publicManage && state.publicManage.active || ''
    })
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
      this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode })
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
