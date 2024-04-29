<template>
  <hl-dialog
    class="assemble-point-detail-dlg"
    :model-value="true"
    width="calc(var(--xxs) * 140)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="集结点详情"
    borderless
    append-to-body
    @closed="$emit('cancel')"
  >
    <hl-scrollbar height="16vh">
      <hl-row layout="grid" class="m-t-lg font-16" count="count-2" gap-x="var(--xxl)" gap-y="var(--lg)">
        <hl-col span="col" v-for="item in labelDataList" :key="item.label">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">{{ item.label }}</span>
            <span class="font-bold group-item">{{ item.value || '--' }}</span>
          </hl-group>
        </hl-col>
      </hl-row>
    </hl-scrollbar>
  </hl-dialog>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';

const props = defineProps({
  properties: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  }
});

const emit = defineEmits(['cancel']);

const loading = ref(false);
const labelDataList = computed(() => [
  { label: '名称', value: props.properties.assembleTitle },
  { label: '地点', value: props.properties.assembleAddress },
  { label: '应集结人员', value: props.properties.userCount },
  { label: '已集结人员', value: props.properties.assembleUserCount }
]);
</script>

<style lang="scss">
.assemble-point-detail-dlg {
  .panel-header {
    background-image: url(@/assets/images/event-handling/right-2/site-personnel/assemble-user-list-dlg-header-bg.png) !important;
    background-size: 75% 100% !important;
  }
}
</style>
