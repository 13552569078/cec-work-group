<!--/*
* @Author: dingli
* @Desc: 从下载新增应用
* @Date: 2022-4-22
*/-->
<template>
  <c-dialog
    width="996px"
    class="details-dialog dialog-center"
    top="32px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="closeDetailDialog"
  >
    <template slot="title">
      <span style="display: flex;align-items: center;line-height: 20px;font-size: 14px; color: #4B4B4B; font-weight: 500;">
        选择下载应用
        <c-tooltip placement="right" popper-class="cls-form-label-tip">
          <span slot="content" class="hahah" v-html="'列表中应用已过滤：一个下载应用只能创建一个应用，创建应用删除后可再次创建。'">
          </span>
          <i class="cls-icon-info" style="margin-left:4px"></i>
        </c-tooltip>
      </span>
    </template>
    <refer-download v-if="step==1" :init="stepData" @close="closeDialog" @next="clickNext" />
    <addEditApp
      v-if="step==2"
      flag="download"
      :selectdata="formData"
      :group-id="groupTag.groupId"
      :group-name="groupTag.groupName"
      @close="closeDialog"
      @laststep="lastStep"
      @downloadok="clickSave"
    />
  </c-dialog>
</template>
<script>
import { importAppByDownload } from '@/api/index';
import ReferDownload from './refer-download.vue';
import addEditApp from './add-edit-app.vue';
export default {
  name: 'DialogAddFormDownload',
  components: { ReferDownload, addEditApp },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    groupTag: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      step: 1,
      stepData: null,
      formData: null,
      parseData: null
    };
  },
  watch: {
    visible(nv) {
      console.log(nv, 'ddd')
      this.step = nv ? 1 : 0
      this.dialogVisible = nv
      if (!nv) {
        this.stepData = null
      }
    }
  },
  methods: {
    closeDetailDialog() {
      console.log('ddddd')
      this.$emit('close', false)
    },
    closeDialog(needSearch = false) {
      this.$emit('close', needSearch)
    },
    lastStep() {
      this.step = 1
    },
    clickSave(data) {
      console.log(data, 'data')
      const h = this.$createElement;
      const referAssetList = this.parseData && this.parseData.referAssetList || []
      const referSubAssetList = this.parseData && this.parseData.referSubAssetList || []
      let str = []
      if (referAssetList.length) {
        str.push(`绑定的${referAssetList.length}个资源（${referAssetList.map((d) => d.assetName).join('、')}）`)
      }
      if (referSubAssetList.length) {
        str.push(`${referAssetList.length ? '、' : ''}订阅的${referSubAssetList.length}个资源（${referSubAssetList.map((d) => d.assetName).join('、')}）`)
      }
      if (str.length) {
        str.unshift('该应用')
        str.push('将同步创建')
      }
      if (str.length === 4) {
        str.push('，使用订阅资源需在资源商城中完成资源订阅，获取授权信息')
      }
      str = str.join('')
      const style = str ? 'font-size:12px;line-height:16px;margin-top:10px;' : '';
      this.$confirm(
        h('p', null, [
          h('p', null, '请确认是否新建该应用？'),
          h('p', { style: style }, str)
        ]),
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          confirmButtonIsLeft: false,
          iconClass: 'c-ioc-icon-warning',
          type: 'warning'
        }
      )
        .then(() => {
          const params = {
            ...data,
            appType: data.appType && data.appType.map(item => +item)
          }
          const loading = this.$loading({
            lock: true,
            text: '创建中...',
            fullscreen: false,
            background: 'rgba(0, 0, 0, 0)'
          });
          importAppByDownload(params).then((res) => {
            if (res.code * 1 === 0) {
              this.$message.success(res.msg || '导入成功');
              loading.close()
              this.closeDialog(res.data.id || true);
            }
          }).catch(() => {
            loading.close()
          });
        })
        .catch(() => {});
    },
    clickNext(arr) {
      this.stepData = arr[0]
      this.formData = {
        shopCode: this.stepData.shopCode,
        packVersion: this.stepData.packVersion,
        packVersionId: this.stepData.packVersionId,
        referPackVersionId: this.stepData.referPackVersionId
      }
      this.step = 2
    }
  }
};
</script>
<style scoped lang="scss">
</style>
