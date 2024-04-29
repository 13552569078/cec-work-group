<template>
<div class="box-icon-button cursor-pointer">
  <img class="icon" :src="icon" />
  <img class="icon-on" :src="iconOn" />
</div>
</template>

<script lang='ts' setup>
const props = defineProps({
  icon: {
    type: String
  },
  iconOn: {
    type: String
  }
});
</script>

<style lang='scss' scoped>
  .box-icon-button {
    img {
      width: calc(var(--xxl) * 0.95175);
      height: calc(var(--xxl) * 0.95175);
    }
    .icon-on {
      display: none;
    }
    &:hover {
      .icon {
        display: none;
      }
      .icon-on {
        display: block;
      }
    }
  }
</style>
