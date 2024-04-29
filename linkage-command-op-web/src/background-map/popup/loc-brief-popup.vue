<template>
  <x-map-popup
    :show="show"
    :coordinates="coordinates"
    :offset="offset"
    anchor="bottom"
    :showTip="false"
  >
    <card-popover
      :title="title"
      :content="content"
      style="width: calc(var(--xxs) * 60)"
    />
  </x-map-popup>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,
  coordinates: {
    type: Array,
    default: () => ([])
  },
  offset: {
    type: Array,
    default: () => ([])
  },
  properties: {
    type: Object,
    default: () => ({})
  }
});

const title = computed(() => props.properties.resName || props.properties.name ||
  props.properties.videoName || props.properties.assembleTitle || props.properties.userName
);

const content = computed(() => props.properties.address || props.properties.mainAddress ||
  props.properties.assembleAddress || props.properties.orgName
);
</script>
