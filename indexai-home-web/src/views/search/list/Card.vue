<template>
  <div class="card-container" @click="goDetail">
    <div :class="'type_' + item.type"></div>
    <div class="chart-container">
      <Echarts :option="option" height="146px" v-if="showChart" class="echart" />
      <div :class="'default-' + item.type" v-else></div>
    </div>

    <div class="detail">
      <TextTooltip :text="item.content" />
      <div class="mt12">统计时间：{{ item.submitTime }}</div>
      <div>提供部门：{{ item.resManageOrg }}</div>
      <div class="mt12 desc">
        {{ item.description }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { barOption, lineOption, pieCardOption } from '/@/views/search/detail/components/useOptions'

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})

const router = useRouter()
const goDetail = () => {
  // 指标
  if (props.item.type == 5) {
    localStorage.setItem('cardDetail', JSON.stringify(props.item))
    router.push('/search/detail')
  } else if (props.item.type == 3) {
    if (props.item.pcUrl) window.open(props.item.pcUrl)
  } else {
    return
  }
}

const showChart = ref(false)
const option = ref()

const initData = () => {
  const data = props.item
  if (data && data.graphType) {
    showChart.value = true

    switch (data.graphType) {
      case 'line':
        option.value = lineOption
        option.value.xAxis.data = data.xData
        option.value.series[0].data = data.data
        // option.value.title.text = '单位：' + data.value
        // option.value.tooltip.formatter = '{b0}:{c0} ' + data.value
        break
      case 'bar':
        option.value = barOption
        option.value.xAxis.data = data.xData
        option.value.series[0].data = data.data
        // option.value.title.text = '单位：' + data.value
        // option.value.tooltip.formatter = '{b0}:{c0} ' + data.value
        break
      case 'pie':
        option.value = pieCardOption
        option.value.series[0].data = data.data
        option.value.series[1].data = data.data
        // option.value.tooltip.formatter = '{b0}:{c0} ' + data.value
        break
    }
  }
}
onMounted(() => {
  initData()
})
</script>
<style lang="scss" scoped>
.card-container {
  width: 100%;
  height: 100%;
  background: url('/@/assets/images/search/card-bg.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  padding: 24px;
  position: relative;
  //专题
  .type_3 {
    width: 62px;
    height: 26px;
    background: url('/@/assets/images/search/type_3.svg') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 20px;
    right: 0;
  }
  //指标
  .type_5 {
    width: 62px;
    height: 26px;
    background: url('/@/assets/images/search/type_5.svg') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 20px;
    right: 0;
  }
  .chart-container {
    width: 251px;
    height: 146px;
    flex-shrink: 0;
    margin-right: 24px;
  }
  .default-5 {
    width: 203px;
    height: 150px;
    flex-shrink: 0;
    margin-right: 24px;
    background: url('/@/assets/images/search/default-chart.png') no-repeat;
    background-size: 100% 100%;
  }
  .default-3 {
    width: 203px;
    height: 150px;
    flex-shrink: 0;
    margin-right: 24px;
    background: url('/@/assets/images/search/default-subject.png') no-repeat;
    background-size: 100% 100%;
  }
  .detail {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 24px;
    :deep() {
      .tooltip-wrap {
        height: 24px;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 24px;
        padding-right: 40px;
      }
    }
    .desc {
      @include ellipsis(2);
    }
  }
}
</style>
