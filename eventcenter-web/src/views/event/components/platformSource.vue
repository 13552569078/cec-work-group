<template>
  <el-select v-model="localValue" placeholder="请选择" clearable @change="handleChange">
    <el-option v-for="item in thirdSystemList" :key="item.id" :value="item.platformCode" :label="item.dictLabel">{{ item.dictLabel }}</el-option>
  </el-select>
</template>

<script>
import thirdSystemMixin from '@/mixin/thirdSystemMixin'

export default {
  name: 'PlatformSource',
  mixins: [thirdSystemMixin],
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => ([])
    },
    labelname: {
      type: String,
      default: ''
    },
    sourcePlatform: {
      type: Number,
      default: undefined
    },
    handlePlatform: {
      type: Number,
      default: undefined
    },
    containCurrentSystem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localValue: ''
    }
  },
  watch: {
    value(val) {
      this.localValue = val
    }
  },
  mounted() {
    this.localValue = this.value
  },
  methods: {
    handleChange(val) {
      this.$emit('input', val)
      this.$emit('update:options', this.thirdSystemList)
    }
  }
}
</script>
