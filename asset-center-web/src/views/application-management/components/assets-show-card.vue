<!--
 * @Description:展示列表
 * @Author: pancj
 * @Date: 2021-09-13
-->
<template>
  <div class="assets-card-show-wrap" :style="data.appIcon ? `background-image:url(${previewUrl}${data.appIcon})` : ''"
       @click="clickToDetail">
    <div v-if="colorConfig.color" class="wrap-bg" :style="'height:140px;width:100%;border-radius:4px 4px 0 0;background:linear-gradient(90deg,'+colorConfig.color+' 0%, rgba(15,32,89,0) 100%);opacity:'+colorConfig.opacity/100"></div>
    <div class="top-status" :class="statusIcon" />
    <div class="title text-splice">{{ data.appName }}</div>
    <span v-if="data.appStatus !== 1" class="title-version">{{ data.version }}</span>
    <div class="bottom-text">
      <span class="name text-splice">{{ data.appName }}</span>
      <div class="fl"> <span class="tag text-splice">{{ data.sceneName }}</span>
        <i v-if="(data.referVersionStatus===2||data.versionStatus===2)"
           class="algin-center">
          <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
            <i class="alert-update"
               @click.stop="" />
          </c-tooltip>
        </i>
        <i v-if="(data.referVersionStatus===3||data.versionStatus===3)"
           class="algin-center" @click.stop="">
          <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
            <i class="alert-invalid"
               @click.stop="" />
          </c-tooltip>
        </i></div>
      <span class="desc text-splice">{{ data.appDesc }}</span>

      <span v-if="data.appStatus !== 1" class="version text-splice">{{ data.version }}</span>
    </div>
    <div class="bottom-hover" @click.stop="''">
      <template v-for="(item, index) in renderBtns">
        <div v-if="index < 2" :key="index" class="assets-operte-btn" :class="item.key"
             :style="index > 0 ? { marginLeft: '20px' } : {}" @click="operte(item.key, item)" />
      </template>
      <div v-if="renderBtns.length > 2" class="cls-right-more">
        <i class="dropdown-icon c-icon-more"></i>
        <div class="c-tooltip__popper is-dark assets-dropdown">
          <div class="c-tooltip__popper-content">
            <template v-for="(item, index) in renderBtns">
              <div v-if="index > 1" :key="index" class="assets-operte-btn-wrap">
                <div class="assets-operte-btn width75" :class="item.key"
                     @click="operte(item.key, item)" />
              </div>
            </template>
          </div>
          <div x-arrow="" class="popper__arrow"></div>
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
        color: coverConfigJson.color || '',
        opacity: coverConfigJson.opacity === null ? 100 : coverConfigJson.opacity
      }
    },
    renderBtns() {
      const map = {
        'post': { 'key': 'post', permissionKey: 'public' },
        'copy': { 'key': 'copy', permissionKey: 'copy' },
        'delete': { 'key': 'delete', permissionKey: 'delete' },
        'deploy': { 'key': 'deploy', permissionKey: 'deploy' },
        'nav': { 'key': 'nav', permissionKey: 'design' },
        'download': { 'key': 'download', permissionKey: 'pack' },
        'cexiaodeploy': { 'key': 'cexiaodeploy', permissionKey: 'deployCancel' },
        'pack': { 'key': 'pack', permissionKey: 'pack' },
        'packing': { 'key': 'packing', permissionKey: 'pack' }
        // 'open': { 'key': 'open', permissionKey: 'link' },
        // 'preview': { 'key': 'preview', permissionKey: 'preview' }
      }
      let btnArrs = [];
      // 按钮显示优先级：发布＞部署＞应用设置>复制>打包>删除>预览/访问
      switch (this.data.appStatus) {
        case 1: // 开发中 （发布、复制、删除）
          btnArrs = ['copy', 'post', 'nav', 'delete'];
          break;
        case 3: // 发布中 （删除）
          btnArrs = ['delete'];
          break;
        case 4: // 发布失败 （删除）
          btnArrs = ['delete'];
          break;
        case 5: // 已发布 （部署、导航、复制、打包/下载、删除）
          // packStatus 2打包成功 1打包中
          if (+this.data.packStatus === 2) {
            btnArrs = ['deploy', 'copy', 'download', 'delete']
          } else if (+this.data.packStatus === 1) {
            btnArrs = ['deploy', 'copy', 'packing', 'delete']
          } else {
            btnArrs = ['deploy', 'copy', 'pack', 'delete']
          }
          break;
        case 6: // 已部署 （部署、应用设置、复制、打包/下载）
          if (+this.data.packStatus === 2) {
            btnArrs = ['cexiaodeploy', 'copy', 'download']
          } else if (+this.data.packStatus === 1) {
            btnArrs = ['cexiaodeploy', 'copy', 'packing']
          } else {
            btnArrs = ['cexiaodeploy', 'copy', 'pack']
          }
          break;
        case 7: // 部署中
          if (+this.data.packStatus === 2) {
            btnArrs = ['download']
          } else if (+this.data.packStatus === 1) {
            btnArrs = ['packing']
          } else {
            btnArrs = ['pack']
          }
          break;
        case 8: // 部署失败
          if (+this.data.packStatus === 2) {
            btnArrs = ['deploy', 'nav', 'copy', 'download', 'delete'];
          } else if (+this.data.packStatus === 1) {
            btnArrs = ['deploy', 'nav', 'copy', 'packing', 'delete'];
          } else {
            btnArrs = ['deploy', 'nav', 'copy', 'pack', 'delete'];
          }

          break;
        default:
          break;
      }
      return btnArrs.map(d => map[d]).filter(d => getUserPermissionByKey('applicationManagement', d.permissionKey));
    },
    statusIcon() {
      const key = this.data.appStatus * 1;
      let res = '';
      switch (key) {
        case 1:
          res = 'dev';
          break;
        case 7:
          res = 'deploying';
          break;
        case 8:
          res = 'deploy-err';
          break;
        case 5:
          res = 'post';
          break;
        case 6:
          res = 'deploy';
          break;
        default:
          break;
      }
      return res;
    }
  },
  created() { },
  methods: {
    clickToDetail() {
      console.log(this.data.appCode, 'this.data.appCode')
      if (!this.data.appCode) return
      // 权限判断
      if (!getUserPermissionByKey('applicationManagement', 'view')) return
      this.$router.push({
        path: '/application-detail',
        query: {
          id: this.data.id,
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
.assets-card-show-wrap {
  width: 304px;
  height: 244px;
  border-radius: 4px;

  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease-in-out;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top;
  border: 2px solid transparent;
  &:hover {
    border: 2px solid #36a4ff;
    box-shadow: 0px 2px 40px -9px rgba(0, 22, 31, 0.16);
    transform: translateY(-10px);
  }
  .title {
    position: absolute;
    top: 35px;
    left: 24px;
    font-size: 18px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: #ffffff;
    width: 260px;
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
  &:hover {
    .bottom-hover {
      display: flex !important;
    }
  }
  .bottom-text {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 124px;
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
      height: 26px;
      line-height: 26px;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #4b4b4b;
      margin-bottom: 8px;
      width: 175px;
      line-height: 16px;
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
      height: 22px;
      line-height: 22px;
      text-align: left;
      margin-top: 8px;
      font-size: 14px;
      color: #8A8A8A;
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
      top: 26px;
      right: 24px;
    }
  }

  .bottom-hover {
    position: absolute;
    bottom: 124px;
    left: 0;
    width: 100%;
    height: 64px;
    display: none;
    justify-content: center;
    align-items: center;

    transition: 0.5s ease;
    background: url(~@/assets/imgs/bg-app-cord.png) no-repeat;
    background-size: 100%;
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
.fl{
  display: flex;
  align-items: center;
}
</style>
