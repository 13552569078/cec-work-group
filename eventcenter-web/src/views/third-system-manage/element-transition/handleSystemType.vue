<template>
  <div ref="commonList" class="page-container">
    <div class="page-content">
      <div id="searchSection1" ref="searchRef1" class="top">
        <search ref="searchRef" label-width="130px" :params-list="searchFilterItems" @searchList="dealwithFilter" @reset="clearFilters" />
      </div>
      <div class="bottom" :style="{ height: contentHeight }">
        <div class="bottom-left">
          <el-scrollbar style="height: 100%">
            <cestc-tree
              ref="tree"
              :data="thirdSystemList"
              :status-list="statusList"
              check-strictly
              node-key="platformCode"
              :highlight-current="true"
              :props="treeProps"
              icon-class-fold="el-icon-caret-right"
              icon-class-unfold="el-icon-caret-bottom"
              @handleNodeClick="handleNodeClick"
            />
          </el-scrollbar>
        </div>
        <div class="bottom-right">
          <common-page-list :has-footer="false" class="common-page-list" :style="{ height: `calc(${contentHeight} - 78px)` }">
            <div slot="content" class="result-content">
              <search-tips
                ref="searchTips"
                :total="page.total"
                show-search-items
                :search-items="filterTips"
                :select-count="selectCount"
                show-actions
                @heightChange="tipHeightChange"
                @delFilter="delFilter"
                @clear="clearFilters"
              >
                <el-button
                  v-if="selectedThirdSystem.sourcePlatform && selectedThirdSystem.handlePlatform"
                  type="primary"
                  class="add-btn common-action-btn"
                  icon="custom-async common-icon"
                  @click="asyncSource"
                >一键同步来源配置</el-button>
              </search-tips>
              <div v-loading="loading" class="result-list" :style="resultStyle">
                <el-table
                  :data="dataList"
                  style="width: 100%;margin-bottom: 20px;"
                  row-key="id"
                  height="calc(100% - 20px)"
                  tooltip-effect="light"
                >
                  <el-table-column type="index" width="80">
                    <template slot-scope="{ row, $index }">
                      <span class="table-index">{{ $index+1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="thisSysEventTypeFullName" label="本系统类型名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{ scope.row.thisSysEventTypeFullName || scope.row.thisSysEventTypeName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="thisSysEventTypeCode" label="本系统类型编码" width="200" />
                  <el-table-column prop="disposeSysEventTypeName" label="处置系统类型名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-cascader
                        v-if="scope.row.isEdit"
                        ref="thisSysEventTypeRef"
                        v-model="scope.row.disposeSysEventTypeCode"
                        :options="options"
                        placeholder="请选择处置系统类型名称"
                        style="width: 300px;"
                        :props="{ label: 'name', value: 'code' }"
                        @change="handleChange"
                      />
                      <span v-else>{{ scope.row.disposeSysEventTypeFullName || scope.row.disposeSysEventTypeName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="disposeSysEventTypeCode" label="处置系统类型编码" width="200">
                    <template slot-scope="scope">
                      <span>{{ scope.row.disposeSysEventTypeCode && Array.isArray(scope.row.disposeSysEventTypeCode) ? scope.row.disposeSysEventTypeCode[scope.row.disposeSysEventTypeCode.length - 1]: scope.row.disposeSysEventTypeCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80" class-name="table-column-action">
                    <template slot-scope="scope">
                      <span v-if="!scope.row.isEdit" class="action-btn" @click="handleEdit(scope.$index, scope.row, true)">编辑</span>
                      <span v-else class="action-btn" @click="handleEdit(scope.$index, scope.row, false)">确定</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </common-page-list>
          <div class="foot-page">
            <cestc-pagination
              background
              :current-page="page.pageNum"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              :page-sizes="[10, 20, 50, 100]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <SyncSourceDialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :source-system-code="sourceSystemCode"
      @cancle="dialogClose"
    />
  </div>
</template>
<script>
import search from './search'
import searchMixin from '@/mixin/searchMixin'
import pageMixin from '@/mixin/pageMixin'
import thirdSystemMixin from '@/mixin/thirdSystemMixin'
import resizeObserverMixin from '@/mixin/resizeObserverMixin'
import moduleSrv from '@/api/dispatchWhh'
import SyncSourceDialog from './syncSourceDialog.vue'

export default {
  name: 'AreaCode',
  components: {
    search,
    SyncSourceDialog
  },
  mixins: [searchMixin, pageMixin, thirdSystemMixin, resizeObserverMixin],
  props: {},
  data() {
    return {
      dialogVisible: false,
      sourcePlatform: 0,
      handlePlatform: 1,
      contentHeight: 'calc(100% - 42px)',
      options: [],
      statusList: [
        {
          type: 1,
          key: 'sourcePlatform',
          label: '来源'
        },
        {
          type: 2,
          key: 'handlePlatform',
          label: '处置'
        }
      ],
      searchFilterItems: [
        {
          type: 'input',
          label: '本系统类型名称',
          labelKey: 'thisSysEventTypeName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'input',
          label: '本系统类型编码',
          labelKey: 'thisSysEventTypeCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'input',
          label: '处置系统类型名称',
          labelKey: 'disposeSysEventTypeName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'input',
          label: '处置系统类型编码',
          labelKey: 'disposeSysEventTypeCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        }
      ],
      eventTypeToTree: [],
      currentSelectedOption: null,
      filterStatus: true
    }
  },
  computed: {
    sourceSystemCode() {
      return this.selectedThirdSystem.platformCode
    }
  },
  watch: {
    selectedThirdSystem: {
      deep: true,
      immediate: true,
      handler(val) {
        this.tableTitle = ''
        if (val && val.platformCode) {
          this._search()

          const params = {
            sourceSystemCode: val.platformCode
          }
          moduleSrv.getThirdTypeList(params).then((res) => {
            this.options = res.data
          })
        }
      }
    }
  },
  async mounted() {
    this.$nextTick(() => {
      // 创建观察实例
      this.initObServer(document.getElementById('searchSection1'), entries => {
        console.log('entries==', entries)
        if (entries[0].target) {
          this.calcHeight()
        }
      })
    })
  },
  methods: {
    asyncSource() {
      // 先调用一键同步接口
      moduleSrv.updateSyncConfDisposeSys({ disposeSystemCode: this.selectedThirdSystem.platformCode })
        .then(res => {
          if (res.code === 0) {
            if (res.data) {
              this.$message({
                type: 'success',
                message: '同步成功'
              })
              this._search()
            } else {
              // 失败后，则弹窗
              this.dialogVisible = true
            }
          }
        })
      // this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
      this._search()
    },
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        disposeSystemCode: this.selectedThirdSystem.platformCode,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv.disposeSystemRelationList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === 0) {
          this.dataList = list
          this.page.total = total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getTreeItem(data, code) {
      data.map(item => {
        // console.log(item.code)
        if (item.code === code) {
          this.currentSelectedOption = item	// 结果赋值
        } else {
          if (item.children) {
            this.getTreeItem(item.children, code)
          }
        }
      })
    },
    getCodes(data, val) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].code === val) {
          return [data[i].code]
        }
        if (data[i] && data[i].children) {
          const d = this.getCodes(data[i].children, val)
          if (d) {
            return d.concat(data[i].code)
          }
        }
      }
    },
    handleChange(value) {
      console.log(258, value)
      this.getTreeItem(this.options, value[value.length - 1])
      console.log(this.currentSelectedOption)
    },
    handleEdit(index, row, isEdit) {
      console.log(index, row, isEdit)
      if (isEdit) {
        console.log('getCodes', this.getCodes(this.options, row.disposeSysEventTypeCode))
        if (row.disposeSysEventTypeCode) row.disposeSysEventTypeCode = this.getCodes(this.options, row.disposeSysEventTypeCode)?.reverse()
        this.$set(row, 'isEdit', isEdit)
      } else {
        if (row.disposeSysEventTypeCode) {
          moduleSrv.saveDiaposeSystemRelation(
            this.currentSelectedOption ? {
              ...row,
              disposeSysEventTypeCode: row.disposeSysEventTypeCode[row.disposeSysEventTypeCode.length - 1],
              'disposeSysEventTypeId': this.currentSelectedOption.id,
              'disposeSysEventTypeName': this.currentSelectedOption.name,
              'disposeSystemCode': this.selectedThirdSystem.platformCode
            } : { ...row, disposeSysEventTypeCode: row.disposeSysEventTypeCode[row.disposeSysEventTypeCode.length - 1] }).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.currentSelectedOption = null
              this._search()
              this.$set(row, 'isEdit', isEdit)
            }
          })
        } else {
          this.$message({
            message: '请选择处置系统类型！',
            type: 'error'
          })
        }
      }
    },
    calcHeight() {
      this.$nextTick(() => {
        const sheight = this.$refs.searchRef1.offsetHeight // 搜索栏的高度
        let contentHeight = this.$refs.commonList.offsetHeight
        if (sheight) {
          contentHeight = contentHeight - sheight - 18
        }
        // 设置给一个最小高度
        this.contentHeight = contentHeight > 100 ? `${contentHeight}px` : '100px'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/global-overrides.scss';
.foot-page {
    height: 76px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding-right: 20px;
    box-shadow: 0px -2px 7px 0px rgba(0,0,0,0.06);
  }
.page-container {
  width: 100%;
  height: 100%;

  .top {
    width: 100%;
    min-height: 72px;
    background: #ffffff;
    border-top: 1px solid #36A4ff;
  }

  .bottom {
    margin-top: 20px;
    display: flex;
    height: calc(100% - 42px);

    .bottom-left {
      width: 272px;
      height: inherit;
      background: #FFFFFF;
      margin-right: 20px;
    }

    .bottom-right {
      flex: 1;
      background: #FFFFFF;
      height: inherit;
      padding: 0;
    }
  }
}
// 可以在该处做适配
::v-deep {
  .search-tips {
    padding: 0 !important;
  }
  .common-page-list {
    padding: 0 20px;
  }
  .advance-search {
    padding: 20px;
    .cestc-search-item {
        .el-form-item__content{
          width: calc(100% - 150px);
        }
    }
  }
}
</style>
