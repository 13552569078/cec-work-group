<!--
 * @Description:不带tree的复选框
 * @Author: pancj
 * @Date: 2021-05-07
-->
<template>
  <c-dialog
    :class="'dialog-center-big'"
    class="dialog-common"
    :title="title"
    :visible.sync="dialogVisible"
    width="1180px"
    top="0"
    @close="dialogClose"
  >
    <template slot="title">
      <span style="display: flex;align-items: center;line-height: 20px;font-size: 14px; color: #4B4B4B; font-weight: 500;">
        {{ title }}
        <c-tooltip placement="right" popper-class="cls-form-label-tip">
          <span slot="content" class="hahah" v-html="'资源开发时支持引用的类型包括：<br>1.私有开发：在应用内部开发创建的资源，仅在应用内可见可用；<br>2.租户资源：组件资源开发列表中的已发布资源，本租户内可见可用；<br>3.公共资源：公共资源列表中的资源，全部租户均可见可用。'">
          </span>
          <i class="cls-icon-info" style="margin-left:4px"></i>
        </c-tooltip>
      </span>
    </template>
    <fixed-page
      class="checkbox-notree"
      padding="0"
      :background-color="'#fff'"
      :header-height="40"
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
                clearable
                class="all-input"
                size="small"
              />
            </div>
            <div
              v-if="needAssetCode"
              class="search-item"
            >
              <span>资源编码</span>
              <c-input
                v-model="requestData.assetCode"
                placeholder="请输入"
                clearable
                class="all-input"
                size="small"
              />
            </div>
            <div class="search-item">
              <span>资源类型</span>
              <c-cascader
                v-model="assetType"
                :options="assetTypeList"
                :specific-suffix="true"
                class="all-input"
                size="small"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              ></c-cascader>
              <!-- <c-select
                v-model="requestData.assetType" placeholder="请选择"
                class="all-input"
                clearable
                :specific-suffix="true"
              >
                <c-option v-for="item in assetTypeList" :key="item.value" :value="item.value" :label="item.label"></c-option>
              </c-select> -->
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
        <div class="tab-list-little">
          <c-radio-group v-model="type" style="margin-top:10px;margin-bottom:10px">
            <c-radio-button v-if="provide" label="2">私有开发</c-radio-button>
            <c-radio-button label="1">租户资源</c-radio-button>
            <c-radio-button label="3">公共资源</c-radio-button>
          </c-radio-group>
        </div>
        <c-table
          ref="multipleTable"
          v-loading="listLoading"
          class="hidden-checkall-header"
          height="258px"
          :data="showList"
          element-loading-text="Loading"
          @selection-change="selectionKpi"
          @select="userClickSelect"
          @select-all="userClickSelect"
        >
          <c-table-column
            type="selection"
            width="70"
          >
          </c-table-column>
          <c-table-column
            label=""
            width="60"
          >
            <template slot-scope="scope">{{ pageData.pageSize*(pageData.currPage-1)+scope.$index+1 }}</template>
          </c-table-column>
          <c-table-column label="" width="70">
            <template slot-scope="scope">
              <i v-if="(scope.row.referVersionStatus===2||scope.row.versionStatus===2)"
                 class="algin-center">
                <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
                  <i class="alert-update"
                     @click.stop="" />
                </c-tooltip>
              </i>
              <i v-if="(scope.row.referVersionStatus===3||scope.row.versionStatus===3)"
                 class="algin-center" @click.stop="">
                <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                  <i class="alert-invalid"
                     @click.stop="" />
                </c-tooltip>
              </i>
            </template>
          </c-table-column>
          <template v-for="(item,index) in local_tableCloumnData">
            <c-table-column
              v-if="item.prop !== tagRealName"
              :key="`checkedName-${item.checkedName}-${index}`"
              :label="`${item.lable}`"
              :prop="`${item.prop}`"
              :show-overflow-tooltip="true"
              :min-width="item.minWidth?item.minWidth:120"
            >
              <template slot-scope="scope">
                {{ scope.row[item.prop] }}
              </template>
            </c-table-column>
            <c-table-column
              v-else
              :key="`checkeddName-${item.checkedName}-${index}`"
              :label="`${item.lable}`"
              :prop="`${item.prop}`"
              width="280"
            >
              <template slot-scope="scope">
                <tags-popover :tags="formatTagNames(scope.row[tagRealName])">
                </tags-popover>
              </template>
            </c-table-column>
          </template>

          <c-table-column
            label="操作"
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
    <div
      slot="footer"
      class="dialog-footer"
    >
      <c-button
        size="small"
        type="ordinary"
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
import tagsPopover from '@/components/tags-popover/cell'
import { assetTypeListDiDaima } from '@/config'
import { goDetail } from '@/utils'
export default {
  components: {
    tagsPopover
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
    provide: {
      type: Boolean,
      default: false
    },
    tableCloumnData: { // 列数据
      type: Array,
      default: () => []
    },
    showList: { // 页面数据
      type: Array,
      default: () => []
    },
    initSelectArrs: { // 已选中的数据 （方便回传使用）
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      type: this.provide ? '2' : '1',
      assetType: [],
      // 流程、对象、技术资源（接口）
      assetTypeList: assetTypeListDiDaima,
      treeData: [],
      dialogVisible: true,
      selectTotalList: [], // 所有的数组数据

      changeTotalList: [],
      changeDeletArr: [],

      totalList: [],
      listLoading: false,
      pageNum: 1,
      newSelectList: [],
      newSelectListValue: [],
      isClickSelect: false,
      selectTableList: [],
      initSelectTotalList: JSON.parse(JSON.stringify(this.initSelectArrs)),
      requestData: {
        assetName: '',
        pageNum: 1,
        assetCode: '',
        assetCodePrefix: '',
        assetType: '',
        subtype: '',
        tagIdList: []
      }
    }
  },
  computed: {
    local_tableCloumnData() {
      return this.type === '3' ? [].concat(this.tableCloumnData, [{ lable: '所属租户', prop: 'tenantName' }]) : this.tableCloumnData
    },
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
    },
    local_tableCloumnData() {
      if (this.$refs.multipleTable) {
        console.log('doLayout')
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout()
        })
      }
    },
    type() {
      this.getKpiList()
    }
  },
  created() {
    this.getKpiList(true)
  },
  methods: {

    handleChange(list) {
      this.requestData.assetType = list[0]
      this.requestData.subtype = list[1]
    },
    goDetail(rowData) {
      goDetail(rowData)
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
    getKpiList(needClear) {
      if (needClear) {
        this.selectTotalList = []

        this.changeTotalList = []
        this.requestData.pageNum = 1
        this.requestData.assetName = ''
        this.requestData.assetCode = ''
        this.requestData.assetType = ''
        this.requestData.subtype = ''
        this.selectTableList = JSON.parse(JSON.stringify(this.initSelectArrs))
        this.selectTotalList = this.initSelectIds
      }
      // 1 租户、 2私有、3公有-可见主资源
      this.requestData.groupType = this.type
      const searchData = Object.assign({}, this.requestData, { pageSize: 10, flag: 1 })
      this.$emit('getTableList', searchData)
    },
    renderTotalList(isFirst = false) {
      this.showList.map((item, Index) => {
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(item, true)
          )
        } else {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(item, false)
          )
        }
      })
    },
    goBackConfirm() {
      this.dialogVisible = false
    },
    handleSelect(list) {
      this.type = list
    },
    search() {
      this.requestData.pageNum = 1
      this.getKpiList()
    },
    reset() {
      this.requestData.pageNum = 1
      this.requestData.assetName = ''
      this.requestData.assetCode = ''
      this.requestData.assetType = ''
      this.requestData.subtype = ''
      this.requestData.tagIdList = []
      this.assetType = []
      this.getKpiList()
    },
    handleCurrentChange(pageNum) {
      this.requestData.pageNum = pageNum
      this.getKpiList()
    },
    save() {
      // if (!this.showList.length) return
      if (this.selectTableList.length) {
        let uniqueFlag = true
        for (let index = 0; index < this.selectTableList.length; index++) {
          const item = this.selectTableList[index];
          if (!(this.selectTableList.findIndex(_item => {
            return item.assetCode === _item.assetCode
          }) === index)) {
            uniqueFlag = false
            break
          }
        }

        if (!uniqueFlag) {
          // 有重复assetCode
          return this.$message.error('同个资源只能引用一个版本')
        }
      }
      const isNeedPop = !!this.changeTotalList.length
      if (isNeedPop === false) {
        this.$emit('saveTableList', this.selectTableList)
        this.dialogVisible = false
        return
      }
      this.$confirm(
        '是否确定保存引用关系？',
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
      console.log(arrs, item, 'arrs, item')
      if (!this.isClickSelect) this.isClickSelect = true
      if (item) {
        // 监听单个选中
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          // 取消
          this.selectTotalList = this.selectTotalList.filter((i) => i !== item[`${this.checkedName}`])
          this.selectTableList = this.selectTableList.filter((i) => i[`${this.checkedName}`] !== item[`${this.checkedName}`])
          const Index = this.changeTotalList.indexOf(item[`${this.checkedName}`])
          if (Index === -1) {
            this.changeTotalList.push(item[`${this.checkedName}`])
          }
        } else {
          // 选中
          const repeatAssets = this.selectTableList.filter(_item => _item.assetCode === item.assetCode) // 相同资源的不同版本数组
          if (repeatAssets.length) { // 有相同资源的版本
            this.$message.warning('已更改选择，同个资源不可选择多版本')
            this.selectTableList = this.selectTableList.filter((i) => i.assetCode !== item.assetCode)
            this.selectTotalList = this.selectTotalList.filter((i) => { return !~repeatAssets.findIndex(_i => _i[`${this.checkedName}`] === i) })
            this.selectTotalList.push(item[`${this.checkedName}`])
            this.selectTableList.push(item)
            this.renderTotalList()
          } else {
            this.selectTotalList.push(item[`${this.checkedName}`])
            this.selectTableList.push(item)
          }

          const Index = this.changeTotalList.indexOf(item[`${this.checkedName}`])
          if (Index === -1) {
            this.changeTotalList.push(item[`${this.checkedName}`])
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
          }
          if (!isSelectAll) {
            this.selectTotalList = this.selectTotalList.filter((i) => i !== item[`${this.checkedName}`])
            this.selectTableList = this.selectTableList.filter((i) => i[`${this.checkedName}`] !== item[`${this.checkedName}`])
          }
          const Index = this.changeTotalList.indexOf(item[`${this.checkedName}`])
          if (Index === -1) {
            this.changeTotalList.push(item[`${this.checkedName}`])
          }
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
@import '../../styles/variables.scss';
.dialog-common {
  box-sizing: border-box;
  .c-dialog {
    height: 600px;
  }
  ::v-deep .fixed-page-header {
    border-top: none;
  }
  ::v-deep .c-table td {
    padding: 0;
    height: 48px;
  }
}
.checkbox-notree {
  width: 100%;
  height: 436px !important;
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
    // margin-bottom: 26px;
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
        &:last-child {
          margin-right: 0px;
        }
        span {
          width: 57px;
          text-align: right;
        }
        .all-input {
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
      padding: 0px 0 0 5px;
    }
  }
}
.icon-operate {
  cursor: pointer;
  color: $primaryColor;
}

.algin-center{
 vertical-align: middle;
}
.tab-list-little {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  &::v-deep {
    .c-radio-button__inner {
      font-size: 14px;
    }
    .c-radio-button__orig-radio:checked + .c-radio-button__inner {
      background-color: #fff;
      border: 1px solid #36a4ff;
    }
  }
}
</style>
