<template>
  <div class="index-list">
    <div
      v-for="item in list"
      :key="item.indexId"
      :class="['item', item.indexId == activeItem.indexId ? 'active' : '']"
      @click="activeItem = item"
    >
      <TextTooltip :text="item.indexContent" />
    </div>
  </div>

  <div class="chart-container" v-loading="!showChart">
    <small-title :title-name="activeItem.indexContent">
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
        /></el-select>
      </div>
    </small-title>
    <Echarts :option="option" height="156px" v-if="showChart" />
  </div>
</template>
<script lang="ts" setup>
// import echarts from '/@/utils/lib/echarts'
import { PropType } from 'vue'
import moduleSrv from '/@/api/index'
import { barOption, lineOption } from './useOptions'
import { pieOption } from './useOptions'
import echarts from '/@/utils/lib/echarts'

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
        option.value.series[1].data = data
        option.value.legend.data = data.map((e: any) => e.name)
        option.value.legend.formatter = function (name: any) {
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
            echarts.format.truncateText(name, 140, '14px Microsoft Yahei', '…', {}) +
            '  ' +
            percent +
            '%'
          )
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
.index-list {
  margin: 8px 0 16px 0;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #044f7c;

  .item {
    cursor: pointer;
    height: 34px;
    margin-bottom: 8px;
    padding: 6px 20px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;

    &:first-child {
      margin-top: 8px;
    }
  }

  .item:hover,
  .active {
    color: #fff8b4;
    background: rgba(255, 255, 255, 0.06);
  }
}

.chart-container {
  position: relative;
  margin-bottom: 14px;
  height: 196px;
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
</style>
<style lang="scss">
.my-select {
  max-width: 200px;

  .el-select-dropdown__item {
    max-width: 198px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.el-select__popper.el-popper[role='tooltip'] {
  background: #06124f;
  box-shadow: none;
  border: 1px solid #044f7c;

  .el-select-dropdown__item {
    background: #06124f;
    color: #ffffff;
  }
}
</style>
