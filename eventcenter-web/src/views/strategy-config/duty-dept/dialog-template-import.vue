<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    width="456px"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-upload
      ref="uploadEventType"
      class="upload-type"
      drag
      action
      :limit="limitNum"
      :before-upload="beforeUpload"
      :auto-upload="false"
      :headers="{
        Authorization: getToken,
      }"
      :on-exceed="exceedFile"
      :on-change="handleChange"
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
            <span class="template-btn" @click="downLoad">职能部门模板</span>并按照模板编辑
          </div>
          <div>请上传10M以内的.xls、.xlsx文件，仅支持上传一个文件</div>
        </div>
      </div>
    </el-upload>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'

export default {
  name: 'TemplateImportDialog',
  data() {
    return {
      limitNum: 1,
      fileList: []
    }
  },
  computed: {
    matchTitle() {
      return this.$attrs.mode === 'all' ? '全量导入' : '增量导入'
    },
    getToken() {
      return localStorage.getItem('token')
    }
  },
  watch: {
    '$attrs.visible': {
      handler(val) {
        if (!val) {
          // 关闭
          this.fileList = []
        }
      }
    }
  },

  methods: {
    _confirm() {
      if (this.fileList.length) {
        this.$refs.uploadEventType.submit()
      } else {
        this.$message.error('请选择文件')
      }
    },
    _cancle() {
      this.$emit('update:visible', false)
    },
    async handleFileUpload(params) {
      console.log('params==', params)
      const file = params.file
      const form = new FormData()
      form.append('file', file)

      let serviceRes = null
      try {
        if (this.$attrs.mode === 'all') {
          serviceRes = await moduleSrv.dutyDeptImportAll(form, { responseType: 'blob' })
        } else {
          serviceRes = await moduleSrv.dutyDeptImportAppend(form, { responseType: 'blob' })
        }
        const fileName = decodeURI(
          serviceRes.headers['content-disposition'].split(';')[1].split('=')[1]
        )
        this.saveAs(serviceRes.data, fileName)
        this._cancle()
        this.$emit('reflash')
      } catch (error) {
        serviceRes.data.text().then(res => {
          res = JSON.parse(res)
          this.$message.error(res.message)
          this.fileList = []
        })
      }
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(
        `只能选择 ${this.limitNum} 个文件，当前共选择了 ${
          files.length + fileList.length
        } 个`
      )
    },
    // 文件状态改变时的钩子
    handleChange(_file, _fileList) {
      this.fileList = _fileList
    },

    beforeUpload(file) {
      const isExcel = ['xls', 'xlsx'].includes(
        file.name.substring(file.name.lastIndexOf('.') + 1)
      )
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
      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      )
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
      const serviceRes = await moduleSrv.downloadTemplateDutyDept(null, { responseType: 'blob' })
      const fileName = decodeURI(
        serviceRes.headers['content-disposition'].split(';')[1].split('=')[1]
      )
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
