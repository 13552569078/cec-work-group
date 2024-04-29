<!--
 * @Description: 选择资源
 * @Author: lianpeng
 * @Date: 2021-09-10
-->

<template>
  <div v-infinite-scroll="load" class="select-asset-main" :infinite-scroll-distance="66" :infinite-scroll-disabled="noMore">
    <div class="banner-box">
      <banner class="banner" :default-index="treeType" @getCurrIndex="bannerChange" />
    </div>
    <div class="sa-nav">
      <div class="nav-top">
        <div class="margin-auto">

          <firstLevelNav
            ref="firstLevelNav"
            :key="firstLevelData.length"
            :first-level-data="firstLevelData"
            :operatable="false"
            :can-maintained="false"
            :second-empty-show="false"
            @selectGroups="selectGroups"
          />
          <div class="search-box flex-between-center">
            <div class="flex-left flex-start-center">
              <div class="select-info flex-start-center">
                <div class="unselected flex-start-center">
                  <i class="icon-search " :class="groupTag.groupId||keywordTag.groupName?'c-icon-search':'icon-data'"></i>
                  <span class="select-text">
                    <!-- {{ groupTag.groupId||keywordTag.groupName?'查询':'全部' }}结果 -->
                    共<span class="select-num">{{ page.total }}</span>条</span>
                </div>
                <div class="tag-list flex-start-center">
                  <tagA v-if="groupTag.groupId" :key="groupTag.groupId" :editable="false"
                        :tag="groupTag" class="tag-margin" @deleteTag="deleteGroupTag" />
                  <tagA v-if="keywordTag.groupName" :key="keywordTag.groupName" :editable="false"
                        :tag="keywordTag" class="tag-margin" @deleteTag="deleteKeywordTag" />
                </div>
              </div>
            </div>
            <div class="flex-right">
              <div class="flex-start-center">
                <c-input-search
                  v-model="keyword"
                  style="width:296px"
                  placeholder="请输入关键词进行模糊查询"
                  @search="search"></c-input-search>
                <!-- <c-input v-model="keyword" size="small" placeholder="请输入关键词进行模糊查询" clearable style="width:296px"
                         class="input-search"
                         @keyup.enter.native="search">
                  <c-button slot="append" icon="c-icon-search" @click="search"></c-button>
                </c-input> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sa-list">
      <div class="assets-content-list"
           :class="assetsList&&assetsList.length?'':'flex-center'"
      >
        <ul v-if="assetsList&&assetsList.length" class="list">
          <assetsCard v-for="item,index in assetsList"
                      :key="item.assetId+''+index"
                      :page-key="'applicationManagement'"
                      :selected="checkedAssetsIds.indexOf(item.assetId)!=-1" :data="item"
                      class="assets-item" @showDialog="showDialog">
          </assetsCard>
        </ul>
        <div v-else class="no-list-show-wrap">
          <img src="@/assets/application/nodata-img.png" class="img-no-list-show" alt="暂无内容">
          <span class="nodata-text">暂无任何内容…</span>
        </div>

        <!-- <p v-if="loading">加载中...</p> -->
        <!-- <p v-if="noMore">没有更多了</p> -->
      </div>
    </div>
    <c-dialog :class="'dialog-center'" :visible.sync="showDialogFlagObject" :title="'查看对象资源'" width="666px">
      <objectDetail v-if="showDialogFlagObject" :flag="'view'" :asset-id="currId"
                    @close="closeDetailDialog" />

    </c-dialog>
    <c-dialog :class="'dialog-center'" :title="'查看指标'" width="666px" class="details-dialog"
              top="32px" :visible.sync="showDialogFlagKpi">
      <kpiDetail v-if="showDialogFlagKpi" :flag="'detail'" :asset-id="currId"
                 @close="closeDetailDialog" />
    </c-dialog>
    <c-dialog
      :class="'dialog-center'"
      :title="'查看接口'"
      width="666px"
      class="details-dialog"
      top="32px"
      :visible.sync="showDialogFlagInterface"
    >
      <interfaceDetail
        v-if="showDialogFlagInterface"
        :flag="'detail'"
        :curr-id="currId"
        @close="closeDetailDialog"
      />
    </c-dialog>
  </div>
