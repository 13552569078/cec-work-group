<!--
 * @Description: 选择资源
 * @Author: lianpeng
 * @Date: 2021-09-10
-->

<template>
  <div class="select-asset-main">
    <div class="sa-nav">
      <div class="nav-top">
        <!-- <firstLevelNav
          :first-level-data="firstLevelData"
          :operatable="false"
          :can-maintained="false"
          :second-empty-show="true"
          @selectGroups="selectGroups"
          @addTree="saveNode"
          @updateTree="saveNode"
          @deleteTree="deleteTree"
        /> -->
        <div class="search-box flex-between-center search-box1">

          <div class="flex-right">
            <div class="flex-start-center">

              <c-select v-model="groupType" placeholder="引用类型" style="width:100px">
                <c-option v-for="item in groupTypeList" :key="item.value" :label="item.label"
                          :value="item.value">
                </c-option>
              </c-select>
              <c-input-search v-model="keyword" style="width:296px" class="input-search"
                              placeholder="请输入关键词进行模糊查询" @search="search"></c-input-search>
              <c-button type="gradual" size="small" @click="save">保存</c-button>
            </div>
          </div>
        </div>
        <div class="search-box flex-between-center">
          <div class="flex-left flex-start-center">
            <div class="select-info flex-start-center">
              <div v-if="!isSearch" class="unselected flex-start-center">
                <i class="icon-search "
                   :class="groupTag.groupId||keywordTag.groupName?'c-icon-search':'icon-data'"></i>
                <span class="select-text">
                  <!-- {{ groupTag.groupId||keywordTag.groupName?'查询':'全部' }}结果 -->
                  共<span class="select-num">{{ page.total }}</span>条
                </span>
              </div>
              <div v-else class="selected-icon flex-start-center">
                <!-- <c-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"></c-checkbox> -->
                <span class="select-text">已选<span
                  class="select-num">{{ checkedAssetsIds.length }}</span>条</span>
              </div>
              <div class="tag-list flex-start-center">
                <tagA v-if="groupTag.groupId" :key="groupTag.groupId" :editable="false"
                      :tag="groupTag" class="tag-margin" @deleteTag="deleteGroupTag" />
                <tagA v-if="keywordTag.groupName" :key="keywordTag.groupName" :editable="false"
                      :tag="keywordTag" class="tag-margin" @deleteTag="deleteKeywordTag" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="sa-list">
      <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore" class="assets-content-list"
           :style="'height:calc(100vh - 280px)'">
        <c-checkbox-group v-model="checkedAssetsIds">
          <ul class="list">
            <assetsCard v-for="item in assetsList" :key="item.assetId"
                        :page-key="'applicationManagement'"
                        :selected="checkedAssetsIds.indexOf(item.assetId)!=-1" :data="item"
                        class="assets-item" @showDialog="showDialog">
              <div class=" ac-icon-bottom" @click.stop="stop">
                <span class="icon-operat icon-delete" @click.stop="">
                  <c-checkbox :key="item.assetId" :label="item.assetId"
                              @change="(flag)=>{assetChange(flag,item)}">选择</c-checkbox>
                </span>
              </div>
            </assetsCard>
          </ul>
        </c-checkbox-group>

        <!-- <p v-if="loading">加载中...</p> -->
        <!-- <p v-if="noMore">没有更多了</p> -->
      </div>
    </div>
    <c-dialog :class="'dialog-center'" :visible.sync="showDialogFlagObject" :title="'查看对象资源'"
              width="666px">
      <objectDetail v-if="showDialogFlagObject" :flag="'view'" :asset-id="currId"
                    @close="closeDialog" />

    </c-dialog>
    <c-dialog :class="'dialog-center'" :title="'查看指标'" width="666px" class="details-dialog"
              top="32px" :visible.sync="showDialogFlagKpi">
      <kpiDetail v-if="showDialogFlagKpi" :flag="'detail'" :asset-id="currId"
                 @close="closeDialog" />
    </c-dialog>
    <c-dialog :class="'dialog-center'" :title="'查看接口'" width="666px" class="details-dialog"
              top="32px" :visible.sync="showDialogFlagInterface">
      <interfaceDetail v-if="showDialogFlagInterface" :flag="'detail'" :curr-id="currId"
                       @close="closeDialog" />
    </c-dialog>
  </div>
