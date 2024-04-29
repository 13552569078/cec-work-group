<template>
  <div class="Analysissis-wrap">
    <common-page-list has-footer>
      <div slot="search" class="serach">
        <el-form :inline="true" style="width: 100%">
          <el-form-item label="统计频率:">
            <el-select v-model="AnalysisType" placeholder="选择统计频率" class="form-item-width" @change="changeAnalysisType">
              <el-option v-for="item in AnalysisTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="统计周期:" class="m-l-20">
            <quarter
              v-if="AnalysisType === 'quarter'"
              ref="refQuarter"
              :default-value="quarterDefaultValue"
              class="form-item-width"
              @func="getMsgQuarter"
            />
            <el-date-picker
              v-else
              v-model="seratcTime"
              :type="timeType"
              placeholder="选择统计周期"
              class="form-item-width"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="行政区划:" class="m-l-20">
            <choose-area-limts
              v-if="areaLimtsVisiable"
              class="form-item-width"
              :dept-id.sync="gridId"
              :node-names.sync="nodeNames"
              :levels.sync="levels"
              :check-strictly="true"
              @init="init"
            />
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button class="cestc-button" @click="reset">重置</el-button>
          <el-button type="primary" class="cestc-button" @click="init">查询</el-button>
        </div>
      </div>
      <div slot="content" class="result-content">
        <div v-if="tableData.length > 0" class="content-wrap">
          <el-table ref="tableRef" :data="tableData" style="width: 100%" tooltip-effect="light" :border="true" show-summary :summary-method="getSummaries" height="550">
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
                :formatter="_formatter"
              />
            </template>
          </el-table>
        </div>
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
import dayjs from 'dayjs'
import eventAnalysisApi from '@/api/eventAnalysis'
import Quarter from './components/quarter.vue'
import ChooseAreaLimts from '@/views/event/components/ChooseAreaLimts.vue'
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'

const formatType = 'YYYY-MM-DD'

const timeMap = {
  month: 'month',
  quarter: 'quarter',
  year: 'year'
}

export default {
  name: 'EventcenterWebEventTypeAnalysissisNew',
  components: {
    Quarter,
    ChooseAreaLimts
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      AnalysisType: 'month',
      quarterDefaultValue: '',
      quarterTime: {},
      seratcTime: new Date(),
      gridId: '',
      nodeNames: [],
      levels: [],
      areaLimtsVisiable: true,
      AnalysisTypeList: [{
        label: '按月统计',
        value: 'month'
      }, {
        label: '按季度统计',
        value: 'quarter'
      }, {
        label: '按年统计',
        value: 'year'
      }],
      tableData: [],
      amount: {
        'completeNum': 0,
        'reportNum': 0,
        'selfCompleteNum': 0,
        'selfReportNum': 0,
        'totalCompleteNum': 0,
        'totalReportNum': 0
      },
      columns: [
        {
          prop: 'eventTypeName',
          label: '事件类型名称',
          fixed: 'left',
          width: 200
        },
        {
          prop: 'totalReportNum',
          label: '总有效上报数',
          width: 200
        },
        {
          prop: 'reportNum',
          label: '有效上报数',
          width: 250
        },
        {
          prop: 'selfReportNum',
          label: '三方自处置有效上报数',
          width: 250
        },
        {
          prop: 'totalCompleteNum',
          label: '总办结数',
          width: 200
        },
        {
          prop: 'completeNum',
          label: '办结数',
          width: 200
        },
        {
          prop: 'selfCompleteNum',
          label: '三方自处置办结数'
        }
      ]
    }
  },
  computed: {
    timeType() {
      return timeMap[this.AnalysisType]
    },
    serachTime() {
      if (this.AnalysisType === 'month') {
        return {
          beginDate: dayjs(this.seratcTime).startOf('month').format(formatType),
          endDate: dayjs(this.seratcTime).endOf('month').format(formatType)
        }
      }
      if (this.AnalysisType === 'year') {
        return {
          beginDate: dayjs(this.seratcTime).startOf('year').format(formatType),
          endDate: dayjs(this.seratcTime).endOf('year').format(formatType)
        }
      }
      if (this.AnalysisType === 'quarter') {
        return {
          beginDate: this.quarterTime.startTime,
          endDate: this.quarterTime.endTime
        }
      }
      return {
        beginDate: '',
        endDate: ''
      }
    }
  },

  methods: {
    init() {
      this._search()
      this.getTotal()
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    async reset() {
      Object.assign(this.$data, this.$options.data())
      this.areaLimtsVisiable = false
      this.$nextTick(() => {
        this.areaLimtsVisiable = true
      })
      // await this.$nextTick()
      // this._search()
      // this.getTotal()
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
          sums[index] = this.amount.totalReportNum + '件'
          return
        }
        if (index === 3) {
          sums[index] = this.amount.reportNum + '件'
          return
        }
        if (index === 4) {
          sums[index] = this.amount.selfReportNum + '件'
          return
        }
        if (index === 5) {
          sums[index] = this.amount.totalCompleteNum + '件'
          return
        }
        if (index === 6) {
          sums[index] = this.amount.completeNum + '件'
          return
        }
        if (index === 7) {
          sums[index] = this.amount.selfCompleteNum + '件'
          return
        }
      })

      return sums
    },
    getMsgQuarter(data) {
      this.quarterTime = data
    },
    changeAnalysisType() {
      if (this.AnalysisType === 'quarter') {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        this.quarterDefaultValue = month <= 3 ? `${year}第一季度` : month <= 6 ? `${year}第二季度` : month <= 9 ? `${year}第三季度` : `${year}第四季度`
        this.$nextTick(() => {
          this.$refs.refQuarter.selectSeason(month <= 3 ? 0 : month <= 6 ? 1 : month <= 9 ? 2 : 3)
        })
      }
    },
    async _search() {
      await this.$nextTick()
      if (!this.serachTime.beginDate || !this.serachTime.endDate) return
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.serachTime,
        gridId: this.gridId,
        level: this.levels.length ? this.levels[0] : ''
      }
      const { data: { list, total }} = await eventAnalysisApi.getEventTypeAnalyseList(params)
      this.tableData = list
      this.page.total = total
      console.log(params)
    },
    async getTotal() {
      if (!this.serachTime.beginDate || !this.serachTime.endDate) return
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.serachTime,
        gridId: this.gridId,
        level: this.levels.length ? this.levels[0] : ''
      }
      const { data } = await eventAnalysisApi.getEventTypeAnalyseTotal(params)
      Object.assign(this.amount, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.Analysissis-wrap {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;

  .serach {
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 10px 0px;
    border-top: 1px solid #36A4FF;

    .btn-wrap {
      display: flex;
    }
  }

  .content-wrap {
    background-color: #fff;
    flex: 1;
    padding: 20px;
  }
}

.form-item-width {
  width: 300px;
}

.m-l-20 {
  margin-left: 0px;
}

::v-deep {
  .el-form-item__label {
    margin-top: 6px
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #EDEDED;
  }
  .el-table--border, .el-table--group{
    border-bottom: 1px solid #EDEDED;
  }
  .el-table--small td, .el-table--small th{
    padding: 6px 0px;
  }
}
</style>
