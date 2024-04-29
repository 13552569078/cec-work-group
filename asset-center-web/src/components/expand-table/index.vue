<!--
 * @Description: 展开table表格  指标引用 数据和模型资源使用
 * @Author: zs
 * @Date: 2021-05-11
-->
<template>
  <c-dialog :class="'dialog-center-big'"
            class="dialog-common-table"
            :title="title"
            :visible.sync="dialogVisible"
            top="0"
            width="1180px"
            @close="dialogClose"
  >
    <fixed-page
      class="checkbox-notree"
      padding="0"
      :header-height="38"
      :header-margin="0"
      :footer-margin="1"
      :footer-height="0"
      :nofooter="true"
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
            <!-- <div class="search-item">
              <span>资源类型</span>
              <c-cascader
                v-model="assetType"
                :options="assetTypeList"
                :specific-suffix="true"
                clearable
                class="all-input"
                size="small"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              ></c-cascader>
            </div> -->
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

            <c-radio-button label="1">接口资源</c-radio-button>
            <c-radio-button label="3">体征资源</c-radio-button>
            <c-radio-button label="4">模型资源</c-radio-button>
            <c-radio-button label="2">支撑应用</c-radio-button>
          </c-radio-group>
          <!-- <c-menu :default-active="type" active-text-color="#36A4FF" text-color="#4b4b4b"
                  class="c-menu-download" mode="horizontal" @select="handleSelect">
            <c-menu-item index="1">接口</c-menu-item>
            <component :is="'c-menu-item'" popper-class="c-menu-download-sub" :index="'2'">
              <template slot="title">支撑应用</template>

            </component>
          </c-menu> -->
        </div>
        <div v-if="type=='1'||type=='3'||type=='4'">
          <c-table
            ref="multipleTable"
            :key="type"
            v-loading="listLoading"
            height="258px"
            class="hidden-checkall-header"
            :data="tableDateList"
            element-loading-text="Loading"
            @select="userClickSelect"
          >
            <c-table-column
              type="selection"
              width="60"
            />

            <c-table-column
              label=""
              width="70"
            >
              <template slot-scope="scope">{{ pageData.pageSize*(pageData.currPage-1)+scope.$index+1 }}</template>
            </c-table-column>
            <c-table-column width="30"></c-table-column>

            <template v-for="(item,index) in tableCloumnData">
              <c-table-column
                v-if="item.lable !== '标签'"
                :key="`checkedName-${item[checkedName]}-${index}`"
                :label="`${item.lable}`"
                :prop="`${item.prop}`"
                :show-overflow-tooltip="true"
                :min-width="item.minWidth ? item.minWidth: 100 "
              />
              <c-table-column
                v-else
                :key="`checkedName-${item.checkedName}-${index}`"
                :label="`${item.lable}`"
                :prop="`${item.prop}`"
                :min-width="100"
              >
                <template slot-scope="scope">
                  <tags-popover
                    :tags="formatTagNames(scope.row)">
                  </tags-popover>
                </template>
              </c-table-column>
            </template>
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
        <div v-if="type=='2'">
          <c-table
            ref="multipleTable"
            :key="type"
            v-loading="listLoading"
            height="258px"
            class="hidden-checkall-header"
            :data="tableDateList"
            element-loading-text="Loading"
            @select="userClickSelect"
          >
            <c-table-column
              type="selection"
              width="60"
            />

            <c-table-column
              :type="'expand'"
              width="30"
            >
              <template v-if="isSelectable(props.row)" slot-scope="props">
                <div class="c-tabs--border-card tabs-card-box">
                  <c-checkbox-group v-model="props.row.checkboxs" class="c-tabs__content" @change="handleCheckedChange(props.row)">
                    <c-checkbox
                      v-for="checkItem in props.row.checkList"
                      :key="checkItem.apiId"
                      class="check-box"
                      :label="checkItem.apiId"
                    >
                      {{ checkItem.bizKey }}
                    </c-checkbox>
                    <div v-show="props.row.checkList.length === 0" class="check-box">暂无数据</div>
                  </c-checkbox-group>
                </div>
              </template>
              <template v-else>
                <div class="hidden-expand"></div>
              </template>
            </c-table-column>

            <c-table-column
              label=""
              width="70"
            >
              <template slot-scope="scope">{{ pageData.pageSize*(pageData.currPage-1)+scope.$index+1 }}</template>
            </c-table-column>

            <template v-for="(item,index) in tableCloumnData">
              <c-table-column
                v-if="item.lable !== '标签'"
                :key="`checkedName-${item[checkedName]}-${index}`"
                :label="`${item.lable}`"
                :prop="`${item.prop}`"
                :show-overflow-tooltip="true"
                :min-width="item.minWidth ? item.minWidth: 100 "
              />
              <c-table-column
                v-else
                :key="`checkedName-${item.checkedName}-${index}`"
                :label="`${item.lable}`"
                :prop="`${item.prop}`"
                :min-width="100"
              >
                <template slot-scope="scope">
                  <tags-popover
                    :tags="formatTagNames(scope.row)">
                  </tags-popover>
                </template>
              </c-table-column>
            </template>
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

      </div>
    </fixed-page>
    <div slot="footer" class="dialog-footer">

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
import tagsPopover from '@/components/tags-popover/cell.vue'
import { getApiList } from '@/api'
import { assetTypeListSub } from '@/config'

