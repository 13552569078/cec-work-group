<!--
 * @Description: 流程资源-业务流程
 * @Author: zhangsen
 * @Date: 2021-05-07
-->
<template>
  <router-page-layout :path="myPath">
    <div class="index-config-wrap">
      <tree-layout :setting="setting" :show-tree="false" :options="options" :init-tags="tags"
                   @getHeaderHeight="contentHeightChange" @getSearch="getSearch" @cacheTags="cacheTags">

        <template v-slot:header="{ searchForm }">
          <c-form ref="searchForm" :model="searchForm" inline @submit.native.prevent>
            <c-form-item label="资源名称" class="lp-search-form-field">
              <c-input v-model="searchForm.assetName" :placeholder="'请输入'" size="small" clearable />
            </c-form-item>
            <c-form-item label="资源编码" class="lp-search-form-field">
              <c-input v-model="searchForm.assetCode" :placeholder="'请输入'" size="small" clearable />
            </c-form-item>
            <c-form-item label="资源标签" class="tagIdList lp-search-form-field">
              <c-select v-model="searchForm.tagIdList" multiple filterable :specific-suffix="true" placeholder="请选择">
                <c-option
                  v-for="item in tagTreeData"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item.groupId" />
              </c-select>
            </c-form-item>
            <c-form-item label="资源来源" class="lp-search-form-field">
              <c-select v-model="searchForm.assetSrc" :specific-suffix="true" class="form-input-item" size="small"
                        placeholder="请选择">
                <c-option v-for="item in assetSrc" :key="item.value" :label="item.label" :value="item.value"></c-option>
              </c-select>
            </c-form-item>
            <c-form-item label="资源状态" class="lp-search-form-field">
              <c-select v-model="searchForm.status" :specific-suffix="true" class="form-input-item" size="small"
                        placeholder="请选择">
                <c-option v-for="item in assetStatus" :key="item.value" :label="item.label" :value="item.value"></c-option>

              </c-select>
            </c-form-item>
            <c-form-item label="共享状态" class="lp-search-form-field">
              <c-select v-model="searchForm.sharedFlag" :specific-suffix="true" class="form-input-item" size="small"
                        placeholder="请选择">
                <c-option v-for="item in shareStatus" :key="item.value" :label="item.label" :value="item.value"></c-option>

              </c-select>
            </c-form-item>
            <c-form-item
              label="场景分类"
              prop="groupId"
              class="lp-search-form-field"
            >
              <c-cascader
                v-model="searchForm.groupId"
                style="width:100%"
                size="small"
                :specific-suffix="true"
                :show-all-levels="false"
                :options="treeData"
                :props="{
                  multiple: false,
                  value: 'groupId',
                  label: 'groupName',
                  children: 'childList',
                  emitPath: false,
                  checkStrictly: true
                }"
                :placeholder=" '请选择'"
                clearable
              />
            </c-form-item>
          </c-form>
        </template>
        <template v-slot:content-header_left>
          <total-info :search="hasSearch" :total="page.total" />
          <iconSwitch v-model="pageListType" />
        </template>
        <template v-slot:content-header_right>
          <button-dropdown v-show="getPermissionByAssetsbutype(51, 'copyAsset')" class="btn-operate mrg-right" :btn-type="'operate'" :options="btnList" :text="'复制资源'" @command="handleCommand" />
          <c-button
            v-show="getPermissionByAssetsbutype(51, 'add')"
            size="small" class="" type="gradual"
            @click="handleCommand(1)">新建资源</c-button>
          <!-- <button-dropdown v-show="getPermissionByAssetsbutype(51, 'add')" :options="btnList" :text="'新建资源'" @command="handleCommand" /> -->
        </template>

        <template v-slot:table>
          <div v-show="pageListType=='card'" class="assets-content-list" :style="{'height': setting.tableHeight,}">
            <div class="list" :style="{ width: '1619px' }">
              <assetsCard v-for="asset in dataList"
                          :key="asset.assetId"
                          :page-key="'flowAsset'" class="assets-item" :is-list="true" :show-status="true"
                          :data="asset" :btn-list="getbtns(asset)" @handleClick="handleOperateClick"></assetsCard>
            </div>
          </div>
          <assetsTable
            v-show="pageListType=='list'"
            :page-key="'flowAsset'"
            :data="dataList"
            :height="setting.tableHeight"
            :page="page"
            :getbtns="getbtns"
            @handleOperateClick="handleOperateClick"></assetsTable>
        </template>
        <template v-slot:footer>
          <div class="lp-page-footer">
            <c-pagination :current-page="page.pageNum" :page-size="page.pageSize" :page-sizes="pageSizeArr"
                          layout="sizes,total, prev, pager, next, jumper" :total="page.total" background
                          class="size-left" @size-change="handleSizeChange"
                          @current-change="handleCurrentChange" />
          </div>
        </template>
      </tree-layout>
      <c-dialog :class="'dialog-center'" title="资源关系图" :visible.sync="showDialog" :before-close="closeRelationDialog">
        <assetRelationChart v-if="showDialog" :asset-data="currAsset"></assetRelationChart>
      </c-dialog>
      <changeGroupDialog v-if="dialogVisibleChangeGroup" :dialog-flag="dialogVisibleChangeGroup" :curr="currAsset"
                         @close="closeChangeGroupDialog" />
      <postDailog :post-dailog-flag="postDailogFlag" :curr-asset="currAsset" @close="closePostDialog" />
      <copyDailog v-if="dialogVisibleCopy" :dialog-flag="dialogVisibleCopy" :curr-id="currAsset.id"
                  @close="closeCopyDialog" />
      <importDailog v-if="dialogVisibleImport" :dialog-flag="dialogVisibleImport" :group-id="groupId"
                    :curr-id="currAsset.id" :curr-asset="currAsset" @close="closeImportDialog" />
      <selectDownload v-if="dialogVisibleSelect" :group-id="groupId" :dialog-flag="dialogVisibleSelect"
                      :asset-type="currAsset.assetType" :subtype="currAsset.subtype" @close="closeSelectDialog" />
      <selectCommon v-if="dialogVisibleCopyCommon" :group-id="groupId" :dialog-flag="dialogVisibleCopyCommon"
                    :asset-type="currAsset.assetType" :subtype="currAsset.subtype" @close="closeCommonDialog" />
    </div>

  </router-page-layout>
