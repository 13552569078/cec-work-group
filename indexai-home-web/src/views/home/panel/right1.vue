<template>
  <div class="panel-con-wrap p-b-panel p-t-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="人才粘性指数"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData"></Line>
      </el-carousel-item>
      <el-carousel-item>
        <bar :xData="BarCharts.xData" :yData="BarCharts.yData"></bar>
      </el-carousel-item>
      <el-carousel-item>
        <radar :xData="RadarCharts.xData" :yData="RadarCharts.yData" type="2"></radar>
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
  const { data } = await moduleSrv.getHomeTalent1()
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
  const { data } = await moduleSrv.getHomeTalent2({ nf: serchYear.value })
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
  const { data } = await moduleSrv.getHomeTalent3({ nf: serchYear.value, cs: '北京' })
  RadarCharts.xData = [
    {
      name: '经济基础源动力',
      max: 100
    },
    {
      name: '创新潜能驱动力',
      max: 100
      // max: data[0].创业活力最大值 ?? 0
    },
    {
      name: '文化开放凝聚力',
      max: 100
      // max: data[0].营商环境最大值 ?? 0
    },
    {
      name: '生态健康吸纳力',
      max: 100
      // max: data[0].收支平衡最大值 ?? 0
    },
    {
      name: '社会福利续航力',
      max: 100
      // max: data[0].快递物流最大值 ?? 0
    },
    {
      name: '公共生活承受力',
      max: 100
      // max: data[0].快递物流最大值 ?? 0
    }
  ]
  RadarCharts.yData = [
    data[0].经济基础源动力 ?? 0,
    data[0].创新潜能驱动力 ?? 0,
    data[0].文化开放凝聚力 ?? 0,
    data[0].生态健康吸纳力 ?? 0,
    data[0].社会福利续航力 ?? 0,
    data[0].公共生活承受力 ?? 0
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
