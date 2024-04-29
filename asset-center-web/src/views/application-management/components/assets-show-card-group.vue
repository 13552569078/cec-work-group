<!--
 * @Description:展示列表
 * @Author: pancj
 * @Date: 2021-09-13
-->
<template>
  <div class="box">
    <div class="assets-card-show-wrap" :style="data.appIcon ? `background-image:url(${previewUrl}${data.appIcon})` : ''"
         @click="clickToDetail">
      <div class="wrap-bg" :style="'border-radius:4px 4px 0 0;height:140px;width: 100%;background:linear-gradient(90deg, '+colorConfig.color+' 0%, rgba(15,32,89,0) 100%);opacity:'+colorConfig.opacity/100"></div>
      <div class="card-content">
        <div class="title text-splice">{{ data.appName }}</div>
        <span class="title-version">版本总数 <span style="font-weight: 600;font-size: 18px;">{{ data.versionCount }}</span> 个</span>
        <div class="bottom-text">
          <span class="name text-splice">{{ data.appName }}</span>
          <span class="tag text-splice">{{ data.sceneName }}</span>
          <span class="desc text-splice">{{ data.appDesc }}</span>
          <div class="bottom-hover" @click.stop="''">
            <div v-if="data.devId" class="btn" @click="appDesign">应用设计</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js';
