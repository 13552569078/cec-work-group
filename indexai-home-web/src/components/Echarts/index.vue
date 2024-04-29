<template>
  <div>
    <div ref="chartRef" :style="{ height, width }" v-if="hasChart"></div>
    <div v-else :style="{ height, width }"><Empty type="2" /></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref, watch } from 'vue'
import { useECharts } from '/@/hooks/web/useECharts'
import { isEmpty } from '/@/utils/is/index'
export default defineComponent({
  props: {
    width: {
      type: String as PropType<string>,
      default: '100%'
    },
    height: {
      type: String as PropType<string>,
      default: 'calc(100vh - 78px)'
    },
    option: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null)
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)
    const hasChart = ref(true)
    onMounted(() => {
      initChart()
    })
    const initChart = () => {
      if (isEmpty(props.option)) {
        hasChart.value = false
      } else {
        hasChart.value = true
        setOptions(props.option)
      }
    }
    watch(
      () => props.option,
      () => initChart(),
      {
        deep: true
      }
    )
    return { chartRef, hasChart }
  }
})
</script>
