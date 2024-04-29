<template>
  <div class="home-box">
    <div class="home-top">
      <div class="home-top-left">
        <div class="app-wrap">
          <div class="title-box">
            <div class="title">应用总览</div>
          </div>
          <div class="content">
            <div class="top">
              <div class="blue-card card">
                <div class="num-box">
                  <div class="info">应用总数</div>
                  <div class="num">{{ appData.sum }}</div>
                </div>
              </div>
              <div class="card-1 card">
                <div class="">
                  <div class="info">开发中</div>
                  <div class="num">{{ appData.devCount }}</div>
                </div>
                <pie :color="'#FA8B16'" :rate="appData.devCountRate" />
              </div>
              <div class="card-2 card">
                <div class="">
                  <div class="info">已发布</div>
                  <div class="num">{{ appData.publishedCount }}</div>
                </div>
                <pie :color="'#4CC09E'" :rate="appData.publishedCountRate" />
              </div>
              <div class="card-3 card">
                <div class="">
                  <div class="info">已部署</div>
                  <div class="num">{{ appData.deployedCount }}</div>
                </div>
                <pie :color="'#4A72E5'" :rate="appData.deployedCountRate" />
              </div>
            </div>
            <!-- <div id="echart1" class="echart1">
            </div> -->
          </div>
        </div>
        <div class="asset-wrap">
          <div class="title-box">
            <div class="title">组件资源总览</div>
          </div>
          <div class="content">
            <div class="blue-card card">
              <div class="num-box">
                <div class="info">组件总数</div>
                <div class="num">{{ assetOverview.sum }}</div>
              </div>
            </div>
            <div class="asset-types-wrap">
              <div v-for="(d, i) in assetOverview.list" :key="i" class="asset-types-item">
                <!-- <i :class="`icon`"></i> -->
                <span class="label">{{ d.label }}</span>
                <span class="num">{{ d.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-top-right">
        <div class="title-box">
          <div class="title">应用场景分类排行</div>
        </div>
        <div class="content">
          <div v-for="item,i in list" :key="item.label+i" class="list-item">
            <i v-if="getIconClass(i)" class="icon" :class="getIconClass(i)"></i>
            <i v-else class="icon">{{ i+1 }}</i>
            <i class="name">{{ item.label }}</i>
            <c-progress class="progress" :show-text="false" :percentage="item.percentage"
                        :color="item.color"></c-progress>
            <i class="num">{{ item.num }}</i>

          </div>
        </div>

      </div>
    </div>
    <div class="home-bottom">
      <latest v-if="show"></latest>
      <resources v-if="show"></resources>
    </div>
  </div>
</template>

<script>
import pie from '../components/pie-echarts.vue'
import { Resources, Latest } from './components';
import * as echart from 'echarts'
import { overviewApp, overviewAsset } from '@/api'
export default {
  components: { pie, Resources, Latest },
  data() {
    return {
      sceneColors: ['#FF4D4F', '#FA8B16', '#36A4FF'],
      list: [],
      appData: {
        sum: 0,
        devCount: 0,
        devCountRate: 0,
        publishedCount: 0,
        publishedCountRate: 0,
        deployedCount: 0,
        deployedCountRate: 0
      },
      show: true,
      assetOverview: {
        sum: 0,
        list: [
          { label: '流程资源', count: 0, type: '5' },
          { label: '对象资源', count: 0, type: '3' },
          { label: '数据资源', count: 0, type: '1' },
          { label: '技术资源', count: 0, type: '2' },
          { label: '模型资源', count: 0, type: '7' }
        ]
      }
    }
  },
  mounted() {
    this.getAppData()
    this.getAssetData()
    // this.setEchart1()
  },
  destroyed() {
    this.show = false
  },
  methods: {
    async getAppData() {
      try {
        const { data } = await overviewApp()
        const appData = {
          sum: 0,
          devCount: data.devCount || 0,
          devCountRate: 0,
          publishedCount: data.publishedCount || 0,
          publishedCountRate: 0,
          deployedCount: data.deployedCount || 0,
          deployedCountRate: 0
        }
        appData.sum = appData.devCount + appData.publishedCount + appData.deployedCount
        appData.devCountRate = appData.sum ? Math.round(appData.devCount * 100 / appData.sum) : 0
        appData.publishedCountRate = appData.sum ? Math.round(appData.publishedCount * 100 / appData.sum) : 0
        appData.deployedCountRate = appData.sum ? 100 - appData.devCountRate - appData.publishedCountRate : 0
        this.appData = appData
        let sum = 0
        data.sceneList.map(d => (sum += (d.appCount || 0)))
        const list = data.sceneList.map((d, i) => {
          const num = +(d.appCount || 0)
          const percentage = Math.round(num * 100 / sum)
          return { ...d, label: d.sceneName || '', num, color: this.sceneColors[i] || '#36A4FF', percentage }
        });
        this.list = list
      } catch (e) {
        this.appData = {
          sum: 0,
          devCount: 0,
          devCountRate: 0,
          publishedCount: 0,
          publishedCountRate: 0,
          deployedCount: 0,
          deployedCountRate: 0
        }
        console.error(e)
      }
    },
    async getAssetData() {
      try {
        const { data } = await overviewAsset()
        let sum = 0
        const list = this.assetOverview.list.map((d, i) => {
          const item = data.find(dd => +d.type === +dd.assetType)
          const count = item ? +(item.assetCount || 0) : 0
          sum += count
          return { ...d, count }
        });
        this.assetOverview = { sum, list }
      } catch (e) {
        this.assetOverview = {
          sum: 0,
          list: [
            { label: '流程资源', count: 0, type: '5' },
            { label: '对象资源', count: 0, type: '3' },
            { label: '数据资源', count: 0, type: '1' },
            { label: '技术资源', count: 0, type: '2' },
            { label: '模型资源', count: 0, type: '7' }
          ]
        }
        console.error(e)
      }
    },
    getIconClass(i) {
      let cl = ''
      switch (i) {
        case 0:
          cl = 'top1'
          break;
        case 1:
          cl = 'top2'

          break;
        case 2:
          cl = 'top3'

          break;

        default:
          break;
      }
      return cl
    },
    setEchart1() {
      const option = {
        grid: {
          left: 50,
          right: 10,
          top: 30,
          bottom: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          extraCssText: 'border-radius: 0;',
          formatter: (params) => `
          <div style="backgroundColor:#fff;borderRaduis:0">
            ${params[0].marker}
            <span>${params[0].axisValue} <span style="font-weight: bold; margin-left: 30px">${params[0].value}</span></span>
          </div>
          `
        },
        xAxis: {
          type: 'category',

          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'],
          axisLine: {
            lineStyle: {
              color: '#EDEDED'
            }
          },
          axisLabel: {
            color: '#8A8A8A'
          }
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [{
          data: [2, 3, 5, 7, 9, 11, 12, 14, 17, 20],
          symbolSize: 0,
          type: 'line',
          smooth: true,
          lineStyle: { color: '#6200EE' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(98,0,238,0.24)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(98,0,238,0.00)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }]
      };
      echart.init(document.getElementById('echart1')).setOption(option, true);
    }
  }
}
</script>

<style lang="scss" scoped>
.home-box {
  width: 1616px;
  .home-top {
    display: flex;
    align-items: flex-start;
    height: 496px;
    .home-top-left {
      width: 1136px;
      height: 100%;
      padding: 0;
      .content {
        .top {
          display: flex;
          justify-content: space-between;
          // margin-bottom: 32px;
        }
        .card {
          height: 142px;
          width: 242.67px;
          border-radius: 4px;
          box-shadow: 0px 4px 16px 0px rgba(41, 48, 64, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          .info {
            font-size: 14px;
            color: #8a8a8a;
            margin-bottom: 16px;
          }
          .num {
            font-size: 24px;
            font-weight: 500;
          }
        }
        .blue-card {
          width: 300px;
          background: url(~@/assets/imgs/bg-blue-card.png) no-repeat;
          background-size: 100%;
          .num-box {
            margin: 0px 0 0 76px;
            .info {
              font-size: 16px;
              font-weight: 500;
              line-height: 19px;

              color: #ffffff;
              margin-bottom: 6px;
            }
            .num {
              font-size: 24px;
              font-weight: 500;
              line-height: 32px;

              color: #ffffff;
            }
          }
        }
        .card-1 {
          border-width: 0px 0px 0px 4px;
          border-style: solid;
          border-color: #FDD493;
          .num {
            font-size: 24px;
            font-weight: 500;
            color: #FA8B16;
          }
        }
        .card-2 {
          border-width: 0px 0px 0px 4px;
          border-style: solid;
          border-color: #A8E6DA;
          .num {
            font-size: 24px;
            font-weight: 500;
            color: #4CC09E;
          }
        }
        .card-3 {
          border-width: 0px 0px 0px 4px;
          border-style: solid;
          border-color: #AAB6F5;
          .num {
            font-size: 24px;
            font-weight: 500;
            color: #4A72E5;
          }
        }
        .echart1 {
          height: 240px;
          width: 1088px;
        }
      }
      .app-wrap {
        margin-bottom: 20px;
        padding-left: 24px;
        padding-right: 24px;
        padding-bottom: 24px;
        background: #ffffff;
      }
      .asset-wrap {
        padding-left: 24px;
        padding-right: 24px;
        padding-bottom: 24px;
        background: #ffffff;
        .content {
          display: flex;
          .card.blue-card {
            height: 142px;
            flex-shrink: 0;
            background: url(~@/assets/imgs/bg-purple-card.png) no-repeat;
            background-size: 100%;
          }
        }
      }
      .asset-types-wrap {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        padding-left: 4px;
        .asset-types-item {
          display: flex;
          align-items: center;
          width: 245px;
          height: 64px;
          padding: 0 16px;
          line-height: 64px;
          margin-left: 16px;
          background: #F6F9FB;
          .icon {
            margin-right: 12px;
            width: 24px;
            height: 24px;
            background: url(~@/assets/imgs/asset-icon-1.png) no-repeat;
            background-size: 100% 100%;
          }
          .label {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            font-weight: 500;
            color: #202020;
          }
          .num {
            flex: 1;
            text-align: right;
            font-family: PingFangSC-Medium;
            font-size: 24px;
            font-weight: 500;
            color: #4b4b4b;
          }
        }
      }
    }
    .home-top-right {
      display: flex;
      flex-direction: column;
      width: 460px;
      height: 100%;
      padding: 0 0 24px 24px;
      background: #ffffff;
      margin-left: 20px;
      .title-box {
        flex-shrink: 0;
      }
      .content {
        flex: 1;
        overflow: hidden auto;
      }
      .list-item {
        width: 412px;
        height: 50px;
        border-radius: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .progress {
          width: 220px;
        }
        .name {
          width: 80px;
          height: 22px;

          /* 文本样式/md */
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: normal;
          line-height: 22px;
        }
        .icon {
          font-family: Impact;
          font-size: 12px;
          font-weight: normal;
          line-height: 14px;
          text-align: justify; /* 浏览器可能不支持 */
          letter-spacing: 0px;
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          /* 文本色/text-light */
          color: #bdbdbd;
        }
        .top1 {
          background: url(~@/assets/imgs/1.png) no-repeat;
          background-size: 100%;
          width: 24px;
          height: 24px;
        }
        .top2 {
          background: url(~@/assets/imgs/2.png) no-repeat;
          background-size: 100%;
          width: 24px;
          height: 24px;
        }
        .top3 {
          background: url(~@/assets/imgs/3.png) no-repeat;
          background-size: 100%;
          width: 24px;
          height: 24px;
        }
        .num {
          width: 17px;
          height: 24px;

          /* 文本样式/lg-bold */
          font-family: PingFangSC-Medium;
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0em;

          /* 文本色/text-regular */
          color: #4b4b4b;
        }
      }
    }
  }
  .home-bottom {
    display: flex;
    height: 679px;
    margin-top: 20px;
  }
}
.title-box {
  display: flex;
  height: 72px;
  align-items: center;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
    color: #202020;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: block;
      width: 5px;
      height: 18px;
      margin-right: 15px;
      background: #36a4ff;
    }
  }
}
</style>
