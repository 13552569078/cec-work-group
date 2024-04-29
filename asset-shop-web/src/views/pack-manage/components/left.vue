<!--/*
* @Author: dingli
* @Desc: 上下架管理-左侧导航
* @Date: 2022-1-27
*/-->
<template>
  <ul class="cls-leftnav">
    <li class="title ftm500 pointer" @click="clickBack"><i class="c-icon-arrow-left" />{{ title }}</li>
    <div class="cls-items">
      <li class="">版本信息</li>
      <li v-for="item in navList" :key="item.key" class="pointer flex" :class="{active:active===item.key}" @click="clickNav(item.key)">
        <span class="pl16 version-text">{{ item | version }}</span>
        <state-label :state="item.state" class="" />
      </li>
      <li v-show="showUpgrade" class="pointer newbtn flex" @click="clickNewBtn">
        <span class="pl16">版本升级</span>
        <i class="c-icon-plus" />
      </li>
      <li class="pointer" :class="{active:active==='history'}" @click="clickNav('history')">历史版本</li>
    </div>
  </ul>
</template>
<script>
import { mapState } from 'vuex'
import { getAssetTypeBySubtype } from '@/utils/enum'
import StateLabel from '@/views/pack-manage/common/state-label.vue'
import { createActiveCommon } from '@/api/index.js'
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
    },
    showUpgrade() {
      try {
        const pub = this.$store.state.publicManage.navList[0]
        return +pub.state === 4 || +pub.state === 5
      } catch (e) {
        return false
      }
    }
  },
  methods: {
    clickNav(item) {
      this.$store.dispatch('publicManage/setActiveNav', item)
    },
    clickNewBtn() {
      const pub = this.navList[0]
      const params = { packVersionId: pub.packVersionId, optType: 4 }
      this.createActiveVersion(params)
    },
    async createActiveVersion(params) {
      // 创建活跃版本
      try {
        if (this.navList.length === 2) {
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
        const list = await this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode, isList: true })
        const key = list[list.length - 1].key
        this.$store.dispatch('publicManage/setActiveNav', key)
      } catch (e) {
        console.error(e)
      }
    },
    clickBack() {
      this.$router.push({
        path: '/packManage/asset',
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
  .newbtn {
    padding-left: 0;
    margin-left: 20px;
    margin-right: 20px;
    border-top: 1px solid #E7E7E7;
    color: #8A8A8A;
    &:hover {
      color: $primaryColor;
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
