<!--
 * @Description: 应用详情-资源卡片
 * @Author: lianpeng
 * @Date: 2021-09-09
-->
<template>
  <div :class="selected ? 'assets-card-main assets-card-main-hover' : 'assets-card-main'" @mouseover="mouseover"
       @mouseleave="mouseleave" @click="openAsset">

    <i v-if="showStatus" class="ac-icon-top-third ass-status" :class="getAssetIcon()" @click.stop="">
    </i>
    <i v-if="(data.referVersionStatus===2)">
      <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
        <i class="alert alert-update"
           @click.stop="" />
      </c-tooltip>
    </i>
    <i v-if="(data.referVersionStatus===3)" @click.stop="">
      <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
        <i class=" alert alert-invalid"
           @click.stop="" />
      </c-tooltip>
    </i>
    <i v-if="isList && getBtnList.length" class="icon-list-btn" @mouseenter="btnMouseenter" @mouseleave="btnMouseleave"
       @click.stop="">
      <i id="ee" ref="btnOperat" class="ac-icon-bottom">
        <span class="icon-operat ">
          <i class="c-icon-caret-left"></i>
          操作</span>
      </i>
      <div v-show="showBtnList" ref="btn-list-box" class="btn-list-box">
        <div v-for="item in getBtnList" :key="item.label" class="btn" @click.stop="clickBtn(item)">{{ item.label }}
        </div>
      </div>
    </i>
    <i v-if="showAuthInfo || showLink||showLog" class=" ac-icon-bottom" @click.stop="">
      <span v-if="(showAuthInfo||showLog) && getUserPermissionByKey('assetSubscription', 'showLog')" class="icon-operat margin-right-left-24" @click.stop="openLog"><span>升级日志</span></span>
      <span v-if="showLink&&getUserPermissionByKey('assetSubscription', 'showCited')" class="icon-operat margin-right-left-24" @click.stop="openLink"><span>被引用关系</span></span>
      <span v-if="showAuthInfo&&getUserPermissionByKey('assetSubscription', 'showAuth')" class="icon-operat" @click.stop="openAuthInfo"><span>查看授权</span></span>
    </i>

    <div class="ac-title">
      <!-- <img src="@/assets/imgs/asset-icon.png" class="asset-icon" alt=""> -->
      <span>{{ data.assetName }}</span>
    </div>
    <div v-if="showType" class="ac-type"><span>{{ data | assetTypeFilter }}</span>
      <div v-if="data.groupType&&provide" class="asset-src">{{ data | assetGroupTypeFilter }}</div>
      <span v-if="data.sharedFlag == 1" class="ac-icon-sharedFlag">已共享</span>
    </div>
    <div v-if="data.version" class="ac-type"><img src="@/assets/imgs/version-icon.png" alt=""><span>
      {{ data.version }}</span>
      <span v-if="data.authStatus == 2" class="ac-icon-authorize">未授权</span>
    </div>
    <slot class="ac-icon-bottom" @click.stop="stop" />

  </div>
</template>

