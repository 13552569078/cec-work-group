<template>
  <div class="panel-con-wrap p-b-panel p-t-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="智慧城市指数"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData" :showMin="true"></Line>
      </el-carousel-item>
      <el-carousel-item>
        <bar :xData="BarCharts.xData" :yData="BarCharts.yData"></bar>
      </el-carousel-item>
      <el-carousel-item>
        <RadarSmart :xData="RadarCharts.xData" :yData="RadarCharts.yData" title="智慧城市评价模型"></RadarSmart>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import moduleSrv from '/@/api/index'
import { IhomeCharts, IhomeRadarCharts } from '/#/echarts'
import { LOOP_INTERVAL } from '/@/common/constant'
import { Line, Bar, RadarSmart, PanelHeader } from "../components/index"

const type = ref('0');
const carousel = ref();

const serchYear = ref('2023')
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
  const { data } = await moduleSrv.getHomeSmart1()
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
  const { data } = await moduleSrv.getHomeSmart2({ nf: serchYear.value })
  const chartsData = data.slice(0, 10)
  const xData = chartsData.map((item: { 城市: string; HDI: string }) => {
    return item.城市
  })
  const yData = chartsData.map((item: { 城市: string; HDI: string }) => {
    return item.HDI
  })
  BarCharts.xData = xData
  BarCharts.yData = yData
}
const getRadarCharts = async () => {
  const { data } = await moduleSrv.getHomeSmart3({ nf: serchYear.value })
  RadarCharts.xData = [
    {
      name: '智慧城市评级',
      max: 10
    },
    {
      name: '基础建设评级',
      max: 10
    },
    {
      name: '科技应用评级',
      max: 10
    }
  ]
  RadarCharts.yData = data
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
