<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="card-item" :class="{'card-item-app':item.assetType==99}" @click.prevent="clickCard(item)">
    <div class="name">{{ item.packName || '--' }}</div>
    <p class="code">资源编码 {{ item.shopCode }}</p>
    <!-- 应用不展示类型 -->
    <span v-show="item.assetType!=99" class="type">{{ typeFilter(item) }}</span>
    <div class="flex">
      <div class="version">
        <p @click.stop="clickVersion(item)"><StateLabel :version="item.packVersion" :state="item.packStatus" /></p>
      </div>
    </div>
  </div>
</template>
<script>
import { asseTypeFormatLong } from '@/utils/enum'
import StateLabel from '@/views/pack-manage/common/state-label.vue'
export default {
  name: '',
  components: { StateLabel },
  props: {
    item: [Object]
  },
  data() {
    return {}
  },
  methods: {
    typeFilter(item) {
      if (+item.assetType === 99) {
        return '应用资源'
      }
      return asseTypeFormatLong(item.assetType, item.assetSubtype)
    },
    clickCard(item) {
      this.$emit('clickCard', item)
    },
    clickVersion(item) {
      this.$emit('clickVersion', item)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.card-item {
  margin-top: 20px;
  padding: 24px 32px;
  width: calc((100% - 40px) / 3);
  height: 192px;
  box-shadow: 4px 6px 20px 0px #E8EDF5;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  background: url(~@/assets/imgs/card-bg.png) no-repeat;
  background-color: white;
  background-position: right bottom;
  &:hover {
    border: 1px solid $primaryColor;
    transform: translateY(-8px);
  }
  &.card-item-app {
    height: 168px;
  }
  .code {
    position: relative;
    color: #8A8A8A;
    line-height: 22px;
    margin-top: 16px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .name {
    width: 100%;
    line-height: 24px;
    position: relative;
    color: #4B4B4B;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
  }
  .version {
    position: relative;
    display: flex;
    margin-top: 16px;
    margin-right: 20px;
    p {
      margin-right: 20px;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .type {
    margin-top: 16px;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    padding: 0 8px;
    background: #F6F9FB;
    border-radius: 100px;
    color: #8A8A8A;
  }
}
</style>
