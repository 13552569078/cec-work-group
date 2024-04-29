<!--/*
* @Author: dingli
* @Desc: 运营分析
* @Date: 2022-5-13
*/-->
<template>
  <div class="statistics-wrap">
    <div class="statistics">
      <shop-count ref="refShopCount" />
      <div class="mt16 flex">
        <asset-chart class="mr16 flex-item" />
        <app-chart class="flex-item" />
      </div>
      <div class="mt16">
        <scene-chart />
      </div>
      <div class="flex mt16">
        <Sort type="asset" class="mr16 flex-item" />
        <Sort type="app" class="mr16 flex-item" />
        <div class="flex-item">
          <public-chart />
          <sort-subscribe class="mt16" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ShopCount from './components/shop-count.vue'
import AssetChart from './components/asset-chart.vue'
import AppChart from './components/app-chart.vue'
import SceneChart from './components/scene-chart.vue'
import Sort from './components/sort.vue'
import PublicChart from './components/public-chart.vue'
import SortSubscribe from './components/sort-subscribe.vue'
export default {
  name: '',
  components: { ShopCount, AssetChart, AppChart, SceneChart, Sort, PublicChart, SortSubscribe },
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.mt16 {
  margin-top: 16px;
}
.mr16 {
  margin-right: 16px;
}
.flex {
  display: flex;
}
.flex-item {
  flex: 1;
  flex-shrink: 0;
}
.statistics-wrap {
  height: 100%;
  width: 100%;
  padding-top: 20px;
  background-image: url(~@/assets/page-bg.png);
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 100% 225px;
  overflow: auto;
}
.statistics {
  margin: 0 auto;
  height: 100%;
  width: 1520px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4B4B4B;
}
</style>
