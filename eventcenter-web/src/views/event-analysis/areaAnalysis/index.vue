<template>
  <div class="Analysissis-wrap">
    <common-page-list :has-footer="false">
      <div slot="search" class="serach">
        <el-form :inline="true" style="width: 100%">
          <el-form-item label="上报时间">
            <el-date-picker
              v-model="seratcTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="form-item-width"
              value-format="yyyy-MM-dd"
              @change="changeTime(seratcTime)"
            />
          </el-form-item>
          <el-form-item label="行政区划">
            <choose-area-limts
              v-if="areaLimtsVisiable"
              class="form-item-width"
              :dept-id.sync="gridId"
              :node-names.sync="nodeNames"
              :levels.sync="levels"
              :check-strictly="true"
              @init="_search"
            />
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button class="cestc-button" @click="reset">重置</el-button>
          <el-button type="primary" class="cestc-button" @click.stop="_search">查询</el-button>
        </div>
      </div>
      <div slot="content" class="result-content">
        <div>
          <TitleBar :title="title1" :option="typeOption" :active="type1" @change="type1Change" />
          <div class="content-wrap">
            <el-table v-if="type1=='list'&&tableData1&&tableData1.length" ref="tableRef" :data="tableData1" style="width: 100%" tooltip-effect="light" :border="true" height="335" show-summary :summary-method="getSummaries">
              <el-table-column type="index" width="50" fixed="left" :index="indexMethod" class-name="table-column-index" />
              <template v-for="(item, index) in columns1">
                <el-table-column
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :width="item.width"
                  :min-width="item.minWidth"
                  show-overflow-tooltip
                  :formatter="_formatter"
                >
                  <template slot-scope="{row }">
                    <span>{{ item.unit?`${row[item.prop]}${item.unit}`:row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <div v-else-if="type1=='graph'&&chartData1" class="chartView">
              <bar-chart :chart-data="chartData1" />
            </div>
            <div v-else class="empty">暂无数据</div>
          </div>
        </div>
        <div class="mt20">
          <TitleBar :title="title2" :option="typeOption" :active="type2" @change="type2Change" />
          <div class="content-wrap">
            <el-table v-if="type2=='list'&&tableData2&&tableData2.length" ref="tableRef" :data="tableData2" style="width: 100%" tooltip-effect="light" :border="true" height="335" show-summary :summary-method="getSummaries">
              <el-table-column type="index" width="50" fixed="left" :index="indexMethod" class-name="table-column-index" />
              <template v-for="(item, index) in columns2">
                <el-table-column
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :width="item.width"
                  :min-width="item.minWidth"
                  show-overflow-tooltip
                  :formatter="_formatter"
                >
                  <template slot-scope="{row }">
                    <span>{{ item.unit?`${row[item.prop]}${item.unit}`:row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <div v-else-if="type2=='graph'&&chartData2" class="chartView">
              <bar-chart v-if="chartData2" :chart-data="chartData2" />
            </div>
            <div v-else class="empty">暂无数据</div>
          </div>
        </div>
      </div>
    </common-page-list>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import ChooseAreaLimts from '@/views/event/components/ChooseAreaLimts.vue'
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import TitleBar from './titlebar.vue'
import barChart from '@/components/echarts/barChart.vue'
import moduleSrv from '@/api/dispatch'
const formatType = 'YYYY-MM-DD'
export default {
  name: 'EventcenterWebEventTypeAnalysissisNew',
  components: {
    ChooseAreaLimts, TitleBar, barChart
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      areaLimtsVisiable: true,
      seratcTime: [dayjs().subtract(30, 'day').format(formatType), dayjs().format(formatType)],
      gridId: '',
      nodeNames: [],
      levels: [],
      tableData1: [],
      tableData2: [],
      columns1: [
        {
          prop: 'deptName',
          label: '部门名称'
        },
        {
          prop: 'toBeProcessedNum',
          label: '应处理数',
          chart: 'bar'
        },
        {
          prop: 'processedNum',
          label: '处理数',
          chart: 'bar'
        },
        {
          prop: 'overTimeNum',
          label: '超时数',
          chart: 'bar'
        },
        {
          prop: 'processedRate',
          label: '处理率',
          chart: 'line',
          unit: '%'
        },
        {
          prop: 'overTimeRate',
          label: '超时率',
          chart: 'line',
          unit: '%'
        }
      ],
      columns2: [
        {
          prop: 'divisionName',
          label: '行政区划名称'
        },
        {
          prop: 'effectiveReportingNum',
          label: '有效上报数',
          chart: 'bar'
        },
        {
          prop: 'completedNum',
          label: '办结数',
          chart: 'bar'
        },
        {
          prop: 'overTimeNum',
          label: '超时数',
          chart: 'bar'
        },
        {
          prop: 'completedRate',
          label: '办结率',
          chart: 'line',
          unit: '%'
        },
        {
          prop: 'overTimeRate',
          label: '超时率',
          chart: 'line',
          unit: '%'
        }
      ],
      typeOption: {
        list: '列表展示',
        graph: '图表展示'
      },
      type1: 'list',
      type2: 'list',
      chartData1: null,
      chartData2: null
    }
  },
  computed: {
    title1() {
      return this.type1 === 'list' ? '直属部门' : '本级部门'
    },
    title2() {
      return this.type2 === 'list' ? '下属行政区划' : '下级行政区划'
    }
  },
  methods: {
    // 表格内容格式化
    _formatter(_row, _column, cellValue) {
      if (_column.unit === '%' && typeof cellValue === 'number') {
        return cellValue + '%'
      }
      if (cellValue === 0) {
        return cellValue
      }
      return cellValue || '--'
    },
    changeTime() {
      if (Array.isArray(this.seratcTime)) {
        const startDate = dayjs(this.seratcTime[0])
        const endDate = dayjs(this.seratcTime[1])
        const diffInDays = endDate.diff(startDate, 'day')
        if (diffInDays > 365) {
          this.$message({
            message: '跨度最大365天!',
            type: 'warning'
          })
          this.initSearchTime()
        }
      }
    },
    type1Change(val) {
      this.type1 = val
    },
    type2Change(val) {
      this.type2 = val
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    reset() {
      Object.assign(this.$data, this.$options.data())
      this.areaLimtsVisiable = false
      this.$nextTick(() => {
        this.areaLimtsVisiable = true
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const arr = ['processedRate', 'overTimeRate', 'completedRate']
      const obj = {}
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
        if (arr.includes(column.property)) {
          sums[index] = '0.00%'
          obj[column.property] = { index }
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
          obj[column.property] = { index, num: sums[index] }
        } else {
          sums[index] = 'N/A'
        }
      })
      const denominator = obj.toBeProcessedNum?.num || obj.effectiveReportingNum?.num || 0
      const numerators = ['processedNum', 'overTimeNum', 'completedNum']
      arr.forEach((k, i) => {
        if (obj[k] && !isNaN(denominator) && denominator > 0) {
          const numerator = obj[numerators[i]]?.num || 0
          sums[obj[k].index] = (Math.round(10000 * numerator / denominator) / 100).toFixed(2) + '%'
        }
      })

      console.log(sums, '---sums')
      return sums
    },
    async _search() {
      if (!(this.seratcTime && this.seratcTime.length === 2)) {
        return this.$message.error('查询条件：上报时间不能为空！')
      }
      if (!this.gridId) {
        return this.$message.error('查询条件：行政区划不能为空！')
      }
      const params = {
        'divisionCode': this.gridId,
        'beginDate': this.seratcTime?.[0],
        'endDate': this.seratcTime?.[1]
      }
      params.beginDate = params.beginDate ? `${params.beginDate} 00:00:00` : ''
      params.endDate = params.endDate ? `${params.endDate} 23:59:59` : ''
      console.log(params, '---params')
      this.getData1(params)
      this.getData2(params)
    },
    async getData1(params) {
      try {
        const res = await moduleSrv.getDirectDept(params)
        this.tableData1 = res?.data || []
        this.chartData1 = this.getChartData(this.tableData1, 1)
      } catch (e) {
        console.log(e)
      }
    },
    async getData2(params) {
      try {
        const res = await moduleSrv.getSubDivision(params)
        this.tableData2 = res?.data || []
        this.chartData2 = this.getChartData(this.tableData2, 2)
      } catch (e) {
        console.log(e)
      }
    },
    getChartData(data, type) {
      if (!data.length) return null
      const xData = []
      const yData = {
        'completedNum': [],
        'completedRate': [],
        'effectiveReportingNum': [],
        'overTimeNum': [],
        'overTimeRate': [],
        'processedNum': [],
        'processedRate': [],
        'toBeProcessedNum': []
      }
      data.forEach(d => {
        if (type === 1) {
          xData.push(d.deptName)
        } else {
          xData.push(d.divisionName)
        }
        Object.keys(yData).forEach(k => {
          yData[k].push(d[k])
        })
      })
      const arr = ['processedRate', 'overTimeRate', 'completedRate']
      const series = []
      const legendData = []
      const columns = type === 1 ? this.columns1 : this.columns2
      const color = ['#A3DEFF', '#A8E6DA', '#FDD493', '#4CC09E', '#FA8B16']
      const borderColor = ['#36A4FF', '#4CC09E', '#FA8B16']
      let ymax = 10
      columns.forEach(d => {
        const isLine = arr.includes(d.prop)
        const unit = isLine ? '%' : '件'
        if (d.chart) {
          if (d.chart === 'bar') {
            ymax = Math.max(ymax, ...yData[d.prop])
          }
          const i = series.length
          series.push({
            name: d.label,
            type: d.chart,
            data: yData[d.prop],
            yAxisIndex: isLine ? 1 : 0,
            tooltip: {
              valueFormatter: value => `${value} ${unit}`
            },
            barMaxWidth: 16,
            itemStyle: {
              borderColor: borderColor[i]
            }
          })
          legendData.push({
            name: d.label,
            itemStyle: {
              color: color[i],
              borderWidth: 1,
              borderColor: borderColor[i]
            },
            textStyle: {
              color: '#8A8A8A'
            }
          })
        }
      })
      ymax = Math.ceil(ymax / 4) * 4
      const opstions = {
        color: color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          show: true,
          padding: 0,
          top: 0,
          itemWidth: 12,
          itemHeight: 12,
          borderRadius: 0,
          data: legendData
        },
        grid: {
          left: ymax > 999 ? 40 : 30,
          right: 30,
          top: 30,
          bottom: 20
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLabel: {
              color: '#BDBDBD'
            },
            axisLine: {
              lineStyle: {
                color: '#EDEDED'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位/件',
            min: 0,
            max: ymax,
            interval: Math.ceil(ymax / 4),
            axisLabel: {
              color: '#BDBDBD',
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#8A8A8A'
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '单位/%',
            min: 0,
            max: 100,
            interval: 25,
            axisLabel: {
              color: '#BDBDBD',
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#8A8A8A'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EDEDED'
              }
            }
          }
        ],
        series: series
      }
      return opstions
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
  .result-content {
    overflow: auto;
  }

  .content-wrap {
    background-color: #fff;
    flex: 1;
    padding: 0 20px 20px 20px;
  }
  .chartView {
    height: 335px;
    .text {
      height: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .empty {
    height: 335px;
    padding-top: 150px;
    text-align: center;
  }
}

.form-item-width {
  width: 300px;
}

::v-deep {
  .el-form-item__label {
    margin-top: 6px
  }
  .table-column-index .cell {
    padding: 0 !important;
    text-align: center;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #EDEDED;
  }
  .el-table--border, .el-table--group{
    border-bottom: 1px solid #EDEDED;
  }
}
</style>
