<template>
  <div class="panel-con-wrap p-b-panel p-t-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="交通健康指数"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData"></Line>
      </el-carousel-item>
      <el-carousel-item>
        <bar :xData="BarCharts.xData" :yData="BarCharts.yData"></bar>
      </el-carousel-item>
      <el-carousel-item>
        <radar :xData="RadarCharts.xData" :yData="RadarCharts.yData"></radar>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { IhomeCharts, IhomeRadarCharts } from '/#/echarts'
import moduleSrv from '/@/api/index'
import { LOOP_INTERVAL } from '/@/common/constant'
import { Line, Bar, Radar, PanelHeader } from "../components/index"

const type = ref('0');
const carousel = ref();

const serchYear = ref('2022')
const LineCharts = reactive<IhomeCharts>({
  xData: [],
  yData: [],
})
const BarCharts = reactive<IhomeCharts>({
  xData: [],
  yData: [],
})
const RadarCharts = reactive<IhomeRadarCharts>({
  xData: [],
  yData: [],
})

const getLineCharts = async () => {
  const { data } = await moduleSrv.getHomeTraffic1()
  const xData = data.map((item: { 年份: string; 排名: string }) => {
    return item.年份
  })
  const yData = data.map((item: { 年份: string; 排名: string }) => {
    return item.排名
  })
  LineCharts.xData = xData
  LineCharts.yData = yData
}
const getBarCharts = async () => {
  const { data } = await moduleSrv.getHomeTraffic2({ nf: serchYear.value })
  const chartsData = data.slice(0, 10)
  let xData = chartsData.map((item: { 城市: string; 交通健康指数: string }) => {
    return item.城市
  })
  let yData = chartsData.map((item: { 城市: string; 交通健康指数: string }) => {
    return item.交通健康指数
  })
  BarCharts.xData = xData
  BarCharts.yData = yData
}
const getRadarCharts = async () => {
  const { data } = await moduleSrv.getHomeTraffic3({ nf: serchYear.value, cs: '北京' })
  RadarCharts.xData = [
    {
      name: '城市交通健康指数(%)',
      max: 100
      // max: 100
    },
    {
      name: '高速日均拥堵里程占比(%)',
      // max: data[2].指标最大值 ?? 0,
      max: 2.5
    },
    {
      name: '公共交通出行幸福指数(%)',
      max: 100
      // max: (data[1].指标最大值) * 100 ?? 0
    },
  ]
  RadarCharts.yData = [
    data[0].指标值 ?? 0,
    (data[1].指标值).toFixed(2) ?? 0,
    data[2].指标值 ?? 0
  ]
}

onMounted(() => {
  getLineCharts()
  getBarCharts()
  getRadarCharts()
})

const changeBtn = (n: number) => {
  type.value = n + '';
}

watch(type, (n) => {
  carousel.value.setActiveItem(n);
})

</script>
<style lang="scss" scoped>
.panel-con-wrap {
  border-bottom: 1px solid #194B93;
}

::v-deep(.el-carousel__container) {
  height: 100% !important;
}
</style>
