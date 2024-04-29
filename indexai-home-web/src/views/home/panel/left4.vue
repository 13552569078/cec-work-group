<template>
  <div class="panel-con-wrap p-b-panel p-t-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="宜商环境指数"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData" :showMin="true"></Line>
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
import { LOOP_INTERVAL } from '/@/common/constant'
import { IhomeCharts, IhomeRadarCharts } from '/#/echarts'
import { Line, Bar, Radar, PanelHeader } from "../components/index"

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
  const { data } = await moduleSrv.getHomeBusiness1()
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
  const { data } = await moduleSrv.getHomeBusiness2({ nf: serchYear.value })
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
  const { data } = await moduleSrv.getHomeBusiness3({ nf: serchYear.value, csmc: '北京' })
  RadarCharts.xData = [
    {
      name: '外贸依存度',
      max: data[0].外贸依存度最大值 ?? 0
    },
    {
      name: '创业活力',
      max: data[0].创业活力最大值 ?? 0
    },
    {
      name: '营商环境',
      max: data[0].营商环境最大值 ?? 0
    },
    {
      name: '收支平衡',
      max: data[0].收支平衡最大值 ?? 0
    },
    {
      name: '快递物流',
      max: data[0].快递物流最大值 ?? 0
    }
  ]
  RadarCharts.yData = [
    data[0].外贸依存度 ?? 0,
    data[0].创业活力 ?? 0,
    data[0].营商环境 ?? 0,
    data[0].收支平衡 ?? 0,
    data[0].快递物流 ?? 0
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
::v-deep(.el-carousel__container) {
  height: 100% !important;
}
</style>
