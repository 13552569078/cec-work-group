<template>
  <div class="title-label">{{ title }}</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.title-label {
  font-size: 14px;
  color: #313131;
  font-weight: 600;
  padding-left: 10px;
  position: relative;
  &::before {
    content: '';
    width: 4px;
    height: 14px;
    display: block;
    background: #36a4ff;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
