
<!--
 * @Description:资源关系图
 * @Author: liu lianpeng
 * @Date: 2021-08-27
-->
<template>
  <div class="relation-wrap">
    <div class="tab">
      <c-tabs v-model="activeName" type="box">
        <c-tab-pane label="关联应用资源" name="1"></c-tab-pane>
        <c-tab-pane label="未关联应用资源" name="2"></c-tab-pane>
      </c-tabs>
      <c-tooltip placement="right" popper-class="cls-form-label-tip">
        <span slot="content" class="hahah" v-html="'关联应用资源展示已在导航设计中编排的资源；<br/>左击【资源】可展开/折叠所引用的资源，<br/>右击可打开资源的详情页。'">
        </span>
        <i class="cls-icon-info"></i>
      </c-tooltip>
    </div>
    <div id="relationChart" ref="relationChart" class="relationChart" :class="{hide:activeName!=1}"></div>
    <div id="relationChart2" ref="relationChart2" class="relationChart" :class="{hide:activeName!=2}"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import { appRelationGraph, checkNav, getByBasicInfo, getByBizCode } from '@/api/index';
import { goDetail } from '@/utils';

export default {
  name: 'RelationChart',
  props: {
    currApp: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: '1',
      relationChart: null,
      relationChart2: null,
      chartData: [],
      chartLinks: []
    }
  },
  watch: {
    activeName() {}
  },
  mounted() {
    document.oncontextmenu = function() { return false; }
    if (this.relationChart == null) {
      this.relationChart = echarts.init(this.$refs.relationChart);
      this.relationChart2 = echarts.init(this.$refs.relationChart2);
    } else {
      this.relationChart.clear()
      this.relationChart2.clear()
    }
    this.$nextTick(() => {
      if (this.relationChart) { this.initRelationChart(this.currApp) }
    })
  },
  methods: {
    init() {
    },
    handleClose() {
      this.close();
    },
    close() {
      this.$emit('closeDialog')
    },
    async initRelationChart(appData) {
      const params = {
        code: appData.appCode,
        version: appData.version
      }
      const res = await appRelationGraph(params);
      if (res.code === 0) {
        const firstData = res.data.relationTree
        const secendData = { name: '未关联应用资源', children: res.data.unRelationTreeList }
        this.formatterData(firstData);
        this.formatterData(secendData);

        this.relationChart.setOption(this.initOption(firstData), true);
        this.relationChart2.setOption(this.initOption(secendData), true);
        this.relationChart.on('contextmenu', this.nodeClick)
        this.relationChart2.on('contextmenu', this.nodeClick)
      }
    },
    nodeClick(e) {
      e.data.assetId = e.data.id
      const nodeType = e.data.nodeType || ''
      switch (nodeType) {
        case 1:
        case 2:
        // 跳转应用预览
          checkNav({
            appCode: this.currApp.appCode,
            version: this.currApp.version
          }).then(res => {
            console.log(res, 'result')
            if (res.data.result === 0) {
              this.$message.error('此应用尚未配置导航！');
              return
            }
            if (window.__systemConfig && window.__systemConfig.platformUrl) {
              const openUrl = `${window.__systemConfig.platformUrl}lowcode-engine/app/index?appVersion=${this.currApp.version}&appCode=${this.currApp.appCode}&appName=${this.currApp.appName}`
              window.open(openUrl)
            } else {
              this.$message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
            }
          })

          break;
        case 3:
          // 跳转资源详情 注意订阅资产要跳转到商城
          this.goDetailAsset(e.data)
          break;
        default:
          // 应用自己
          break;
      }
    },
    goDetailAsset(data) {
      switch (data.referType) {
        case 1: // 引用
          goDetail(data)
          break;
        case 2: // 订阅
          this.goDetail2(data)
          break;

        default:
          break;
      }
    },
    goDetail2(row) {
      console.log(row, 'row')
      if (row.subtype + '' === '27') {
        getByBasicInfo({
          shopCode: row.bizKey,
          packVersion: row.version
        }).then(res => {
          if (res.code === 1404) {
            this.$message.error('订阅资源不存在！')
          } else {
            this.downloadOpen(res.data)
          }
        })
        return
      }
      getByBizCode({
        bizCode: row.bizCode
      }).then(res => {
        if (res.code === 1404) {
          this.$message.error('订阅资源不存在！')
        } else {
          this.downloadOpen(res.data)
        }
      })
    },
    downloadOpen(row) {
      console.log(row)
      if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
        const params = {
          shopCode: row.shopCode,
          packVersion: row.packVersion,
          packVersionId: row.packVersionId,
          assetType: row.subtype || row.assetSubtype
        }
        window.open(`${window.__systemConfig.assetShopUrl}home/snapshoot?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`)
      } else {
        this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
      }
    },
    getType(subtype) {
      let res = ''
      switch (subtype) {
        case 51: // 业务流程
          res = '流程'
          break;
        case 31:// 实体对象
          res = '对象'
          break;
        case 11:// 指标
          res = '指标'
          break;
        case 13:// 数据
          res = '数据'
          break;
        case 72:// 模型
          res = '模型'
          break;
        case 14:// 模型
          res = '体征'
          break;
        case 22:// 接口
          res = '接口'
          break;
        case 23:// 页面
          res = '页面'
          break;
        case 26:// 页面
          res = '脚本'
          break;

        default:

          break;
      }
      return res
    },
    formatterData(data) {
      data.name = (this.getType(data.subtype) ? this.getType(data.subtype) + '：' : '') + data.name + ' ' + (data.version || '')
      // data.itemStyle = data.subtype === 26 ? { color: 'red' } : {}
      data.itemStyle = data.referVersionStatus === 2 ? { color: '#36A4FF' } : data.referVersionStatus === 3 ? { color: '#FF4D4F' } : {}
      if (data.children && data.children.length) {
        for (let index = 0; index < data.children.length; index++) {
          const element = data.children[index];
          this.formatterData(element)
        }
      }
    },
    initOption(data) {
      const option = {
        tooltip: {
          trigger: 'item',
          // show: false,
          // formatter:rs=>{
          //     console.log(rs)
          //     return
          // },
          triggerOn: 'mousemove'
        },

        series: [
          {
            type: 'tree',
            roam: true, // 是否开启平游或缩放

            data: [data],

            selectedMode: 'single',
            top: '32px',
            left: '13%',
            bottom: '32px',
            right: '20%',

            symbolSize: 10,
            emphasis: {
              color: '#fff'
            },
            itemStyle: {
              color: '#36A4FF',
              borderColor: '#36A4FF'
            },
            // lineStyle: {
            //   color: '#36A4FF',
            //   curveness: 0.5
            // },

            label: {
              formatter: rs => {
                return rs.name
              },
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 14,
              fontWeight: 500,
              color: '#4B4B4B',
              lineHeight: 20
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }

            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
      return option;
    }
  }
}
</script>
<style lang="scss" scoped>
.relation-wrap {
  position: relative;
  height: 1000px;
  background: #fff;
  overflow: hidden;
  .tab {
    padding: 20px;
    display: flex;
    align-items: center;
    .c-tabs {
      margin-right: 16px;
    }
  }
  .relationChart {
    width: 100%;
    position: absolute;
    left: 0;
    top: 52px;
  }
  .hide {
    left: 99999px;
    top: 99999px;
  }
  ::v-deep.c-tabs{
    .c-tabs__header {
      margin: 0;
    }
    .c-tabs__content {
      display: none;
    }
  }
}
#relationChart{
  // width: 686px;
  height: 1000px;
  background: #fff;
}
#relationChart2{
  // width: 686px;
  height: 1000px;
  background: #fff;
}
</style>
<style>
</style>
