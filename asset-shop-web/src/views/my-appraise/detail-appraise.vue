<!--/*
* @Author:
* @Desc:
* @Date:
*/-->
<template>
  <div class="cls-appraise-wrap">
    <div class="asset-info-wrap flex items-center">
      <i :class="`img ${assetClass(formData)}`" :style="coverImg(formData.coverConfigJson)"></i>
      <div class="asset-info-content">
        <p class="name">{{ formData.packName||'--' }}</p>
        <p class="flex">
          <span class="type">{{ asseTypeFormatLong(formData.assetType, formData.assetSubtype)||'--' }}</span>
          <span class="version">{{ formData.packVersion||'--' }}</span>
        </p>
        <p class="desc">{{ formData.packDesc||'--' }}</p>
      </div>
    </div>
    <div class="appraise-info-wrap" :class="{'showReplyBtn':showReplyBtn}">
      <h3 class="info-title">评价内容</h3>
      <c-form
        ref="refForm"
        :model="formData"
        :rules="rules"
        class="ml-[40px]"
        label-position="top">
        <c-form-item label="" prop="scoreDetail" :label-top-no-padding="true">
          <div class="cls-rate-wrap">
            <span class="cls-rate-label">描述相符度</span>
            <c-rate v-model="formData.scoreDetail.descConform" allow-half show-score score-template="{value}" disabled></c-rate>
          </div>
          <div class="cls-rate-wrap">
            <span class="cls-rate-label">资源有效性</span>
            <c-rate v-model="formData.scoreDetail.assetValid" allow-half show-score score-template="{value}" disabled></c-rate>
          </div>
          <div class="cls-rate-wrap">
            <span class="cls-rate-label">资源完整性</span>
            <c-rate v-model="formData.scoreDetail.assetComplete" allow-half show-score score-template="{value}" disabled></c-rate>
          </div>
          <div class="cls-rate-wrap">
            <span class="cls-rate-label">服务响应速度</span>
            <c-rate v-model="formData.scoreDetail.resRate" allow-half show-score score-template="{value}" disabled></c-rate>
          </div>
        </c-form-item>
        <c-form-item label="" prop="content" class="maxw800">
          <div>{{ formData.content }}</div>
        </c-form-item>
        <c-form-item v-if="formData.attachment&&formData.attachment.length" label="">
          <c-image
            v-for="img,i in formData.attachment"
            :key="i"
            style="width:128px;height:128px;border-radius:4px;margin-right:12px;"
            :src="`${PREVIEW_URL}${img.filePath}`"
            :preview-src-list="[`${PREVIEW_URL}${img.filePath}`]"
            fit="cover"></c-image>
        </c-form-item>
        <c-form-item label="">
          <p>{{ formData.appraiseTime }}</p>
        </c-form-item>
        <c-form-item v-if="formData.replyContent" label="回复" class="reply-content">
          <p>{{ formData.replyContent }}</p>
        </c-form-item>
      </c-form>
    </div>
    <div v-if="showReplyBtn" class="cls-btn-bar">
      <c-button
        type="primary"
        size="small"
        plain
        @click="replyDialogFlag=true"
      >回复评价</c-button>
    </div>
    <c-dialog
      :visible.sync="replyDialogFlag"
      title="回复评价"
      width="500px"
      :class="'dialog-center'"
      @close="replyDialogFlag=false">
      <c-form
        ref="refReplyForm"
        :model="replyForm"
        :rules="rules">
        <c-form-item label="评价内容" prop="replyContent">
          <c-input
            v-model="replyForm.replyContent" size="small" resize="none" type="textarea"
            maxlength="200" placeholder="请输入" show-word-limit :rows="4" clearable />
        </c-form-item>
      </c-form>
      <span slot="footer" class="dialog-footer">
        <c-button type="" size="small" @click="replyDialogFlag=false">取消</c-button>
        <c-button type="primary" size="small" :disabled="loading" @click="clickOk">确定</c-button>
      </span>
    </c-dialog>
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { appraiseDetail, appraiseReply } from '@/api'
import { asseTypeFormatLong } from '@/utils/enum'
export default {
  name: '',
  components: {},
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      DOWNLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/download',
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      id: this.$route.query.id,
      flag: this.$route.query.flag,
      formData: {
        packName: '',
        packVersion: '',
        packDesc: '',
        content: '',
        scoreDetail: {
          'descConform': 0,
          'assetValid': 0,
          'assetComplete': 0,
          'resRate': 0
        },
        attachment: [],
        appraiseTime: '',
        replyContent: ''
      },
      replyDialogFlag: false,
      replyForm: {
        id: this.$route.query.id,
        replyContent: ''
      },
      rules: {
        replyContent: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      loading: false,
      asseTypeFormatLong
    }
  },
  computed: {
    showReplyBtn() {
      return (this.flag === 'received' && !this.formData.replyContent)
    }
  },
  watch: {
    replyDialogFlag(nv) {
      if (!nv) {
        this.replyForm.replyContent = ''
        this.$nextTick(() => {
          this.$refs.refReplyForm.clearValidate()
        })
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    coverImg(coverConfigJson) {
      const item = coverConfigJson ? JSON.parse(coverConfigJson) : {}
      if (item && item.path) {
        return `background-image:url(${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/${item.path});background-size:cover;`
      }
      return ''
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
    clickOk() {
      this.$refs.refReplyForm.validate(valid => {
        if (!valid) return
        this.loading = true
        appraiseReply(this.replyForm).then(res => {
          this.replyDialogFlag = false
          this.loading = false
          this.getDetail()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    async getDetail() {
      try {
        const res = await appraiseDetail(this.id)
        if (res.data.scoreDetail && typeof res.data.scoreDetail === 'string') {
          res.data.scoreDetail = JSON.parse(res.data.scoreDetail) || {}
        }
        if (res.data.attachment && typeof res.data.attachment === 'string') {
          res.data.attachment = JSON.parse(res.data.attachment) || []
        }
        this.formData = res.data
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.cls-appraise-wrap {
  margin-top: 20px;
  height: calc(100% - 94px);
  .asset-info-wrap {
    position: relative;
    background: white;
    margin-bottom: 20px;
    height: 240px;
    padding-left: 40px;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 444px;
      height: 256px;
      background-image: url(~@/assets/imgs/detail-bg.svg);
      background-position: -44px -373px;
      background-size: 638px 835px;
      background-repeat: no-repeat;
      z-index: 1;
    }
    .asset-info-content {
      z-index: 2;
    }
    .img {
      margin-right: 32px;
      width: 160px;
      height: 160px;
      background-size: 48px 48px;
      background-position: center;
      background-repeat: no-repeat;
    }
    .name {
      margin-bottom: 16px;
      line-height: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 20px;
      font-weight: 500;
      color: #202020;
    }
    .type {
      height: 22px;
      line-height: 22px;
      padding: 0 8px;
      border: 1px solid rgba(255, 255, 255, 0);
      background: #F6F9FB;
      color: #4B4B4B;
      border-radius: 2px;
      margin-right: 12px;
    }
    .version {
      height: 22px;
      line-height: 22px;
      min-width: 72px;
      padding-left: 28px;
      background-image: url(~@/assets/imgs/version.png);
      background-position: left top;
      background-size: auto 100%;
      background-repeat: no-repeat;
    }
    .desc {
      margin-top: 16px;
      width: 780px;
      padding: 12px;
      line-height: 22px;
      color: #4B4B4B;
      background: #F6F9FB;
    }
  }
  .appraise-info-wrap {
    height: calc(100% - 260px);
    padding-top: 20px;
    background: white;
  }
  .appraise-info-wrap.showReplyBtn  {
    height: calc(100% - 320px);
  }
  .c-form {
    height: calc(100% - 50px);
    flex: 1;
    overflow: auto;
    .maxw800 {
      max-width: 800px;
    }
  }
  .cls-btn-bar {
    background: white;
    padding: 16px 20px;
    box-shadow: 0 -2px 7px 0 rgb(0 0 0 / 6%);
  }
}
.cls-rate-wrap {
  display: flex;
  align-items: center;
  .cls-rate-label {
    display: inline-block;
    width: 100px;
  }
}
.info-title {
  margin-left: 20px;
  position: relative;
  .icon-info {
    position: absolute;
    top: 3px;
    left: 90px;
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(~@/assets/imgs/icon-info.png) no-repeat center;
    background-size: 100%;
  }
}
::v-deep.c-form {
  .c-rate__text {
    margin-left: 20px;
  }
  .reply-content {
    margin-right: 40px;
    padding: 16px 20px !important;
    background: #F6F9FB;
    color: #8A8A8A;
    .c-form-item__label {
      font-size: 14px !important;
      font-weight: 500 !important;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #4B4B4B;
    }
  }
}
</style>
