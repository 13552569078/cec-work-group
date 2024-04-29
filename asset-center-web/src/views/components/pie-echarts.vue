<template>
  <div class="pie-box">
    <div ref="pie" class="pie"></div>
    <div class="pie-num">{{ rate }}%</div>
  </div>
</template>

<script>
import * as echart from 'echarts'
export default {
  props: {
    rate: Number,
    color: String
  },
  watch: {
    rate(nv, ov) {
      if (nv !== ov) {
        this.setEchart()
      }
    }
  },
  mounted() {
    this.setEchart()
  },
  methods: {
    setEchart() {
      const option = {
        color: [this.color, '#EDEDED'],

        series: [
          {
            type: 'pie',
            radius: ['70%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },

            data: [
              { value: this.rate },
              { value: 100 - this.rate }

            ]
          }
        ]
      }
      echart.init(this.$refs['pie']).setOption(option, true);
    }
  }
}
</script>

<style lang="scss" scoped>
.pie-box {
  position: relative;
  .pie {
    width: 64px;
    height: 64px;
  }
  .pie-num {
    position: absolute;
    top: 23px;
    left: 18px;
    font-size: 14px;
  }
}
</style>