export default {
  components: {
    tagsPopover
  },
  props: {
    status: {
      type: Number,
      default: 1 // 1 新增 2 修改 3 查看
    },
    assetType: {
      type: Number,
      default: 1 // 1 数据 3 模型资源
    },
    title: {
      type: String,
      default: '引用指标'
    },
    needAssetCode: { //
      type: Boolean,
      default: true
    },
    checkedName: { // 当前唯一值名称
      type: String,
      default: 'assetId'
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

    initSelectArrs: { // 已选中的数据 （方便回传使用）
      /**
       * [{
       *  assetId: 主键
       *  assetName:
       *  assetCode:
       *  assetType:
       *  assetDesc:
       *  children:[{
       *    apiId 主键
            assetId
            bizCode
            bizKey
            designInfo
            id
            supportAppId
            version
            versionStatus
       *  }]
       * }]
       */
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: true,
      assetTypeList: assetTypeListSub,
      listLoading: false,
      requestData: {
        assetName: '',
        pageNum: 1,
        assetCode: '',
        assetCodePrefix: '',
        assetType: ''
      },
      type: '1',
      isClickSearch: false, // 是否执行过查询
      tableDateList: [],
      selectTotalListMap: [] // 运行时被缓存的选中项
    }
  },

  watch: {
    showList(val) {
      this.createTableList(val)
    },
    type() {
      this.getKpiList()
    }
  },
  created() {
    this.selectTotalListMap = JSON.parse(JSON.stringify(this.initSelectArrs.map(item => {
      return {
        ...item,
        checkboxs: item.children && item.children.map(_item => _item.apiId) || []
      }
    }))) // 选中的初始值复制
    // this.getTreeList()
    this.getKpiList(true)
  },
  methods: {
    handleSelect(list) {
      this.type = list
    },

    isSelectable(item) {
      if (item.children.length) {
        return true
      } else {
        return false
      }
    },
    diffChange() {
      // 查找是否有变动
      console.log(this.initSelectArrs, this.selectTotalListMap, 'item_old')
      let flag = false
      if (this.initSelectArrs.length !== this.selectTotalListMap.length) {
        flag = true
      } else {
        for (let i = 0; i < this.selectTotalListMap.length; i++) {
          const item = this.selectTotalListMap[i].checkboxs || []
          const item_old = this.initSelectArrs[i].children || []
          console.log(item, item_old, 'item_old')
          if (item.length !== item_old.length) {
            flag = true
            break
          }
          if (item.join() !== item_old.map(item => item.assetId).join) {
            flag = true
            break
          }
        }
      }
      return flag
    },

    updateSelectTotalListMap(item, flag) {
      if (flag === 0) { // 清除
        const findIndex = this.selectTotalListMap.findIndex(_item => _item.assetId === item.assetId)
        if (findIndex !== -1) {
          this.selectTotalListMap.splice(findIndex, 1)
        }
        return
      }
      const findIndex = this.selectTotalListMap.findIndex(_item => _item.assetId === item.assetId)
      if (findIndex !== -1) {
        if (item.subtype + '' !== '27') { // 非支撑应用
          return
        }
        if (item.checkboxs.length === 0) {
          this.selectTotalListMap.splice(findIndex, 1)
        } else {
          this.selectTotalListMap.splice(findIndex, 1, item)
        }
      } else {
        this.selectTotalListMap.push(item)
      }
    },
    createTableList(val) {
      getApiList({ supportAppIdList: val.map(item => item.assetId) }).then(res => {
        // 对数据进行个性化操作
        const list = JSON.parse(JSON.stringify(val))
        console.log(list)
        list.forEach(item => { // 填充数据
          const findOne = res.data.find(_item => _item.supportAppId + '' === item.assetId + '')
          item.children = (findOne || {}).appList || []
        })
        list.map(item => {
          item.checkboxs = ((this.selectTotalListMap.find(_item => _item.assetId === item.assetId) || {}).children || []).map(_item => _item.apiId)
          item.checkList = item.children
          if (item.subtype + '' !== '27') { // 非支撑应用
            if (this.selectTotalListMap.find(_item => _item.assetId === item.assetId)) {
              setTimeout(() => {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }, 200)
            }
          }
          if (item.checkboxs.length) {
            if (item.checkboxs.length === item.checkList.length) {
              setTimeout(() => {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }, 200)
            } else {
              setTimeout(() => {
                this.$refs.multipleTable.toggleRowSelection(item, true)// 半选
              }, 200)
            }
          }
        })
        this.tableDateList = list
      })
    },
    tableItemSelect(key, flag) {
      for (let i = 0; i < this.tableDateList.length; i++) {
        if (this.tableDateList[i][this.checkedName] === key) {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(this.tableDateList[i], flag)
          )
          break
        }
      }
    },
    handleCheckedChange(item) {
      // 折叠项下的复选框被选中
      if (item.checkboxs.length === 0) {
        // 去除
        this.tableItemSelect(item[this.checkedName], false)
        this.updateSelectTotalListMap(item, 0)
      } else {
        this.tableItemSelect(item[this.checkedName], true)
        this.updateSelectTotalListMap(item, 1)
      }
    },
    formatTagNames(data) {
      let tag = ''
      if (this.assetType === 3) {
        tag = data.tagNameList
      } else {
        tag = data.assetTags
      }
      if (!tag) return [];
      if (typeof tag === 'string') return tag.split(/,|，/)
      return tag
    },
    dialogClose() {
      this.$emit('close')
    },
    getKpiList(needClear) {
      if (needClear) {
        this.requestData.pageNum = 1
        this.requestData.assetName = ''
        this.requestData.assetCode = ''
        this.requestData.tagIds = []
      }
      let subtype
      let assetType
      this.type === '1' ? 22 : 27
      switch (+this.type) {
        case 1:
          subtype = 22
          assetType = 2
          break;
        case 2:
          subtype = 27
          assetType = 2
          break;
        case 3:
          subtype = 14
          assetType = 1
          break;
        case 4:
          subtype = 72
          assetType = 7
          break;
        default:
          break;
      }
      const searchData = Object.assign({}, this.requestData, { assetType, subtype: subtype }, { pageSize: 10 }, { flag: 1 })
      this.$emit('getTableList', searchData)
    },

    search() {
      this.isClickSearch = true
      this.requestData.pageNum = 1
      this.getKpiList()
    },
    reset() {
      this.requestData.pageNum = 1
      this.requestData.assetName = ''
      this.requestData.assetCode = ''
      this.requestData.tagIds = []
      this.isClickSearch = false
      this.getKpiList()
    },
    handleCurrentChange(pageNum) {
      this.requestData.pageNum = pageNum
      this.getKpiList()
    },
    goBackConfirm() {
      // 如果无修改直接关闭
      this.dialogVisible = false
    },
    doSave() {
      const hasChange = this.diffChange()
      if (hasChange) {
        console.log('sdfsdfsdfsdfs')
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
            console.log('0ddddd')
            this.$emit('saveTableList', this.getSelectTableList())
            this.dialogVisible = false
            // this.$emit('close')
          }).catch(() => {
            console.log('ddssss')
            this.$emit('saveTableList', this.getSelectTableList())
          })
      } else {
        this.$emit('close')
      }
    },
    getSelectTableList() {
      const arr = []
      this.selectTotalListMap.map(item => {
        console.log(item, 'item')
        arr.push({
          ...item,
          children: item.children && item.children.filter(_item => item.checkboxs && item.checkboxs.indexOf(_item.apiId) !== -1) || []
        })
      })
      return arr
    },
    save() {
      if (!this.tableDateList.length) return
      this.doSave('save')
    },

    // table item被选中之后，如果item的字项没有被选中的项目 需要初始为全选中状态
    changeTableItemCheckbox(arrs) {
      const arrKeys = [] // 被选中的items
      arrs.forEach(element => {
        arrKeys.push(element[this.checkedName])
      })

      this.tableDateList.forEach(element => {
        if (arrKeys.indexOf(element[this.checkedName]) !== -1) { // 选中
          if (!element.checkboxs.length) {
            // 勾选全部
            element.checkList.forEach(item => {
              // 一级
              element.checkboxs.push(item.id)
            })
          }
          this.updateSelectTotalListMap(element, 1)
        } else {
          // 去除勾选

          // 一级
          element.checkboxs = []
          this.updateSelectTotalListMap(element, 0)
        }
      });
    },

    userClickSelect(arrs, item) {
      this.changeTableItemCheckbox(arrs)
    }
  }
}
</script>
<style scoped lang='scss' >
@import '../../styles/variables.scss';

