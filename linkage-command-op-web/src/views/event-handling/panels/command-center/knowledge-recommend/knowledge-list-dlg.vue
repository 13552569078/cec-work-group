<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 300)"
    height="calc(var(--xxs)*241.5)"
    :title="title"
    class="knowledge-list-dlg full-body"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <div v-if="items.length" class="wrapper">
      <hl-scrollbar>
        <div class="list">
          <h5
            v-for="item in items"
            :key="item.id"
            class="item"
            :class="{active: item === currentItem}"
            @click="currentItem = item;"
          >
            <span class="ellipsis">{{ item.fileName }}</span>
          </h5>
        </div>
      </hl-scrollbar>
      <doc-previewer v-bind="currentItem" />
    </div>
    <hb-empty v-if="showEmpty" :image="NoDataImg" class="big"></hb-empty>
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useCurrentEvent } from '@/hooks';
import { MAX_PAGE_SIZE } from '@/common';
import { apiKnowledgeRecommendObj } from '@/apis/modules/knowledge-recommend';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import { IpostFindKnowledgeEventPageSpace } from '@/apis/modules/knowledge-recommend/model';
import NoDataImg from '@/assets/images/empty/no-data.png';
import DocPreviewer from './knowledge-doc-previewer.vue';

const props = defineProps({
  title: String,
  fileType: String,
});

const items = ref<IpostFindKnowledgeEventPageSpace.List[]>([]);
const currentItem = ref({} as IpostFindKnowledgeEventPageSpace.List);
const showEmpty = ref(false);

const loadData = async(event: IpostFindEventDetailByIdSpace.Data) => {
  const result = await apiKnowledgeRecommendObj.postFindKnowledgeEventPage({
    currentPage: 1,
    pageSize: MAX_PAGE_SIZE,
    fileType: props.fileType,
    eventTypeName: event.eventTypeName
  });
  items.value = result.data.list;
  if (items.value.length) {
    currentItem.value = items.value[0];
  }
  showEmpty.value = items.value.length === 0;
};

useCurrentEvent(loadData);
</script>
<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: var(--px20);
  display: flex;
  column-gap: var(--px20);
  :deep(.hl-scrollbar){
    flex: none !important;
  }
  .list {
    display: flex;
    flex-direction: column;
    row-gap: var(--xxs);
    .item {
      padding: calc(var(--xxs) * 2.5) var(--md);
      height: calc(var(--xxs) * 11);
      width: calc(var(--xxs) * 65);
      background: url('@/assets/images/event-handling/left-2/plan-name-bg.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      &.active, &:hover {
        background: url('@/assets/images/event-handling/left-2/plan-name-active-bg.png') no-repeat;
      }
    }
  }
}
</style>
