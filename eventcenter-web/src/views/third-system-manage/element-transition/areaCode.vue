<template>
  <div ref="commonList" class="page-container">
    <div class="page-content">
      <div id="searchSection1" ref="searchRef1" class="top">
        <search ref="searchRef" :params-list="searchFilterItems" @searchList="dealwithFilter" @reset="clearFilters" />
      </div>
      <div class="bottom">
        <div class="bottom-left">
          <el-scrollbar style="height: 100%">
            <cestc-tree
              ref="tree"
              :data="thirdSystemList"
              check-strictly
              node-key="platformCode"
              :highlight-current="true"
              :props="treeProps"
              icon-class-fold="el-icon-caret-right"
              icon-class-unfold="el-icon-caret-bottom"
              :text-length="13"
              @handleNodeClick="handleNodeClick"
            />
          </el-scrollbar>
        </div>
        <div v-loading="loading" class="bottom-right">
          <el-table
            v-if="dataList.length"
            :data="thirdSystemList&&thirdSystemList.length?dataList:[]"
            style="width: 100%;margin-bottom: 20px;"
            row-key="areaCode"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            height="100%"
          >
            <el-table-column type="index" width="80">
              <template slot-scope="{ row, $index }">
                <span class="table-index">{{ $index+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="areaName" label="标准行政区划" width="380" />
            <el-table-column prop="areaCode">
              <template slot="header">
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 5px; display: inline-block;">{{ tableTitle }}行政区划编码</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="第三方系统的行政区划编码默认采用标准编码，若第三方平台采用非标编码，可以手动配置。"
                    placement="right"
                  >
                    <!-- <i class="el-icon-info" style="cursor: pointer" /> -->
                    <span class="info-tips" />
                  </el-tooltip>
                </div>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.isEdit"
                  v-model="scope.row.platformAreaCode"
                  placeholder="请输入行政区划编码"
                  style="width: 300px;"
                />
                <span v-else>{{ scope.row.platformAreaCode || scope.row.areaCode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <span class="action-group">
                  <span v-if="!scope.row.isEdit" class="action-btn" @click="handleEdit(scope.$index, scope.row, true)">编辑</span>
                  <span v-else class="action-btn" @click="handleEdit(scope.$index, scope.row, false)">确定</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import search from './search'
import searchMixin from '@/mixin/searchMixin'
import thirdSystemMixin from '@/mixin/thirdSystemMixin'
import resizeObserverMixin from '@/mixin/resizeObserverMixin'
import moduleSrv from '@/api/dispatchWhh'

export default {
  name: 'AreaCode',
  components: {
    search
  },
  mixins: [searchMixin, thirdSystemMixin, resizeObserverMixin],
  props: {},
  data() {
    return {
      contentHeight: 'calc(100% - 42px)',
      searchFilterItems: [
        {
          type: 'input',
          label: '行政区划',
          labelKey: 'areaName',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        },
        {
          type: 'input',
          label: '区划编码',
          labelKey: 'areaCode',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入内容'
        }
      ],
      templateTableData: [],
      loading: false,
      tableTitle: '',
      filterStatus: true
    }
  },
  watch: {
    // 如果只有查看权限，则无需再继续查询按钮权限,
    selectedThirdSystem: {
      deep: true,
      immediate: true,
      handler(val) {
        this.tableTitle = ''
        if (val && val.platformCode) {
          this._search()
          this.tableTitle = val.platformName
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 创建观察实例
      this.initObServer(document.getElementById('searchSection1'), entries => {
        console.log('创建观察实例==', entries)
        if (entries[0].target) {
          this.calcHeight()
        }
      })
    })
  },
  methods: {
    // 正常递归
    flattenTree(data, keys) {
      // 定义函数，传入两个参数，第一个是需要扁平化的树形数组，第二个是需要扁平化的关键字
      const result = [] // 定义一个空数组，用来存储扁平化后的结果
      function traverse(node) {
        // 定义一个名为 traverse 的函数，用于遍历节点
        result.push(node) // 将当前节点添加到结果数组中
        for (const key of keys) {
          // 遍历传入的关键字数组
          if (Array.isArray(node[key])) {
            // 如果当前节点的关键字对应的值是一个数组
            for (const child of node[key]) {
              // 遍历该数组中的子节点
              traverse(child) // 递归调用 traverse 函数，继续遍历子节点
            }
          }
        }
      }
      for (const node of data) {
        // 遍历原始树形数组中的每个节点
        traverse(node) // 对每个节点递归调用 traverse 函数，遍历所有子节点
      }
      return result // 返回扁平化后的结果数组
    },
    filterTree(tree, params) {
      if (!tree.length) return []
      console.log(163, this.flattenTree(tree, ['children']).map(element => {
        return { ...element, children: [] }
      }))
      const _tree = this.flattenTree(tree, ['children']).map(element => {
        return { ...element, children: [] }
      })
      return _tree.filter(item => {
        // 过滤出数据
        // areaName
        if (params.areaName && !params.areaCode) {
          return item.areaName.indexOf(params.areaName) !== -1
        }
        // areaCode
        if (params.areaCode && !params.areaName) {
          return item.areaCode.indexOf(params.areaCode) !== -1
        }
        // areaName  areaCode
        if (params.areaName && params.areaCode) {
          return item.areaName.indexOf(params.areaName) !== -1 && item.areaCode.indexOf(params.areaCode) !== -1
        }
      })
    },
    async _search() {
      console.log(this.searchParams, 'this.searchParams')
      await this.getAreaTree()
      if (this.searchParams.areaName || this.searchParams.areaCode) {
        this.dataList = this.filterTree(this.templateTableData, this.searchParams)
      }
    },
    async getAreaTree() {
      this.loading = true
      this.dataList = []
      const res = await moduleSrv.getAreaTree(
        { platformCode: this.selectedThirdSystem.platformCode }
      )
      if (res.code === 0) {
        this.dataList = res.data
        this.templateTableData = res.data
        this.$nextTick(() => {
          this.loading = false
        })
      }
    },
    handleEdit(index, row, isEdit) {
      console.log(index, row, isEdit)
      if (isEdit) {
        if (!row.platformAreaCode) this.$set(row, 'platformAreaCode', row.areaCode)
      } else {
        if (!row.platformAreaCode) {
          this.$message.error('请填写行政区划编码')
          return
        }
        moduleSrv.updateThirdSystemArea(
          {
            // 第三方区划信息
            'originalSysCode': this.selectedThirdSystem.platformCode,
            'originalName': row.areaName,
            'originalValue': row.platformAreaCode,

            // 标准区划信息
            'replaceSysCode': this.selectedThirdSystem.platformCode,
            'replaceName': row.areaName,
            'replaceValue': row.areaCode
          }
        ).then(res => {
          if (res.code === 0) {
            this.$message.success('保存成功')
            this._search()
          }
        })
      }
      this.$set(row, 'isEdit', isEdit)
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
::v-deep {
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
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
      padding: 20px;
    }
  }
}
</style>
