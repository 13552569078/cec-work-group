<!--/*
* @Author: dingli
* @Desc: 上下架管理-左侧导航
* @Date: 2022-1-27
*/-->
<template>
  <ul class="cls-leftnav">
    <li class="title ftm500 pointer" @click="clickBack"><i class="c-icon-arrow-left" />{{ title }}</li>
    <div class="cls-items">
      <li class="">编目信息</li>
      <li v-for="item in navList" :key="item.key" class="pointer flex" :class="{active:active===item.key}" @click="clickNav(item.key)">
        <span class="pl16 version-text">{{ item | version }}</span>
        <state-label :state="item.state" class="" />
      </li>
      <li class="pointer" :class="{active:active==='history'}" @click="clickNav('history')">历史版本</li>
    </div>
  </ul>
</template>
<script>
import { mapState } from 'vuex'
import { getAssetTypeBySubtype } from '@/utils/enum'
import StateLabel from '@/views/pack-manage/common/state-label.vue'
export default {
  name: 'Leftnav',
  components: { StateLabel },
  filters: {
    version(item) {
      return item.version || '--'
    }
  },
  data() {
    return {
      packValidateFlag: false,
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode
    }
  },
  computed: {
    ...mapState({
      assetType: state => state.publicManage && state.publicManage.assetType || '',
      navList: state => state.publicManage && state.publicManage.navList || [],
      active: state => state.publicManage && state.publicManage.active || ''
    }),
    title() {
      return getAssetTypeBySubtype(this.assetType)
    }
  },
  methods: {
    clickNav(item) {
      if (this.active === item) return
      if (this.active !== 'current') {
        this.$store.dispatch('publicManage/setActiveNav', item)
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
        this.$store.dispatch('publicManage/setActiveNav', item)
      }).catch(() => {
      })
    },
    clickBack() {
      this.$router.push({
        path: '/packManage/api',
        query: {
          assetType: this.assetType
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.f16 {
  font-size: 16px;
}
.cls-leftnav {
  padding: 0;
  li {
    padding-left: 20px;
    height: 48px;
    line-height: 48px;
  }
  .cls-items {
    padding: 0px 8px;
    margin-top: 12px;
  }
  .version-text {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pl16 {
    padding-left: 8px;
  }
  .pr20 {
    padding-right: 16px;
  }
  .pointer {
    cursor: pointer;
    &:hover {
      color: $primaryColor;
    }
  }
  .title {
    margin-right: 20px;
    width: 220px;
    height: 64px;
    line-height: 64px;
    border: 1px solid white;
    background: url(~@/assets/imgs/left-nav-header.png) no-repeat center;
    background-size: 100%;
    font-size: 18px;
    .c-icon-arrow-left {
      font-weight: bold;
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
  }
  .active {
    background: #F8FAFF;
    border-radius: 2px;
  }
}
</style>
