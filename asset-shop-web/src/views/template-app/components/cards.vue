<!--/*
* @Author: dingli
* @Desc: 卡片
* @Date: 2022-1-21
*/-->
<template>
  <transition name="fade-transform" mode="out-in">
    <div v-show="list.length" class="cards-wrap">
      <CardItem
        v-for="item in list"
        :key="item.shopCode"
        :item="item"
        :hidebtn="hidebtn"
        @clickCard="clickCard"
        @clickAddShopCar="clickAddShopCar"
        @handleBtn="handleBtn" />
      <i v-for="i in emptyEl" :key="`emptyEl-${i}`" class="card-empty"></i>
      <subDialog v-if="dialogFlagSub" :pack-version-id="curr.packVersionId" :app-name="curr.packName" :dialog-flag="dialogFlagSub" :shop-code="curr.shopCode"
                 :pack-version="curr.packVersion" @close="closeSubDialog" />
      <shopCarAdd
        :visible="shopCarAddFlag"
        :data="curr"
        @close="closeSubDialog"
      />
    </div>
  </transition>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import subDialog from './sub-dialog.vue'
import shopCarAdd from '@/views/home/components/shop-car-add.vue'
import { DOWNLOADAPP } from '@/utils/enum'
import { getToken } from '@l/utils/auth'
import { APP_STATUS } from '@/views/pack-manage-app/enums.js'
import CardItem from './card-item.vue'
export default {
  name: 'Cards',
  components: { subDialog, CardItem, shopCarAdd },
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
    },
    packType: {
      type: Number,
      default: 1 // 1资源 2应用
    },
    customClick: {
      type: Boolean,
      default: false
    },
    systype: String,
    showthird: {
      type: Boolean,
      default: true
    },
    hidebtn: Boolean
  },
  data() {
    return {
      dialogFlagSub: false,
      shopCarAddFlag: false,
      curr: {},
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      DOWNLOAD: DOWNLOADAPP,
      btnLoading: [],
      APP_STATUS
    }
  },
  computed: {
    emptyEl() {
      let n = this.list.length % 4
      n = n ? 4 - n : n
      return n
    }
  },
  methods: {
    login() {
      if (!getToken()) {
        this.$store.dispatch('user/resetToken')
        return true
      }
    },
    closeSubDialog() {
      this.curr = {}
      this.dialogFlagSub = false
      this.shopCarAddFlag = false
    },
    clickCard(item) {
      if (this.customClick) {
        this.$emit('clickCard', item)
        return
      }
      const path = this.packType === 1 ? '/home/detail' : '/templateApp/detail'
      const route = this.$router.resolve({
        path,
        query: {
          shopCode: item.shopCode,
          packVersion: item.packVersion,
          packVersionId: item.packVersionId
        }
      })
      window.open(route.href, '_blank')
    },
    clickAddShopCar(item) {
      this.curr = item
      this.shopCarAddFlag = true
    },
    handleBtn(item) {
      // 已下载不能点击
      if (item.downloadStatus === 1 || this.btnLoading.indexOf(item.shopCode) > -1) return
      // 审核中跳转至审核详情
      if (item.downloadStatus === 3) {
        const path = this.$router.resolve({
          path: +item.assetType === 99 ? '/myApply/appDetail' : '/myApply/assetDetail',
          query: {
            shopCode: item.shopCode,
            packVersion: item.packVersion
          }
        })
        window.open(path.href, '_blank')
        return
      }
      this.curr = item

      this.dialogFlagSub = true
    }
  }
}
</script>
<style scoped lang="scss">
.cards-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .card-empty {
    opacity: 0;
    cursor: default;
    margin-bottom: 24px;
    flex-shrink: 0;
    width: 305px;
    height: 292px;
    background-color: white;
    border-radius: 2px;
  }
}
@keyframes progressmove {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}
</style>
