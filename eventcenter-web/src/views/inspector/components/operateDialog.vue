<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="title"
    width="684px"
    v-on="$listeners"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      inline
      label-position="top"
      class="type-in-class"
    >
      <el-form-item v-if="type == 1" label="是否通过" prop="type">
        <el-radio-group
          v-model="form.type"
          class="cestc-radio-group"
        >
          <el-radio label="2">通过</el-radio>
          <el-radio label="1">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="type == 3" label="是否完成" prop="type">
        <el-radio-group
          v-model="form.type"
          class="cestc-radio-group"
        >
          <el-radio label="2">完成</el-radio>
          <el-radio label="1">未完成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="descLabel" prop="desc" class="item-row">
        <el-input
          v-model="form.desc"
          type="textarea"
          maxlength="500"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <!-- 自定义操作按钮 -->
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button type="primary" @click.stop="_confirm">提交</el-button>
    </div>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    // eslint-disable-next-line vue/require-default-prop
    id: [String, Number]
  },
  data() {
    return {
      form: {},
      rules: {
        type: [
          { required: true, message: '请选择，该项不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: `不能为空`, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.type === 1 ? '审核' : this.type === 2 ? '评论' : this.type === 3 ? '反馈' : ''
    },
    descLabel() {
      return this.type === 1 ? '审核意见' : this.type === 2 ? '评论描述' : this.type === 3 ? '反馈说明' : ''
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (!val) {
        this.form = {}
      } else {
        this.$set(this.rules, 'desc', [
          { required: true, message: `${this.descLabel}不能为空`, trigger: 'blur' }
        ])
      }
    }
  },
  methods: {
    // 取消、关闭弹窗
    _cancle(refresh) {
      this.$emit('cancle', refresh)
    },
    _confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let p
          if (this.type === 1) {
            p = moduleSrv.verifySupervise({
              superviseId: this.id,
              dealtDesc: this.form.desc,
              status: Number(this.form.type)
            })
          } else if (this.type === 2) {
            p = moduleSrv.commentSupervise({
              superviseId: this.id,
              dealtDesc: this.form.desc
            })
          } else if (this.type === 3) {
            p = moduleSrv.feedbackSupervise({
              superviseId: this.id,
              dealtDesc: this.form.desc,
              status: Number(this.form.type)
            })
          }
          p.then(res => {
            if (res && res.code === SUCCESS_CODE) {
              this.$message.success('操作成功')
              this._cancle(1)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.type-in-class {
  .el-form-item {
    width: calc(50% - 25px);
    margin-right: 24px;
    .el-cascader,
    .el-select {
      // 修复上级事件类型样式问题
      width: 100%;
    }
    // &:nth-child(2n) {
    //   margin-right: 0;
    // }
    &.item-row {
      width: 100%;
    }
    .upload-trigger {
      display: flex;
    }
    .upload_tips {
      cursor: initial;
      color: #bdbdbd;
    }
    .el-upload-list {
      display: flex;
    }
  }
}
</style>
