<template>
  <cestc-dialog v-bind="$attrs" :title="mode" width="456px" v-on="$listeners" @confirm="_confirm">
    <el-upload
      ref="uploadEventType"
      class="upload-type"
      drag
      action
      :limit="limitNum"
      :before-upload="beforeUpload"
      :auto-upload="false"
      :headers="{
        Authorization: getToken
      }"
      :data="{
        sourceSystemCode: getSourceSystemCode
      }"
      :on-exceed="exceedFile"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-change="handleChange"
      :before-remove="beforeRemove"
      accept=".xlsx, .xls"
      :file-list="fileList"
      :http-request="handleFileUpload"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div slot="tip" class="el-upload__tip">
        <div class="tips">
          <div>
            请下载
            <span class="template-btn" @click="downLoad">事件类型模版</span>并按照模板编辑
          </div>
          <div>请上传10M以内的.xls、.xlsx文件，仅支持上传一个文件</div>
        </div>
      </div>
    </el-upload>
  </cestc-dialog>
</template>
<script>
import eventTypeModuleSrv from '@/api/eventType'
import baseUrlMap from '@/utils/config'
import axios from 'axios'

export default {
  name: 'TemplateImportDialog',
  data() {
    return {
      limitNum: 1,
      matchTitle: '全量导入',
      fileList: []
    }
  },
  computed: {
    getSourceSystemCode() {
      return this.$attrs['selected-third-system'] ? this.$attrs['selected-third-system']?.platformCode : '100'
    },
    mode() {
      return this.$attrs.mode === 'all' ? '全量导入' : '增量导入'
    },
    actionUrl() {
      return this.$attrs.mode === 'all' ? `${baseUrlMap.event}/eventExcel/eventTypeImportAll` : `${baseUrlMap.event}/eventExcel/eventTypeImportAppend`
    },
    getToken() {
      return localStorage.getItem('token')
    }
  },

  watch: {
  },
  methods: {
    _confirm() {
      if (this.fileList.length) {
        this.$refs.uploadEventType.submit()
      } else {
        this.$message.error('请选择文件')
      }
    },
    handleFileUpload(params) {
      const file = params.file
      console.log(70, file)
      const form = new FormData()
      form.append('file', file)
      form.append('sourceSystemCode', this.getSourceSystemCode)
      axios({
        method: 'post',
        url: this.actionUrl,
        headers: {
          'Content-type': 'multipart/form-data;charset=utf-8',
          Authorization: this.getToken
        },
        responseType: 'arraybuffer',
        data: form
      }).then(
        _res => {
          const response = _res.data
          try {
            // 上传失败 将 UTF-8 格式的字节序列解码为文本
            const jsonObject = JSON.parse(new TextDecoder().decode(new Uint8Array(response)))
            jsonObject?.code && this.$message.error(jsonObject.message)
          } catch {
            // 上传成功 流返回
            this.$message.success('导入成功，导入结果已下载，请核查导入结果！')
            const fileName = decodeURI(_res.headers['content-disposition'].split(';')[1].split('=')[1])
            this.saveAs(response, fileName)
            this.$emit('uplaodSuccess')
          }
        }, _err => {
          this.$message.error(_err.message)
        })
    },
    UploadUrl() {
      return ''
    },
    isJsonString(obj) {
      try {
        /*
        判断条件 1. 排除null可能性
                2. 确保数据是对象或数组
        */
        if (obj && typeof obj === 'object') {
          return true
        }
      } catch {
        //
      }
      return false
    },

    beforeRemove(file, fileList) {
      this.fileList = []
      return true
    },

    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      // 对上传结果进行判断
      console.log('===========', res, file, fileList)
    },
    // 文件上传失败时的钩子
    handleError(_err, _file, _fileList) {
      this.$message.error('文件导入失败')
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`)
    },
    // 文件状态改变时的钩子
    handleChange(file, _fileList) {
      console.log(file.raw)
      this.fileList = _fileList
      console.log(this.fileList)
    },
    beforeUpload(file) {
      const isExcel = ['xls', 'xlsx'].includes(file.name.substring(file.name.lastIndexOf('.') + 1))
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isExcel) {
        this.$message.error('上传必须是Excel格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传Excel大小不能超过 10MB!')
      }
      return isExcel && isLt10M
    },
    saveAs(blob, fileName) {
      const url = window.URL.createObjectURL(new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      link = null
    },
    async downLoad() {
      const serviceRes = await eventTypeModuleSrv[this.$attrs['selected-third-system'] ? 'getThirdDownLoad' : 'getDownLoad'](null, { responseType: 'blob' })
      const fileName = decodeURI(serviceRes.headers['content-disposition'].split(';')[1].split('=')[1])
      this.saveAs(serviceRes.data, fileName)
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-type {
  ::v-deep {
    @include importOrExport;
  }
}
</style>
