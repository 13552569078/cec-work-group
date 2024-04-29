<!--
 * @Description:不带tree的复选框
 * @Author: pancj
 * @Date: 2021-05-07
-->
<template>
  <c-dialog :class="'dialog-center-big'"
            class="dialog-common"
            :title="title"
            :visible.sync="dialogVisible"
            width="1180px"
            top="0"
            @close="dialogClose"
  >
    <fixed-page
      class="checkbox-notree"
      padding="0"
      :background-color="'#fff'"
      :header-height="38"
      :header-margin="0"
      :footer-margin="0"
      :footer-height="0"
    >
      <template v-slot:header>
        <div class="header-wrap">
          <div class="left-top">
            <div class="search-item">
              <span>资源名称</span>
              <c-input
                v-model="requestData.assetName"
                placeholder="请输入"
                class="all-input"
                size="small"
              />
            </div>
            <div v-if="needAssetCode" class="search-item">
              <span>资源编码</span>
              <c-input
                v-model="requestData.assetCode"
                placeholder="请输入"
                class="all-input"
                size="small"
              />
            </div>
            <div class="search-item">
              <span>资源标签</span>
              <cestc-tree-select
                v-model="requestData.tagIdList"
                class="all-input"
                :multiple="true"
                clearable
                :placeholder="'请选择'"
                :search="true"
                :options="treeData"
                :props="defaultProps"
                :get-leaf-only="true"
              />
            </div>
          </div>
          <div class="right-top">

            <c-button
              size="small"
              type="ordinary"
              @click="reset"
            >重置</c-button>
            <c-button
              type="gradual"
              size="small"
              @click="search"
            >
              查询
            </c-button>
          </div>
        </div>
      </template>
      <div class="body-demo">
        <c-table
          ref="multipleTable"
          v-loading="listLoading"
          height="532px"
          :data="showList"
          element-loading-text="Loading"
          @selection-change="selectionKpi"
          @select="userClickSelect"
          @select-all="userClickSelect"
        >
          <c-table-column
            type="selection"
            width="70"
          />
          <c-table-column
            label=""
            width="70"
          >
            <template slot-scope="scope">{{ pageData.pageSize*(pageData.currPage-1)+scope.$index+1 }}</template>
          </c-table-column>
          <template v-for="(item,index) in tableCloumnData">
            <c-table-column
              v-if="item.prop !== tagRealName"
              :key="`checkedName-${item.checkedName}-${index}`"
              :label="`${item.lable}`"
              :prop="`${item.prop}`"
              :show-overflow-tooltip="true"
              :min-width="item.minWidth?item.minWidth:120"
            />
            <c-table-column
              v-else
              :key="`checkedName-${item.checkedName}-${index}`"
              :label="`${item.lable}`"
              :prop="`${item.prop}`"
              width="280"
            >
              <template slot-scope="scope">
                <tags-popover
                  :tags="formatTagNames(scope.row[tagRealName])">
                </tags-popover>
              </template>
            </c-table-column>
          </template>
          <c-table-column
            label="操作"
            fixed="right"
            width="80"
          >
            <template slot-scope="scope">

              <span
                class=" icon-operate"
                @click="goDetail(scope.row)"
              >查看</span>
            </template>
          </c-table-column>
        </c-table>
        <c-pagination
          style="line-height:normal;"
          background
          :current-page="requestData.pageNum"
          :page-size="pageData.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageData.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </fixed-page>
    <div slot="footer" class="dialog-footer">

      <c-button
        size="small" type="ordinary"
        @click="goBackConfirm"
      >取消</c-button>
      <c-button
        size="small"
        type="gradual"
        @click="save"
      >保存</c-button>
    </div>
  </c-dialog>