<script>
import { assetSrc, groupType } from '@/config/index'
import { disable_scroll, enable_scroll } from '@/utils/scroll'
// 1统计、2技术、3对象、4数据、5流程
import { getAssetTypeLabel, goDetail, openWindow, validateTenant, getUserPermissionByKey } from '@/utils'
export default {
  components: {

  },
  filters: {
    assetTypeFilter(v) {
      v.subtype = v.subType || v.subtype
      const res = getAssetTypeLabel(v.assetType, v.subtype)
      return res
    },
    assetSrcFilter(v) {
      v.assetSrc = v.assetSrc || 0
      const res = assetSrc.find(item => item.value + '' === v.assetSrc + '')
      return res && res.label
    },
    assetGroupTypeFilter(v) {
      v.groupType = v.groupType || 0
      const res = groupType.find(item => item.value + '' === v.groupType + '')
      return res && res.label
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    isList: { // 是否列表
      type: Boolean,
      default: false
    },
    showStatus: { // 显示状态标签
      type: Boolean,
      default: false
    },
    showType: { // 显示类型
      type: Boolean,
      default: true
    },
    provide: { // 是否私有
      type: Boolean,
      default: false
    },
    pageKey: { // pageKey
      type: String,
      default: ''
    },
    btnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    showAuthInfo: { // 显示授权
      type: Boolean,
      default: false
    },
    showLink: { // 显示被引用
      type: Boolean,
      default: false
    },
    showLog: { // 显示日志
      type: Boolean,
      default: false
    },
    deleteable: { // 可以移除
      type: Boolean,
      default: false
    },
    downloadFlag: { // 我的下载
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      showBtnList: false,
      play: false,
      showDialogFlag: ''
    }
  },
  computed: {
    getBtnList() {
      return this.btnList.filter(item => !item.disabled).filter(item => !item.hide).filter(item => item.label !== '查看')
    }
  },
  created() {
    // window.onscroll = this.onmousewheelHandle
    // window.onscroll = function() { // 元素位置固定函数
    //   console.log(document.body.scrollLeft, document.body.scrollTop)
    // }
  },
  destroyed() {
    // window.removeEventListener('mousewheel', this.onmousewheelHandle)
  },
  methods: {
    getUserPermissionByKey(a, b) {
      return getUserPermissionByKey(a, b)
    },
    onmousewheelHandle(e) {
      console.log(e, 'e')
      if (Math.abs(e.wheelDeltaY) > 32) this.btnMouseleave()
    },
    clickBtn(item) {
      if (validateTenant(item.row.createUserId, this.pageKey, item.permissionKey)) return
      this.$emit('handleClick', item)
    },
    stop() {
      return false
    },
    openAsset() {
      if (this.isList) {
        // 查看权限在 btnList里面，无该按钮则无权限，不可查看
        const viewBtn = this.btnList.find(d => d.label === '查看')
        if (!viewBtn) return
        this.$emit('handleClick', { ...viewBtn, label: '查看', row: this.data })
        return
      }
      if (this.downloadFlag) {
        if (!getUserPermissionByKey('assetSubscription', 'view')) return
        return this.$emit('downloadOpen', this.data)
      }
      const res = goDetail(this.data)
      if (res) {
        this.showDialog(res)
      }
    },
    showDialog(flag) {
      console.log('flag', flag)
      this.$emit('showDialog', { flag, currId: this.data.assetId })
    },

    openLog() {
      this.$emit('openLog', this.data)
    },
    openWindow(path) {
      console.log('path', path)

      openWindow(path)
    },
    btnMouseenter(e) {
      const parentPosition = this.$refs.btnOperat.getBoundingClientRect()
      this.showBtnList = true
      this.$refs['btn-list-box'].style.opacity = 0
      disable_scroll()
      this.$nextTick(() => {
        console.log(this.$refs['btn-list-box'].getBoundingClientRect().width, 'width===')
        this.$refs['btn-list-box'].style.top = parentPosition.y + 'px'
        this.$refs['btn-list-box'].style.left = parentPosition.x - this.$refs['btn-list-box'].getBoundingClientRect().width - 74 + parentPosition.width + 'px'
        this.$refs['btn-list-box'].style['zIndex'] = '1004'
        this.$refs['btnOperat'].style['zIndex'] = '1003'
        this.$refs['btn-list-box'].style.opacity = 1
      })
    },
    btnMouseleave(e) {
      console.log('ee', e)
      enable_scroll()
      this.showBtnList = false
      if (this.$refs['btn-list-box']) {
        this.$refs['btn-list-box'].style['zIndex'] = '-1'
      }
      if (this.$refs['btnOperat']) {
        this.$refs['btnOperat'].style['zIndex'] = '1001'
      }
    },
    mouseover() {
      this.play = true
    },
    mouseleave() {
      this.play = false
    },
    deleteItem() {
      this.$emit('deleteItem', this.data)
    },
    openAuthInfo() {
      this.$emit('openAuthInfo', this.data)
    },
    openLink() {
      this.$emit('openLink', this.data)
    },
    getAssetIcon() {
      let res = ''
      /**
       * [{ '开发中', '1' }, { '发布中', '3' }, { '发布失败', '4' }, { '已发布', '5' }, { '创建中', '6' }, { '创建失败', '7' } ]
       */
      switch (this.data.status) {
        case 1:
          res = 'deving'
          break;
        case 2:
          res = ''
          break;
        case 3:
          res = ''
          break;
        case 4:
          res = 'post-error'
          break;
        case 5:
          res = 'posted'
          break;
        case 6:
          res = ''
          break;
        case 7:
          res = ''
          break;
        default:
          break;
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  display: none !important;
}

.assets-card-main {
  width: 309px;
  height: 170px;
  position: relative;
  padding-top: 24px;
  padding-left: 24px;
  cursor: pointer;
  border-radius: 4px;
  background: #fff;

  .ac-icon-top-bg {
    width: 156px;
    height: 57px;
    position: absolute;
    top: 0;
    right: 0;
    background: url(~@/assets/application/ac-icon-top-bg.png) no-repeat 100%;
  }

  .ac-icon-top {
    position: absolute;
    top: -38px;
    right: -1px;
    width: 90px;
    height: 90px;
  }

  .bg-move {
    animation: test_anim steps(30) 1s forwards;
  }

  @keyframes test_anim {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 0 -2700px;
    }
  }

  .ac-icon-bottom {
    display: flex;
    align-items: center;
    min-width: 72px;
    height: 32px;
    border-radius: 16px 0px 0px 16px;
    position: absolute;
    bottom: 14px;
    right: 0px;
    z-index: 1001;
    text-align: right;
    padding-right: 20px;
    padding-left: 16px;

    .icon-operat {
      min-width: 48px;
      height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8a8a8a;
      line-height: 26px;
      cursor: pointer;
      margin-right: 12px;
      line-height: 32px;
      display: flex;
      align-items: center;

      &:last-child {
        margin: 0 0px;
      }

      &:hover {
        color: #36a4ff;
      }

      &::v-deep {
        .c-checkbox {
          color: #8a8a8a;

          &:hover {
            color: #36a4ff;

            .c-checkbox__inner {
              border-color: #36A4FF;
            }
          }
        }

        .is-checked {
          .c-checkbox__label {
            color: #36a4ff;
          }
        }
      }
    }

  }

  .icon-list-btn:hover {
    .c-icon-caret-left {
      transform: rotate(180deg);
    }

    .icon-operat {
      color: #36a4ff;
    }
  }

  .btn-list-box {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 32px;
    padding-right: 0px;
    padding-left: 0px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    background: #fff;
    min-width: 225px;
    justify-content: flex-end;
    .btn {
      display: inline-block;
      text-align: right;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8A8A8A;
      margin-left: 12px;

      &:hover {
        color: #36a4ff;

      }
    }
  }

  .ac-icon-top-third {
    display: block;
    width: 64px;
    height: 20px;
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(~@/assets/application/icon-invalid.png) no-repeat 100%;
    background-size: 100%;
  }

  .ass-status {
    width: 52px;
    height: 20px;
    top: 130px;
    left: 24px;
  }

  .deving {
    background: url(~@/assets/imgs/dev-icon.png) no-repeat 100%;
    background-size: 100%;
  }

  .post-error {
    width: 64px;
    background: url(~@/assets/imgs/post-error-icon.png) no-repeat 100%;
    background-size: 100%;
  }

  .posted {
    background: url(~@/assets/imgs/posted-icon.png) no-repeat 100%;
    background-size: 100%;
  }

  .ac-icon-title-bg {
    display: block;
    width: 126px;
    height: 10px;
    background: linear-gradient(270deg, rgba(255, 183, 0, 0) 0%, rgba(255, 109, 1, 0.28) 100%);
    position: absolute;
    top: 42px;
    left: 33px;
  }

  .ac-title {
    padding-right: 40px;
    display: flex;
    align-items: center;
    position: relative;
    // width: 190px;
    // img {
    //   margin-right: 8px;
    // }

    span {
      display: inline-block;
      height: 28px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4b4b4b;
      // width: 208px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      line-height: 28px;
    }
  }

  .ac-type {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8a8a8a;
    line-height: 16px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
    span {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8a8a8a;
      line-height: 18px;
    }
    .asset-src {
      width: 36px;
      height: 18px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      margin-left: 6px;
      line-height: 18px;
      text-align: center;
    }
  }
}

.asset-icon {
  width: 28px;
  height: 28px;
}

.alert{
  display: block;

  position: absolute;
  z-index: 2;
  top: 28px;
  right: 24px;
}

.ac-icon-authorize {
  padding: 0 4px;
  height: 32px;
  line-height: 32px;
  background: #9DC1FC;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fff !important;
  text-align: center;
  margin-left: 8px;
}
.ac-icon-sharedFlag {
  padding: 0 4px;
  height: 32px;
  line-height: 32px;
  background: #F6F9FB;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8A8A8A !important;
  text-align: center;
  margin-left: 8px;
}
</style>
