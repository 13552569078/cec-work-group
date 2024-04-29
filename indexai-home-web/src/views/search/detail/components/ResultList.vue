<template>
  <div class="result-list">
    <div class="chart-container" v-loading="!showChart">
      <small-title :title-name="activeItem.content">
        <div class="select-container" v-if="hasOptions">
          <el-select
            v-model="selectiveValue"
            @change="handleSelect"
            :popper-append-to-body="false"
            popper-class="my-select"
          >
            <el-option
              v-for="item in selectList"
              :key="item"
              :label="item"
              :value="item"
              :title="item"
          /></el-select></div
      ></small-title>
      <Echarts :option="option" height="312px" v-if="showChart" class="echart" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import echarts from '/@/utils/lib/echarts'
import { PropType } from 'vue'
import moduleSrv from '/@/api/index'
import { barOption, lineOption, pieOption } from './useOptions'

const props = defineProps({
  list: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  value: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['update:value'])
const activeItem = computed({
  get: () => {
    return props.value
  },
  set: (val) => {
    emit('update:value', val)
  }
})

const selectiveValue = ref('')
const hasOptions = ref(false)
const selectList = ref([]) as any
const option = ref({}) as any
const showChart = ref(true)
const searchIndexDetail = async () => {
  option.value = {}
  hasOptions.value = false
  showChart.value = false
  const res = await moduleSrv.searchIndexDetail({
    indexId: props.value.indexId,
    selectiveValue: ''
  })
  if (res.data) {
    showChart.value = true
    hasOptions.value = res.data.hasOptions
    selectList.value = res.data.options || []
    selectiveValue.value = selectList.value[0]

    const xData = res.data.xData
    const data = res.data.data
    switch (res.data.type) {
      case 'line':
        option.value = lineOption
        option.value.xAxis.data = xData
        option.value.series[0].data = data
        // option.value.title.text = '单位：' + res.data.value
        // option.value.tooltip.formatter = '{b0}:{c0} ' + res.data.value
        break
      case 'bar':
        option.value = barOption
        option.value.xAxis.data = xData
        option.value.series[0].data = data
        // option.value.title.text = '单位：' + res.data.value
        // option.value.tooltip.formatter = '{b0}:{c0} ' + res.data.value
        break
      case 'pie':
        option.value = pieOption
        option.value.series[0].data = data
        option.value.series[0].center = ['25%', '50%']
        option.value.series[1].data = data
        option.value.series[1].center = ['25%', '50%']
        option.value.legend = {
          icon: 'circle',
          type: 'scroll',
          orient: 'vertical',
          left: '50%',
          top: '10%',
          bottom: '10%',
          textStyle: { color: '#ffffff' },
          pageIconColor: '#06124f',
          pageIconInactiveColor: '#06124f',
          pageTextStyle: {
            color: '#ffffff'
          },
          data: data.map((e: any) => e.name),
          tooltip: {
            show: true
          },
          formatter: function (name: any) {
            let total = 0
            let targetValue
            for (let i = 0; i < data.length; i++) {
              total += data[i].value
              if (data[i].name === name) {
                targetValue = data[i].value
              }
            }
            const percent = ((targetValue / total) * 100).toFixed(2)

            return (
              echarts.format.truncateText(name, 180, '14px Microsoft Yahei', '…', {}) +
              '  ' +
              percent +
              '%'
            )
          }
        }
        // option.value.tooltip.formatter = '{b0}:{c0} ' + res.data.value
        break
    }
  }
}

const handleSelect = async () => {
  const res = await moduleSrv.searchIndexDetail({
    indexId: props.value.indexId,
    selectiveValue: selectiveValue.value
  })
  if (res.data) {
    option.value.xAxis.data = res.data.xData
    option.value.series[0].data = res.data.data
  }
}

watch(
  () => props.value,
  () => {
    searchIndexDetail()
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.result-list {
  width: 496px;
  .chart-container {
    width: 496px;
    height: 312px;
    position: relative;
    margin-bottom: 14px;
  }
  .echart {
    width: 496px;
    height: 312px;
    background: rgba(255, 255, 255, 0.06);
  }

  :deep() {
    .el-select {
      &:hover,
      &:active {
        .el-input__wrapper {
          border: 1px solid #044f7c;
          box-shadow: none !important;
        }
      }
    }
    .el-select .el-input.is-focus .el-input__wrapper,
    .el-select .el-input__wrapper.is-focus {
      box-shadow: none !important;
    }
    .el-input__wrapper {
      width: 94px;
      height: 28px;
      background: #06124f;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      border: 1px solid #044f7c;
      box-shadow: none;
    }
    .el-input__inner {
      height: 28px;
      font-size: 14px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      &:hover,
      &:active {
        border: none;
        box-shadow: none;
      }
    }
    .el-select .el-input__suffix {
      border: none;
      background: #06124f;
      width: 27px;
      height: 26px;
      top: 0;
      &:hover {
        border: none;
      }
    }
  }
}
</style>
