<template>
  <div class="panel-con-wrap p-b-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="GDP及时评估指数" :buttonList="buttonList"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData" :inverse="false" :minValue="0"></Line>
      </el-carousel-item>
      <el-carousel-item>
        <bar :xData="BarCharts.xData" :yData="BarCharts.yData"></bar>
      </el-carousel-item>
      <el-carousel-item>
        <Line :xData="LineCharts2.xData" :yData="LineCharts2.yData" :inverse="false" :minValue="-15"></Line>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { LOOP_INTERVAL } from '/@/common/constant'
import { IhomeCharts } from '/#/echarts'
import { Line, Bar, PanelHeader } from "../components/index"
import { DATA1, DATA2 } from "../data/left1"

const type = ref('0');
const carousel = ref();


const LineCharts = reactive<IhomeCharts>({
  xData: [],
  yData: [],
})
const LineCharts2 = reactive<IhomeCharts>({
  xData: [],
  yData: [],
})
const BarCharts = reactive<IhomeCharts>({
  xData: [],
  yData: [],
})
const buttonList = [{
  balel: '及时评估',
  value: '0'
}, {
  balel: '规模',
  value: '1'
}, {
  balel: '增速',
  value: '2'
}]

const getLineCharts = async () => {
  const xData = DATA1.map((item) => {
    return item.index_date
  })
  const yData = DATA1.map((item) => {
    return item.index_value
  })
  LineCharts.xData = xData
  LineCharts.yData = yData
}
const getBarCharts = async () => {
  const xData = DATA2.map((item) => {
    return item.data_name
  })
  const yData = DATA2.map((item) => {
    return item.data_value
  })
  BarCharts.xData = xData
  BarCharts.yData = yData


  const xData2 = DATA2.map((item) => {
    return item.data_name
  })
  const yData2 = DATA2.map((item) => {
    return item.data_value2
  })
  LineCharts2.xData = xData2
  LineCharts2.yData = yData2
}

const changeBtn = (n: number) => {
  type.value = n + '';
}

watch(type, (n) => {
  carousel.value.setActiveItem(n);
})

onMounted(() => {
  getLineCharts()
  getBarCharts()
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