</template>
<script>
import { tagTree } from '@/api/index'
import cestcTreeSelect from '@/components/cestc-tree-select'
import tagsPopover from '@/components/tags-popover/cell'
export default {
  components: {
    tagsPopover, cestcTreeSelect
  },
  props: {
    tagRealName: {
      type: String,
      default: 'tagNames'
    },
    title: {
      type: String,
      default: '引用指标'
    },
    needAssetCode: { // 当前唯一值名称
      type: Boolean,
      default: true
    },
    checkedName: { // 当前唯一值名称
      type: String,
      default: 'kpiId'
    },
    pageData: { // 需要的分页信息
      type: Object,
      default: () => {
        return { total: 0, pageSize: 10, currPage: 1 }
      }
    },
    tableCloumnData: { // 列数据
      type: Array,
      default: () => []
    },
    showList: { // 页面数据
      type: Array,
      default: () => []
    },
    // initSelectIds: { // 已选中的数组
    //   type: Array,
    //   default: () => []
    // },
    initSelectArrs: { // 已选中的数据 （方便回传使用）
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'childList',
        label: 'groupName',
        pid: 'parentId',
        value: 'groupId',
        disabled: 'disabled'
      },
      treeData: [],
      dialogVisible: true,
      selectTotalList: [], // 所有的数组数据
      notSelectTotalList: [],
      changeTotalList: [],
      changeDeletArr: [],
      changeTotalListParams: [],
      totalList: [],
      listLoading: false,
      pageNum: 1,
      newSelectList: [],
      newSelectListValue: [],
      isClickSelect: false,
      selectTableList: [],
      // initSelectTableList: JSON.parse(JSON.stringify(this.initSelectIds)),
      initSelectTotalList: JSON.parse(JSON.stringify(this.initSelectArrs)),
      requestData: {
        assetName: '',
        pageNum: 1,
      assetCode: '',
assetCodePrefix: '',
        tagIdList: []
      }
    }
  },
  computed: {
    initSelectIds() {
      const arr = []
      this.initSelectArrs.map((item) => {
        arr.push(item[`${this.checkedName}`])
      })
      return arr
    }
  },
  watch: {
    showList(val) {
      this.showList = val
      this.renderTotalList()
    }
  },
  created() {
    this.getTreeList()
    this.getKpiList(true)
    this.getTreeList()
  },
  methods: {
    treeChange(list, info) {
    },
    goDetail(rowData) {
      return '指标只在数据中使用'

      // const { id = '' } = rowData
      // switch (this.title) {
      //   case '引用指标':
      //     window.open(`${window.location.origin}${window.location.pathname}#/asset-management/statistics-asset/kpi?id=${id}&flag=detail`, '_blank')
      //     break
      //   default:
      //     break
      // }
      // this.$emit('goDetail', rowData)
    },
    formatTagNames(data) {
      if (!data) return [];
      if (typeof data === 'string') return data.split(/,|，/)

      return data
    },
    dialogClose() {
      this.$emit('close')
    },
    getTreeList() {
      tagTree().then(rs => {
        if (rs.code === 0) {
          this.treeData = rs.data
          this.treeRecursion(this.treeData)
        }
      })
    },
    treeRecursion(data) {
      if (Array.isArray(data) && data.length) {
        data.forEach((unit, index) => {
          if (!unit.parentId || unit.childList.length) {
            unit.disabled = true
          }
          if (unit.childList && unit.childList.length) {
            this.treeRecursion(unit.childList)
          }
        })
      }
    },
    getKpiList(needClear) {
      if (needClear) {
        this.selectTotalList = []
        this.notSelectTotalList = []
        this.changeTotalList = []
        this.requestData.pageNum = 1
        this.requestData.assetName = ''
        this.requestData.assetCode = ''
        this.requestData.assetType = ''
        this.selectTableList = JSON.parse(JSON.stringify(this.initSelectArrs))
        this.selectTotalList = this.initSelectIds
      }
      const searchData = Object.assign({}, this.requestData, { pageSize: 10, flag: 1 })
      this.$emit('getTableList', searchData)
    },
    renderTotalList(isFirst = false) {
      this.showList.map((item, Index) => {
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(item, true)
          )
        } else if (this.notSelectTotalList.indexOf(item[`${this.checkedName}`]) === -1) {
          this.notSelectTotalList.push(item[`${this.checkedName}`])
        }
      })
    },
    goBackConfirm() {
      // if (!this.isClickSelect) {
      //   this.dialogVisible = false
      //   return
      // }
      // this.$confirm('是否确定保存?', '提示', {
      //   cancelButtonText: '取消',
      //   confirmButtonText: '确定',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.save()
      //   })
      //   .catch(() => {
      //     this.$emit('saveTableList', this.initSelectTableList)
      this.dialogVisible = false
      // })
    },
    search() {
      this.requestData.pageNum = 1
      this.getKpiList()
    },
    reset() {
      this.requestData.pageNum = 1
      this.requestData.assetName = ''
      this.requestData.assetCode = ''
      this.requestData.tagIdList = []
      this.getKpiList()
    },
    handleCurrentChange(pageNum) {
      this.requestData.pageNum = pageNum
      this.getKpiList()
    },
    save() {
      if (!this.showList.length) return
      const isNeedPop = !!this.changeTotalList.length
      if (isNeedPop === false) {
        this.$emit('saveTableList', this.selectTableList)
        this.dialogVisible = false
        return
      }
      this.$confirm(
        '是否确定保存？',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then((res) => {
          this.$emit('saveTableList', this.selectTableList)
          this.dialogVisible = false
        })
        .catch(() => {
          this.dialogVisible = false
        })
    },
    selectionKpi(data) {
      this.newSelectList = data
      const newArr = []
      data.map((item) => newArr.push(item[`${this.checkedName}`]))
      this.newSelectListValue = newArr
    },
    userClickSelect(arrs, item) {
      if (!this.isClickSelect) this.isClickSelect = true
      if (item) {
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          this.selectTotalList = this.selectTotalList.filter((i) => i !== item[`${this.checkedName}`])
          this.selectTableList = this.selectTableList.filter((i) => i[`${this.checkedName}`] !== item[`${this.checkedName}`])
          this.notSelectTotalList.push(item[`${this.checkedName}`])
          const Index = this.changeTotalList.indexOf(item[`${this.checkedName}`])
          if (Index > -1) {
            this.changeTotalListParams[Index].selectKpiFlag = false
          } else {
            this.changeTotalList.push(item[`${this.checkedName}`])
            this.changeTotalListParams.push({
              [`${this.checkedName}`]: item[`${this.checkedName}`],
              selectKpiFlag: false
            })
          }
        } else {
          this.notSelectTotalList = this.notSelectTotalList.filter((i) => i !== item[`${this.checkedName}`])
          this.selectTotalList.push(item[`${this.checkedName}`])
          this.selectTableList.push(item)
          const Index = this.changeTotalList.indexOf(item[`${this.checkedName}`])
          if (Index > -1) {
            this.changeTotalListParams[Index].selectKpiFlag = true
          } else {
            this.changeTotalList.push(item[`${this.checkedName}`])
            this.changeTotalListParams.push({
              [`${this.checkedName}`]: item[`${this.checkedName}`],
              selectKpiFlag: true
            })
          }
        }
      } else {
        const isSelectAll = arrs.length > 0
        this.showList.map((item) => {
          if (isSelectAll) {
            if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) < 0) {
              this.selectTotalList.push(item[`${this.checkedName}`])
              this.selectTableList.push(item)
            }
          } else {
            if (this.notSelectTotalList.indexOf(item[`${this.checkedName}`]) < 0) {
              this.notSelectTotalList.push(item[`${this.checkedName}`])
            }
          }
          if (isSelectAll) {
            this.notSelectTotalList = this.notSelectTotalList.filter((i) => i !== item[`${this.checkedName}`])
          } else {
            this.selectTotalList = this.selectTotalList.filter((i) => i !== item[`${this.checkedName}`])
            this.selectTableList = this.selectTableList.filter((i) => i[`${this.checkedName}`] !== item[`${this.checkedName}`])
          }
          const Index = this.changeTotalList.indexOf(item[`${this.checkedName}`])
          if (Index > -1) {
            this.changeTotalListParams[Index].selectKpiFlag = isSelectAll
          } else {
            this.changeTotalList.push(item[`${this.checkedName}`])
            this.changeTotalListParams.push({
              [`${this.checkedName}`]: item[`${this.checkedName}`],
              selectKpiFlag: isSelectAll
            })
          }
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
@import '../../styles/variables.scss';
.dialog-common{
  box-sizing: border-box;
  .c-dialog{
  height: 820px;
  }
  ::v-deep .fixed-page-header {
    border-top: none;
  }
  ::v-deep .c-table td{
    padding: 0;
    height: 48px;
  }
}
.checkbox-notree {
  width: 100%;
  height: 820px;
  .fixed-page-body {
    border: 1px solid rgba(244, 244, 244, 1);
  }
  .footer-demo {
    height: 100%;
    border-top: 1px solid #f4f4f4;
    line-height: 75px;
     float: right;
     margin-right: 20px;
  }
   .header-wrap {
      height: 38px;
      width: 100%;
      box-sizing: border-box;
      // border-bottom: 1px solid rgba(244, 244, 244, 1);
      // padding: 0 32px 0 12px;
      align-items: center;
      display: flex;
      justify-content: space-between;
      .left-top {
        width: calc(100% - 220px);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .search-item {
          font-size: 14px;
          width: 40%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-right: 24px;
          &:last-child{
            margin-right: 0px;
          }
          span{
            width: 57px;
            text-align: right;
          }
          .all-input{
            width: calc(100% - 73px);
          }
        }
      }
      .right-top {
        align-items: center;
        display: flex;
        justify-content: flex-end;
      }
    }
  .body-demo {
    width: 100%;
    box-sizing: border-box;
    // padding: 16px 32px 8px 32px;
    .c-checkbox__input.is-checked .c-checkbox__inner,
    .c-checkbox__input.is-indeterminate .c-checkbox__inner {
      background: $primaryColor;
      border-color: #d9d9d9;
    }
    .c-checkbox__input .c-checkbox__inner {
      border-color: #d9d9d9;
    }
     .c-pagination {
      margin-top: 24px;
      padding: 0px 0 0 5px ;
    }
  }
}
.icon-operate {
  cursor: pointer;
  color: $primaryColor;

}
</style>
