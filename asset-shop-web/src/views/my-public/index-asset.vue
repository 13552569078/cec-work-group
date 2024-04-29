<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <router-page-layout :path="myPath">
    <div class="pack-manage-wrap">
      <div class="search-wrap">
        <div class="flex">
          <div class="flex">
            <div class="search">
              <c-select v-model="searchType" class="search-type">
                <c-option
                  v-for="(item, key) in searchTypes"
                  :key="key"
                  :label="item"
                  :value="key" />
              </c-select>
              <c-input v-show="searchType=='packName'" ref="refPackName" v-model="searchForm.packName" clearable placeholder="请输入" />
              <c-cascader
                v-show="searchType=='assetType'"
                ref="refAssetType"
                v-model="searchForm.assetType"
                :options="ASSET_TYPE_TREE"
                class="search-right"
                :props="{children: 'childList'}"
                clearable
                :show-all-levels="false" />
            </div>
            <i class="btn-search c-icon-search" @click="clickSearch" />
          </div>
        </div>
        <div class="labels">
          <tags :list="labelList" @change="labelsChange" />
        </div>
      </div>
      <div v-infinite-scroll="loader"
           :infinite-scroll-distance="250"
           :style="`height:${listHeight}px`"
           class="page-table">
        <cards
          v-show="cardList.length"
          class="content"
          :pack-type="packType"
          :list="cardList"
          custom-click
          :hidebtn="true"
          @clickCard="clickCard"
          @downloadok="downloadok" />
        <empty v-show="!cardList.length" text="" style="margin-top:72px;" />
      </div>
    </div>
  </router-page-layout>
</template>
<script>
import Tags from '@/views/home/components/tags.vue'
import { queryPublishList } from '@/api/index'
import Cards from '@/views/home/components/cards.vue'
import empty from '@/components/empty'
import { debounce } from '@l/utils'
export default {
  name: '',
  components: { Tags, Cards, empty },
  data() {
    return {
      myPath: '/myPublic/asset',
      packType: 1,
      listHeight: 0,
      cardList: [],
      labelList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 16,
        total: 0
      },
      searchType: 'packName',
      searchForm: {
        packName: '',
        assetType: ''
      },
      searchTypes: {
        packName: '上架名称',
        assetType: '资源类型'
      },
      ASSET_TYPE_TREE: window.ENUMS.TAB_ASSET_TYPE.filter(d => +d.value !== 99),
      loader: null
    }
  },
  created() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
    this.loader = debounce(this.queryData, 500)
    this.queryData(1)
  },
  mounted() {
    if (this.$route.path.replace(/\/$/, '') !== this.myPath) return
    let height = document.querySelector('.app-main').offsetHeight - document.querySelector('.search-wrap').offsetHeight - 32
    height = height > 200 ? height : 200
    this.listHeight = height
    this.$nextTick(() => {
      this.$refs.refPackName.focus()
    })
  },
  methods: {
    clickCard(item) {
      this.$router.push({
        path: '/myPublic/asset/detail',
        query: {
          shopCode: item.shopCode,
          packVersion: item.packVersion,
          assetType: item.assetSubtype,
          packVersionId: item.packVersionId
        }
      })
    },
    downloadok() {
      // 下载成功后刷新列表页
      this.queryData(1)
    },
    // 点击查询按钮
    clickSearch() {
      const obj = { showId: Date.now(), showType: this.searchType }
      if (this.searchForm[this.searchType]) {
        obj.value = this.searchForm[this.searchType]
        if (this.searchType === 'assetType') {
          const n = this.$refs.refAssetType.getCheckedNodes()[0]
          obj.show = `${this.searchTypes[this.searchType]}：${n.label}`
          if (n.level === 2) {
            obj.assetType = n.parent.value
            obj.assetSubtype = n.value
          }
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
      this.queryData(1)
    },
    // 查询标签变更
    labelsChange(list) {
      this.labelList = list
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
        assetTypeList: [],
        assetSubtypeList: [],
        statIdList: [],
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        orderKey: 'packTime',
        packOwner: 1,
        orderType: 'desc' // 默认值倒叙
      }
      this.labelList.forEach(d => {
        if (d.showType === 'packName') {
          params.packName = d.value
        }
        if (d.showType === 'assetType') {
          params.assetTypeList = [d.assetType]
          params.assetSubtypeList = [d.assetSubtype]
        }
      })
      try {
        const res = await queryPublishList(params)
        this.pageInfo.pageNum = res.data.currPage + 1
        this.pageInfo.hasNext = res.data.hasNext
        this.pageInfo.pageSize = res.data.pageSize
        this.pageInfo.total = res.data.total
        const cardList = res.data.currPage === 1 ? [] : this.cardList
        this.cardList = [].concat(cardList, res.data.list)
      } catch (e) {
        //
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
::v-deep.search {
  width: 176px;
  .search-right {
    width: 100%;
  }
  .c-input__inner {
    padding-left: 16px;
    border-radius: 0;
    border: none;
  }
  .c-select.search-type .c-input__inner {
    border-right: 1px solid #E7E7E7;
  }
}
.page-wrap {
  display: flex;
  height: 100%;
  .leftnav {
    flex-shrink: 0;
    width: 320px;
  }
}
.page-table {
  margin-top: 6px;
  padding-top: 10px;
  width: 100%;
  overflow: auto;
}
.pack-manage-wrap {
  flex-shrink: 0;
  height: 100%;
  width: 1280px;
  padding-bottom: 10px;
  overflow: hidden;
}
.search-wrap {
  padding: 40px 20px 0 20px;
  background: white;
  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .search {
      display: flex;
      align-items: center;
      width: 1150px;
      height: 48px;
      border-radius: 2px;
      border: 1px solid $primaryColor;
    }
  }
  .labels {
    min-height: 40px;
  }
  .flex .flex {
    width: 100%;
  }
}
.btn-search {
  display: inline-block;
  width: 74px;
  height: 48px;
  line-height: 48px;
  background: linear-gradient(336deg, #508DFF 0%, #1E6FFF 100%);
  box-shadow: 2px 3px 8px 0px #79A4FD;
  border-radius: 2px;
  border: 1px solid;
  border-image: linear-gradient(163deg, rgba(131, 171, 246, 1), rgba(48, 115, 253, 1)) 1 1;
  color: white;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
}
</style>
