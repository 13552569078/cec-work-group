<template>
  <div class="panel-con-wrap p-b-panel p-t-panel" style="color:#ffffff;">
    <PanelHeader v-model="type" title="复工复产指数" :buttonList="buttonList"></PanelHeader>
    <el-carousel indicator-position="none" :interval="LOOP_INTERVAL" class="carousel" arrow="never" :initial-index="0"
      :autoplay="false" ref="carousel" @change="changeBtn">
      <el-carousel-item>
        <Line :xData="LineCharts.xData" :yData="LineCharts.yData" :inverse="false" :minValue="0" :axisTick="false"></Line>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { LOOP_INTERVAL } from '/@/common/constant'
import { IhomeCharts } from '/#/echarts'
import { Line, PanelHeader } from "../components/index"
import { DATA1 } from "../data/right2"

const type = ref('0');
const carousel = ref();

const LineCharts = reactive<IhomeCharts>({
  xData: [],
  yData: [],
})
const buttonList = [{
  balel: '变化趋势',
  value: '0'
}]

const getLineCharts = async () => {
  const xData = DATA1.Xdata
  const yData = DATA1.Ydata.map((item) => +item)
  LineCharts.xData = xData
  LineCharts.yData = yData
}

const changeBtn = (n: number) => {
  type.value = n + '';
}

watch(type, (n) => {
  carousel.value.setActiveItem(n);
})


onMounted(() => {
  getLineCharts()
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
