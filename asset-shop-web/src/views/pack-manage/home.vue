<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="pack-manage-home">
    <div class="left">
      <div v-if="!!appInfo" class="item-app" :class="{active:activeKey=='app'}" @click="clickLeft('app')"><i></i>应用资源</div>
      <div v-if="TAB_ASSET_TYPE&&TAB_ASSET_TYPE.length" class="item-asset" :class="{active:activeKey=='asset'}" @click="clickLeft('asset')"><i></i>组件资源</div>
    </div>
    <div class="right">
      <c-menu v-show="activeKey=='asset'" :default-active="tabAssetKey" mode="horizontal" text-color="#4b4b4b" active-text-color="#36A4FF" class="tab-menu" @select="handleSelect">
        <template v-for="item in TAB_ASSET_TYPE">
          <component
            :is="item.childList&&item.childList.length?'c-submenu':'c-menu-item'"
            :key="item.value"
            :index="item.value+''">
            <template slot="title">{{ item.label }}</template>
            <c-menu-item
              v-for="sub in item.childList"
              :key="sub.value"
              :index="sub.value+''">
              {{ sub.label }}
            </c-menu-item>
          </component>
        </template>
      </c-menu>
      <div class="tips-wrap w-full">
        <i :class="`asset-icon ${assetIcon}`"></i>
        <div class="tips-box w-full">
          <h3 class="title">{{ activeInfo.title }}</h3>
          <p class="desc w-[880px]">{{ activeInfo.desc }}</p>
          <p class="tips w-[880px]">{{ activeInfo.tips }}</p>
          <div class="flex justify-between">
            <c-button type="primary" @click="clickAdd">{{ activeKey=='app'?'开始注册应用':'开始上架资源' }}</c-button>
            <c-button type="primary" plain @click="guideFlag=!guideFlag">{{ guideFlag?'关闭引导':'场景引导' }}</c-button>
          </div>
        </div>
      </div>
      <div class="content">
        <template v-if="!guideFlag">
          <h3 class="info-title">最近编目</h3>
          <span class="more" type="text" @click="clicMore">更多<i class="c-icon-arrow-right"></i></span>
          <div class="cards-wrap">
            <cards v-show="list.length" class="cards-list" :list="list" @clickCard="clickCard" />
            <div v-show="!list.length" class="empty">暂无内容</div>
          </div>
        </template>
        <div v-else class="guide-info-wrap">
          <h1 class="title">{{ guideInfo[activeKey].title }}</h1>
          <p class="tips">{{ guideInfo[activeKey].tips }}</p>
          <div class="img-wrap">
            <img :src="guideInfo[activeKey].img" alt="" class="w-full">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { queryPackListCommon } from '@/api/index'
