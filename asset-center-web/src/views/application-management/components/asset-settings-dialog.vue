<!--/*
* @Author: dingli
* @Desc: 应用设置
* @Date: 2022-3-17
*/-->
<template>
  <c-dialog :class="'dialog-center'" :title="'应用设置'" width="480px" class="details-dialog-adjustpadding-1"
            :visible.sync="settingFlag" :before-close="close">
    <c-form v-if="settingFlag" ref="formData" :model="formData" :rules="rules" @submit.native.prevent>
      <c-form-item class="group-form-item need-small" label="访问地址" label-width="80px" prop="accessUrl">
        <c-input v-model="formData.accessUrl" style="width:100%" size="small" type="text" maxlength="150"
                 placeholder="请输入访问地址" />
      </c-form-item>
    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="close">取消</c-button>
      <c-button type="gradual" size="small" @click="saveAccessUrl()">确定</c-button>
    </div>
  </c-dialog>
</template>
<script>
import { apiAppSetAccessUrl } from '@/api/index'
export default {
  name: 'AssetSettingsDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      settingFlag: false,
      formData: {
        id: '',
        accessUrl: ''
      },
      rules: {
        accessUrl: [
          {
            required: false,
            validator: (rule, val, cb) => {
              if (!val) return cb();
              if (val.length > 150) {
                cb('最多输入150个字符');
              } else if (!val) {
                cb('请输入访问地址');
              } else if (!/(https?):\/\/[-A-Za-z0-9+\&\@\#\/\%?=~_|!:,.;]+[-A-Za-z0-9+\&\@\#\/\%=~_|]/.test(val)) {
                cb('只支持http(https)开头的绝对地址')
              } else {
                cb()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  watch: {
    visible(nv) {
      if (nv) {
        this.init()
      }
      this.settingFlag = nv
    }
  },
  methods: {
    init() {
      this.formData.id = this.data.id
      this.formData.accessUrl = this.data.accessUrl
    },
    saveAccessUrl() {
      this.$refs.formData.validate(valid => {
        if (!valid) {
          return
        }
        apiAppSetAccessUrl(this.formData).then(res => {
          this.formData.accessUrl = ''
          this.formData.id = ''
          this.settingFlag = false
          this.$emit('ok')
        })
      })
    },
    close() {
      this.$emit('close')
    }
  }
};
</script>
<style scoped lang="scss">
</style>
