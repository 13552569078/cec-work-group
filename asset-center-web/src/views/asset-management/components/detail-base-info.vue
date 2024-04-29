<!--/*
* @Author:
* @Desc:
* @Date:
*/-->
<template>
  <div class="box-wrap">
    <div class="header">
      <div class="border"></div>
      <div class="title">基本信息</div>
    </div>
    <c-form label-position="left">
      <div class="item-wrap">
        <c-form-item label="资源名称">{{ formData.assetName }}</c-form-item>
        <c-form-item label="资源编码">
          <template slot="label">
            <span>
              资源编码
              <c-tooltip placement="top" popper-class="cls-form-label-tip">
                <div slot="content" class="hahah" v-html="AssetCodeToolTipText">
                </div>
                <i class="cls-icon-info"></i>
              </c-tooltip>
            </span>
          </template>
          {{ formData.assetCode }}
        </c-form-item>
        <c-form-item v-if="!hideScene" label="场景分类">{{ formData.sceneName || '--' }}</c-form-item>
        <c-form-item v-if="(formData.status !== 1)" label="版本号">{{ formData.version }}</c-form-item>
        <c-form-item v-if="(formData.subtype==72)" label="模型类型">{{ mxTypeListFormat(formData.businessType) }}</c-form-item>
        <c-form-item v-if="(formData.subtype==14)" label="体征类型">{{ tzTypeListFormat(formData.businessType) }}</c-form-item>
        <c-form-item v-if="(formData.subtype==23)" label="页面类型">{{ pageTypeListFormat(formData.businessType) }}</c-form-item>
        <c-form-item v-if="(formData.businessType==='2')" label="模板选择">{{ formData.navType==1?'顶部导航':'左侧导航' }}</c-form-item>
        <c-form-item label="资源状态">
          <span slot="label">
            <span class="lable">资源状态</span>
          </span>
          {{ formData.statusName }}
          <span class="log-btn" @click="showLog">查看日志</span>
        </c-form-item>
      </div>
      <div class="item-wrap">
        <c-form-item v-if="(formData.subtype==72)" label="发布方">{{ formData.publisher||'--' }}</c-form-item>
        <c-form-item v-if="(formData.assetType==5)" label="流程图">
          <span v-if="!formData.imgUrl">--</span>
          <span v-else class="img" @click.stop="(imgDialogVisible=true)">{{ imageName(formData.imgUrl) }}</span>
        </c-form-item>
        <c-form-item label="资源描述"><p v-html="textAreaFormt(formData.assetDesc)"></p></c-form-item>
        <c-form-item v-if="(formData.status !== 1)" label="版本说明"><p v-html="textAreaFormt(formData.versionDesc)"></p></c-form-item>
      </div>
      <div class="item-wrap">
        <c-form-item label="资源标签">
          <span v-if="!(formData.tagList&&formData.tagList.length)">--</span>
          <div v-else>
            <span v-for="(d, i) in formData.tagList" :key="i" class="tag-item">{{ d.groupName }}</span>
          </div>
        </c-form-item>
        <c-form-item v-if="(formData.subtype==14||formData.subtype==72)" label="请求参数实例"><p v-html="textAreaFormt(formData.requestExample)"></p></c-form-item>
        <c-dialog :visible.sync="imgDialogVisible" class="dialog-center">
          <div style="max-height:80vh;overflow: auto;">
            <img width="100%" style="max-width:100%;max-height:100%;" :src="formData.imgUrl" alt="">
          </div>
        </c-dialog>
      </div>
    </c-form>
  </div>
</template>
<script>
import { AssetCodeToolTipText } from '@/config/index'
import { pageTypeList } from '@/config'
export default {
  name: '',
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hideScene: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      AssetCodeToolTipText,
      imgDialogVisible: false,
      pageTypeList,
      tzTypeList: window.__systemConfig && window.__systemConfig.bizType && window.__systemConfig.bizType.tzList && window.__systemConfig.bizType.tzList.map(item => {
        return { label: item.name, value: item.type }
      }) || [],
      mxTypeList: window.__systemConfig && window.__systemConfig.bizType && window.__systemConfig.bizType.modelList && window.__systemConfig.bizType.modelList.map(item => {
        return { label: item.name, value: item.type }
      }) || []
    }
  },
  methods: {
    imageName(url) {
      if (!url) return ''
      const i = url.lastIndexOf('.')
      return '流程图' + url.substr(i)
    },
    showLog() {
      this.$emit('showLog')
    },
    textAreaFormt(str) {
      str = str || '--'
      return str.replace(/\r|\n/g, '<br>')
    },
    pageTypeListFormat(k) {
      const d = this.pageTypeList.find(d => +d.value === +k)
      if (d) return d.label
      return '--'
    },
    tzTypeListFormat(k) {
      const d = this.tzTypeList.find(d => d.value === k)
      console.log(this.tzTypeList, k, d)
      if (d) return d.label
      return '--'
    },
    mxTypeListFormat(k) {
      const d = this.mxTypeList.find(d => d.value === k)
      console.log(this.mxTypeList, k, d)
      if (d) return d.label
      return '--'
    }
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables.scss';
.header {
  height: 64px;
  line-height: 64px;
  padding-left: 20px;
  margin-bottom: 0px;
}
.box-wrap {
  position: relative;
  border-bottom: 20px solid #f3f4fb;

  padding-bottom: 20px;
  background-color: white;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    right: -158px;
    top: 0px;
    width: 574px;
    height: 342px;
    background-image: url(~@/assets/imgs/form-bg.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0px -246px;
    z-index: 0;
  }
  .img {
    color: $primaryColor;
    cursor: pointer;
    padding-left: 24px;
    background-image: url(~@/assets/imgs/icon-img.png);
    background-size: 20px 20px;
    background-repeat: no-repeat;
  }
  .item-wrap {
    padding-left: 40px;
    flex: 1;
    border-right: 1px solid #E4E9ED;
    &:last-child {
      border-right: 0;
    }
  }
  .tag-item {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    padding: 0px 4px;
    margin-right: 8px;
    margin-bottom: 12px;
    border: 1px solid #E4E9ED;
    background: #F6F9FB;
    font-size: 12px;
    color: #8A8A8A;
  }
}
::v-deep.c-form {
  display: flex;
  .c-form-item__label {
    line-height: 22px;
    color: #8A8A8A;
  }
  .c-form-item__content {
    line-height: 22px;
    margin-left: 100px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
    color: #4B4B4B;
  }
}
</style>
