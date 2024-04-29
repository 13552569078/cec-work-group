<template>
  <div class="panel-con-wrap p-b-panel p-t-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="自然指数(科研城市)"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData" :showMin="false"></Line>
      </el-carousel-item>
      <el-carousel-item>
        <bar :xData="BarCharts.xData" :yData="BarCharts.yData"></bar>
      </el-carousel-item>
      <el-carousel-item>
        <radar :xData="RadarCharts.xData" :yData="RadarCharts.yData" title="自然指数(科研城市)评价模型"></radar>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import moduleSrv from '/@/api/index'
import { IhomeCharts, IhomeRadarCharts } from '/#/echarts'
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
  const { data } = await moduleSrv.getHomeNature1()
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
  const { data } = await moduleSrv.getHomeNature2({ nf: serchYear.value })
  const chartsData = data.slice(0, 10)
  const xData = chartsData.map((item: { 份额: string; 地区: string }) => {
    return item.地区
  })
  const yData = chartsData.map((item: { 份额: string; 地区: string }) => {
    return item.份额
  })
  BarCharts.xData = xData
  BarCharts.yData = yData
}
const getRadarCharts = async () => {
  const { data } = await moduleSrv.getHomeNature3({ nf: serchYear.value, cs: '北京' })
  RadarCharts.xData = [
    {
      name: '年度贡献份额',
      max: data[0].份额最大值 ?? 0
    },
    {
      name: '年度论文数',
      max: data[0].论文数最大值 ?? 0
    },
    {
      name: '占地区贡献份额比(%)',
      max: 100
    }
  ]
  RadarCharts.yData = [data[0].份额 ?? 0, data[0].论文数 ?? 0, data[0].占地区份额比重 ?? 0]
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
