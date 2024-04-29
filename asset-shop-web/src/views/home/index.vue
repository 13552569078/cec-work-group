<!--/*
* @Author: dingli
* @Desc: 商城首页
* @Date: 2022-1-20
*/-->
<template>
  <div v-infinite-scroll="loader" :infinite-scroll-distance="250" class="home">
    <topSearch :pack-type="packType" :count="pageInfo.total" @search="topSearch" />
    <div class="main width mainDom">
      <cards v-show="cardList.length" class="content" :pack-type="packType" :list="cardList" @downloadok="downloadok"></cards>
      <empty v-show="!cardList.length" text="暂无内容" />
      <div style="width:100%;">
        <shopCar />
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
import PageFooter from '@/components/footer'
import Cards from './components/cards.vue'
import { queryPublishList } from '@/api/index'
import { debounce } from '@l/utils'
import empty from '@/components/empty'
import topSearch from './components/top-search.vue'
import shopCar from '@/views/home/components/shop-car.vue'
export default {
  name: 'TemplateAsset',
  components: { empty, Cards, PageFooter, topSearch, shopCar },
  data() {
    return {
      packType: 1,
      backtopShow: false,
      clickClassifyFlag: false,
      order: 'packTime',
      activeTab: '',
      tabList: [
        { label: '全部模板', value: '0' },
        { label: '我上架的', value: '1' }
      ],
      orderList: {
        downloadCount: '最多下载',
        packTime: '最新上架'
      },
      labelList: [],
      cardList: [],
      pageInfo: {
        hasNext: true,
        pageNum: 1,
        pageSize: 16,
        total: 0
      },
      topSearchParams: {}
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
    // this.queryData(1)
  },
  mounted() {
    document.querySelector('.mainDom').style.minHeight = (document.querySelector('.home').offsetHeight - 200 - 340 - 38) + 'px'
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
    this.$store.commit('shopCar/CLOSE_CART_DIALOG')
  },
  methods: {
    topSearch(data) {
      this.topSearchParams = data
      this.queryData(1)
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
    downloadok() {
      // 下载成功后刷新列表页
      this.queryData(1)
    },
    async queryData(pageNum) {
      this.pageInfo.pageNum = pageNum || this.pageInfo.pageNum
      if (this.pageInfo.pageNum === 1) {
        this.pageInfo.hasNext = true
      }
      if (!this.pageInfo.hasNext) return
      const params = {
        orderType: 'desc', // 默认值倒叙
        ...this.topSearchParams,
        packType: this.packType,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      try {
        const res = await queryPublishList(params)
        this.pageInfo.pageNum = res.data.currPage + 1
        this.pageInfo.hasNext = res.data.hasNext
        this.pageInfo.pageSize = res.data.pageSize
        this.pageInfo.total = res.data.total
        const cardList = res.data.currPage === 1 ? [] : this.cardList
        this.cardList = [].concat(cardList, res.data.list)
      } catch (e) {
        console.error(e)
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
  background-image: url(~@/assets/page-bg.png);
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 100% 225px;
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
</style>
