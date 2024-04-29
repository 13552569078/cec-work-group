<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-dialog
    :class="'dialog-center'"
    :title="title"
    width="480px"
    :visible.sync="dialogVisible"
  >
    <c-form v-if="dialogVisible" ref="ruleForm" :model="form" :rules="rules" @submit.native.prevent>
      <c-form-item
        :label="labelName"
        label-width="80px"
        prop="name"
      >
        <c-input
          v-model="form.name"
          size="small"
          maxlength="10"
          placeholder="请输入"
        />
      </c-form-item>
    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="dialogVisible = false">取消</c-button>
      <c-button type="gradual" size="small" @click="confirm">确定</c-button>
    </div>
  </c-dialog>
</template>
<script>
export default {
  name: '',
  props: {
    visible: Boolean,
    flag: String,
    level: [String, Number],
    label: String,
    init: Object
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    title() {
      const arr = ['添加', this.label, '分类']
      if (this.flag === 'edit') {
        arr[0] = '编辑'
      }
      if (+this.level !== 1) {
        arr[2] = ''
      }
      return arr.join('')
    },
    labelName() {
      if (+this.level !== 1) {
        return `${this.label}名称`
      }
      return `${this.label}类型`
    }
  },
  watch: {
    visible: {
      handler(v) {
        this.dialogVisible = v
        if (v) {
          if (this.init) {
            this.form.name = this.init.name
          }
        }
      },
      immediate: true
    },
    dialogVisible(nv, ov) {
      if (!nv && nv !== ov) {
        this.handleClose()
      }
    }
  },
  methods: {
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.$emit('ok', this.form)
      })
    },
    handleClose() {
      this.form.name = ''
      this.$emit('close')
    }
  }
};
</script>
<style scoped lang="scss">
</style>
