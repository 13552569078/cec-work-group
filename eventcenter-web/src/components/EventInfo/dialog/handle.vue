<!--
 * @description 事件审核--处理弹窗表单
 * @date 2020-08-25
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchtitle.title"
    width="466px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="handle-dialog-class"
      :rules="rules"
    >
      <!-- 暂时只有事件处理有多媒体 -->
      <el-form-item
        v-if="matchtitle.action === 'complete'"
        label="处置后多媒体"
        prop="eventMedia"
      >
        <cestc-upload-card
          accept="video/*,image/*,audio/*"
          :media-list="form.eventMedia"
          :limit="9"
          limit-size="100"
          @fileList="updateEventMedia"
        />
      </el-form-item>
      <el-form-item
        v-if="matchtitle.action === 'apply'"
        label="延时时间"
        prop="postponeTime"
      >
        <cestc-date-picker
          v-model="form.postponeTime"
          type="datetime"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          :custom-picker-options="customPickerOptions"
        />
      </el-form-item>
      <el-form-item :label="matchtitle.label" prop="comment" class="row-one">
        <el-input
          v-model="form.comment"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import { validCommitStr } from '@/utils/validate'

const checkCommitStr = (rule, value, callback) => {
  if (validCommitStr(value)) {
    // 是否包含了特殊字符
    return callback(new Error('意见包含了特殊字符，请检查后提交'))
  } else {
    callback()
  }
}

export default {
  name: 'HandleDialog',
  props: {
    buttonCode: {
      type: String,
      default: ''
    },
    todoButtons: {
      type: Array,
      default: () => []
    },
    taskId: {
      type: [String, Number],
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  data() {
    const checkMedia = (rule, value, callback) => {
      if (!this.form.eventMedia.length) {
        return callback(new Error('请上传处置后多媒体'))
      } else {
        callback()
      }
    }
    return {
      form: {
        eventMedia: [],
        postponeTime: '',
        comment: ''
      },
      rules: {
        postponeTime: [
          { required: true, message: '请选择申请时间', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '请输入处理说明', trigger: 'blur' },
          { validator: checkCommitStr, trigger: 'blur' }
        ],
        eventMedia: [
          { required: true, message: '请上传处置后多媒体', trigger: 'blur' },
          { validator: checkMedia }
        ]
      }
    }
  },
  computed: {
    matchtitle() {
      // 根据权限定制弹窗标题
      let title = ''
      let label = ''
      let action = ''
      if (this.buttonCode.indexOf('handle_reject') > -1) {
        title = '申请驳回'
        label = '申请理由'
        action = 'reject'
      } else if (this.buttonCode.indexOf('handle_complete') > -1) {
        title = '事件处理反馈'
        label = '事件描述'
        action = 'complete'
      } else if (this.buttonCode.indexOf('handle_apply') > -1) {
        title = '申请延时'
        label = '申请理由'
        action = 'apply'
      } else {
        title = '事件上报'
        label = '事件描述'
        action = 'report'
      }
      return {
        title,
        label,
        action
      }
    },
    customPickerOptions() {
      // 如果有截止时间，控制截止时间之前的时间不能选，否则默认为当前之前的时间不可选
      let _disabledDate = Date.now()
      if (this.endTime) {
        _disabledDate = new Date(this.endTime).getTime()
      }
      return {
        disabledDate(time) {
          return time.getTime() < _disabledDate
        }
      }
    }
  },
  methods: {
    // 更新图片上传的列表
    updateEventMedia(fileList = []) {
      this.form.eventMedia = fileList
    },
    // 提交的时候，需要重组数据结构向上返回
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$nextTick(() => {
          this.$emit('confirm', {
            ...this.form,
            action: this.matchtitle.action
          })
        })
      })
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
      // 图片列表清空
      this.$refs.upload.clearFile()
    }
  }
}
</script>
<style lang="scss">
.handle-dialog-class {
  .el-form-item {
    width: 100%;
    .el-select,
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
