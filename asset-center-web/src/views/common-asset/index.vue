<!--/*
  * @Author:
  * @Desc: 公共资源库
  * @Date:
  */-->
<template>
  <div class="common-asset">
    <div class="header">
      <div class="search-box">
        <c-menu
          :default-active="activeIndex"
          active-text-color="#36A4FF"
          text-color="#4b4b4b"
          class="c-menu-download"
          mode="horizontal"
          @select="handleSelect">
          <c-menu-item index="">全部资源</c-menu-item>
          <component
            :is="item.childList && item.childList.length ? 'c-submenu' : 'c-menu-item'"
            v-for="item in typeTreeData"
            :key="item.groupId"
            popper-class="c-menu-download-sub"
            :index="item.groupId + ''">
            <template slot="title">{{ item.groupName }}</template>
            <c-menu-item
              v-for="_item in item.childList"
              :key="_item.groupId"
              :index="_item.groupId + ''">
              {{ _item.groupName }}
            </c-menu-item>
          </component>
        </c-menu>
      </div>
      <div class="info-box lp-data-controls">
        <total-info :search="hasSearch" :total="page.total" />
        <c-input-search v-model="keyword" style="width:296px" placeholder="请输入关键字进行模糊查询" @search="submit">
        </c-input-search>
      </div>
    </div>
    <div class="content-wrap">
      <c-table
        v-if="tableHeight"
        :data="tableData"
        :row-class-name="tableRowClassName"
        :default-sort="{prop:'sharedTime',order: orderType}"
        :height="tableHeight"
        @sort-change="sortChange">
        <c-table-column type="index" label="#" width="60">
          <template slot-scope="scope">{{ page.pageSize*(page.pageNum-1)+scope.$index+1 }}</template>
        </c-table-column>
        <c-table-column label="" width="70">
          <template slot-scope="scope">
            <i v-if="(+scope.row.referVersionStatus===3)"
               class="algin-center" @click.stop="">
              <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                <i class="alert-invalid" @click.stop="" />
              </c-tooltip>
            </i>
          </template>
        </c-table-column>
        <c-table-column label="资源名称" prop="assetName" show-overflow-tooltip></c-table-column>
        <c-table-column label="资源编码" prop="assetCode" show-overflow-tooltip></c-table-column>
        <c-table-column label="版本号" prop="version" show-overflow-tooltip></c-table-column>
        <c-table-column label="资源类型" prop="assetType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row|assetTypeFilter }}
          </template>
        </c-table-column>
        <c-table-column label="所属租户" prop="tenantName" show-overflow-tooltip></c-table-column>
        <c-table-column label="引用次数" prop="sharedCount" show-overflow-tooltip></c-table-column>
        <c-table-column
          label="共享时间"
          prop="sharedTime"
          show-overflow-tooltip
          sortable></c-table-column>
        <c-table-column label="" prop="" width="110">
          <template slot="header" slot-scope="">
            操作
            <c-tooltip placement="top" popper-class="cls-form-label-tip" content="">
              <div slot="content" class="hahah" v-html="'仅流程、对象、页面、脚本资源支持复制；<br>体征、模型、接口资源支持通过引用资源方式使用，<br>实际使用情况将受服务本身影响。'">
              </div>
              <i class="cls-icon-info"></i>
            </c-tooltip>
          </template>
          <template slot-scope="scope">
            <btn-group
              :btns="getbtns(scope.row)"
              @handleClick="handleOperateClick" />
          </template>
        </c-table-column>
      </c-table>
      <c-pagination
        background
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <copyDailog
      v-if="dialogVisibleCopy"
      :dialog-flag="dialogVisibleCopy"
      :curr-id="currAsset.id"
      :iscommon="true"
      @close="closeCopyDialog" />
  </div>
