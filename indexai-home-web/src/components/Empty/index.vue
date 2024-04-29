<template>
  <el-empty :image="type == '1' ? src1 : src2" description="" />
</template>
<script lang="ts" setup>
import src1 from '/@/assets/images/common/no-data1.svg'

import src2 from '/@/assets/images/common/no-data2.svg'
defineProps({
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: '1'
  }
})
</script>

<style>
.el-empty__description {
  display: none;
}
.el-empty {
  padding: 0;
}
</style>
