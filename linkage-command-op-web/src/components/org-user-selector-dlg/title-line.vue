<template>
  <hl-group class="title-line" align="items-middle">
    <span class="m-r-sm"></span>
    <h6>{{title}}</h6>
  </hl-group>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '所有人员'
  }
});
</script>

<style lang="scss">
.title-line {
  span{
    width: calc(var(--xxs) * 4.25);
    height: calc(var(--xxs) * 4.25);
    background: url('@/assets/images/event-handling/left-2/icon1.png') no-repeat center;
    background-size: 100%;
  }
}
</style>
