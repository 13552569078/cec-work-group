<template>
  <div class="default-page-wrapper" :style="{padding}">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DefaultPage',
  props: {
    padding: {
      type: String,
      default: '16px'
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';
.default-page-wrapper {
  position: relative;
  padding: 16px;
  background: $pageBgColor;
}
</style>
