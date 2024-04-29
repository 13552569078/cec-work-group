<!--/*
* @Author: dingli
* @Desc: 第三步 - 填写基本信息
* @Date: 2022-2-9
*/-->
<template>
  <c-form ref="refFormStep3" :model="formData" label-position="top" :disabled="isview" :class="{'disabled-new':isview}">
    <div class="bg-white">
      <h3 class="info-title" data-section="ziyuanxiangqing">资源详情</h3>
      <c-form-item label="详细说明" prop="detailDesc" :rules="rules.detailDesc">
        <vue-tinymce
          key="detailDesc2"
          :height="200"
          :editor-content="formData.detailDesc"
          :status="isview?1:0"
          class="cls-tinymce"
          @editorBlur="editorBlur1"
        />
      </c-form-item>
    </div>
    <div class="bg-white">
      <h3 class="info-title" data-section="shiyongzhinan">使用指南</h3>
      <c-form-item label="使用说明" prop="instruction" :rules="rules.instruction">
        <vue-tinymce
          key="instruction2"
          :height="200"
          :editor-content="formData.instruction"
          :status="isview?1:0"
          class="cls-tinymce"
          @editorBlur="editorBlur2"
        />
      </c-form-item>
      <c-form-item label="附件" prop="attachList" :rules="rules.attachList">
        <span v-if="isview&&!(formData.attachList&&formData.attachList.length)">--</span>
        <c-upload
          v-else
          :action="UPLOAD_URL"
          multiple
          :limit="5"
          :before-upload="beforeUpload"
          :on-success="handleUpload"
          :on-exceed="handleExceed"
          :file-list="formData.attachList">
          <span class="btn-upload">添加文件</span>
          <div slot="tip" class="c-upload__tip">至多上传5个，单个不超过50M</div>
          <div slot="file" slot-scope="{file}">
            <div class="file-item" @click.self="handlePreview(file)"><p>{{ file.name }}</p></div>
            <i class="c-icon-close" @click="handleRemove(file)" />
          </div>
        </c-upload>
      </c-form-item>
    </div>
    <!-- 文件下载 -->
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    />
  </c-form>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
const UPLOAD_FILE_URL = getProxyUrl(serviceSuffix.file_upload)
import vueTinymce from '@/components/tinymce'
export default {
  name: '',
  components: { vueTinymce },
  props: {
    isview: {
      type: Boolean,
      default: false
    },
    disabled: Boolean
  },
  data() {
    return {
      UPLOAD_URL: UPLOAD_FILE_URL + '/fdfs/upload',
      formData: {
        detailDesc: '',
        instruction: '',
        attachList: []
      },
      rules: {},
      rules2: {
        detailDesc: { required: true, message: '请填写详细说明', trigger: 'blur' },
        instruction: { required: true, message: '请填写使用说明', trigger: 'blur' }
      },
      download: {
        name: '',
        url: ''
      },
      oldData: null
    }
  },
  watch: {
    isview: {
      handler(nv) {
        if (nv) {
          this.rules = {}
        } else {
          this.rules = this.rules2
        }
        console.log(this.formData, nv, '--isview---')
      },
      immediate: true
    }
  },
  methods: {
    beforeUpload(file) {
      console.log(file)
      // 上传前狗子，单个不能超过50M
      const limit = 50 * 1024 * 1024
      if (file.size > limit) {
        this.$message.warning('单个文件不能超过50M')
        return false
      }
      return true
    },
    handleExceed() {
      // 文件超出个数限制时的钩子
      this.$message.warning('最多上传5个文件')
    },
    handlePreview(file) {
      // 点击文件列表的狗子函数
      this.download.name = file.name
      const url = file.response ? file.response.data.relativePath : file.url
      this.download.url = `${UPLOAD_FILE_URL}/fdfs/download?relativePath=${url}&filename=${encodeURI(file.name)}`
      console.log(this.download.url, '-----handlePreview')
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    },
    // 附件上传成功
    handleUpload(response, file, fileList) {
      if (response.code !== 0) {
        this.formData.attachList = [...this.formData.attachList]
        return this.$message.error(response.msg || '上传失败')
      }
      this.formData.attachList = fileList
      // this.$refs.refFormStep3.validateField('attachList')
    },
    // 附件删除
    handleRemove(file) {
      if (this.isview) return
      this.formData.attachList = this.formData.attachList.filter(d => d.uid !== file.uid)
      // this.$refs.refFormStep3.validateField('attachList')
    },
    // 编辑器失去焦点
    editorBlur1(content) {
      console.log('----editorBlur1-----')
      this.$set(this.formData, 'detailDesc', content)
      // this.formData.detailDesc = content
      this.$refs.refFormStep3.validateField('detailDesc')
    },
    editorBlur2(content) {
      console.log('----editorBlur2-----')
      this.$set(this.formData, 'instruction', content)
      // this.formData.instruction = content
      this.$refs.refFormStep3.validateField('instruction')
    },
    getFromData() {
      if (this.$refs.refFormStep3.$el.querySelector('.c-form-item__error')) return false
      const params = {
        detailDesc: this.formData.detailDesc,
        instruction: this.formData.instruction,
        attachList: []
      }
      params.attachList = Array.isArray(this.formData.attachList) ? this.formData.attachList.map(d => ({
        fileName: d.name,
        filePath: d.response ? d.response.data.relativePath : d.url
      })) : []
      const change = this.getChange(params)
      return {
        change,
        data: params
      }
    },
    getChange(data) {
      if (!this.oldData) return true
      if (data.detailDesc !== this.oldData.detailDesc) return true
      if (data.instruction !== this.oldData.instruction) return true
      if (data.attachList.length !== this.oldData.attachList.length) return true
      for (let i = 0; i < data.attachList.length; i++) {
        const item = this.oldData.attachList[i]
        if (!item) {
          return true
        }
      }
      return false
    },
    // 校验表单
    validate() {
      let flag
      this.$refs.refFormStep3.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFromData()
      })
      return flag
    },
    initForm(data, change) {
      data.attachList = data.attachList || []
      this.oldData = data
      if (change) return
      this.$set(this.formData, 'detailDesc', data.detailDesc)
      this.$set(this.formData, 'instruction', data.instruction)
      this.formData.attachList = data.attachList.map((d, i) => ({ name: d.fileName, url: d.filePath }))
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.bg-white {
  padding: 20px 40px;
  margin-bottom: 20px;
  background: white;
  .info-title {
    margin-left: -20px;
  }
}

.pt22 {
  padding-top: 22px;
}
::v-deep.c-form {
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  .c-upload-list {
    max-width: 1220px;
    .c-upload-list__item {
      display: inline-block;
      width: 395px;
      margin-right: 15px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .c-icon-close {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  &.disabled-new .c-icon-close {
    opacity: 0;
  }
}
.btn-upload {
  position: relative;
  display: inline-block;
  width: 160px;
  height: 48px;
  line-height: 48px;
  padding-left: 42px;
  border-radius: 2px;
  border: 1px solid $primaryColor;
  color: $primaryColor;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    top: 50%;
    transform: translateY(-50%);
    left: 30px;
    background: url(~@/assets/imgs/upload.png) no-repeat center;
  }
}
.cls-tinymce {
  border-radius: 2px;
}
.file-item {
  width: 400px;
  position: relative;
  display: inline-block;
  height: 56px;
  line-height: 56px;
  padding-left: 56px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  background: #F9FAFE;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    background: url(~@/assets/imgs/pack.png) no-repeat center;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.disabled-new {
  ::v-deep.c-form-item {
    margin-bottom: 20px !important;
  }
}
</style>
