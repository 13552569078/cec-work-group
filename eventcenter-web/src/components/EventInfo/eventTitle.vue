<template>
  <div class="event-title">
    <div class="left-icon" />
    <div class="title">{{ title }}</div>
  </div>
</template>
<script>
export default {
  name: 'EventTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.event-title {
  display: flex;
  font-weight: 600;
  align-items: center;
  color: #4b4b4b;
  .left-icon {
    width: 4px;
    height: 14px;
    background: #36a4ff;
    margin-right: 8px;
  }
}
</style>