import { mapState } from 'vuex'
import cards from '@/views/pack-manage/common/cards.vue'
import store from '@/store'
export default {
  name: '',
  components: { cards },
  beforeRouteEnter(to, from, next) {
    // 切换顶部tab时，其他路由跳转过来的为初始化
    if (!from.path.startsWith('/packManage')) {
      let assetType = window.ENUMS.TAB_ASSET_TYPE[0].value
      if (window.ENUMS.TAB_ASSET_TYPE[0].childList && window.ENUMS.TAB_ASSET_TYPE[0].childList[0]) {
        assetType = window.ENUMS.TAB_ASSET_TYPE[0].childList[0].value
      }
      store.dispatch('publicManage/setAssetType', assetType)
    }
    next()
  },
  data() {
    const assetMap = {}
    window.ENUMS.TAB_ASSET_TYPE.forEach(d => {
      assetMap[d.value] = d
      if (d.childList) {
        d.childList.forEach(dd => {
          assetMap[dd.value] = { ...dd, pid: d.value }
        })
      }
    })
    const appInfo = window.ENUMS.TAB_ASSET_TYPE.find(d => +d.value === 99)
    return {
      activeKey: appInfo ? 'app' : 'asset',
      tabAssetKey: '',
      TAB_ASSET_TYPE: window.ENUMS.TAB_ASSET_TYPE.filter(d => +d.value !== 99),
      appInfo,
      assetMap,
      activeInfo: {
        title: '',
        tips: '',
        desc: ''
      },
      list: [],
      guideFlag: false,
      guideInfo: {
        app: {
          title: '欢迎进行应用编目',
          tips: '数字资源开发中心提供一站式应用资源全生命周期管理能力，支持多渠道应用的注册、上架、升级、更新及下架管理，实现数字资源沉淀及一本账管理。',
          img: require('@/assets/imgs/guide-app.png')
        },
        asset: {
          title: '欢迎进行组件编目',
          tips: '数字资源开发中心提供一站式组件资源管理能力，支持多种类型组件资源的上架、升级、更新及下架管理，实现数字资源沉淀及一本账管理。',
          img: require('@/assets/imgs/guide-asset.png')
        }
      }
    }
  },
  computed: {
    ...mapState({
      assetType: state => state.publicManage && state.publicManage.assetType || ''
    }),
    assetIcon() {
      if (this.activeKey === 'app') return 'icon-asset-app'
      const tabAssetKey = +this.tabAssetKey
      switch (tabAssetKey) {
        case 5: return 'icon-asset-flow'
        case 31: return 'icon-asset-object'
        case 14: return 'icon-asset-tz'
        case 22: return 'icon-asset-api'
        case 23: return 'icon-asset-page'
        case 27: return 'icon-asset-supportapp'
        case 7: return 'icon-asset-model'
      }
      return ''
    }
  },
  watch: {
    assetType: {
      handler(nv, ov) {
        if (nv && nv !== ov) {
          if (+nv === 99) {
            this.clickLeft('app')
          } else {
            const item = this.assetMap[nv]
            const path = [item.value + '']
            if (item.pid) {
              path.unshift(this.assetMap[item.pid].value + '')
            }
            this.clickLeft('asset', path)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    clickCard(item) {
      let path = '/packManage/app/config'
      let assetType = 99
      if (this.activeKey !== 'app') {
        assetType = +this.tabAssetKey
        switch (assetType) {
          case 5: path = '/packManage/asset/config'; break
          case 31: path = '/packManage/asset/config'; break
          case 23: path = '/packManage/asset/config'; break

          case 14: path = '/packManage/api/config'; break
          case 22: path = '/packManage/api/config'; break
          case 7: path = '/packManage/api/config'; break

          case 27: path = '/packManage/api/supportAppConfig'; break
        }
      }
      this.jumpPage(assetType, `${path}/${item.shopCode}`)
    },
    clicMore() {
      let path = '/packManage/app'
      let assetType = 99
      if (this.activeKey !== 'app') {
        assetType = +this.tabAssetKey
        switch (assetType) {
          case 5: path = '/packManage/asset'; break
          case 31: path = '/packManage/asset'; break
          case 23: path = '/packManage/asset'; break

          case 14: path = '/packManage/api'; break
          case 22: path = '/packManage/api'; break
          case 7: path = '/packManage/api'; break

          case 27: path = '/packManage/api'; break
        }
      }
      this.jumpPage(assetType, path)
    },
    clickAdd() {
      let path = '/packManage/app/config'
      let assetType = 99
      if (this.activeKey !== 'app') {
        assetType = +this.tabAssetKey
        switch (assetType) {
          case 5: path = '/packManage/asset/config'; break
          case 31: path = '/packManage/asset/config'; break
          case 23: path = '/packManage/asset/config'; break

          case 14: path = '/packManage/api/config'; break
          case 22: path = '/packManage/api/config'; break
          case 7: path = '/packManage/api/config'; break

          case 27: path = '/packManage/api/supportAppConfig'; break
        }
      }
      this.$store.dispatch('publicManage/setActiveNav', 'current')
      this.$store.dispatch('publicManage/setNavlist', [{
        key: 'current',
        version: '',
        state: this.activeKey === 'app' ? 10 : 0, // 初始状态是注册未提交10
        init: true
      }])
      this.jumpPage(assetType, path)
    },
    jumpPage(assetType, path, query) {
      let publishStatus = 3 // 应用第一个分类是“未注册”、其他资源是“未上架”
      if (+assetType !== 99) {
        publishStatus = 0
      }
      query = query || {}
      query.assetType = assetType
      this.$store.dispatch('publicManage/setAssetType', assetType)
      this.$store.dispatch('publicManage/setPublishStatus', publishStatus)
      this.$router.push({
        path,
        query
      })
    },
    handleSelect(key, keyPath) {
      this.tabAssetKey = key
      let title = ''
      let item = this.TAB_ASSET_TYPE.find(d => +d.value === +keyPath[0])
      title = item.label
      if (keyPath[1]) {
        item = item.childList.find(d => +d.value === +keyPath[1])
        title = title + '-' + item.label
      }
      if (item) {
        this.activeInfo = {
          title: title,
          tips: item.tips,
          desc: item.desc
        }
      }
      this.queryList({ assetType: keyPath[0], assetSubtype: keyPath[1] })
    },
    clickLeft(key, keypath) {
      this.guideFlag = false
      if (key === 'app') {
        this.activeInfo = {
          title: this.appInfo.label,
          tips: this.appInfo.tips,
          desc: this.appInfo.desc
        }
        this.queryList({ assetType: 99 })
      } else {
        let path
        if (keypath) {
          path = keypath
        } else {
          path = [this.TAB_ASSET_TYPE[0].value + '']
          if (this.TAB_ASSET_TYPE[0].childList && this.TAB_ASSET_TYPE[0].childList[0]) {
            path.push(this.TAB_ASSET_TYPE[0].childList[0].value + '')
          }
        }
        this.handleSelect(path[path.length - 1], path)
      }
      this.activeKey = key
    },
    async queryList(queryParams) {
      try {
        const params = {
          pageNum: 1,
          pageSize: 6,
          ...queryParams
        }
        const res = await queryPackListCommon(params)
        this.list = res.data.list
      } catch (e) {
        console.error(e)
      }
    }
  },
  mounted(){
    this.clicMore()
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.pack-manage-home {
  display: flex;
  height: calc(100% - 20px);
  padding-top: 20px;
  justify-content: center;
  overflow: auto;
  background-image: url(~@/assets/page-bg.png);
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 100% 225px;
  .left {
    flex-shrink: 0;
    padding-top: 20px;
    padding-left: 20px;
    margin-right: 20px;
    width: 220px;
    background: white;
    .item-app, .item-asset {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      width: 180px;
      height: 64px;
      padding-left: 10px;
      border-radius: 2px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      font-weight: 500;
      background: #F6F9FB;
      cursor: pointer;
      i {
        width: 40px;
        height: 40px;
        margin-right: 20px;
        background-size: 100%;
      }
      &.active {
        background: linear-gradient(110deg, #36A4FF 0%, #84C7FF 100%);
        color: #FFFFFF;
      }
    }
    .item-app {
      i {
        background-image: url(~@/assets/imgs/icon-pack-app.png);
      }
      &.active i {
        background-image: url(~@/assets/imgs/icon-pack-app-hover.png);
      }
    }
    .item-asset {
      i {
        background-image: url(~@/assets/imgs/icon-pack-asset.png);
      }
      &.active i {
        background-image: url(~@/assets/imgs/icon-pack-asset-hover.png);
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    flex: 1;
    flex-shrink: 0;
    max-width: 1280px;
    height: 100%;
  }
  .more {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #8A8A8A;
    cursor: pointer;
    &:hover {
      color: $primaryColor;
    }
    i {
      font-weight: bold;
    }
  }
}
.content {
  height: calc(100% - 266px);
  position: relative;
  padding: 20px;
  margin-top: 20px;
  // flex: 1;
  background: #FFFFFF;
  overflow: auto;
  .info-title {
    margin-bottom: 0;
  }
}
.tips-wrap {
  flex-shrink: 0;
  display: flex;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 40px;
  height: 266px;
  border-radius: 0px 0px 2px 2px;
  background: #FFFFFF;
  .asset-icon {
    margin-right: 16px;
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-size: 24px;
    background-position: center;
  }
  .tips-box {
    .title {
      margin-top: 8px;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      color: #202020;
    }
    .desc {
      margin: 12px 0;
      font-size: 18px;
      line-height: 26px;
    }
    .tips {
      line-height: 22px;
      margin-bottom: 32px;
      font-size: 14px;
      color: #8A8A8A;
    }
    .c-button {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
}
::v-deep.tab-menu {
  flex-shrink: 0;
  width: 100% !important;
  height: 72px;
  padding-top: 20px;
  padding-left: 20px;
  border-bottom: none !important;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid #FFFFFF;
  border-radius: 4px 4px 0px 0px;
  .c-menu-item, .c-submenu__title {
    margin-right: 12px;
    height: 32px;
    line-height: 32px;
    background: #FFFFFF;
    border-radius: 2px;
  }
  .c-submenu.is-active .c-submenu__title, .c-submenu .c-submenu__title, .c-menu-item.is-active, .c-menu-item {
    border-bottom: none !important;
  }
  .c-submenu__icon-arrow {
    font-weight: bold !important;
    color: #4b4b4b !important;
  }
  .is-active .c-submenu__icon-arrow {
    color: $primaryColor !important;
  }
}
.empty {
  padding-top: 100px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #8A8A8A;
  text-align: center;
}
.guide-info-wrap {
  padding-top: 20px;
  text-align: center;
  .title {
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
  }
  .tips {
    margin: auto;
    margin-top: 12px;
    width: 714px;
    line-height: 22px;
    color: #8A8A8A;
  }
  .img-wrap {
    margin: auto;
    width: 1040px;
  }
}
</style>
