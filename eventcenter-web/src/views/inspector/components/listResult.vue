<template>
  <el-table :data="value" style="width: 100%" show-summary :height="tableContentHeight" :summary-method="getSummaries">
    <el-table-column type="index" width="60" />
    <el-table-column
      v-for="(item, index) in thead"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
    />
  </el-table>
</template>
<script>

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    tableContentHeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [
        {
          deptName: '',
          approveRatio: '',
          approveCount: '',
          endCount: '',
          endRate: '',
          overTimeRate: '',
          overTimeCount: '',
          totalCount: ''
        }
      ]
    }
  },
  computed: {
    thead() {
      const item = this.$route.name === 'gridHandle' ? { prop: 'gridName', label: '区域名称', width: '' } : { prop: 'deptName', label: '部门名称', width: '' }
      const arr = [
        {
          prop: 'totalCount',
          label: '督办单总数'
        },
        {
          prop: 'claimCount',
          label: '认领数'
        },
        {
          prop: 'handleCount',
          label: '反馈数',
          width: ''
        },
        {
          prop: 'approveCount',
          label: '审核数',
          width: ''
        },
        {
          prop: 'handleRatio',
          label: '反馈率',
          width: ''
        },
        {
          prop: 'approveRatio',
          label: '审核率'
        }
      ]
      return [item, ...arr]
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
        if (['gridName', 'deptName', 'approveRatio', 'handleRatio'].includes(column.property)) {
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
    }
  }
}
</script>