</template>

<script>
import firstLevelNav from '@/components/first-level-select';
import tagA from '@/components/tag-app'
import assetsCard from '@/views/application-management/components/assets-card.vue'
import interfaceDetail from '@/views/asset-management/technology-asset/interface-asset/index.vue'
import objectDetail from '@/views/asset-management/object-asset/add.vue'
import { typeTreeData } from '@/config'
import kpiDetail from '@/views/asset-management/statistics-asset/components/kpi-add.vue'
import banner from '../components/asset-list.vue'
import { debounce } from '@/utils/helper/tool'
import {
  getTree,
  tagTree,
  assetDirectoryListPage
} from '@/api/index'

export default {
  components: {
    firstLevelNav,
    tagA,
    assetsCard,
    kpiDetail,
    objectDetail,
    banner,
    interfaceDetail
  },
  data() {
    return {
      treeType: this.$route.query.type || 1,
      firstLevelData: [],
      count: 9,
      showDialogFlagFlow: false,
      showDialogFlagObject: false,
      showDialogFlagInterface: false,
      showDialogFlagKpi: false,
      currId: '',
      keyword: '',
      loading: false,
      noMore: false,
      contentHeight: 0,
      appCode: this.$route.query.appCode,
      groupTag: {
        groupId: '',
        groupName: '',
        status: 0
      },
      keywordTag: {
        groupId: 'key-2',
        groupName: '',
        status: 0

      },
      page: {
        pageNum: 0,
        pageSize: 10,
        total: 0
      },
      assetsList: [],
      checkedAssetsIds: []
    }
  },

  created() {
    this.load = debounce(this.loader, 200)
    // treeType: 1资源类型 2资源标签 3场景归属
    window.requestIdleCallback(() => {
      this.initTree()
    })
  },
  methods: {
    bannerChange(treeType) {
      this.treeType = treeType
      this.groupTag.groupId = ''
      this.assetsList = []
      this.page.pageNum = 0
      this.noMore = false
      window.requestAnimationFrame(() => {
        this.$refs.firstLevelNav.leaveFirstLevel()
      })
      window.requestIdleCallback(() => {
        this.initTree()
      })
    },
    initTree() {
      switch (this.treeType + '') {
        case '1':
          this.getTypeTreeList()
          break;
        case '2':
          this.getTagTreeList()
          break;
        case '3':
          this.getTreeList()
          break;
        default:
          this.getTreeList()
          break;
      }
      this.load()
    },
    getTagTreeList() {
      tagTree().then(rs => {
        if (rs.code * 1 === 0) {
          if (rs.data.length) {
            this.handlePeelingData(rs.data)
          }
        }
      })
    },
    getTypeTreeList() {
      // 1统计、2技术、3对象、4数据、5流程
      this.handlePeelingData(typeTreeData)
      // this.firstLevelData = typeTreeData
    },
    showDialog({ flag, currId }) {
      if (flag === 'flow') {
        this.showDialogFlagFlow = true
      } else if (flag === 'object') {
        this.showDialogFlagObject = true
      } else if (flag === 'interface') {
        this.showDialogFlagInterface = true
      } else if (flag === 'kpi') {
        this.showDialogFlagKpi = true
      }
      this.currId = currId
    },
    closeDetailDialog() {
      this.showDialogFlagFlow = false
      this.showDialogFlagObject = false
      this.showDialogFlagInterface = false
      this.showDialogFlagKpi = false

      this.currId = ''
    },
    stop() {
      return false
    },
    selectGroups(node) {
      this.groupTag = { groupId: node.id + '', groupName: node.name }
      this.search()
    },

    // 处理剥离treedata insert TreeTotalData outPut firstLevelData,firstLe
    handlePeelingData(totalData) {
      const firstLevelData = [];
      totalData.map(item => {
        let hasOneMoreThreeChild = false
        if (item.childList && item.childList.length) {
          for (let i = 0; i < item.childList.length; i++) {
            if (item.childList[i] && item.childList[i].childList.length > 0) {
              hasOneMoreThreeChild = true;
              break
            }
          }
        }
        firstLevelData.push(Object.assign({}, item, { hasOneMoreThreeChild: hasOneMoreThreeChild }))
      })
      console.log(firstLevelData, 'firstLevelData')
      this.firstLevelData = firstLevelData
    },
    // 获取专题树
    getTreeList() {
      getTree().then(rs => {
        if (rs.code * 1 === 0) {
          if (rs.data.length) {
            this.handlePeelingData(rs.data)
          }
        }
      })
    },

    deleteKeywordTag() {
      this.keywordTag.groupName = ''
      this.keyword = ''
      this.search()
    },
    deleteGroupTag() {
      this.groupTag.groupId = ''
      this.search()
    },

    search() {
      this.$nextTick(() => {
        this.page.pageNum = 0
        this.assetsList = []
        this.keywordTag.groupName = this.keyword
        this.noMore = false
        console.log('-------')
        this.load()
      })
    },
    loader() {
      console.log('--dd-----', this.noMore)
      this.page.pageNum += 1
      if (this.noMore) return
      const params = {
        keyword: this.keywordTag.groupName,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      switch (this.treeType + '') {
        case '1':
          if (this.groupTag.groupId.length > 1) {
            params.subtype = this.groupTag.groupId
          } else {
            params.assetType = this.groupTag.groupId
          }
          break;
        case '2':
          params.tagId = this.groupTag.groupId
          break;
        case '3':
          params.sceneId = this.groupTag.groupId
          break;
        default:
          break;
      }
      this.loading = true
      assetDirectoryListPage(params).then(res => {
        this.page.total = res.data.total
        this.loading = false
        this.noMore = !res.data.hasNext
        this.assetsList = [].concat(this.assetsList, res.data.list.map(item => {
          item.selected = false
          return item
        }))
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.flex-center{
    display: flex;
    align-items: center;
}
.no-list-show-wrap {
  width: 100%;
  height: 50%;
  text-align: center;
  .img-no-list-show {
    height: calc(100% - 36px);
    display: block;
    margin: 0 auto 20px;
  }
  .nodata-text{
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #9DACCE;
  }
}
.select-asset-main {
  height: 100%;
  overflow: auto;
  min-width: 1708px;
  .banner-box {
    position: relative;
    height: 232px;
    .banner{
      position: absolute;
      top: 0px;
      left: 0;
      right: 0;
    }
  }
  .assets-content-list {
    overflow: auto;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 16px;
    min-height: calc(100vh - 496px);
    .list {
      padding: 59px 0px 0px 30px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
    }
    .assets-item {
      margin-bottom: 26px;
      margin-right: 35px;
    }
  }
  .sa-nav {
    margin-bottom: 32px;
    .margin-auto {
      width: 1688px;
      margin: auto;
    }
    .nav-top {
      background-image: url('~@/assets/logo/first-level-bg.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      padding: 0 8px;
      position: relative;
      height: 144px;
    }
    .search-box {
      height: 80px;
      background: #ffffff;
      border-radius: 0px 0px 8px 8px;
      position: relative;
      padding: 0 20px;
      .icon-search {
        margin-right: 8px;
      }
      .tag-list {
        margin-left: 24px;
        .tag-margin {
          margin-left: 16px;
        }
      }
      .input-search {
        margin-right: 32px;
      }
      .select-text {
        margin-left: 4px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #202020;
      }
      .select-num {
        color: rgba(54, 164, 255, 1);
        margin: 0 4px;
      }
    }
  }

  .sa-list {
    width: 1688px;
    margin: auto;
  }
  .selected {
    &::v-deep {
      .c-checkbox__label {
        display: none;
      }
    }
  }
  .flex-start-center {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .flex-between-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
