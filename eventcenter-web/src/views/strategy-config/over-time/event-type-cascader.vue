<template>
  <el-cascader
    ref="cascader"
    :key="isRescourceShow"
    v-model="eventType"
    :options="options"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    clearable
    filterable
    collapse-tags
    :props="{
      value: 'id',
      label: 'eventTypeName',
      checkStrictly,
      multiple,
    }"
    @change="changeCascader"
  />
</template>
<script>
export default {
  name: 'EventTypeCascader',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    parentType: {
      type: [Number, String],
      default: undefined
    },
    middleType: {
      type: [Number, String],
      default: undefined
    },
    childType: {
      type: [Number, String],
      default: undefined
    },
    // 是否取消级联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 是否显示全路径
    showAllLevels: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 事件类型中是否包含隐藏项目
    showHidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isRescourceShow: 0,
      eventType: this.value
    }
  },
  computed: {},
  watch: {
    options: {
      deep: true,
      handler(nval) {
        ++this.isRescourceShow
      }
    }
  },
  created() {},
  methods: {
    changeCascader() {
      this.$emit('input', this.eventType)
    }
  }
}
</script>
<style scoped></style>
