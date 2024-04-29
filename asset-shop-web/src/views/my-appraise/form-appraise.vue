<!--/*
* @Author:
* @Desc:
* @Date:
*/-->
<template>
  <div class="cls-appraise-wrap">
    <h3 class="info-title">资源评分
      <c-tooltip placement="right">
        <div slot="content">相符度、有效性、完整性、响应速度的权重系数分别为：0.2、0.35、0.3、0.15，将按照上述计算标准得出综合星级并在评价列表展示。</div>
        <i class="icon-info" />
      </c-tooltip>
    </h3>
    <c-form
      ref="refForm"
      :model="formData"
      :rules="rules"
      label-position="top">
      <c-form-item label="" prop="scoreDetail" :label-top-no-padding="true">
        <div class="cls-rate-wrap">
          <span class="cls-rate-label">描述相符度</span>
          <c-rate v-model="formData.scoreDetail.descConform" allow-half show-score score-template="{value}" @change="rateChange"></c-rate>
        </div>
        <div class="cls-rate-wrap">
          <span class="cls-rate-label">资源有效性</span>
          <c-rate v-model="formData.scoreDetail.assetValid" allow-half show-score score-template="{value}" @change="rateChange"></c-rate>
        </div>
        <div class="cls-rate-wrap">
          <span class="cls-rate-label">资源完整性</span>
          <c-rate v-model="formData.scoreDetail.assetComplete" allow-half show-score score-template="{value}" @change="rateChange"></c-rate>
        </div>
        <div class="cls-rate-wrap">
          <span class="cls-rate-label">服务响应速度</span>
          <c-rate v-model="formData.scoreDetail.resRate" allow-half show-score score-template="{value}" @change="rateChange"></c-rate>
        </div>
      </c-form-item>
      <c-form-item label="评价" prop="content">
        <c-input
          v-model="formData.content" size="small" resize="none" type="textarea"
          style="width:600px;"
          maxlength="200" placeholder="写点评价吧，您的评价对资源及服务升级有很大帮助的" show-word-limit :rows="4" clearable />
      </c-form-item>
      <c-form-item label="" prop="file" :label-top-no-padding="true">
        <c-upload
          :action="UPLOAD_URL"
          :limit="5"
          list-type="picture-card"
          accept=".jpeg,.jpg,.png,.gif"
          :on-success="handleUploadImg"
          :before-upload="beforeUploadImg"
          :file-list="fileList"
        >
          <div class="c-upload-tip_box">
            <i class="c-ioc-icon-upload"></i>
            <div class="c-upload-text">上传图片</div>
          </div>
          <div slot="file" slot-scope="{file}" class="img-wrap">
            <img
              class="c-upload-list__item-thumbnail"
              :src="file.url" alt=""
              style="width:118px;height:118px;object-fit:cover;"
            >
            <span class="c-upload-list__item-actions">
              <span
                class="c-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="c-icon-zoom-in"></i>
              </span>
              <span
                class="c-upload-list__item-delete"
                @click="handleRemoveImg(file)"
              >
                <i class="c-icon-delete"></i>
              </span>
            </span>
          </div>
          <div slot="tip" class="c-upload__tip">请上传图片，最多5张</div>
        </c-upload>
      </c-form-item>
    </c-form>
    <div class="cls-btn-bar">
      <c-button
        type="primary"
        size="small"
        :class="'dialog-center'"
        @click="clickOk"
      >发表评价</c-button>
    </div>
    <c-dialog :visible="!!dialogImageUrl" @close="dialogImageUrl=''">
      <img width="100%" :src="dialogImageUrl" alt="">
    </c-dialog>
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { appraiseAdd } from '@/api'
export default {
  name: '',
  components: {},
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      formData: {
        shopApplyId: this.$route.query.applyId,
        content: '',
        scoreDetail: {
          'descConform': 0,
          'assetValid': 0,
          'assetComplete': 0,
          'resRate': 0
        }
      },
      fileList: [],
      dialogImageUrl: '',
      rules: {
        content: [
          { required: true, message: '请输入评价意见', trigger: 'blur' }
        ],
        scoreDetail: [
          { required: true, validator: (rule, val, cb) => {
            const scoreDetail = this.formData.scoreDetail
            if (!(scoreDetail.descConform && scoreDetail.assetValid && scoreDetail.assetComplete && scoreDetail.resRate)) {
              return cb('请选择评分')
            }
            cb()
          }, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    rateChange() {
      if (this.formData.rate1 && this.formData.rate2 && this.formData.rate3 && this.formData.rate4) {
        this.$refs.refForm.validateField('rate1')
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
    },
    handleRemoveImg(file) {
      this.fileList = this.fileList.filter(d => d.uid !== file.uid)
    },
    handleUploadImg(response, file, fileList) {
      // 上传成功
      if (response.code !== 0) {
        this.$message.error(response.msg || '上传失败')
      }
      this.fileList = fileList
    },
    beforeUploadImg(file) {
      const reg = /\.(jpeg|jpg|png|gif)$/i
      if (!reg.test(file.name)) {
        this.$message.warning('请上传 jpeg/jpg/png/gif 格式的图片')
        return false
      }
      return true
    },
    clickOk() {
      this.$refs.refForm.validate(valid => {
        if (!valid) return
        const params = {
          ...this.formData,
          scoreDetail: JSON.stringify(this.formData.scoreDetail)
        }
        if (this.fileList && this.fileList.length) {
          const attachment = this.fileList.map(d => ({
            fileName: d.name,
            filePath: d.response.data.relativePath
          }))
          params.attachment = JSON.stringify(attachment)
        }
        appraiseAdd(params).then(res => {
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.cls-appraise-wrap {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background: white;
  height: calc(100% - 94px);
  padding-top: 20px;
  .c-form {
    margin: 0px 0px 0 40px;
    flex: 1;
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
  .is-required .c-form-item__label {
    &::before {
      display: none !important;
    }
  }
}
</style>
