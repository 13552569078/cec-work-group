/**
 * @Description:
 * @Author: wyh19
 * @Date: 2021-03-31
 */

import { easyClone } from '@l/utils'
const DynamicFlag = '--'
export default {
  props: {
    formName: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    oldData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {},
      oldFormData: null,
      rulesResult: {}
    }
  },
  computed: {
    isSimpleForm() {
      return this.formName.indexOf(DynamicFlag) === -1
    },
    partFormData() {
      return this.isSimpleForm ? this.data[this.formName] : this.data
    },
    oldPartFormData() {
      return this.isSimpleForm ? this.oldData[this.formName] : this.oldData
    }
  },
  watch: {
    partFormData: {
      handler(n) {
        this.formData = easyClone(n) || {}
      },
      immediate: true
    },
    oldPartFormData(n) {
      this.oldFormData = easyClone(n)
    }
  },
  methods: {
    handleValidate(rule, valid) {
      this.rulesResult[rule] = valid
      if (!valid) {
        this.$emit('validate', this.formName, false)
      } else {
        // 检查所有值，当全部为true时，才触发
        let result = true
        for (const key in this.rulesResult) {
          if (!this.rulesResult[key]) {
            result = false
            break
          }
        }
        if (result) {
          this.$emit('validate', this.formName, true)
        }
      }
    },
    resetFormData() {
      // 重置rulesResult，防止老数据污染
      this.rulesResult = {}
      this.formData = easyClone(this.partFormData) || {}
      this.$refs['form'].clearValidate()
    },
    validForm() {
      let result = false
      this.$refs['form'].validate((valid) => {
        if (valid) {
          result = true
        } else {
          return false
        }
      })
      return result
    }
  }
}