</template>
<script>
import {
  getTree,
  getProcessList,
  updateTree,
  addTree,
  delTree,
  processDelete,
  tagTree
} from '@/api/index'

import postDailog from '../components/post-dialog.vue'
import copyDailog from '../components/copy-dialog.vue'
import importDailog from '../components/import-dialog.vue'
import selectDownload from '../components/select-download.vue'
import selectCommon from '../components/select-common.vue'

import { assetSrc, assetStatus, shareStatus } from '@/config/index'
import assetsCard from '@/views/application-management/components/assets-card.vue'
import assetRelationChart from './components/asset-relation-chart.vue';
import changeGroupDialog from '../components/change-group-dialog.vue'
import treeLayout from '@/components/card-layout'
import lpMixin from '@/mixin/list-page-cache-mixin'

import ButtonDropdown from '@/components/button-dropdown'
import iconSwitch from '@/views/asset-management/components/icon-switch.vue'
import assetsTable from '@/views/asset-management/components/assets-table.vue'

export default {
  name: 'FlowAssetProcess',
  components: {
    postDailog,
    importDailog,
    selectCommon,
    treeLayout,
    ButtonDropdown,
    assetsCard,
    assetRelationChart,
    changeGroupDialog,
    copyDailog,
    selectDownload,
    iconSwitch,
    assetsTable
  },
  mixins: [lpMixin],
  data() {
    let btnList = [{ label: '复制公共资源', code: '3' }, { label: '复制下载资源', code: '4' }, { label: '导入本地资源', code: '5' }]
    // deployType=1仅部署开发中心不显示【复制下载资源】
    if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
      btnList = btnList.filter(d => d.code !== '4')
    }
    return {
      myPath: '/asset-management/flow-asset',
      btnList,
      postDailogFlag: false,
      defaultExpandedKey: [],
      assetStatus,
      assetSrc: assetSrc,
      shareStatus,
      options: [
        { key: 'assetSrc', value: assetSrc.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'status', value: assetStatus.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'sharedFlag', value: shareStatus.map(item => ({ groupId: item.value, groupName: item.label })) }
      ],
      isPlus: false, // 是否允许添加
      showDialog: false,
      currAsset: {},
      operateBtns: [{
        label: '查看详情', icon: 'icon-c-details'
      }, {
        label: '编辑', icon: 'icon-c-editor'
      }, {
        label: '删除', icon: 'icon-c-delete'
      }],
      title: '新建流程资源',
      tagTreeData: [],
      tagTreeDataOld: [],
      groupId: '',
      flag: 'add',
      currId: '',
      treeData: [],
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      defaultProps: {
        children: 'childList',
        label: 'groupName',
        pid: 'parentId',
        value: 'groupId'
      }
    }
  },
  created() {
    this.getTreeList()
    this.getTagTreeList()
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    handleCommand(command) {
      console.log(command, 'ddd')
      switch (+command) {
        case 1:// 新增
          this.editOrDetail('', 'add')
          break;
        case 3:// 公共
          this.showCommonDialog({ assetType: '5', subtype: '51' })
          break;
        case 4:// 下载
          this.showSelectAssetDialog({ assetType: '5', subtype: 51 })
          break;
        case 5: // 导入
          this.showImportDialog({ assetType: '5', subtype: '51' })
          break;

        default:
          break;
      }
    },

    closePostDialog(search = false) {
      this.postDailogFlag = false
      if (search) {
        this.getList()
      }
    },

    handleOperateClick(msg) {
      switch (msg.label) {
        case '共享':
          this.shareAsset(msg.row.id, '1')
          break
        case '取消共享':
          this.shareAsset(msg.row.id, '2')
          break
        case '查看':
          this.editOrDetail(msg.row.id, 'detail')
          break
        case '编辑':
          this.editOrDetail(msg.row.id, 'edit')
          break
        case '流程设计':
          this.openAssetEditorUrl(msg.row)
          break
        case '场景切换':
          this.showChangeGroupDialog(msg.row)
          break
        case '发布':
          this.postAsset(msg.row)
          break
        case '删除':
          this.deleteAsset(msg.row.id)
          break
        case '复制':
          this.showCopyAssetDialog(msg.row)
          break
        case '下载':
          this.downloadAsset(msg.row)
          break
        case '打包':
          this.packageAsset(msg.row)
          break
      }
    },

    closeRelationDialog() {
      this.currAsset = {}
      this.showDialog = false
    },
    showRelationDialog(data) {
      this.currAsset = data
      this.showDialog = true
    },
    editOrDetail(id, flag = 'detail') {
      switch (flag) {
        case 'detail':
          this.title = '查看流程资源'
          break;
        case 'edit':
          this.title = '编辑流程资源'
          break;
        case 'add':
          this.title = '新建流程资源'
          break;
        default:
          break;
      }
      this.$router.push({
        path: '/asset-management/flow-asset/add',
        query: {
          id: id,
          flag,
          cache: true,
          groupId: this.groupId

        }
      })
    },

    // 获取列表
    async getList() {
      this.loading = true
      try {
        const queryParams = this.getQueryParams(this.page.pageNum)
        // console.log(queryParams, 'queryParamsqueryParamsqueryParams')
        queryParams.subtype = 51
        const result = await getProcessList(queryParams)
        this.dataList = result.data.list.map(item => {
          if (item.status === 1) item.version = ''
          return item
        })
        this.page.total = result.data.total
        this.doQueryCache(['searchForm', 'page', 'groupId', 'tags', 'isPlus'])
      } catch (err) {
        // console.log(err)
      }
      this.loading = false
    },
    handleClick({ label, row }) {
      switch (label) {
        case '查看详情':
          this.title = '查看流程'
          this.editOrDetail(row.id, 'detail')
          break;
        case '编辑':
          this.title = '编辑流程'
          this.editOrDetail(row.id, 'edit')
          break;
        case '删除':
          this.deleteAsset(row.id)
          break;

        default:
          break;
      }
    },
    // 点击跳转bpm设计页
    clickDesign(url) {
      if (url) { window.open(url) }
    },
    // 删除资源
    deleteAsset(id) {
      this.$confirm(
        '请确认是否删除资源？',
        '资源删除',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).then(() => {
        processDelete(id).then(rs => {
          this.$message.success(rs.msg)
          this.searchAfterDel()
        })
      }).catch(() => {

      })
    },
    search(pageNum = 1) {
      this.page.pageNum = pageNum
      this.getList()
    },
    // 获取专题树
    getTreeList() {
      getTree().then(rs => {
        this.treeData = rs.data.map((d) => ({
          ...d,
          childList: d.childList.length ? d.childList.map((dd) => ({ ...dd, childList: null, leaf: true })) : null
        }));
        this.options.push({ key: 'groupId', value: JSON.parse(JSON.stringify(rs.data)) })
      })
    },
    // 获取标签树
    getTagTreeList() {
      tagTree().then(rs => {
        if (rs.code === 0) {
          this.tagTreeData = JSON.parse(JSON.stringify(rs.data))
          this.tagTreeDataOld = JSON.parse(JSON.stringify(rs.data))
          this.options.push({ key: 'tagIdList', value: JSON.parse(JSON.stringify(rs.data)) })
          // this.treeRecursion(this.tagTreeData)
        }
      })
    },
    treeChange(node) {
      node = node[0] || {}
      // console.log(!node.childList, !node.childList.length, 'treeChange')
      // if (!node.childList || !node.childList.length) {
      //   this.isPlus = true
      // } else this.isPlus = false
      this.groupId = node.groupId
      this.search()
    },
    // 保存树
    saveNode(node) {
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
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.index-config-wrap {
  height: 100%;
}

.assets-content-list {
  overflow: auto;

  .list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
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
</style>
