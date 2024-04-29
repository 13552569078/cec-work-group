<script>
import { applyTypeListMap, applyTypeTipsMap } from '@/config/index'
import { subcribeAppList, appRegistList } from '@/api/index'
export default {
  props: {
    visible: Boolean,
    data: Object
  },
  data() {
    return {
      visibleFlag: false,
      formData: {
        applyType: '',
        referPackVersionId: '',
        referPackName: '',
        appName: ''
      },
      rules: {
        applyType: { required: true, message: '请选择', trigger: ['blur', 'change'] },
        referPackVersionId: { required: true, message: '请选择', trigger: ['blur', 'change'] },
        appName: { required: true, message: '请输入', trigger: 'blur' }
      },
      applyTypeTipsMap,
      referPackList: []
    }
  },
  computed: {
    applyTypeList() {
      let applyType = this.data?.applyType || ''
      applyType = applyType.split(',').filter(d => !!d)
      return applyType.map(d => ({ label: applyTypeListMap.get(+d), value: d }))
    }
  },
  watch: {
    visible: {
      handler(nv) {
        this.visibleFlag = !!nv
        if (nv) {
          this.getreferPackAppList()
        }
      },
      immediate: true
    }
  },
  methods: {
    reset() {
      this.$refs.refFrom.resetFields()
    },
    close() {
      this.$emit('close')
      this.reset()
    },
    handleOk() {
      if (!(this.data?.packVersionId)) return
      this.$refs.refFrom.validate(valid => {
        if (!valid) return
        this.sendData()
      })
    },
    async sendData() {
      try {
        const params = {
          ...this.formData,
          packVersionId: this.data.packVersionId
        }
        if (+this.data.assetType !== 99) {
          params.applyType = 2
        }
        if (+params.applyType === 3) {
          params.appName = ''
          params.referPackName = ''
          params.referPackVersionId = ''
        } else if (+params.applyType === 1 || +params.applyType === 2) {
          params.appName = ''
        }
        await this.$store.dispatch('shopCar/addToCart', { params })
        this.close()
      } catch (e) {
        console.error(e)
      }
    },
    referChange(v) {
      const item = this.referPackList.find(item => item.packVersionId === v)
      this.formData.referPackName = item?.packName || ''
      this.formData.appName = item?.packName || ''
    },
    async getreferPackAppList() {
      try {
        let res
        if (+this.data.assetType === 99) {
          // 建设渠道buildChannel=2第三方？资源状态是待开发+开发中
          res = await appRegistList({
            buildChannel: +this.data.buildChannel === 2 ? '' : this.data.buildChannel,
            appStatusList: +this.data.buildChannel === 2 ? [1, 2] : [1]
          })
        } else {
          res = await subcribeAppList({ packVersionId: this.data.packVersionId })
        }
        this.referPackList = res?.data || []
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<template>
  <c-dialog
    title="加入购物车"
    :visible.sync="visibleFlag"
    append-to-body
    width="400px"
    :class="'dialog-center'"
    :before-close="close">
    <c-form ref="refFrom" :model="formData" :rules="rules">
      <c-form-item v-if="data.assetType==99" label="申请类型" prop="applyType">
        <c-select
          v-model="formData.applyType"
          filterable
          style="width:100%"
          size="small"
          :specific-suffix="true"
          placeholder="请选择">
          <c-option
            v-for="item in applyTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </c-option>
        </c-select>
      </c-form-item>
      <div style="line-height:22px;">
        <p v-if="formData.applyType==1&&data.buildChannel==2">{{ applyTypeTipsMap['1_buildChannel2'] }}</p>
        <p v-else>{{ applyTypeTipsMap[formData.applyType] }}</p>
      </div>
      <c-form-item v-if="formData.applyType!=3" label="申请资源主体" prop="referPackVersionId">
        <c-select
          v-model="formData.referPackVersionId"
          filterable
          style="width:100%"
          size="small"
          popper-class="select-popper-max-limit"
          :specific-suffix="true"
          placeholder="请选择"
          @change="referChange">
          <c-option
            v-for="item in referPackList"
            :key="item.packVersionId"
            :label="item.packName"
            :value="item.packVersionId">
          </c-option>
        </c-select>
      </c-form-item>
      <c-form-item v-if="formData.applyType==4" label="应用名称" prop="appName">
        <c-input
          v-model="formData.appName"
          size="small"
          placeholder="请输入"
          type="text"
          maxlength="20"></c-input>
      </c-form-item>
    </c-form>
    <span slot="footer" class="dialog-footer">
      <c-button type="" size="small" @click="close">取消</c-button>
      <c-button type="primary" size="small" @click="handleOk">确定</c-button>
    </span>
  </c-dialog>
</template>
<style lang='scss' scoped>
</style>
