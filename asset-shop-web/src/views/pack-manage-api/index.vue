<!--/*
* @Author: dingli
* @Desc: 上下架管理-接口
* @Date: 2022-4-24
*/-->
<template>
  <router-page-layout :path="myPath" class="page-main-wrap">
    <div class="page-wrap">
      <Leftnav
        class="leftnav"
        :title="leftnavData.title"
        :notroute="true"
        :hasback="true"
        :active="activeLeftnav"
        :list="leftnavData.list"
        @clickTab="clickleftnav"
        @clickBack="clickBackHome" />
      <div class="pack-manage-wrap">
        <div class="search-wrap">
          <div class="flex">
            <div class="flex">
              <div class="search">
                <c-select v-model="searchType" :specific-suffix="true" class="search-type">
                  <c-option
                    v-for="(item, key) in searchTypes"
                    :key="key"
                    :label="item"
                    :value="key" />
                </c-select>
                <c-input v-show="searchType=='packName'" ref="refPackName" v-model="searchForm.packName" clearable placeholder="请输入" />
                <c-input v-show="searchType=='shopCode'" v-model="searchForm.shopCode" clearable placeholder="请输入" />
                <c-select v-show="searchType=='packStatus'" v-model="searchForm.packStatus" filterable clearable class="search-right">
                  <c-option
                    v-for="(item, key) in PACK_STATUS"
                    :key="key"
                    :label="item"
                    :value="key" />
                </c-select>
              </div>
              <c-button type="primary" size="small" class="btn-search" @click="clickSearch">确定</c-button>
            </div>
            <c-button type="primary" size="small" @click="clickAdd"><i class="c-icon-plus"></i>新增上架资源</c-button>
          </div>
          <div class="labels">
            <tags :list="labelList" @change="labelsChange" />
          </div>
        </div>
        <div class="content-wrap">
          <cards v-show="list.length" class="cards-list" :list="list" @clickCard="clickCard" />
          <empty v-show="!list.length" text="暂无内容" />
        </div>
        <c-pagination
          v-show="pageData.total>0"
          background
          :current-page="pageData.pageNum"
          :page-size="pageData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[9, 18, 45, 90]"
          :total="pageData.total"
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </router-page-layout>
</template>
<script>
import { mapState } from 'vuex'
import Leftnav from '@/components/left-nav'
import Tags from '@/views/home/components/tags.vue'
import { queryPackListCommon } from '@/api/index'
import { APP_TYPE, API_PACK_STATUS, getAssetTypeBySubtype } from '@/utils/enum'
import Cards from '@/views/pack-manage/common/cards.vue'
import empty from '@/components/empty'

function initDataFn() {
  const leftnavData = {
    title: '接口编目',
    list: [
      {
        path: 'beforePublic',
        title: '未上架资源',
        status: 0
      }, {
        path: 'public',
        title: '已上架资源',
        status: 1
      }, {
        path: 'unpublic',
        title: '已下架资源',
        status: 2
      }
    ]
  }
  return {
    leftnavData
  }
}

