<template>
  <div v-loading="loading" class="list-result-container">
    <el-table :data="tableData" show-summary :height="tableContentHeight" :summary-method="getSummaries">
      <el-table-column type="index" width="60" align="center" />
      <el-table-column prop="deptName" label="区域名称" />
      <el-table-column
        v-for="(item, index) in computedCols"
        :key="index"
        :prop="item.prop"
      >
        <template v-slot:header>
          <div class="custom-header" :title="item.label">
            {{ item.label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalCount" label="总数" />
      <el-table-column prop="percent" label="占比" />
    </el-table>
  </div>
</template>

<script>
import service from '@/api/dispatch'
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    tableContentHeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      defaultColumns: [
        {
          label: '应急类'
        },
        {
          label: '重大生活保障类'
        },
        {
          label: '社会治安类'
        },
        {
          label: '特殊人群类'
        },
        {
          label: '安全隐患类'
        },
        {
          label: '城市管理类'
        },
        {
          label: '咨询帮助类'
        },
        {
          label: '不文明行为类'
        }
      ]
    }
  },
  computed: {
    computedCols() {
      if (this.tableData && this.tableData.length) {
        const columns = []
        this.tableData[0] &&
          this.tableData[0].child.forEach((item, index) => {
            columns.push({
              label: item.eventTypeName,
              prop: `col${index}`
            })
          })
        return columns
      } else {
        return this.defaultColumns
      }
    }
  },
  methods: {
    // 表格合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (['percent', 'deptName'].includes(column.property)) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    search(searchForm) {
      const params = {
        ...searchForm
      }
      this.loading = true
      service
        .getListEventType(params)
        .then((res) => {
          this.tableData = res.data.data || []
          // 如果返回了当前机构，则进行回填
          if (res.data.deptId) {
            this.$bus.$emit('setDefautRoot', res.data.deptId)
          }
          this.tableData &&
            this.tableData.forEach((item) => {
              item.percent = `${item.percentage}%`
              item.child &&
                item.child.forEach((key, index) => {
                  item[`col${index}`] = key.count
                })
            })
          this.$emit('update:total', this.tableData.length || 0)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.list-result-container {
  height: 100%;
  overflow: auto;
  .custom-header {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
