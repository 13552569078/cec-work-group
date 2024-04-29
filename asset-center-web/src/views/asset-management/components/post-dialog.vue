<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-11-29
-->

<template>
  <c-dialog :class="'dialog-center asset-post'" width="480px" :visible.sync="postDailogFlag"
            :before-close="close">
    <div slot="title">
      <span class="title-span">资源发布</span>

    </div>
    <c-form v-if="postDailogFlag" ref="postFormData" :model="postFormData" :rules="rules"
            label-position="top" @submit.native.prevent>
      <!-- <c-form-item class="half-form-item" label="版本号" prop="version">
        <c-input v-model="postFormData.version" size="small" maxlength="20" clearable
                 placeholder="请输入"
                 @input="postFormData.version = postFormData.version&&postFormData.version.toLowerCase()" />
      </c-form-item> -->
      <c-form-item label="版本号" prop="version" :rules="rules.version">
        <div class="csl-version">
          <span>v</span>
          <c-input-number
            v-model="postFormData.packVersion1"
            :min="0"
            :max="99"
            :controls="false"
            :precision="0"
            class="input-version"
            placeholder="" />.
          <c-input-number
            v-model="postFormData.packVersion2"
            :min="0"
            :max="99"
            :controls="false"
            :precision="0"
            class="input-version"
            placeholder="" />.
          <c-input-number
            v-model="postFormData.packVersion3"
            :min="0"
            :max="99"
            :controls="false"
            :precision="0"
            class="input-version"
            placeholder="" />
          <span>最新版本为 <span style="color: #36A4FF;">{{ newVersion }}</span> </span>
        </div>
      </c-form-item>
      <c-form-item label="版本说明" prop="versionDesc">
        <c-input v-model="postFormData.versionDesc" size="small" resize="none" type="textarea"
                 maxlength="200" placeholder="请输入" show-word-limit :rows="3" clearable />
      </c-form-item>
      <div class="footer-box">
        <i class="cls-icon-info"></i>
        <div class="content">
          请完成{{ assetTypeName }}设计后发布，资源发布后不可取消
        </div>
      </div>
    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="close()">取消</c-button>
      <c-button type="gradual" size="small" @click="postApp()">确定</c-button>
    </div>
  </c-dialog>
</template>

<script>

import { newestVersion } from '@/api'
import {
  assetPost
} from '@/api/index'
export default {
  props: {
    postDailogFlag: {
      type: Boolean,
      default: false
    },
    currAsset: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      newVersion: '',
      postFormData: {
        version: '',
        versionDesc: '',
        packVersion1: undefined,
        packVersion2: undefined,
        packVersion3: undefined
      },
      rules: {
        versionDesc: [
          { required: true, message: '请输入版本说明', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        version: {
          required: true,
          validator: (rule, val, cb) => {
            const msg = '请输入版本号'
            const v1 = this.postFormData.packVersion1
            const v2 = this.postFormData.packVersion2
            const v3 = this.postFormData.packVersion3
            if (!(v1 !== undefined && v2 !== undefined && v3 !== undefined)) return cb(msg)
            if (this.compare((v1 + '.' + v2 + '.' + v3), this.newVersion.replace('v', '')) !== 1) {
              return cb('版本号必须大于最新版本号')
            }
            cb()
          },
          trigger: ['change', 'blur']
        }

      }
    }
  },
  computed: {
    assetTypeName() {
      let res = ''

      switch (this.currAsset.assetType + '') {
        // 1统计、2技术、3对象、4数据、5流程
        case '1':

          if (this.currAsset.subType + '' === '11' || this.currAsset.subtype + '' === '11') { // 指标
            res = '指标'
          } else if (this.currAsset.subType + '' === '12' || this.currAsset.subtype + '' === '12') { // 模型
            res = '模型'
          } else if (this.currAsset.subType + '' === '13' || this.currAsset.subtype + '' === '13') { // 数据
            res = '数据'
          }
          break;
        case '2':

          if (this.currAsset.subType + '' === '22' || this.currAsset.subtype + '' === '22') { // 接口
            res = '接口'
          } else if (this.currAsset.subType + '' === '23' || this.currAsset.subtype + '' === '23') { // 页面
            res = '页面'
          }
          break;
        case '3': // 对象资源 是弹框
          res = '对象'
          break;
        case '4':// 4数据
          res = '数据'
          break;
        case '5':// 流程资源 是弹框
          res = '流程'
          break;
        case '7':
          if (this.currAsset.subType + '' === '71' || this.currAsset.subtype + '' === '71') { // 模型
            res = '模型'
          }
          break;
        default:
          break;
      }
      return res
    }
  },
  watch: {
    postDailogFlag() {
      this.postFormData = {
        version: '',
        versionDesc: '',
        packVersion1: undefined,
        packVersion2: undefined,
        packVersion3: undefined
      }
      this.getNewestVersion()
    }
  },
  mounted() {
  },
  methods: {
    compare(version1, version2) {
      const arr1 = version1.split('.');
      const arr2 = version2.split('.');
      const length = Math.max(arr1.length, arr2.length);
      for (let i = 0; i < length; i++) {
        const n1 = Number(arr1[i] || 0)
        const n2 = Number(arr2[i] || 0)
        if (n1 > n2) return 1
        if (n1 < n2) return -1
      }
      return 0
    },
    getNewestVersion() {
      newestVersion({
        resourceType: 'asset',
        code: this.currAsset.assetCode
      }).then(res => {
        this.newVersion = res.data.version || 'v0.0.0'
      })
    },
    postApp() {
      this.$refs.postFormData.validate(valid => {
        if (!valid) return
        const loading = this.$loading({
          lock: true,
          text: '资源发布中...',
          fullscreen: false,
          background: 'rgba(0, 0, 0, 0)'
        });
        assetPost({
          ...this.currAsset,
          ...this.postFormData,
          version: 'v' + this.postFormData.packVersion1 + '.' + this.postFormData.packVersion2 + '.' + this.postFormData.packVersion3,
          tagNameList: null
        }).then(res => {
          if (res.code * 1 === 0) {
            this.$message.success(res.msg || '发布成功')
            this.$emit('close', true)
            loading.close()
          }
        }).catch((e) => {
          loading.close()
          console.error(e);
        });
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  position: relative;
}
.footer-box {
  display: flex;
  justify-content: flex-end;
  .cls-icon-info {
    width: 12px;
    height: 12px;
  }
  .content {
    font-size: 12px;
    color: #bdbdbd;
  }
}
::v-deep.csl-version {
  display: flex;
  .input-version {
    margin: 0 4px;
    width: 35px;
    .c-input__inner {
      width: 35px;
      padding: 0 !important;
    }
  }
}
</style>