export default {
  name: '',
  components: { Leftnav, Tags, Cards, empty },
  data() {
    const initDatas = initDataFn.apply(this)
    return {
      myPath: '/packManage/api',
      activeLeftnav: 'beforePublic',
      leftnavData: initDatas.leftnavData,
      PACK_STATUS: {},
      packType: 3,
      list: [],
      labelList: [],
      pageData: {
        pageNum: 1,
        pageSize: 9,
        total: 0
      },
      searchType: 'packName',
      searchForm: {
        packName: '',
        shopCode: '',
        packStatus: ''
      },
      searchTypes: {
        packName: '资源名称',
        shopCode: '资源编码',
        packStatus: '编目状态'
      },
      APP_TYPE,
      API_PACK_STATUS
    }
  },
  computed: {
    ...mapState({
      assetType: state => state.publicManage && state.publicManage.assetType || '',
      publishStatus: state => {
        const publishStatus = state.publicManage && state.publicManage.publishStatus
        if (publishStatus === undefined) return 0
        return publishStatus
      }
    })
  },
  watch: {
    assetType: {
      handler(nv, ov) {
        this.leftnavData.title = getAssetTypeBySubtype(nv)
      },
      immediate: true
    },
    publishStatus: {
      handler(nv, ov) {
        console.log(nv, ov, '-----publishStatus')
        const PACK_STATUS = {}
        switch (+nv) {
          // 未上架资源：仅上架未提交、上架审核、上架失败三种状态
          case 0:
            this.activeLeftnav = 'beforePublic';
            [0, 1, 3].forEach(k => (PACK_STATUS[k] = API_PACK_STATUS[k]))
            break
          // 已上架资源：存在已上架、下架审核、下架失败、更新审核、15更新未提交、更新失败、升级审核、升级失败
          case 1:
            this.activeLeftnav = 'public';
            [4, 6, 7, 16, 15, 17, 20, 21, 23].forEach(k => (PACK_STATUS[k] = API_PACK_STATUS[k]))
            break
          // 已下架资源：存在已下架、上架未提交、上架审核、上架失败、升级审核、升级失败
          case 2:
            this.activeLeftnav = 'unpublic';
            [5, 0, 1, 3, 20, 21, 23].forEach(k => (PACK_STATUS[k] = API_PACK_STATUS[k]))
            break
        }
        this.PACK_STATUS = PACK_STATUS
        if (nv !== undefined) {
          this.queryList()
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.query.assetType) {
      this.$store.dispatch('publicManage/setAssetType', this.$route.query.assetType)
    }
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
  },
  mounted() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
    this.$nextTick(() => {
      this.$refs.refPackName.focus()
    })
  },
  destroyed() {
    this.$store.dispatch('publicManage/setPublishStatus', this.publishStatus)
  },
  methods: {
    clickCard(item) {
      let path = '/packManage/api/config'
      if (+item.assetSubtype === 27) {
        path = '/packManage/api/supportAppConfig'
      }
      this.$router.push({
        path: `${path}/${item.shopCode}`,
        query: {}
      })
    },
    clickBackHome() {
      this.$router.push('/packManage/home')
    },
    clickleftnav(d) {
      this.$store.dispatch('publicManage/setPublishStatus', d.status)
    },
    // 点击查询按钮
    clickSearch() {
      const obj = { showId: Date.now(), showType: this.searchType }
      if (this.searchForm[this.searchType]) {
        obj.value = this.searchForm[this.searchType]
        if (this.searchType === 'packStatus') {
          obj.show = `${this.searchTypes.packStatus}：${this.PACK_STATUS[this.searchForm.packStatus]}`
        } else {
          obj.show = `${this.searchTypes[this.searchType]}：${this.searchForm[this.searchType]}`
        }
      }
      const list = [...this.labelList]
      const i = list.findIndex(d => d.showType === obj.showType)
      if (i === -1) {
        obj.show && list.push(obj)
      } else {
        obj.showId = list[i].showId
        obj.show ? (list[i] = obj) : list.splice(i, 1)
      }
      this.searchForm[this.searchType] = ''
      this.labelList = list
      this.queryList()
    },
    // 查询标签变更
    labelsChange(list) {
      this.labelList = list
      this.queryList()
    },
    handleSizeChange(n) {
      // 调整pageSize
      this.pageData.pageSize = n
      this.pageData.pageNum = 1
      this.queryList()
    },
    handleCurrentChange(i) {
      // 翻页
      this.pageData.pageNum = i
      this.queryList()
    },
    clickAdd() {
      this.$store.dispatch('publicManage/setActiveNav', 'current')
      this.$store.dispatch('publicManage/setNavlist', [{
        key: 'current',
        version: '',
        state: 0,
        init: true
      }])
      let path = '/packManage/api/config'
      if (+this.assetType === 27) {
        path = '/packManage/api/supportAppConfig'
      }
      this.$router.push(path)
    },
    async queryList() {
      try {
        const typeArr = getAssetTypeBySubtype(this.assetType, true)
        const params = {
          pageNum: this.pageData.pageNum,
          pageSize: this.pageData.pageSize,
          publishStatus: this.publishStatus,
          assetType: typeArr[0],
          assetSubtype: typeArr[1] || undefined
        }
        this.labelList.forEach(d => {
          params[d.showType] = d.value
        })
        const res = await queryPackListCommon(params)
        this.pageData.pageSize = res.data.pageSize
        this.pageData.pageNum = res.data.currPage
        this.pageData.total = res.data.total
        this.list = res.data.list
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
::v-deep.page-main-wrap .page-content {
  background-image: url(~@/assets/page-bg.png);
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 100% 225px;
}
::v-deep.page-top-tabs {
  padding: 0;
  .tab-wrap {
    max-width: 1500px;
    margin: 0 auto;
  }
}
.page-wrap {
  display: flex;
  height: calc(100% - 20px);
  border-top: 20px solid transparent;
  justify-content: center;
  overflow: auto;
  .leftnav {
    margin-right: 20px;
    flex-shrink: 0;
    width: 220px;
    background: white;
  }
}
.pack-manage-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  max-width: 1280px;
  overflow: hidden auto;
  .content-wrap {
    flex: 1;
    overflow: auto;
  }
}
.search-wrap {
  padding: 20px 24px 0 24px;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 2px;
  border: 1px solid #FFFFFF;
  backdrop-filter: blur(10px);
  .flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search {
      display: flex;
      align-items: center;
      width: 456px;
      margin-right: 20px;
    }
    .btn-search {
      padding: 8px 26px;
    }
    .c-icon-plus {
      font-weight: bold;
      margin-right: 8px;
    }
  }
  .labels {
    min-height: 20px;
  }
  .flex .flex {
    width: 1051px;
    justify-content: start;
  }
}
.pagination {
  height: 76px;
  padding-top: 24px;
  text-align: right;
}
::v-deep.dialog-asset-select {
  .c-dialog__body-wrap {
    background: #F6F9FB;
    margin-top: 24px;
    padding: 28px;
  }
  .btns-wrap {
    display: flex;
  }
  .btn-item-api, .btn-item-app {
    width: 240px;
    height: 104px;
    line-height: 104px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
    color: #4B4B4B;
    border: 1px solid transparent;
    border-radius: 2px;
    cursor: pointer;
    background: white;
    &.active {
      border-color: #36A4FF;
      color: #36A4FF;
    }
  }
  .btn-item-api {
    margin-right: 20px;
    i {
      margin-left: 32px;
      margin-right: 24px;
      display: inline-block;
      width: 64px;
      height: 64px;
      background: url(~@/assets/imgs/api-icon.png) no-repeat center;
      background-size: 100%;
      vertical-align: middle;
    }
  }
  .btn-item-app {
    i {
      margin-left: 32px;
      margin-right: 24px;
      display: inline-block;
      width: 64px;
      height: 64px;
      background: url(~@/assets/imgs/supportapp-icon.png) no-repeat center;
      background-size: 100%;
      vertical-align: middle;
    }
  }
  .info {
    height: 152px;
    margin-top: 20px;
    padding: 0 12px;
    background: white;
    line-height: 22px;
    color: #202020;
    .title {
      padding-left: 28px;
      position: relative;
      height: 64px;
      line-height: 64px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      font-weight: 500;
      &::before {
        content: '';
        position: absolute;
        top: 22px;
        left: 8px;
        width: 5px;
        height: 18px;
        background: #36A4FF;
      }
    }
    p {
      text-indent: 28px;
    }
  }
  .dialog-footer {
    text-align: right;
    padding: 28px;
    background: white;
  }
}
</style>
