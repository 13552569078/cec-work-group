<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-form ref="refFormSubscribe" :model="formData" label-position="top" :disabled="isview" :class="{'disabled-new':isview,'bg-white':true}">
    <h3 class="info-title" data-section="subscribeInfo">订阅后显示信息</h3>
    <c-form-item label="补充说明" prop="desc">
      <vue-tinymce
        key="desc1"
        :height="200"
        :editor-content="formData.desc"
        :status="isview?1:0"
        :disabled="disabled"
        class="cls-tinymce"
        @editorBlur="editorBlur"
      />
    </c-form-item>
  </c-form>
</template>
<script>
import vueTinymce from '@/components/tinymce'
import { debounce } from '@l/utils'
import { bus } from '@/utils'
export default {
  name: '',
  components: { vueTinymce },
  props: {
    isview: Boolean,
    disabled: Boolean
  },
  data() {
    return {
      formData: {
        desc: ''
      }
    }
  },
  watch: {
    formData: {
      handler(nv, ov) {
        if (JSON.stringify(nv) !== JSON.stringify(ov)) {
          this._formDataChange()
        }
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this._formDataChange = debounce(this.formDataChange, 1000)
  },
  mounted() {},
  destroyed() {},
  methods: {
    formDataChange() {
      if (this.isBackFill) return
      console.log('----emit')
      bus.$emit('-bus-packapiform-leave-validate-', true)
    },
    getFormData() {
      const params = { ...this.formData }
      return JSON.stringify(params)
    },
    validateForm() {
      let flag
      this.$refs.refFormSubscribe.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFormData()
      })
      return flag
    },
    backFill(data) {
      data = (data && data.subInfo) ? JSON.parse(data.subInfo) : {}
      this.isBackFill = true
      if (this.isview) {
        data['desc'] = data['desc'] || '--'
      }
      if (data['desc']) {
        this.$set(this.formData, 'desc', data['desc'])
      }

      this.$nextTick(() => {
        this.isBackFill = false
      })
    },
    editorBlur(content) {
      this.$set(this.formData, 'desc', content)
    }
  }
}
</script>
<style scoped lang="scss">
.bg-white {
  padding: 20px 40px;
  margin-bottom: 20px;
  background: white;
  .info-title {
    margin-left: -20px;
  }
}
.c-form {
  padding-bottom: 10px;
}
</style>
