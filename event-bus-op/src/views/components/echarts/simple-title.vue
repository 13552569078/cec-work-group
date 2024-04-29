<template>
  <hl-group
      class="title-wrap"
      v-if="title"
      align="items-middle"
    >
      <i class="title-icon"> </i>
      {{ title }}
    </hl-group>
</template>
<script lang="ts" setup>

defineProps({
  title: {
    type: String,
    default: '',
  }
});
</script>
<style lang="scss" scoped>
.title-wrap {
  color: #ffffff;
  font-size: calc(var(--xxs) * 4.5);
  font-weight: 400;
  color: #ffffff;

  .title-icon {
    display: inline-block;
    width: calc(var(--xxs) * 5);
    height: calc(var(--xxs) * 3.75);
    background: url("@/assets/images/eventCenter/trend-title.png") no-repeat;
    background-size: auto 100%;
  }
}
</style>
