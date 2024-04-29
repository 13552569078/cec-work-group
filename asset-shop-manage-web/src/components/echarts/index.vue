<!--
 * @Descripttion: echarts图表渲染组件
 * @Author: 丁利
 * @Date: 2022-5-13
-->
<template>
  <div class="echarts-box-wrapper">
    <div
      v-if="showIt"
      class="echarts-box"
    />
  </div>
</template>
<script>
const echarts = require('echarts')
import { bus } from '@/utils'
export default {
  name: 'ChartBox',
  props: {
    chartOption: {
      type: Object,
      default: () => {
        return null
      }
    },
    noData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myChart: null,
      showIt: true
    }
  },
  computed: {
  },
  watch: {
    chartOption(val) {
      if (this.$el && val) {
        this.init(this.$el.querySelector('.echarts-box'), val)
      }
    }
  },
  mounted() {
    bus.$on('page-resize', this.resize)
  },
  beforeDestroy() {
    bus.$off('page-resize', this.resize)
  },
  methods: {
    init(el, option) {
      if (this.myChart) {
        this.myChart.setOption(option)
        return
      }
      this.myChart = echarts.init(el)
      // 绘制图表
      this.myChart.setOption(option)
      this.myChart.on('click', (params) => {
        this.$emit('chartClick', params)
      })
    },
    resize() {
      console.log('0000')
      if (this.noData) return
      this.showIt = false
      this.myChart = null
      this.$nextTick(() => {
        this.showIt = true
        this.$nextTick(() => {
          this.init(this.$el.querySelector('.echarts-box'), this.chartOption)
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.echarts-box-wrapper, .echarts-box {
  width: 100%;
  height: 100%;
}
</style>
