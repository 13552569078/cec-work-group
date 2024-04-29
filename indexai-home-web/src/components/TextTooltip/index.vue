<template>
  <div class="tooltip-wrap" ref="tlp">
    <el-tooltip :content="text" :disabled="!tooltipFlag" v-bind="$attrs">
      <p class="over-flow" ref="el">
        {{ text }}
      </p>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { useCssVar } from '@vueuse/core'

const props = defineProps({
  text: { type: String, default: '' }, // 字符内容
  lineClamp: { type: Number, default: 1 } //行数
})

const el = ref() // 文本元素
const tlp = ref() // 文本容器
const tooltipFlag = computed(
  () =>
    el.value?.scrollHeight > el.value?.clientHeight || el.value?.scrollWidth > el.value?.clientWidth
) // 是否显示tooltips

onMounted(() => {
  const lineClamp = useCssVar('--lineClamp', el)
  lineClamp.value = String(props.lineClamp)
})
</script>

<style lang="scss" scoped>
.tooltip-wrap {
  height: 100%;
  width: 100%;
}
.over-flow {
  @include ellipsis(var(--lineClamp, 1));
}
p {
  width: 100%;
  margin: 0;
}
</style>
