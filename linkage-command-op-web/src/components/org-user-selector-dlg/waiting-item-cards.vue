<template>
  <hl-group class="border p-t-xs radius-md w-full h-full" wrap>
    <hl-scrollbar>
      <hl-group
        align="items-middle"
        v-for="(item, index) in data"
        :key="`${item.id}-${item.userId}-${item.orgId}-${item.groupId}-${index}`"
        :class="[
          'select-card',
          'm-r-xs',
          'm-b-xs',
          'p-y-xs',
          'p-x-xs',
          item.disable ? 'select-card-disable' : 'cursor-pointer',
          item.active ? 'checked-bg' : '',
        ]"
        @click.stop="select(item, index)"
      >
        <span class="title-icon"></span>
        <hl-group dir="vertical" class="m-l-xs content" style="width: 80%">
          <hl-group align="items-top" gap="var(--xxs)" class="m-b-xxs">
            <h5 class="ellipsis">
              {{
                type === "org"
                  ? item.orgName
                  : type === "user"
                  ? item.userName ?? item.name
                  : item.groupName
              }}
            </h5>
          </hl-group>
          <p v-if="type !== 'org'" class="ellipsis m-none">{{ item.orgName }}</p>
        </hl-group>
      </hl-group>
    </hl-scrollbar>
  </hl-group>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
  data: {
    type: Array as PropType<any[]>,
  },
  type: {
    type: String, // org 机构
    default: '',
  },
});
const emit = defineEmits(['change']);

const select = (item: any, index: number) => {
  if (item.disable) return;
  // item.active = !item.active;
  emit('change', item, index);
};
</script>

<style lang="scss">
.select-card {
  position: relative;
  width: calc(var(--xxs) * 57.5);
  height: calc(var(--xxs) * 18);
  box-sizing: border-box;
  background: rgba(0, 158, 247, 0.12);

  &-disable {
    background: var(--bg-light) !important;
  }

  .title-icon {
    align-self: flex-start;
    width: calc(var(--xxs) * 4.25);
    height: calc(var(--xxs) * 4.25);
    background: url('@/assets/images/event-handling/left-1/prefix-icon.png') no-repeat center;
    background-size: 100%;
  }
  .content {
    align-self: flex-start;
  }
}
.select-card.checked-bg {
  width: calc(var(--xxs) * 57.5);
  height: calc(var(--xxs) * 18);
  background: url('@/assets/images/event-handling/right-3/add-task-dlg/selected-card-bg.png') no-repeat center;
  background-size: 100%;
}
</style>
