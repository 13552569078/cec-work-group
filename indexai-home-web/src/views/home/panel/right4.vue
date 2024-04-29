<template>
  <div class="panel-con-wrap p-b-panel p-t-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="教育指数"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData" :showMin="false"></Line>
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
import moduleSrv from '/@/api/index'
import { IhomeCharts, IhomeRadarCharts } from '/#/echarts'
import { LOOP_INTERVAL } from '/@/common/constant'
import { Line, Bar, Radar, PanelHeader } from "../components/index"

const type = ref('0');
const carousel = ref();

const serchYear = ref('2021')
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
  const { data } = await moduleSrv.getHomeEducation1()
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
  const { data } = await moduleSrv.getHomeEducation2({ nf: serchYear.value })
  const chartsData = data.slice(0, 10)
  const xData = chartsData.map((item: { 城市: string; 总得分: string }) => {
    return item.城市
  })
  const yData = chartsData.map((item: { 城市: string; 总得分: string }) => {
    return item.总得分
  })
  BarCharts.xData = xData
  BarCharts.yData = yData
}
const getRadarCharts = async () => {
  const { data } = await moduleSrv.getHomeEducation3({ nf: serchYear.value, csmc: '北京' })
  RadarCharts.xData = [
    {
      name: '发展指数',
      // max: 100
      max: data[0].最大发展指数 ?? 0
    },
    {
      name: '创新指数',
      max: data[0].最大创新指数 ?? 0
    },
    {
      name: '绿色指数',
      max: data[0].最大绿色指数 ?? 0
    },
  ],
    RadarCharts.yData = [data[0].发展指数 ?? 0, data[0].绿色指数 ?? 0, data[0].发展指数 ?? 0]
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
::v-deep(.el-carousel__container) {
  height: 100% !important;
}
</style>
