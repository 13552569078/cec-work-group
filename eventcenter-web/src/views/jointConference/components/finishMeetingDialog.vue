<template>
  <el-dialog
    title="会议纪要"
    width="594px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="top"
      label-width="100px"
      class="form-in-dialog"
      :class="{'info-form' : formDisabled}"
      top="10vh"
    >
      <el-form-item label="会议结论" type="text" prop="meetingSummaryConclusion">
        <el-input
          v-model="formData.meetingSummaryConclusion"
          type="textarea"
          :rows="2"
          size="small"
        />
      </el-form-item>
      <el-form-item label="上传会议纪要" class="item-row" prop="fileList">
        <el-upload
          ref="imageUpload"
          :disabled="dialogMode === 'view'"
          multiple
          :action="uploadUrl"
          :file-list="uploadFileList"
          :on-success="imageUploadSuccess"
          :on-change="imageUploadChange"
          :on-remove="imageUploadChange"
          :on-preview="imagePreivew"
        >
          <div slot="trigger" class="upload-trigger">
            <el-button :disabled="dialogMode === 'info'" class="mr8 width-auto">
              <i class="el-icon-upload" />
              上传附件</el-button>
            <div :style="{ cursor: 'initial' }" class="upload_tips">
              请上传会议纪要文件、视频、音频等内容，单个文件大小不超过50M
            </div>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <template v-if="!formDisabled">
        <el-button @click="close">取消</el-button>
        <el-button v-loading="submitLoading" type="primary" @click="confirm">提交</el-button>
      </template>
    </div>

  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import blobToDataURL from '@/utils/blobToDataURL'
import { SUCCESS_CODE } from '@/constants'

export default {
  components: {
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formBody: {
      type: Object,
      default: () => {}
    },
    similarObj: {
      type: Object,
      default: () => {}
    },
    groupId: {
      required: true,
      type: [Number, String]
    },
    dialogMode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tagOptionList: [],
      resMoreIdList: [],
      submitLoading: false,
      uploadUrl: moduleSrv.uploadUrl,
      uploadFileList: [],
      formData: {
        fileList: []
      },
      showMemberDialog: false,
      rules: {
        meetingSummaryConclusion: [
          { required: true, message: '会议主题，不超过50个字', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '请选择角色权限', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formTitle() {
      return this.dialogMode === 'add' ? '添加角色' : this.dialogMode === 'edit' ? '编辑角色' : '角色详情'
    },
    formDisabled() {
      return this.dialogMode === 'info'
    }
  },
  created() {
  },
  methods: {
    treeChange(data) {
      this.resMoreIdList = data
    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
    goBack() {
      this.$router.push({
        path: '/joint-conference/meeting-query'
      })
    },
    addMember() {
      this.showMemberDialog = true
    },
    async imagePreivew(file) {
      this.imagePreivewList = file.url
        ? [file.url]
        : [await blobToDataURL(file.raw)]
      const others = this.uploadFileList.filter(
        (item) => item.uid !== file.uid
      )
      for (let i = 0; i < others.length; i++) {
        this.imagePreivewList.push(
          others[i].url || (await blobToDataURL(others[i].raw))
        )
      }
      // this.form.fileList.push({
      //   meetingSummaryFileDownUrl: file.url,
      //   meetingSummaryFileViewUrl: file.url,
      //   meetingSummaryFileName: file.name
      // })
      this.showPreview = true
    },
    imageUploadSuccess(response, file) {
      if (response.code !== 0 || !response.data) {
        this.$message.error(response.message || '上传失败，请稍后重试！')
        this.uploading = false
        this.$refs.imageUpload.clearFiles()
        this.formData.fileList = []
      } else {
        this.formData.fileList.push({
          mediaType: file.raw.type.includes('image') ? 'image' : file.raw.type,
          meetingSummaryFileDownUrl: response.data.url,
          meetingSummaryFileViewUrl: response.data.url,
          meetingSummaryFileName: file.name
        })
      }
    },

    imageUploadChange(file, fileList) {
      this.imageAdded = fileList.length
      if (this.dialogMode === 'edit' && !this.uploading) {
        this.form.fileList = []
        fileList.forEach((item) => {
          console.log('item===', item)
          if (!item.raw) {
            this.form.fileList.push({
              mediaType: item.type.includes('image') ? 'image' : item.type,
              meetingSummaryFileDownUrl: item.url,
              meetingSummaryFileViewUrl: item.url,
              meetingSummaryFileName: item.name
            })
          }
        })
      }
      this.uploadFileList = fileList
    },

    async confirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        try {
          this.submitLoading = true
          const { meetingSummaryConclusion, fileList } = this.formData
          const params = {
            eventId: this.$route.query.id,
            meetingSummaryConclusion,
            fileList
          }
          const res = await moduleSrv.submitMeetingSummary(params)
          if (res.code === SUCCESS_CODE) {
            this.$message.success('提交成功')
            this.goBack()
          } else {
            this.$message.error(res.msg)
          }
          // this.close()
        } catch (err) {
          console.log(err)
          this.$message.error(err)
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-in-dialog {
  padding-right: 15px;
  max-height: 55vh;
  overflow-y: auto;
  ::v-deep .c-radio__label{
  font-weight: normal;
  }
  &.info-form {
    ::v-deep .c-form-item__label {
      color: #8A8A8A;
    }
    ::v-deep .c-form-item__content {
      div {
        min-height: 40px;
      }
    }
  }
  ::v-deep{
    .upload-trigger{
      text-align: left;
    }
  }
}
.entire_item{
    width: 100%;
    .c-select {
      width: 100%;
    }
  }
</style>
