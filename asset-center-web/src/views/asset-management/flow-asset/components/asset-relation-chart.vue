
<!--
 * @Description:资源关系图
 * @Author: liu lianpeng
 * @Date: 2021-08-27
-->
<template>
  <div id="relationChart" ref="relationChart"></div>
</template>
<script>
import * as echarts from 'echarts';
import { assetRelation } from '@/api/index';
export default {
  name: 'RelationChart',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    assetData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      relationChart: null,
      defaultType: 0,
      dataArr: [
        { label: '数据资源', value: 1, color: '#FFC255' },
        { label: '技术资源', value: 2, color: '#F978A0' },
        { label: '对象资源', value: 3, color: '#4D7CFE' },
        { label: '数据', value: 4, color: '#5FC8C0' },
        { label: '流程资源', value: 5, color: '#A786FB' }
      ],
      chartData: [],
      chartLinks: []
    }
  },
  mounted() {
    this.initRelationChart(this.assetData)
  },
  methods: {
    handleClose() {
      this.close();
    },
    close() {
      this.$emit('closeDialog')
    },
    async initRelationChart(assetData) {
      console.log(assetData, 'assetData')
      const params = {
        assetId: assetData.id,
        assetType: assetData.assetType || 3
      }
      let defaultObj = {}
      this.defaultType = assetData.assetType
      this.dataArr.forEach(item => {
        if (item.value + '' === '' + this.defaultType) {
          defaultObj = { assetId: assetData.assetId, subType: assetData.subType, assetName: assetData.assetName, assetType: this.defaultType, symbolSize: 100 }
        }
      })
      const res = await assetRelation(params);
      if (res.code === 0) {
        let data = res.data.usedAssetList;
        if (!Array.isArray(data)) {
          data = []
        }
        data.forEach(item => {
          item.symbolSize = 60
        })
        data.unshift(defaultObj)
        data.forEach(item => {
          item.name = item.assetName;
          item.category = item.assetType - 1
        })
        this.chartData = data
        if (this.chartData.length > 1) {
          for (var i = 0; i < this.chartData.length - 1; i++) {
            this.chartLinks[i] = { source: this.chartData[i + 1].name, target: this.chartData[0].name, name: '' }
          }
        }
        if (this.relationChart == null) {
          this.relationChart = echarts.init(document.getElementById('relationChart'));
        } else {
          this.relationChart.clear()
        }
        var categories = []; var colors = [];
        for (let i = 0; i < this.dataArr.length; i++) {
          categories[i] = {
            name: this.dataArr[i].label
          };
          colors[i] = this.dataArr[i].color
        }
        this.relationChart.setOption(this.initOption(colors, categories, this.chartData, this.chartLinks), true);
        const chartBox = this.$refs.relationChart;
        chartBox.oncontextmenu = function () { return false; }; // 阻止浏览器指定区域的右键默认事件
        this.relationChart.off('click');
        this.relationChart.off('contextmenu');
        this.relationChart.on('click', (param) => {
          if (param.data.assetId + '' !== '' + assetData.assetId) {
            this.initRelationChart(param.data)
          } else {
            return false
          }
        })
        this.relationChart.on('contextmenu', (param) => {
          this.$emit('detail', param.data);
        })
      }
    },
    initOption(colors, categories, chartData, chartLinks) {
      const option = {
        tooltip: {
          formatter: function (x) {
            return x.data.name;
          }
        },
        color: colors,
        legend: [{
          data: categories.map(function (a) {
            return a.name;
          }),
          itemHeight: 8,
          itemWidth: 8
        }],
        series: [{
          type: 'graph',
          layout: 'force',
          symbolSize: 40,
          roam: true,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [2, 10],
          force: {
            repulsion: 2500,
            edgeLength: [10, 50]
          },
          draggable: true,
          lineStyle: {
            normal: {
              width: 2,
              color: '#4b565b'
            }
          },
          edgeLabel: {
            normal: {
              show: true,
              formatter: function (x) {
                return x.data.name;
              }
            }
          },
          label: {
            normal: {
              show: true,
              textStyle: {}
            }
          },
          data: chartData,
          links: chartLinks,
          categories: categories
        }]
      };
      return option;
    }
  }
}
</script>
<style lang="scss" scoped>
#relationChart{
  // width: 686px;
  height: 524px;
}
</style>
<style>
</style>