</template>
<script>
import { typeTreeData } from '@/config/index'
import { commonAssetList } from '@/api/index'
import { getAssetTypeLabel } from '@/utils'
import copyDailog from '@/views/asset-management/components/copy-dialog.vue'
import { getUserPermissionByKey } from '@/utils'
export default {
  name: '',
  components: { copyDailog },
  filters: {
    assetTypeFilter(v) {
      v.subtype = v.subType || v.subtype
      const res = getAssetTypeLabel(v.assetType, v.subtype)
      return res
    }
  },
  data() {
    return {
      dialogVisibleCopy: false,
      activeIndex: '',
      typeTreeData,
      tableHeight: 0,
      keyword: '',
      orderType: 'descending',
      hasSearch: false,
      tableData: [],
      keyPath: [],
      currAsset: {},
      page: {
        total: 0,
        pageNum: 1,
        pageSize: 20
      }
    };
  },
  mounted() {
    this.getPageData(1)
    this.tableHeight = document.getElementsByClassName('page-content-wrapper')[0].offsetHeight - 118 - 184
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (+row.referVersionStatus === 3) {
        return 'disabled-row';
      }
      return '';
    },
    closeCopyDialog(search = false) {
      const assetType = this.currAsset.assetType
      const subtype = this.currAsset.subtype || this.currAsset.subType
      this.dialogVisibleCopy = false
      this.currAsset = {}
      if (!search) return
      let path = ''
      switch (assetType) {
        // 2技术、3对象、5流程
        case 1:
          path = '/asset-management/statistics-asset'
          break;
        case 2:
          if (+subtype === 22) { // 接口
            path = '/asset-management/technology-asset'
          } else if (+subtype === 23) { // 页面
            path = '/asset-management/technology-asset'
          } else if (+subtype === 26) { // 脚本
            path = '/asset-management/technology-asset'
          }
          break;
        case 3: // 对象资源
          path = '/asset-management/object-asset'
          break
        case 5: // 流程资源
          path = '/asset-management/flow-asset'
          break;
        case 7: // 模型资源
          path = '/asset-management/mode-asset'
          break;
        default:
          break;
      }
      if (path) {
        this.$router.push(path)
      }
    },
    getbtns(row) {
      const map = [{
        permissionKey: 'view',
        label: '查看',
        row: row
      }, {
        permissionKey: 'copy',
        disabled: +row.referVersionStatus === 3 || !([5, 3].includes(+row.assetType) || [23, 26].includes(+row.subtype)),
        label: '复制',
        row: row
      }]
      return map.filter(d => !d.hide && getUserPermissionByKey('commonAsset', d.permissionKey))
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.$router.push({
            path: '/common-asset/detail',
            query: {
              assetType: msg.row.assetType,
              subtype: msg.row.subtype,
              id: msg.row.id,
              flag: 'detail'
            }
          })
          break
        case '复制':
          this.currAsset = msg.row
          this.dialogVisibleCopy = true
          break
      }
    },
    handleCurrentChange(pageNum) {
      this.page.pageNum = pageNum
      this.getPageData()
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getPageData()
    },
    handleSelect(key, keyPath) {
      this.keyPath = keyPath
      this.getPageData(1)
    },
    submit() {
      this.getPageData(1)
    },
    sortChange({ column, prop, order }) {
      this.orderType = order
      this.getPageData(1)
    },
    async getPageData(pageNum) {
      try {
        this.page.pageNum = pageNum || this.page.pageNum
        const params = {
          'keyword': this.keyword,
          'pageNum': this.page.pageNum,
          'pageSize': this.page.pageSize,
          'assetType': this.keyPath[0],
          'subtype': this.keyPath[1] || '',
          'orderKey': 'sharedTime',
          'orderType': ''
        }
        if (this.orderType === 'descending') {
          params.orderType = 'desc'
        } else if (this.orderType === 'ascending') {
          params.orderType = 'asc'
        }
        const { data } = await commonAssetList(params)
        this.tableData = data.list
        this.page.total = data.total
        this.page.pageNum = data.currPage
        this.page.pageSize = data.pageSize
      } catch (e) {
        console.error(e)
      }
    }
  }
};
</script>
  <style scoped lang="scss">
  @import '@/styles/variables.scss';
  .common-asset {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      display: block;
      background-color: #fff;
      &::v-deep {
        .c-menu.c-menu--horizontal {
          border-bottom: 0px solid;
        }
        .c-menu-item {
          height: 64px;
          line-height: 64px;
          padding: 0 0px;
          margin-right: 48px;
        }
        .c-submenu__title {
          height: 64px;
          line-height: 64px;
          padding: 0px;
          margin-right: 48px;
          i {
            color: #4b4b4b;
          }
        }
        .is-active .c-submenu__title i {
          color: $primaryColor;
        }
      }
    }
    .info-box {
      padding: 22px 20px;
    }
    .search-box {
      border-bottom: 1px solid #ededed;
      padding-left: 24px;
    }
    .content-wrap {
      padding: 20px 20px 0 20px;
      flex: 1;
      background: white;
      .c-table {
        height: calc(100% - 64px);
      }
      ::v-deep.c-pagination {
        position: relative;
        height: 80px;
        padding-right: 0;
        .c-pagination__sizes {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(0, -50%);
        }
        .c-pagination__total {
          position: absolute;
          left: 134px;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
  }
  ::v-deep.c-table .disabled-row {
    color: #bdbdbd;
  }
  </style>
