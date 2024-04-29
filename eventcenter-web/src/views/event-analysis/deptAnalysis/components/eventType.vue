<template>
  <div class="warp">
    <common-page-list has-footer :has-top-border="false" :height-auto="true">
      <div slot="search" class="title">
        <div class="name">事件类型</div>
        <el-radio-group v-model="type" @change="init">
          <el-radio-button label="this">仅本部门</el-radio-button>
          <el-radio-button label="thisAndNext">本部与下级</el-radio-button>
        </el-radio-group>
      </div>
      <div slot="content">
        <el-table
          ref="tableRef"
          :data="tableData"
          border
          show-summary
          style="width: 100%;"
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
      <template v-slot:footer>
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
      </template>
    </common-page-list>
  </div>
</template>

<script>
import eventAnalysisApi from '@/api/eventAnalysis'
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'

export default {
  name: 'ThisDep',
  mixins: [pageMixin, searchMixin],
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
      sumToBeProcessedNum: '0',
      sumProcessedNum: '0',
      columns: [
        {
          prop: 'eventTypeName',
          label: '事件类型名称',
          fixed: 'left',
          width: 200
        },
        {
          prop: 'toBeProcessedNum',
          label: '应处理数',
          width: 200
        },
        {
          prop: 'processedNum',
          label: '处理数'
        }
      ],
      type: 'this'
    }
  },

  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
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
          sums[index] = this.sumToBeProcessedNum + '件'
          return
        }
        if (index === 3) {
          sums[index] = this.sumProcessedNum + '件'
          return
        }
      })

      return sums
    },
    async init() {
      // await this.$nextTick()
      if (!this.serachParams.deptCode) return
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.serachParams,
        thisDept: this.type === 'this'
      }
      const { data: { pageInfo, sumProcessedNum, sumToBeProcessedNum }} = await eventAnalysisApi.postEventTypeStatPage(params)
      this.tableData = pageInfo.list
      console.log(this.tableData.length)
      this.sumProcessedNum = sumProcessedNum
      this.sumToBeProcessedNum = sumToBeProcessedNum
      this.page.total = pageInfo.total
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #4B4B4B;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .name {
    border-left: 4px solid #36A4FF;
    padding-left: 10px;
  }
}

.m-t-20 {
  margin-top: 20px;
}
</style>
