<!--/*
* @Author: dingli
* @Desc: 接口资源
* @Date:
*/-->
<template>
  <div v-infinite-scroll="loader" :infinite-scroll-distance="250" class="home">
    <TopCarousel :pack-type="packType" />
    <div class="tab-wrap">
      <div class="flex width">
        <ul class="tab-box">
          <li
            v-for="d in TZ_ASSET_TYPE_TREE"
            :key="d.value"
            :class="{active:activeTab==d.value,disable:d.disabled}"
            @click="handleTabCommand(d)">{{ d.label }}</li>
        </ul>
        <div class="search-wrap">
          <i class="icon-search cursor" @click="clickChowSearch" />
          <i class="line" />
          <div class="cursor" @click="clickOrder">
            <span>{{ orderList[order] }}</span>
            <i class="icon-sort" />
          </div>
        </div>
      </div>
    </div>
    <div class="main width">
      <classify-dialog ref="refClassifyDialog" :pack-type="packType" hide-label hide-scene :showflag="clickClassifyFlag" @ok="classifyDialogOk" @close="clickClassifyFlag=false" />
      <cards v-show="cardList.length" :pack-type="packType" systype="tizheng" :showthird="false" :list="cardList" class="content" custom-click @clickCard="clickCard" @downloadok="downloadok"></cards>
      <empty v-show="!cardList.length" text="" style="margin-top:111px;margin-bottom:72px;" />
      <div style="width:100%;">
        <div v-show="backtopShow" class="backtop" @click="backtop">
          <i />
          <span>顶部</span>
        </div>
      </div>
    </div>
    <page-footer />
  </div>