import { getUserPermissionByKey, validateTenant } from '@/utils'
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      previewUrl: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/'
    };
  },
  computed: {

    colorConfig() {
      const coverConfigJson = JSON.parse(this.data.coverConfigJson || '{}')
      return {
        color: coverConfigJson.color || '#0F205A',
        opacity: coverConfigJson.opacity || 100
      }
    }
  },
  created() { },
  methods: {
    appDesign() {
      // if (!getUserPermissionByKey('applicationManagement', 'view')) return
      this.$router.push({
        path: '/application-detail',
        query: {
          id: this.data.devId,
          dev: 'dev',
          code: this.data.appCode

        }
      });
    },
    clickToDetail() {
      // 权限判断
      if (!getUserPermissionByKey('applicationManagement', 'view')) return
      this.$router.push({
        path: '/application-detail',
        query: {
          id: this.data.newestId,
          code: this.data.appCode
        }
      });
    },
    operte(type, item) {
      if (type === 'packing') return
      if (validateTenant(this.data.createUserId, 'applicationManagement', item.permissionKey)) return
      this.$emit(
        'operteItem',
        Object.assign({}, this.data, { operteType: type })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.text-splice {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
.box{
position: relative;
width: 376px;
  height: 310px;
  &::before{
    content: '';
    width: 376px;
    height: 310px;
    border-radius: 2px;
    opacity: 0.6;
    /* 背景色/bg-content */
    background: #FFFFFF;

    /* 阴影样式/lg */
    box-shadow: 0px 4px 24px 0px rgba(41, 48, 64, 0.12);
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;

  }
  &::after{
    content: '';
    width: 376px;
    height: 310px;
    border-radius: 2px;
    opacity: 0.6;
    /* 背景色/bg-content */
    background: #FFFFFF;

    /* 阴影样式/lg */
    box-shadow: 0px 4px 24px 0px rgba(41, 48, 64, 0.12);
    display: block;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;

  }
}
.assets-card-show-wrap {
  width: 376px;
  height: 310px;
  border-radius: 4px;

  z-index: 30;
  background-size: 100% auto;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease-in-out;
  &:hover {
    border: 2px solid #36a4ff;
    box-shadow: 0px 2px 40px -9px rgba(0, 22, 31, 0.16);
    // transform: translateY(-10px);
  }
  .title {
    position: absolute;
    top: 35px;
    left: 24px;
    font-size: 18px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: #ffffff;
    width: 300px;
    &::after {
      content: '';
      display: block;
      width: 20px;
      height: 2px;
      background: #fff;
      margin-top: 12px;
    }
  }
  .title-version {
    position: absolute;
    top: 79px;
    left: 24px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: #ffffff;
  }
  .top-status {
    width: 56px;
    height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    background-size: contain;
    background-repeat: no-repeat;
    &.dev {
      background-image: url('../../../assets/logo/dev-tag.png');
    }

    &.posting {
      background-image: url('../../../assets/logo/posting-tag.png');
    }

    &.post-err {
      background-image: url('../../../assets/logo/post-err-tag.png');
    }

    &.post {
      background-image: url('../../../assets/logo/post-tag.png');
    }

    &.deploying {
      background-image: url('../../../assets/logo/deploying-tag.png');
    }

    &.deploy-err {
      background-image: url('../../../assets/logo/deploy-err-tag.png');
    }

    &.deploy {
      background-image: url('../../../assets/logo/deploy-tag.png');
    }

    &.creating {
      background-image: url('../../../assets/logo/creating-tag.png');
    }

    &.create-err {
      width: 64px;
      background-image: url('../../../assets/logo/create-err-tag.png');
    }
  }

  .bottom-text {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 170px;
    background: #ffffff;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4b4b4b;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 24px;
    box-sizing: border-box;

    .name {
      display: block;
      line-height: 24px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #4b4b4b;
      margin-bottom: 8px;
      display: block;
      width: 100%;
    }
    .tag {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      width: auto;
      text-align: right;
      background: #F6F9FB;
      border-radius: 2px;
      padding: 0 4px;
      font-size: 12px;
      color: #8A8A8A;
    }
    .desc {
      display: block;
      text-align: left;
      margin-top: 8px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      color: #4B4B4B;
    }
    .version {
      background: url(~@/assets/imgs/app-version.png) no-repeat;
      background-size: 100%;
      width: 72px;
      height: 20px;
      display: block;
      font-size: 14px;

      color: #4B4B4B;
      line-height: 20px;
      padding-left: 30px;
      position: absolute;
      top: 22px;
      right: 24px;
    }
  }

  .bottom-hover {
    width: 100%;
    height: 64px;
    .btn{
      margin-top: 16px;
      margin-left: 232px;
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      color: #36A4FF;
      width: 96px;
      height: 32px;
      border-radius: 2px;
      opacity: 1;
      padding: 4px 8px;
      background: #EBF9FF;
      border: 1px solid #EBF9FF;
      &::before{
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        background: url(~@/assets/imgs/icon-fillbox.svg);
        margin-right: 6px;
      }
    }
  }

  .dropdown-icon {
    position: absolute;
    right: 23px;
    bottom: 25px;
    color: white;
    font-size: 16px;
    transform: rotate(90deg);

    &:hover {
      color: $primaryColor;
    }
  }
}
.width75 {
  width: 85px !important;
}

.assets-operte-btn {
  width: 68px;
  height: 22px;
  position: relative;
  background: rgba(213, 213, 213, 0.1);
  border-radius: 2px;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 5px;
    width: 16px;
    height: 16px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }

  &::before {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 25px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }

  &.delete {
    &::after {
      background-image: url('../../../assets/logo/delete.png');
    }

    &::before {
      content: '删除';
    }
  }

  &.post {
    &::after {
      background-image: url('../../../assets/logo/post.png');
    }

    &::before {
      content: '发布';
    }
  }

  &.cexiao {
    width: 84px;

    &::after {
      background-image: url('../../../assets/logo/cexiao.png');
    }

    &::before {
      content: '取消部署';
    }
  }

  &.cexiaodeploy {
    width: 84px;

    &::after {
      background-image: url('../../../assets/logo/cexiao.png');
    }

    &::before {
      content: '取消部署';
    }
  }

  &.setting {
    width: 84px;

    &::after {
      background-image: url('../../../assets/logo/icon-setting.png');
    }

    &::before {
      content: '应用设置';
    }
  }

  &.nav {
    width: 84px;

    &::after {
      background-image: url('../../../assets/logo/icon-setting.png');
    }

    &::before {
      content: '导航设计';
    }
  }

  &.open {
    width: 84px;

    &::after {
      background-image: url("../../../assets/logo/icon-preview.png");
    }

    &::before {
      content: "访问应用";
    }
  }

  &.preview {
    width: 84px;

    &::after {
      background-image: url("../../../assets/logo/icon-preview.png");
    }

    &::before {
      content: "预览应用";
    }
  }

  &.deploy {
    &::after {
      background-image: url('../../../assets/logo/deploy.png');
    }

    &::before {
      content: '部署';
    }
  }

  &.copy {
    &::after {
      background-image: url('../../../assets/logo/copy-white.png');
    }

    &::before {
      content: '复制';
    }
  }

  &.pack {
    &::after {
      background-image: url('../../../assets/logo/pack.png');
    }

    &::before {
      content: '打包';
    }
  }

  &.packing {
    opacity: 0.5;
    cursor: no-drop;

    &::after {
      background-image: url('../../../assets/logo/pack.png');
    }

    &::before {
      content: '打包中';
    }
  }

  &.download {
    &::after {
      background-image: url('../../../assets/logo/download.png');
    }

    &::before {
      content: '下载';
    }
  }
}

.assets-dropdown {
  padding: 8px 0;

  &.c-tooltip__popper.is-dark {
    background: #07172d;
    border: 1px solid rgba(125, 144, 186, 0.35);
  }

  &.c-tooltip__popper .popper__arrow::after {
    border-bottom-color: #07172d;
  }

  .assets-operte-btn-wrap {
    padding: 0 16px;
    cursor: pointer;

    &:hover {
      background: rgba(54, 164, 255, 0.1);
    }
  }

  .assets-operte-btn {
    height: 32px;
    background: transparent;
  }
}

.cls-right-more {
  &:hover {
    .dropdown-icon {
      color: $primaryColor;
    }

    .assets-dropdown {
      display: block;
    }
  }

  .assets-dropdown {
    transform-origin: center top;
    z-index: 2048;
    display: none;
    top: 46px;
    right: -18px;

    .popper__arrow {
      transform: rotate(0deg);
      top: -16px;
      left: 50%;
    }
  }
}
.algin-center{
  display: flex !important;
    align-items: center !important;
    margin-left: 8px;
}

</style>
