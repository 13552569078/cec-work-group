<!--/*
* @Author: dingli
* @Desc: 卡片
* @Date: 2022-2-16
*/-->
<template>
  <div class="cards-wrap">
    <CardItem
      v-for="item in list"
      :key="item.shopCode"
      :item="item"
      @clickVersion="clickVersion"
      @clickCard="clickCard" />
    <i v-for="i in emptyEl" :key="`emptyEl-${i}`" class="card-item card-empty" />
  </div>
</template>
<script>
import { asseTypeFormatLong } from '@/utils/enum'
import CardItem from '@/views/pack-manage/common/card-item.vue'
export default {
  name: 'Cards',
  filters: {
    typeFilter(item) {
      // 应用只显示小类
      if (+item.assetType === 99) {
        return asseTypeFormatLong('', item.assetSubtype)
      }
      return asseTypeFormatLong(item.assetType, item.assetSubtype)
    }
  },
  components: { CardItem },
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    emptyEl() {
      let n = this.list.length % 3
      n = n ? 3 - n : n
      return n
    }
  },
  methods: {
    clickCard(item) {
      let version
      if (item.packStatusList && item.packStatusList.length) {
        version = +item.packStatusList[item.packStatusList.length - 1].packStatus
      }
      this.getVersionInfo(item, version)
    },
    clickVersion(item) {
      this.getVersionInfo(item)
    },
    getVersionInfo(item, version) {
      try {
        console.log(item)
        this.$store.dispatch('publicManage/setNavlist', [])
        this.$store.dispatch('publicManage/setActiveNav', '')
        this.$emit('clickCard', item)
      } catch (e) {
        //
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.cards-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.card-item.card-empty {
  opacity: 0;
  cursor: default;
  height: 192px;
  width: calc((100% - 40px) / 3);
}
</style>
