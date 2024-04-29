<!--/*
* @Author: dingli
* @Desc: 卡片
* @Date: 2022-1-21
*/-->
<template>
  <transition name="fade-transform" mode="out-in">
    <div v-show="list.length" class="cards-wrap">
      <div v-for="item in list" :key="item.shopCode" class="card-item" @click.prevent="clickCard(item)">
        <!-- <div class="img" :style="item|coverImg"></div> -->
        <div class="content">
          <div class="name-box">
            <i :class="assetClass(item)"></i>
            <p class="name">{{ item.packName }}</p>
            <p class="type-box">
              <span class="type">{{ typeFilter(item) }}</span>
              <span v-show="item.packVersion" class="version"> | {{ item.packVersion }}</span>
            </p>
          </div>
          <p class="desc">{{ item.packDesc || '--' }}</p>
          <div class="tags-wrap">
            <span v-for="tag in item.tagList" :key="tag" class="tags-item">{{ tag }}</span>
          </div>
        </div>
        <div class="download">
          <div class="num">{{ [22,24,27,14,72,7].includes(+item.assetSubtype)?'订阅':'下载' }}次数 <span>{{ item.downloadCount }}</span></div>
          <div v-if="!hidebtn" class="flex">
            <div v-if="![1,2,3].includes(+item.downloadStatus)" class="btn btn-shopcar" @click.stop="clickAddShopCar(item)">加入购物车</div>
            <div v-if="![22,24,27,14,72,7].includes(+item.assetSubtype)" class="btn" :class="`btn-${item.downloadStatus}`" @click.stop="handleBtn(item)">
              {{ DOWNLOAD[item.downloadStatus] }}<i />
            </div>
            <div v-else class="btn btn-sub" @click.stop="clickSub(item)">
              {{ '订阅' }}<i />
            </div>
          </div>
        </div>
        <i v-show="!!item.showColor" :class="`label ${labelClass(item.showColor)} ${item.showContent?'text':''}`" :data-text="item.showContent" />
      </div>
      <i v-for="i in emptyEl" :key="`emptyEl-${i}`" class="card-item card-empty"></i>
      <subDialog
        v-if="dialogFlagSub"
        :datainfo="curr"
        :dialog-flag="dialogFlagSub"
        :shop-code="curr.shopCode"
        :pack-version="curr.packVersion"
        :pack-version-id="curr.packVersionId"
        @close="closeSubDialog" />
      <downloadDialog
        v-if="dialogFlagDownload"
        :datainfo="curr"
        :dialog-flag="dialogFlagDownload"
        :shop-code="curr.shopCode"
        :pack-version="curr.packVersion"
        :pack-version-id="curr.packVersionId"
        @close="closeSubDialog" />
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
import { downloadPack } from '@/api/index'
import subDialog from './sub-dialog.vue'
import downloadDialog from './download-dialog.vue'
import shopCarAdd from './shop-car-add.vue'
import { DOWNLOAD, asseTypeFormatLong } from '@/utils/enum'
import { getToken } from '@l/utils/auth'
export default {
  name: 'Cards',
  components: { subDialog, downloadDialog, shopCarAdd },
  filters: {
    coverImg(item) {
      if (item.coverImagePath) {
        return `background-image:url(${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/${item.coverImagePath})`
      }
      return ''
    }
  },
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
    hidebtn: [Boolean]
  },
  data() {
    return {
      dialogFlagSub: false,
      dialogFlagDownload: false,
      shopCarAddFlag: false,
      curr: {},
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      DOWNLOAD
    }
  },
  computed: {
    emptyEl() {
      let n = this.list.length % 4
      n = n ? 4 - n : n
      return n
    }
  },
  beforeDestroy() {
    this.notify && this.notify.close()
  },
  methods: {
    login() {
      if (!getToken()) {
        this.$store.dispatch('user/resetToken')
        return true
      }
    },
    clickAddShopCar(item) {
      if (![22, 24, 27, 14, 72, 7].includes(+item.assetSubtype)) {
        this.$store.dispatch('shopCar/addToCart', { params: { packVersionId: item.packVersionId, applyType: 1 }})
      } else {
        this.curr = item
        this.shopCarAddFlag = true
      }
    },
    assetClass(item) {
      const assetType = +item.assetType
      const assetSubtype = +item.assetSubtype
      switch (assetType) {
        case 5: return 'icon-asset-flow'
        case 3: return 'icon-asset-object'
        case 1: return 'icon-asset-kpi'
        case 2:
          if (assetSubtype === 22) return 'icon-asset-api'
          if (assetSubtype === 23) return 'icon-asset-page'
          if (assetSubtype === 26) return 'icon-asset-script'
          if (assetSubtype === 27) return 'icon-asset-supportapp'
          break
        case 7: return 'icon-asset-model'
      }
      return ''
    },
    typeFilter(item) {
      if (this.systype === 'tizheng' || this.systype === 'jiekou') {
        return asseTypeFormatLong('', item.assetSubtype)
      }
      return asseTypeFormatLong(item.assetType, item.assetSubtype, '-')
    },
    closeSubDialog(isOk) {
      this.curr = {}
      this.dialogFlagSub = false
      this.dialogFlagDownload = false
      this.shopCarAddFlag = false
      if (isOk) {
        this.$emit('downloadok')
      }
    },
    // 订阅
    clickSub(item) {
      if (this.login()) return
      this.curr = item
      this.dialogFlagSub = true
    },
    labelClass(item) {
      if (+item === 3) return 'ruletag-3'
      if (+item === 2) return 'ruletag-2'
      if (+item === 1) return 'ruletag-1'
      if (+item === 4) return 'ruletag-4'
      return ''
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
          assetType: item.assetSubtype,
          packVersionId: item.packVersionId
        }
      })
      window.open(route.href, '_blank')
    },
    handleBtn(item) {
      if (this.login()) return
      // 已下载不能点击
      if (item.downloadStatus === 1) return
      // 审核中跳转至审核详情
      if (item.downloadStatus === 3) {
        const path = this.$router.resolve({
          path: +item.assetType === 99 ? '/myApply/appDetail' : '/myApply/assetDetail',
          query: {
            shopCode: item.shopCode,
            packVersion: item.packVersion,
            packVersionId: item.packVersionId,
            assetType: item.assetSubtype
          }
        })
        window.open(path.href, '_blank')
        return
      }
      this.curr = item
      this.dialogFlagDownload = true
    },
    async downloadFn(item) {
      try {
        await downloadPack({
          packVersionId: item.packVersionId
        })
        this.$emit('downloadok')
      } catch (e) {
        console.error(e)
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
  color: #4B4B4B;
  .card-item.card-empty {
    opacity: 0;
    cursor: default;
  }
  .card-item {
    position: relative;
    margin-bottom: 24px;
    flex-shrink: 0;
    width: 305px;
    height: 210px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(41, 48, 64, 0.08);
    border-radius: 2px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    &:hover {
      border: 1px solid $primaryColor;
      transform: translateY(-8px);
    }
    .content {
      padding: 24px 24px 0 24px;
      height: 156px;
      p {
        line-height: 20px;
      }
    }
    .name-box {
      position: relative;
      padding-left: 52px;
      i {
        position: absolute;
        left: 0;
        top: 0;
        width: 40px;
        height: 40px;
        border-radius: 3px;
        background-repeat: no-repeat;
        background-size: 24px 24px;
        background-position: center;
      }
    }
    .name {
      line-height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .type-box {
      line-height: 20px;
      font-size: 12px;
      color: #8A8A8A;
    }
    .desc {
      margin-top: 12px;
      line-height: 20px;
      font-size: 12px;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .tags-wrap {
      margin-top: 16px;
      width: 276px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .tags-item {
        display: inline-block;
        margin-left: 8px;
        padding: 0px 4px;
        height: 22px;
        line-height: 22px;
        background-color: #F6F9FB;
        border: 1px solid #E4E8EB;
        color: #8A8A8A;
        font-size: 12px;
        &:first-child {
          margin: 0;
        }
      }
    }
    .download {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      height: 54px;
      line-height: 54px;
      border-top: 1px solid #E4E9ED;
      font-size: 12px;
      .num{
        color: #BDBDBD;
        span {
          color: #8A8A8A;
        }
      }
      .btn {
        display: flex;
        align-items: center;
        height: 22px;
        padding: 0 8px 0 26px;
        color: $primaryColor;
        background-image: url(~@/assets/imgs/icon-download.png);
        background-repeat: no-repeat;
        background-size: 14px 14px;
        background-position: 8px center;
        border-radius: 1px;
        &:hover {
          background-color: #EBF9FF;
        }
      }
      .btn-sub {
        background-image: url(~@/assets/imgs/icon-sub.png);
      }
      .btn-shopcar {
        background-image: url(~@/assets/imgs/shop-car.png);
      }
      .btn-3 {
        background-image: url(~@/assets/imgs/icon-approvaling.png);
      }
    }
    .label {
      position: absolute;
      top: -6px;
      left: -8px;
      width: 69px;
      height: 69px;
      padding-top: 7px;
      padding-left: 12px;
      color: #FFFFFF;
    }
    .label.text::before {
      content: attr(data-text);
      position: absolute;
      width: 69px;
      height: 65px;
      line-height: 45px;
      text-align: center;
      top: 0;
      left: 0;
      transform: rotate(315deg);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
    .label.ruletag-1 {
      background: url(~@/assets/imgs/rule-tag-1.png) no-repeat center;
      background-size: 100% 100%;
    }
    .label.ruletag-2 {
      background: url(~@/assets/imgs/rule-tag-2.png) no-repeat center;
      background-size: 100% 100%;
    }
    .label.ruletag-3 {
      background: url(~@/assets/imgs/rule-tag-3.png) no-repeat center;
      background-size: 100% 100%;
    }
    .label.ruletag-4 {
      background: url(~@/assets/imgs/rule-tag-4.png) no-repeat center;
      background-size: 100% 100%;
    }
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
