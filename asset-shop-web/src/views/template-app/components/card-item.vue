<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="card-item" :class="{'disabled': isview}" @click.prevent="clickCard(item)">
    <div class="img" :style="item|coverImg">
      <i class="img-filter" :style="coverImgMask(item)"></i>
      <p class="name">{{ item.packName }}</p>
      <p class="version">{{ item.packVersion }}</p>
    </div>
    <div class="content">
      <p class="name-box">
        <span class="name">{{ item.packName }}</span>
        <span v-show="item.appStatus" class="app-status" :class="`app-status-${item.appStatus}`">{{ APP_STATUS[item.appStatus] }}</span>
      </p>
      <p class="icon-box">
        <span class="scene">{{ item.packSceneName }}</span>
      </p>
      <p class="desc">{{ item.packDesc || '--' }}</p>
    </div>
    <div class="download">
      <div class="num">{{ '申请' }}次数 <span>{{ item.downloadCount }}</span></div>
      <div v-if="!hidebtn&&(item.packStatus!=13&&item.packStatus!=5&&item.applyType)" class="flex">
        <div class="btn btn-shopcar" @click.stop="clickAddShopCar(item)">
          {{ '加入购物车' }}
        </div>
        <div class="btn" :class="`btn${item.downloadStatus||0}`" @click.stop="handleBtn(item)">
          {{ '使用' }}
        </div>
      </div>
    </div>
    <i v-show="!!item.showColor" :class="`rule-label ${labelClass(item.showColor)} ${item.showContent?'text':''}`" :data-text="item.showContent" />
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { APP_STATUS } from '@/views/pack-manage-app/enums.js'
export default {
  name: '',
  components: {},
  filters: {
    coverImg(item) {
      if (item && item.coverConfigJson) {
        const coverConfigJson = JSON.parse(item.coverConfigJson)
        return `background-image:url(${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/${coverConfigJson.path})`
      }
      if (item.coverImagePath) {
        return `background-image:url(${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/${item.coverImagePath})`
      }
      return ''
    }
  },
  props: {
    item: [Object],
    isview: {
      type: Boolean,
      default: false
    },
    hidebtn: Boolean
  },
  data() {
    return {
      APP_STATUS
    }
  },
  methods: {
    labelClass(item) {
      if (+item === 3) return 'ruletag-3'
      if (+item === 2) return 'ruletag-2'
      if (+item === 1) return 'ruletag-1'
      if (+item === 4) return 'ruletag-4'
      return ''
    },
    coverImgMask(item) {
      if (item && item.coverConfigJson) {
        const coverConfigJson = JSON.parse(item.coverConfigJson)
        return coverConfigJson.style
      }
      return ''
    },
    clickCard(item) {
      this.$emit('clickCard', item)
    },
    clickAddShopCar(item) {
      this.$emit('clickAddShopCar', item)
    },
    handleBtn(item) {
      this.$emit('handleBtn', item)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.card-item.disabled {
  height: 236px;
  transition: none;
  cursor: default;
  &:hover {
    border: 0;
    transform: none;
  }
  .download {
    display: none;
  }
}
.card-item {
  position: relative;
  margin-bottom: 24px;
  flex-shrink: 0;
  width: 305px;
  height: 292px;
  background-color: white;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  &:hover {
    border: 1px solid $primaryColor;
    transform: translateY(-8px);
  }
  .img {
    position: relative;
    padding-top: 32px;
    padding-left: 24px;
    width: 100%;
    height: 120px;
    background: #EAF1F8;
    border: none;
    border-radius: 2px 2px 0px 0px;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    color: #FFFFFF;
    .img-filter {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, #0F205A 0%, rgba(15,32,90,0.05) 99%);
      z-index: 0;
      opacity: 1;
      border-radius: 2px 2px 0px 0px;
    }
    .name {
      position: relative;
      margin-bottom: 28px;
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      font-weight: 600;
      z-index: 1;
      &::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 20px;
        height: 2px;
        background: #fff;
      }
    }
    .version {
      position: relative;
      line-height: 16px;
      z-index: 1;
    }
  }
  .content {
    padding: 16px 24px 0 24px;
    .name-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .name {
      line-height: 26px;
      flex: 1;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      color: #4B4B4B;
    }
    .app-status {
      padding: 0px 8px;
      height: 20px;
      line-height: 20px;
      color: #FFFFFF;
      font-size: 12px;
      border-radius: 2px;
    }
    .app-status-1 {
      background: #6A87EB;
    }
    .app-status-2 {
      background: #5ABAFF;
    }
    .app-status-3 {
      background: #6ACEB4;
    }
    .app-status-4 {
      background: #BDBDBD;
    }
    .icon-box {
      margin-top: 8px;
      display: flex;
      align-items: center;
    }
    .scene {
      height: 22px;
      line-height: 22px;
      padding: 0px 4px;
      border-radius: 2px;
      display: inline-block;
      color: #8A8A8A;
      background: #F6F9FB;
    }
    .desc {
      margin-top: 8px;
      line-height: 22px;
      color: #8A8A8A;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  }
  .download {
    height: 54px;
    line-height: 54px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    color: #8A8A8A;
    border-radius: 0px 0px 2px 2px;
    border-top: 1px solid #E4E9ED;
    .num{
      font-size: 12px;
      color: #BDBDBD;
      span {
        margin-left: 4px;
        color: #8A8A8A;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      height: 22px;
      padding: 0 8px 0 26px;
      color: $primaryColor;
      background-image: url(~@/assets/imgs/icon-app.png);
      background-repeat: no-repeat;
      background-size: 14px 14px;
      background-position: 8px center;
      border-radius: 1px;
      &:hover {
        background-color: #EBF9FF;
      }
    }
    .btn-shopcar {
      background-image: url(~@/assets/imgs/shop-car.png);
    }
  }
  .rule-label {
    position: absolute;
    top: -6px;
    left: -8px;
    width: 69px;
    height: 69px;
    padding-top: 7px;
    padding-left: 12px;
    color: #FFFFFF;
  }
  .rule-label.text::before {
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
  .rule-label.ruletag-1 {
    background: url(~@/assets/imgs/rule-tag-1.png) no-repeat center;
    background-size: 100% 100%;
  }
  .rule-label.ruletag-2 {
    background: url(~@/assets/imgs/rule-tag-2.png) no-repeat center;
    background-size: 100% 100%;
  }
  .rule-label.ruletag-3 {
    background: url(~@/assets/imgs/rule-tag-3.png) no-repeat center;
    background-size: 100% 100%;
  }
  .rule-label.ruletag-4 {
    background: url(~@/assets/imgs/rule-tag-4.png) no-repeat center;
    background-size: 100% 100%;
  }
}
</style>