.dialog-common-table {
  .icon-operate{
 color: $primaryColor !important;
}
  box-sizing: border-box;
  .c-dialog{
  height: 600px;
  }
  ::v-deep .fixed-page-header {
    border-top: none;
  }
  ::v-deep .c-table td{
    padding: 0;
    height: 48px;
  }
  ::v-deep .c-tabs--border-card{
    box-shadow: none;
    background: #F6F9FB;
    padding: 0 20px;
    .c-tabs__content {
      padding: 15px 23px;
    }
  }
  .tabs-card-box {
    ::v-deep .c-input-number-group {
      padding: 0px 19px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }
}
.checkbox-notree {
  width: 100%;
  height: 436px !important;
  background: #fff !important;
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
      // padding: 0 20px 0 7px;
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
    // padding: 16px 16px 8px 16px;
    ::v-deep .c-checkbox__input.is-checked .c-checkbox__inner,
    ::v-deep .c-checkbox__input.is-indeterminate .c-checkbox__inner {
      border-color: #d9d9d9;
    }
    ::v-deep .c-checkbox__input .c-checkbox__inner {
      border-color: #d9d9d9;
    }
    ::v-deep .c-pagination {
      margin-top: 24px;
      padding: 0px 0 0 5px ;
    }
  }
}
.check-box {
  margin-top: 14px;
  margin-bottom: 14px;
  width: 190px;
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
