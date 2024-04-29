<template>
  <x-map-popup
    :show="show"
    :coordinates="coordinates"
    :offset="offset"
    anchor="bottom"
    :showTip="false"
  >
    <card-popper title="聚合打点列表" class="cluster-point-card" @close="$emit('close')">
      <hl-scrollbar height="100%">
        <div class="list">
          <div v-for="i in properties" :key="i.properties.id" class="list-item">
            <span class="name text-ellipsis" :title="i.properties.resName">
              {{ i.properties.resName || i.properties.name }}
            </span>
          </div>
        </div>
      </hl-scrollbar>
    </card-popper>
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
    type: Array,
    default: () => []
  }
});

</script>
<style lang="scss" scoped>
.cluster-point-card {
  color: white;
}
</style>
