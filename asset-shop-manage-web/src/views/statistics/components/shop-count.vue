<!--/*
* @Author: dingli
* @Desc: 商城总览
* @Date: 2022-5-13
*/-->
<template>
  <div class="overview-wrap">
    <div class="asset">
      <h3 class="info-title">商城总览-资源数量统计</h3>
      <div class="content-wrap">
        <div class="sum">
          <p class="title">资源总数</p>
          <p class="num">{{ (+assetSum).toLocaleString() }}</p>
          <p>
            <c-tooltip class="item" placement="top-start">
              <div slot="content">
                近7日上架资源数量<br />
                {{ get7Days() }}
              </div>
              <p class="upload"><span class="up-num">+{{ apimInfo.assetNewCount }}</span><i class="icon-up" />新上架</p>
            </c-tooltip>
          </p>
        </div>
        <div class="assets-type-wrap">
          <div v-for="(item, k) in assetInfo" :key="`assettype-${k}`" class="asset-item">
            <p class="num">{{ (+item.count).toLocaleString() }}</p>
            <p class="label">{{ item.label }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="app">
      <h3 class="info-title">商城总览-应用数量统计</h3>
      <div class="content-wrap">
        <div class="sum">
          <p class="title">应用总数</p>
          <p class="num">{{ (+appInfo.appCount).toLocaleString() }}</p>
          <p>
            <c-tooltip class="item" placement="top-start">
              <div slot="content">
                近7日上架应用数量<br />
                {{ get7Days() }}
              </div>
              <p class="upload"><span class="up-num">+{{ appInfo.appNewCount }}</span><i class="icon-up" />新上架</p>
            </c-tooltip>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment-cn'
import { queryOverview } from '@/api/statistics'
export default {
  name: 'ShopCount',
  components: {},
  props: {},
  data() {
    let assetInfo = {
      processCount: {
        label: '流程资源',
        count: 0
      },
      objectCount: {
        label: '对象资源',
        count: 0
      },
      statsCount: {
        label: '数据资源',
        count: 0
      },
      techCount: {
        label: '技术资源',
        count: 0
      },
      modelCount: {
        label: '模型资源',
        count: 0
      }
    }
    // 只部署门户+运营，过滤掉 流程/对象/页面
    if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
      assetInfo = {
        statsCount: {
          label: '数据资源',
          count: 0
        },
        techCount: {
          label: '技术资源',
          count: 0
        },
        modelCount: {
          label: '模型资源',
          count: 0
        }
      }
    }
    return {
      assetSum: 0,
      assetInfo: assetInfo,
      apimInfo: {
        apimCount: 0,
        apimNewCount: 0,
        assetNewCount: 0
      },
      appInfo: {
        appCount: 0,
        appNewCount: 0
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    get7Days() {
      return `（${moment().subtract('days', 6).format('YYYY-MM-DD')}至${moment().format('MM-DD')}）`
    },
    reset() {
      this.assetSum = 0
      const obj = {}
      Object.keys(this.assetInfo).forEach(k => {
        obj[k] = { ...this.assetInfo[k], count: 0 }
      })
      this.assetInfo = obj
      this.apimInfo = {
        apimCount: 0,
        apimNewCount: 0,
        assetNewCount: 0
      }
      this.appInfo = {
        appCount: 0,
        appNewCount: 0
      }
    },
    async getData() {
      this.reset()
      try {
        let resdata = await queryOverview()
        resdata = resdata.data
        this.appInfo = {
          appCount: resdata.appInfo.appCount || 0,
          appNewCount: resdata.appInfo.appNewCount || 0
        }
        this.apimInfo = {
          apimCount: 0,
          apimNewCount: 0,
          assetNewCount: resdata.assetInfo.assetNewCount || 0
        }
        const assetInfo = { ...this.assetInfo }
        let sum = 0
        Object.keys(assetInfo).forEach(k => {
          assetInfo[k].count = resdata.assetInfo[k] || 0
          sum += Number(assetInfo[k].count)
        })
        this.assetInfo = assetInfo
        this.assetSum = sum
      } catch (e) {
        // e
        console.log(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.info-title {
  margin-top: 20px;
  margin-bottom: 0px;
}
.overview-wrap {
  display: flex;
  justify-content: space-between;
  font-family: PingFangSC-Regular;
  font-size: 14px;
}
.content-wrap {
  display: flex;
  align-items: center;
}
.sum {
  margin-top: 20px;
  margin-bottom: 24px;
  margin-right: 20px;
  margin-left: 20px;
  padding: 20px 32px;
  width: 300px;
  height: 140px;
  color: #FFFFFF;
  .title {
    line-height: 22px;
  }
  .num {
    margin-top: 10px;
    line-height: 38px;
    font-family: PingFangSC-Medium;
    font-size: 30px;
    font-weight: 500;
  }
  .upload {
    display: flex;
    align-items: center;
    line-height: 24px;
  }
  .up-num {
    font-size: 16px;
  }
  .icon-up {
    margin-right: 8px;
    width: 12px;
    height: 12px;
    background: url(~@/assets/img/icon-up.png) no-repeat center;
    background-size: 100%;
  }
}
.assets-type-wrap {
  flex: 1;
  display: flex;
  .asset-item {
    // padding-left: 28px;
    position: relative;
    flex: 1;
    color: #8A8A8A;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 54px;
      background-color: #E4E9ED;
    }
    &:first-child{
      // padding-left: 20px;
      &::before {
        opacity: 0;
      }
    }
    .num {
      margin-bottom: 8px;
      line-height: 32px;
      color: #202020;
      font-family: PingFangSC-Medium;
      font-size: 24px;
      font-weight: 500;
    }
    .num, .label {
      width: 120px;
      margin: auto;
    }
  }
}
.app, .asset {
  padding: 0 20px;
  background-color: white;
}
.asset {
  margin-right: 20px;
  flex: 1;
}
.asset .sum {
  background: url(~@/assets/img/blue.png) no-repeat center;
  background-size: 100%;
}
.app .sum {
  background: url(~@/assets/img/green.png) no-repeat center;
  background-size: 100%;
}
</style>