</template>
<script>
import TopCarousel from '@/views/home/components/top.vue'
import PageFooter from '@/components/footer'
import Cards from '@/views/home/components/cards.vue'
import ClassifyDialog from '@/views/home/components/classify-dialog.vue'
import { queryPublishList } from '@/api/index'
import { debounce } from '@l/utils'
import empty from '@/components/empty'
export default {
  name: 'TemplateAsset',
  components: { TopCarousel, empty, Cards, ClassifyDialog, PageFooter },
  data() {
    return {
      packType: 1,
      backtopShow: false,
      clickClassifyFlag: false,
      searchVal: '',
      order: 'packTime',
      activeTab: '',
      orderList: {
        downloadCount: '最多下载',
        packTime: '最新上架'
      },
      labelList: [],
      cardList: [],
      pageInfo: {
        hasNext: true,
        pageNum: 1,
        pageSize: 16
      },
      searchValId: `-search-search-search-search-search-search-search--`,
      TZ_ASSET_TYPE_TREE: [
        { label: '全部', value: '', disabled: false },
        { label: '场景能力', value: 'tz-category-04', disabled: false },
        { label: '业务能力', value: 'tz-category-03', disabled: false },
        { label: '服务能力', value: 'tz-category-02', disabled: false },
        { label: '原子能力', value: 'tz-category-01', disabled: false }
      ]
    }
  },
  watch: {
    order(nv, ov) {
      if (nv !== ov) {
        this.queryData(1)
      }
    },
    activeTab(nv, ov) {
      if (nv !== ov) {
        this.queryData(1)
      }
    }
  },
  created() {
    this.loader = debounce(this.queryData, 500)
    this.queryData(1)
  },
  mounted() {
    document.querySelector('.home').onscroll = (e) => {
      this.backtopShow = e.srcElement.scrollTop > 100
    }
    window.onresize = () => {
      this.setBacktopPosition()
    }
    this.setBacktopPosition()
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    clickCard(item) {
      const route = this.$router.resolve({
        path: '/templateTZ/detail',
        query: {
          shopCode: item.shopCode,
          packVersion: item.packVersion
        }
      })
      window.open(route.href, '_blank')
    },
    clickOrder() {
      if (this.order === 'packTime') {
        this.order = 'downloadCount'
      } else {
        this.order = 'packTime'
      }
    },
    setBacktopPosition() {
      const bodyWidth = document.body.offsetWidth
      const dom = document.querySelector('.backtop')
      if (bodyWidth < 1500) {
        dom.parentElement.style.paddingLeft = '1290px'
        // dom.style.right = '50px'
      } else {
        dom.parentElement.style.paddingLeft = '1320px'
        // dom.style.right = '104px'
      }
    },
    clickChowSearch() {
      if (!this.clickClassifyFlag) {
        const data = this.labelList
        this.$refs.refClassifyDialog.init(data)
        this.clickClassifyFlag = true
      }
    },
    handleTabCommand(v) {
      if (v.disabled) return
      this.activeTab = v.value
    },
    downloadok() {
      // 下载成功后刷新列表页
      this.queryData(1)
    },
    classifyDialogOk(data) {
      this.labelList = data
      this.queryData(1)
    },
    async queryData(pageNum) {
      this.pageInfo.pageNum = pageNum || this.pageInfo.pageNum
      if (this.pageInfo.pageNum === 1) {
        this.pageInfo.hasNext = true
      }
      if (!this.pageInfo.hasNext) return
      const params = {
        packType: this.packType,
        packName: '',
        sceneIdList: [],
        tagIdList: [],
        assetTypeList: [2],
        assetSubtypeList: [24], // 指定查询 技术-体征资源
        statIdList: [],
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        orderKey: this.order,
        orderType: 'desc' // 默认值倒叙
      }
      if (this.activeTab) {
        params.bizType = this.activeTab
      }
      this.labelList.forEach(d => {
        if (d.type === '资源分类') {
          params.sceneIdList.push(d.value)
        } else if (d.type === '标签分类') {
          params.tagIdList.push(d.value)
        } else if (d.type === '查询') {
          params.packName = d.value
        } else if (d.type === '自定义') {
          params.statIdList.push(d.value)
        }
      })
      try {
        const res = await queryPublishList(params)
        this.pageInfo.pageNum = res.data.currPage + 1
        this.pageInfo.hasNext = res.data.hasNext
        this.pageInfo.pageSize = res.data.pageSize
        const cardList = res.data.currPage === 1 ? [] : this.cardList
        this.cardList = [].concat(cardList, res.data.list)
      } catch (e) {
        //
      }
    },
    backtop() {
      document.querySelector('.home').scrollTo({ behavior: 'smooth', top: 0 })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.width {
  width: 1280px;
  margin: auto;
}
.cursor {
  cursor: pointer;
}
.home {
  position: relative;
  height: 100%;
  overflow: auto;
  min-width: 1280px;
  background: #FFFFFF;
  .main {
    position: relative;
    z-index: 10;
  }
  .content {
    margin-top: 20px;
  }
  .backtop {
    position: fixed;
    bottom: 124px;
    // right: -104px;
    padding-top: 8px;
    width: 64px;
    height: 64px;
    background: linear-gradient(180deg, #F3F5F8 0%, #FDFDFE 100%);
    box-shadow: 4px 6px 20px 0px #E8EDF5;
    border-radius: 2px;
    border: 2px solid #FFFFFF;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    i {
      margin: auto;
      margin-bottom: 6px;
      display: block;
      width: 24px;
      height: 23px;
      background: url(~@/assets/imgs/backtop.png) no-repeat center;
    }
  }
}
.tab-wrap {
  position: absolute;
  top: 280px;
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px 4px 0px 2px;
  backdrop-filter: blur(8px);
  z-index: 2;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tab-box {
    li {
      display: inline-block;
      height: 80px;
      line-height: 80px;
      width: 140px;
      text-align: center;
      font-size: 16px;
      color: #FFFFFF;
      cursor: pointer;
      transition: background 2s;
    }
    li.active {
      background: rgba(30, 111, 255, 0.5);
    }
    li.disable {
      color: #7C7C7C;
      cursor: default;
    }
  }
  .search-wrap {
    display: flex;
    align-items: center;
    width: 185px;
    height: 48px;
    padding-left: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    color: #FFFFFF;
    .icon-search {
      width: 24px;
      height: 24px;
      background: url(~@/assets/imgs/icon-search.png) no-repeat center;
      background-size: 100% 100%;
    }
    .line {
      margin: 0 20px;
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.59);
    }
    .icon-sort {
      margin-left: 8px;
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url(~@/assets/imgs/icon-sort.png) no-repeat center;
      vertical-align: middle;
  background-size: 100%;
    }
  }
}
</style>