</template>

<script>
import firstLevelNav from '@/components/first-level-select';
import tagA from '@/components/tag-app'
import assetsCard from './components/assets-card.vue'
import kpiDetail from '@/views/asset-management/statistics-asset/components/kpi-add.vue'
import objectDetail from '@/views/asset-management/object-asset/add.vue'
import interfaceDetail from '@/views/asset-management/technology-asset/interface-asset/index.vue'
import {
  getTree,
  assetListPage,
  assetSave,
  updateTree,
  addTree,
  delTree
} from '@/api/index'
export default {
  components: {
    firstLevelNav,
    assetsCard,
    tagA,
    kpiDetail,
    objectDetail,
    interfaceDetail
  },
  data() {
    return {
      isSearch: false,
      groupTypeList: [{
        label: '租户资源',
        value: 1
      }, {
        label: '公共资源',
        value: 3
      }],
      firstLevelData: [],
      count: 9,
      showDialogFlagFlow: false,
      showDialogFlagObject: false,
      showDialogFlagKpi: false,
      showDialogFlagInterface: false,
      currId: '',
      keyword: '',
      loading: false,
      noMore: false,
      contentHeight: 0,
      appCode: this.$route.query.appCode,
      selectAssets: [],
      groupType: '',
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
        pageSize: 15,
        total: 0
      },
      assetsList: [],
      checkedAssetsIds: [],
      isFirstFlag: true
    }
  },
  computed: {
    checkAll() {
      return this.checkedAssetsIds.length === this.assetsList.length;
    },
    isIndeterminate() {
      return this.checkedAssetsIds.length > 0 && this.checkedAssetsIds.length < this.assetsList.length;
    }
  },
  created() {
    this.getTreeList()
    // this.load()
  },
  methods: {
    assetChange(flag, data) {
      console.log(flag, data, 'dddd')
      if (flag) { // 选中
        const findIndex = this.selectAssets.findIndex(_item => _item.assetCode === data.assetCode)
        if (~findIndex) { // 存在相同code的资源
          this.$message.warning('已更改选择，同个资源不可选择多版本')
          this.selectAssets.splice(findIndex, 1)
        }
        this.selectAssets.push(data)
      } else { // 取消
        const findIndex = this.selectAssets.findIndex(_item => _item.assetId === data.assetId)
        if (~findIndex) { // 找到当前资源
          this.selectAssets.splice(findIndex, 1)
        }
      }
      this.checkedAssetsIds = this.selectAssets.map(item => item.assetId)
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
    closeDialog() {
      this.showDialogFlagFlow = false
      this.showDialogFlagKpi = false
      this.showDialogFlagObject = false
      this.showDialogFlagInterface = false

      this.currId = ''
    },
    stop() {
      return false
    },
    selectGroups(node) {
      if (this.checkedAssetsIds.length) {
        this.$confirm('您已选中资源，查询会清除已选择资源，是否确定继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            this.checkedAssetsIds = []
            this.groupTag = { groupId: node.id, groupName: node.name }
            this.search()
          })
          .catch(() => {
          })
        return
      }
      this.groupTag = { groupId: node.id, groupName: node.name }
      this.search()
    },
    // 保存树
    saveNode(node) {
      console.log(node, '===>当前node')
      if (node.groupId) {
        this.groupId = node.parentId
        const params = {
          ...node
        }
        updateTree(params).then(rs => {
          if (rs.code === 0) {
            this.getTreeList()
            this.$message.success(rs.msg)
          }
        })
      } else {
        this.groupId = node.parentId
        const paramsAdd = {
          ...node
        }
        addTree(paramsAdd).then(rs => {
          this.getTreeList()
          this.$message.success(rs.msg)
        })
      }
    },
    deleteTree(node) {
      if (!node.groupId) {
        this.getTreeList()
      } else {
        this.$confirm('请确认是否删除节点?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            delTree({}, node.groupId).then(rs => {
              if (rs.code === 0) {
                this.getTreeList()
                this.$message.success(rs.msg)
              } else {
                this.$message.error(rs.msg)
              }
            })
          })
      }
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
        this.firstLevelData = firstLevelData
      })
    },
    // 获取专题树
    getTreeList() {
      getTree().then(rs => {
        if (rs.code * 1 === 0) {
          this.treeTotalData = rs.data
          if (rs.data.length) {
            this.handlePeelingData(rs.data)
          }
        }
      })
    },
    save() {
      const assetList = []
      this.checkedAssetsIds.forEach(item => {
        // const findOne = this.assetsList.find(_item => _item.assetId + '' === '' + item)
        const findOne = this.selectAssets.find(_item => _item.assetId + '' === '' + item)
        if (findOne) {
          assetList.push({
            assetId: findOne.assetId,
            assetCode: findOne.assetCode,
            assetType: findOne.assetType,
            version: findOne.version,
            subtype: findOne.subType || findOne.subtype
          })
        }
      })
      if (!assetList.length) {
        this.$message.error('未选择资源')
        return
      }
      assetSave({
        assetList,
        appCode: this.appCode,
        assetType: this.$route.query.assetType,
        groupId: this.$route.query.excludeGroupId,
        id: this.$route.query.appId
      }).then(res => {
        this.$message.success('保存成功')
        this.$router.back(-1)
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
    handleCheckAllChange(val) {
      this.checkedAssetsIds = val ? this.assetsList.map(item => item.assetId) : [];
    },
    search() {
      this.$nextTick(() => {
        this.isSearch = true
        this.page.pageNum = 0
        this.assetsList = []
        this.keywordTag.groupName = this.keyword
        this.load()
      })
    },
    load() {
      this.page.pageNum += 1
      this.loading = true
      assetListPage({
        keyword: this.keywordTag.groupName,
        groupType: this.groupType,
        sceneId: this.groupTag.groupId,
        assetType: this.$route.query.assetType,
        subtype: this.$route.query.subtype,
        id: this.$route.query.appId,
        appCode: this.$route.query.appCode,
        excludeGroupId: this.$route.query.excludeGroupId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }).then(res => {
        this.page.total = res.data.total
        if (this.isFirstFlag) {
          const checkedAssetList = res.data.checkedAssetList || []
          this.selectAssets = checkedAssetList
          this.checkedAssetsIds = checkedAssetList.map(item => item.assetId)
          this.isFirstFlag = false
        }
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
.assets-content-list {
  overflow: auto;
  border-radius: 8px;

  .list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    width: 1619px;
    margin: auto;
  }
  .assets-item {
    margin-bottom: 20px;
    margin-right: 18px;
    &:nth-child(5n) {
      margin-right: 0px;
    }
  }
}
.sa-nav {
  margin-bottom: 32px;
}
.nav-top {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 0 0px;
  border-radius: 0px 0px 8px 8px;
  position: relative;
  height: 144px;
}

.search-box {
  height: 72px;
  background: rgba(255, 255, 255, 0.45);

  box-sizing: border-box;
  border: 1px solid #ffffff;

  border-radius: 0px 0px 8px 8px;
  position: relative;
  padding: 0 20px;
  .icon-search {
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
    margin-left: 8px;
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
.search-box1 {
  height: 72px;
  background: rgba(255, 255, 255, 0.45);
  box-sizing: border-box;
  border: 1px solid #ffffff;
  border-radius: 0px;
  border-bottom: 0px solid;
  position: relative;
  padding: 0 24px;
}
.sa-list {
  padding: 0 0px;
}
.sa-checkbox {
  height: 50px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  &::v-deep {
    .c-checkbox__label {
      display: none;
    }
  }
}
.selected-icon {
  position: relative;
  padding-left: 16px;
  &::before {
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(~@/assets/imgs/icon-search.svg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
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
</style>
