<template>
  <div class="warp">
    <div class="title">下级部门</div>
    <el-table
      ref="tableRef"
      class="m-t-20"
      :data="tableData"
      style="width: 100%"
      tooltip-effect="light"
      :border="true"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="index" width="75" fixed="left" :index="indexMethod" class-name="table-column-index" />
      <template v-for="(item, index) in columns">
        <el-table-column
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :min-width="item.minWidth"
          show-overflow-tooltip
          :fixed="item.fixed"
        />
      </template>
    </el-table>
  </div>
</template>

<script>
import eventAnalysisApi from '@/api/eventAnalysis'
export default {
  name: 'ThisDep',
  props: {
    serachParams: {
      // 查询
      required: true,
      type: Object,
      default: () => {
        return {
          'beginDate': '',
          'deptCode': '',
          'endDate': ''
        }
      }
    }
  },
  data() {
    return {
      tableData: [],
      // 合计
      sumDeptStatVO: {
        'sumOverTimeNum': 0, // 超时数
        'sumOverTimeRate': 0, // 超时率
        'sumProcessedNum': 0, // 处理数
        'sumProcessedRate': 0, // 处理率
        'sumToBeProcessedNum': 0// 应处理数
      },
      columns: [
        {
          prop: 'deptName',
          label: '部门名称',
          fixed: 'left',
          width: 200
        },
        {
          prop: 'deptLevel',
          label: '部门等级',
          width: 200
        },
        {
          prop: 'toBeProcessedNum',
          label: '应处理数',
          width: 250
        },
        {
          prop: 'processedNum',
          label: '处理数',
          width: 250
        },
        {
          prop: 'overTimeNum',
          label: '超时数',
          width: 200
        },
        {
          prop: 'processedRate',
          label: '处理率',
          width: 200
        },
        {
          prop: 'overTimeRate',
          label: '超时率'
        }
      ]
    }
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    async init() {
      if (!this.serachParams.deptCode) return
      const { data: { deptProcessStatVOList, sumDeptStatVO }} = await eventAnalysisApi.postSubDeptStatList(this.serachParams)
      this.tableData = deptProcessStatVOList.map((item) => {
        return {
          ...item,
          processedRate: item.processedRate + '%',
          overTimeRate: item.overTimeRate + '%'
        }
      })
      this.sumDeptStatVO = sumDeptStatVO
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = ''
          return
        }
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        if (index === 2) {
          sums[index] = ''
          return
        }
        if (index === 3) {
          sums[index] = this.sumDeptStatVO.sumToBeProcessedNum + '件'
          return
        }
        if (index === 4) {
          sums[index] = this.sumDeptStatVO.sumProcessedNum + '件'
          return
        }
        if (index === 5) {
          sums[index] = this.sumDeptStatVO.sumOverTimeNum + '件'
          return
        }
        if (index === 6) {
          sums[index] = this.sumDeptStatVO.sumProcessedRate + '%'
          return
        }
        if (index === 7) {
          sums[index] = this.sumDeptStatVO.sumOverTimeRate + '%'
          return
        }
      })

      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.m-t-20{
  margin-top: 20px;
}
.title {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #4B4B4B;
  border-left: 4px solid #36A4FF;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
