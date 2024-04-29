<template>
  <el-table :data="value" style="width: 100%" show-summary :height="tableContentHeight" :summary-method="getSummaries">
    <el-table-column type="index" width="60" />
    <el-table-column
      v-for="(item, index) in thead"
      :key="index"
      :prop="item.prop"
      :label="item.lable"
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
          checkRate: '',
          checkCount: '',
          endCount: '',
          endRate: '',
          overTimeRate: '',
          overTimeCount: '',
          totalCount: ''
        }
      ],
      thead: [
        {
          prop: 'deptName',
          lable: '区域名称',
          width: ''
        },
        {
          prop: 'totalCount',
          lable: '事件总数'
        },
        {
          prop: 'checkCount',
          lable: '审核通过事件数',
          width: ''
        },
        {
          prop: 'endCount',
          lable: '结案事件数'
        },
        {
          prop: 'overTimeCount',
          lable: '超时事件数'
        },
        {
          prop: 'endRate',
          lable: '结案率',
          width: ''
        },
        {
          prop: 'checkRate',
          lable: '审核通过率'
        },
        {
          prop: 'overTimeRate',
          lable: '超时率'
        }
      ]
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
        if (['endRate', 'checkRate', 'overTimeRate', 'deptName'].includes(column.property)) {
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
