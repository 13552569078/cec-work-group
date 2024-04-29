<!--/*
* @Author: dingli
* @Desc: 排行榜
* @Date:
*/-->
<template>
  <div class="sort-wrap">
    <h3 class="info-title">{{ title }}</h3>
    <span class="btn-radio">
      <span class="btn-radio-item" :class="{active:timeFlag==6}" @click="clickTab(6)">近7天</span>
      <span class="btn-radio-item" :class="{active:timeFlag==29}" @click="clickTab(29)">总榜</span>
    </span>
    <ul class="list-wrap">
      <li v-for="(d, i) in list" :key="d.shopCode" :data-index="i+1" class="list-item" :class="`list-item-${i+1}`">
        <p class="name" @click="clickName(d)">{{ d.packName }}</p>
        <p class="value">
          <span>{{ type=='asset'?d.assetName:d.sceneName }}</span>
          <span>下载次数<span class="num">{{ d.downloadCount }}</span></span>
        </p>
      </li>
    </ul>
    <empty v-if="!(list&&list.length)" text="暂无数据" type="no-data" style="height:500px;width:340px;margin:0 auto;" />
  </div>
</template>
<script>
import moment from 'moment-cn'
import { getProxyUrl } from '@/api/service-suffix.js'
import { referAssetTypeObj, ASSET_SUBTYPE } from '@/views/statistics/enumerate.js'
import { queryTopAnalysis } from '@/api/statistics'
import empty from '@l/components/empty'
export default {
  name: 'Sort',
  components: { empty },
  props: {
    type: {
      type: String,
      default: 'asset'
    }
  },
  data() {
    return {
      PREVIEW_URL: getProxyUrl('fdfs_preview_prefix') + '/',
      timeFlag: 6,
      list: [],
      referAssetTypeObj, ASSET_SUBTYPE
    }
  },
  computed: {
    title() {
      if (this.type === 'asset') {
        return '资源下载排行榜'
      }
      return '应用下载排行榜'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    assetNameFilter(item) {
      if (+item.assetType === 7 || +item.assetType === 5) {
        return this.referAssetTypeObj[item.assetType]
      }
      return `${this.referAssetTypeObj[item.assetType]}-${this.ASSET_SUBTYPE[item.assetSubtype]}`
    },
    clickTab(v) {
      this.timeFlag = v
      this.getData()
    },
    clickName(item) {
      const base = location.origin
      const query = {
        shopCode: item.shopCode,
        packVersionId: item.packVersionId,
        packVersion: item.packVersion
      }
      let url = `${base}/asset_shop_web/#/home/snapshoot`
      if (this.type === 'app') {
        url = `${base}/asset_shop_web/#/templateApp/snapshoot`
      } else {
        query.assetType = item.assetSubtype
      }
      window.open(`${url}?${Object.keys(query).map(k => k + '=' + query[k]).join('&')}`, '_blank')
    },
    async getData() {
      try {
        const params = {
          type: this.type === 'asset' ? 2 : 1
        }
        if (+this.timeFlag === 6) {
          params.startTime = moment().subtract('days', 6).format('YYYY-MM-DD') + ' 00:00:00'
          params.endTime = moment().format('YYYY-MM-DD') + ' 23:59:59'
        }
        let resdata = await queryTopAnalysis(params)
        resdata = resdata.data
        this.list = resdata.map(d => ({ ...d, assetName: this.assetNameFilter(d) }))
      } catch (e) {
        // e
      }
    }
  }
}
</script>
<style scoped lang="scss">
.sort-wrap {
  position: relative;
  min-width: 456px;
  padding-bottom: 40px;
  background: #FFFFFF;
  font-size: 14px;
}
.info-title {
  padding-top: 20px;
  margin-left: 20px;
}
.btn-radio {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
}
.list-wrap {
  margin-top: 38px;
  margin-left: 36px;
  max-height: 934px;
  overflow-y: auto;
}
.list-item {
  margin-right: 34px;
  position: relative;
  height: 90px;
  padding-left: 36px;
  border-bottom: 1px solid #EDEDED;
  &::before {
    content: attr(data-index);
    position: absolute;
    top: 18px;
    left: 8px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: #8A8A8A;
  }
  .name {
    padding-top: 16px;
    margin-bottom: 8px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    font-size: 16px;
    color: #202020;
    cursor: pointer;
  }
  .value {
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8A8A8A;
    .num {
      margin-left: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4B4B4B;
    }
  }
}
.list-item-1, .list-item-2, .list-item-3 {
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    left: 0px;
    top: 12px;
  }
}
.list-item-1 {
  border-top: none;
}
.list-item-1::before {
  background: url(~@/assets/img/top1.png) no-repeat center;
  background-size: 100%;
}
.list-item-2::before {
  background: url(~@/assets/img/top2.png) no-repeat center;
  background-size: 100%;
}
.list-item-3::before {
  background: url(~@/assets/img/top3.png) no-repeat center;
  background-size: 100%;
}
</style>
