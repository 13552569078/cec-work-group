<!--
 * @Description: 对象资源管理
 * @Author: zhao wei
 * @Date: 2021-05-07
-->
<template>
  <router-page-layout :path="myPath">
    <div class="objectAsset">
      <tree-layout
        :setting="setting"
        :show-tree="false"
        :options="options"
        :init-tags="tags"
        @getHeaderHeight="contentHeightChange"
        @getSearch="getSearch"
        @cacheTags="cacheTags"
      >
        <template v-slot:header="{searchForm}">
          <c-form :model="searchForm" label-width="70px" inline @submit.native.prevent>
            <c-form-item label="资源名称" class="lp-search-form-field">
              <c-input
                v-model="searchForm.assetName"
                size="small"
                placeholder="请输入"
              ></c-input>
            </c-form-item>
            <c-form-item label="资源编码" class="lp-search-form-field">
              <c-input
                v-model="searchForm.assetCode"
                size="small"
                placeholder="请输入"
              ></c-input>
            </c-form-item>
            <c-form-item label="资源标签" class="lp-search-form-field">
              <c-select v-model="searchForm.tagIdList" multiple filterable :specific-suffix="true" placeholder="请选择">
                <c-option
                  v-for="item in treeData"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item.groupId" />
              </c-select>
            </c-form-item>
            <c-form-item label="资源来源" class="lp-search-form-field">
              <c-select
                v-model="searchForm.assetSrc"
                :specific-suffix="true"
                size="small"
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
          </c-form>
        </template>
        <template v-slot:content-header_left>
          <total-info :search="hasSearch" :total="page.total" />
          <iconSwitch v-model="pageListType" />
        </template>
        <template v-slot:content-header_right>
          <button-dropdown v-show="getPermissionByAssetsbutype(31, 'copyAsset')" class="btn-operate mrg-right" :btn-type="'operate'" :options="btnList" :text="'复制资源'" @command="handleCommand" />
          <c-button
            v-show="getPermissionByAssetsbutype(31, 'add')"
            size="small" class="" type="gradual"
            @click="handleCommand(1)">新建资源</c-button>
        </template>
        <template v-slot:table>
          <div v-show="pageListType=='card'" class="assets-content-list" :style="{'height': setting.tableHeight,}">
            <div class="list" :style="{ width: '1619px' }">
              <assetsCard v-for="asset in tableData" :key="asset.assetId" class="assets-item"
                          :page-key="'objectAssetEntity'" :is-list="true" :show-status="true" :data="asset" :btn-list="getbtns(asset)" @handleClick="handleOperateClick"></assetsCard>
            </div>
          </div>
          <assetsTable
            v-show="pageListType=='list'"
            :page-key="'objectAssetEntity'"
            :data="tableData"
            :height="setting.tableHeight"
            :page="page"
            :getbtns="getbtns"
            @handleOperateClick="handleOperateClick"></assetsTable>
        </template>
        <template v-slot:footer>
          <div class="lp-page-footer">
            <c-pagination
              background
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total"
              :page-sizes="pageSizeArr"
              layout="sizes,total, prev, pager, next, jumper"
              class="size-left"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </c-pagination>
          </div>
        </template>
      </tree-layout>
      <c-dialog :class="'dialog-center'" :title="title" :visible.sync="showDialog" width="666px" :before-close="closeDialog">
        <add
          v-if="showDialog"
          :flag="flag"
          :asset-id="currAssetId"
          @close="closeDialog"
        />
      </c-dialog>
      <postDailog :post-dailog-flag="postDailogFlag" :curr-asset="currAsset" @close="closePostDialog" />
      <copyDailog v-if="dialogVisibleCopy" :dialog-flag="dialogVisibleCopy" :curr-id="currAsset.id" @close="closeCopyDialog" />
      <importDailog v-if="dialogVisibleImport" :dialog-flag="dialogVisibleImport" :curr-id="currAsset.id" :curr-asset="currAsset" @close="closeImportDialog" />
      <selectDownload v-if="dialogVisibleSelect" :dialog-flag="dialogVisibleSelect" :asset-type="currAsset.assetType" :subtype="currAsset.subtype" @close="closeSelectDialog" />
      <selectCommon v-if="dialogVisibleCopyCommon" :group-id="groupId" :dialog-flag="dialogVisibleCopyCommon"
                    :asset-type="currAsset.assetType" :subtype="currAsset.subtype" @close="closeCommonDialog" />
    </div>
  </router-page-layout>
</template>
<script>
import { tagTree, statsObjectList, statsObjectDelete } from '@/api/index';
// import cestcTreeSelect from '@/components/cestc-tree-select';
import treeLayout from '@/components/card-layout';
import postDailog from '../components/post-dialog.vue'
import selectDownload from '../components/select-download.vue'
import copyDailog from '../components/copy-dialog.vue'
import importDailog from '../components/import-dialog.vue'
import selectCommon from '../components/select-common.vue'
import ButtonDropdown from '@/components/button-dropdown'
import Add from './add.vue';
import { assetSrc, assetStatus, shareStatus } from '@/config/index'
import assetsCard from '@/views/application-management/components/assets-card.vue'
import iconSwitch from '@/views/asset-management/components/icon-switch.vue'
import assetsTable from '@/views/asset-management/components/assets-table.vue'

