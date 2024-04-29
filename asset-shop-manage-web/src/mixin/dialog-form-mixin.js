import { easyClone } from '@l/utils'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    originData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      formData: {}
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.formData = easyClone(this.originData)
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate()
        })
      }
    }
  },
  methods: {
    handleOK() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          this.loading = true
          await this.submitData()
          this.loading = false
        }
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
