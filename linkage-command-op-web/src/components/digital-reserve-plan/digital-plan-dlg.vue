<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 300)"
    height="calc(var(--xxs)*241.5)"
    body-padding="var(--md)"
    custom-class="full-body"
    :title="title"
    append-to-body
    @close="$emit('cancel')"
  >
    <DigitalReservePlan :id="id"/>
  </hl-dialog>
</template>
<script lang="ts" setup>
import DigitalReservePlan from './index.vue';

defineProps({
  title: String,
  id: String
});
</script>

<style lang="scss" scoped>
</style>