import lpMixin from '@/mixin/list-page-cache-mixin'
export default {
  name: 'ObjectAssetEntry',
  components: {
    assetsCard,
    treeLayout, selectCommon,
    Add,
    postDailog,
    importDailog,
    ButtonDropdown,
    copyDailog,
    selectDownload,
    iconSwitch,
    assetsTable
  },
  mixins: [lpMixin],
  props: {
    isShowPage: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    let btnList = [{ label: '复制公共资源', code: '3' }, { label: '复制下载资源', code: '4' }, { label: '导入本地资源', code: '5' }]
    // deployType=1仅部署开发中心不显示【复制下载资源】
    if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
      btnList = btnList.filter(d => d.code !== '4')
    }
    return {
      myPath: '/asset-management/object-asset',
      btnList,
      postDailogFlag: false,
      currAsset: {},
      title: '新建实体对象',
      showDialog: false,
      tableData: [],
      treeData: [],
      loading: false,
      currentPage: 1,
      assetSrc: assetSrc,
      shareStatus,
      assetStatus,
      options: [{ key: 'assetSrc', value: assetSrc.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'status', value: assetStatus.map(item => ({ groupId: item.value, groupName: item.label })) },
        { key: 'sharedFlag', value: shareStatus.map(item => ({ groupId: item.value, groupName: item.label })) }

      ],
      defaultProps: {
        children: 'childList',
        label: 'groupName',
        pid: 'parentId',
        value: 'groupId',
        disabled: 'disabled'
      },
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      }
    };
  },
  mounted() {
    this.getTreeList();
  },
  methods: {
    handleCommand(command) {
      console.log(command, 'ddd')
      switch (+command) {
        case 1:// 新增
          this.editData('', 'add')
          break;
        case 3:// 公共
          this.showCommonDialog({ assetType: '3', subtype: '31' })
          break;
        case 4:// 下载
          this.showSelectAssetDialog({ assetType: '3', subtype: 31 })
          break;
        case 5: // 导入
          this.showImportDialog({ assetType: '3', subtype: '31' })
          break;

        default:
          break;
      }
    },
    closePostDialog(search = false) {
      this.postDailogFlag = false
      console.log(search, '------')
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
          this.editData(msg.row, 'detail')
          break
        case '对象设计':
          this.openAssetEditorUrl(msg.row)
          break
        case '编辑':
          this.editData(msg.row, 'edit')
          break
        case '发布':
          this.postAsset(msg.row)
          break
        case '删除':
          this.deletedata(msg.row)
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

    closeDialog() {
      this.showDialog = false
      this.currAssetId = ''
      this.getList();
    },

    search(pageNum = 1) {
      this.page.pageNum = pageNum
      this.getList()
    },
    // 检索
    async  getList() {
      this.loading = true;
      try {
        const queryParams = this.getQueryParams(this.page.pageNum)
        queryParams.subtype = 31
        const result = await statsObjectList(queryParams)
        this.tableData = result.data.list.map(item => {
          if (item.status === 1)item.version = ''
          return item
        })
        this.page.total = result.data.total
        this.doQueryCache(['searchForm', 'page', 'groupId', 'tags'])
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 新增修改详情
    editData(data, flag) {
      switch (flag) {
        case 'detail':
          this.title = '查看实体对象'
          break;
        case 'edit':
          this.title = '编辑实体对象'
          break;
        case 'add':
          this.title = '新建实体对象'
          break;
        default:
          break;
      }
      // this.flag = flag
      // this.showDialog = true
      // this.currAssetId = data.id
      this.$router.push({
        path: '/asset-management/object-asset/addEntry',
        query: {
          id: data.id,
          flag,
          cache: true,
          groupId: this.groupId
        }
      })
    },
    // 删除
    deletedata(data) {
      this.$confirm('请确认是否删除资源？', '资源删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        statsObjectDelete(data.id).then((rs) => {
          if (rs.code === 0) {
            this.$message({
              message: rs.msg,
              type: 'success'
            });
            this.getList();
          }
        });
      });
    },
    // 获取专题树
    getTreeList() {
      tagTree().then((rs) => {
        if (rs.code === 0) {
          this.treeData = rs.data;
          this.options.push({ key: 'tagIdList', value: JSON.parse(JSON.stringify(rs.data)) })
          // this.treeRecursion(this.treeData);
        }
      });
    },
    treeRecursion(data) {
      if (Array.isArray(data) && data.length) {
        data.forEach((unit) => {
          if (!unit.parentId || unit.childList.length) {
            unit.disabled = true;
          }
          if (unit.childList && unit.childList.length) {
            this.treeRecursion(unit.childList);
          }
        });
      }
    },
    treeChange(list) {
      console.log(list);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
.objectAsset {
  height: 100%;
}
.assets-content-list{
  overflow: auto;
  .list{
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    margin: auto;

  }
  .assets-item{
    margin-bottom: 20px;
    margin-right: 18px;
    &:nth-child(5n){
      margin-right: 0px;
    }
  }

}
</style>
