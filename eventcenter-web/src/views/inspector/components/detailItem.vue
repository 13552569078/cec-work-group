<template>
  <div class="d-item pl10">
    <div class="key mb6">{{ label }}</div>
    <div class="val">{{ val }}</div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    val: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.d-item {
  // display: flex;
  // margin-top: 16px;
  .key {
    // width: 60px;
    text-align: left;
    color: #8a8a8a;
  }
  .val {
    // flex: 1;
    word-break: break-all;
    color: #4b4b4b;
    // margin-left: 16px;
  }
}
</style>
