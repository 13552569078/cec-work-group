<template>
  <hl-group
      class="title-wrap w-full"
      v-if="title"
      align="items-middle"
    >
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
  height: calc(var(--xxs) * 7);
  padding-left: calc(var(--xxs) * 4);
  color: #ffffff;
  font-size: calc(var(--xxs) * 4.5);
  font-weight: 400;
  color: #ffffff;
  background: url("@/assets/images/eventCenter/trend-title-2.png") no-repeat;
  background-size: auto 100%;
  background-position: left center;

}
</style>
