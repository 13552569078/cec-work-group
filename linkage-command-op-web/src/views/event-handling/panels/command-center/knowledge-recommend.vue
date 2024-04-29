<template>
  <div class="knowledge">
    <div class="text-right m-b-md">
      <hl-button type="primary" class="hover-style" @click="knowledgeGraphDlgVisible=true">知识图谱</hl-button>
    </div>
    <div class="items">
      <img :src="recommendlogo" class="recommend-logo" />
      <div class="knowledge-list">
        <div class="knowledge-item cursor-pointer" @click="showKnowledgeDlg({title: '推荐处置预案', fileType: 'handlePreplan'})">
          <span class="name text-ellipsis">推荐处置预案</span>
          <span class="mid-num">{{ totalData.handlePreplanNum || 0 }}</span>
        </div>
        <div class="knowledge-item cursor-pointer" @click="showKnowledgeDlg({title: '推荐案例', fileType: 'historyCase'})">
          <span class="name text-ellipsis">推荐案例</span>
          <span class="mid-num">{{ totalData.historyCaseNum }}</span>
        </div>
        <div class="knowledge-item cursor-pointer" @click="showKnowledgeDlg({title: '推荐法规', fileType: 'lawsAndRegulations'})">
          <span class="name text-ellipsis">推荐法规</span>
          <span class="mid-num">{{ totalData.lawsAndRegulationsNum }}</span>
        </div>
        <div class="knowledge-item cursor-pointer" @click="showKnowledgeDlg({title: '推荐知识', fileType: 'knowledge'})">
          <span class="name text-ellipsis">推荐知识</span>
          <span class="mid-num">{{ totalData.knowledgeNum }}</span>
        </div>
        <div v-if="isChemicalEvent" class="knowledge-item cursor-pointer" @click="msdsDlgVisible=true">
          <span class="name text-ellipsis">危化品知识库</span>
          <span class="mid-num">{{ chemicalCount }}</span>
        </div>
      </div>
    </div>
    <msds-list-dlg v-if="msdsDlgVisible" @cancel="msdsDlgVisible=false" />
    <knowledge-list-dlg v-if="knowledgeDlgVisible" v-bind="knowledgeDlgParams" @cancel="knowledgeDlgVisible=false" />
    <knowledge-graph-dlg v-if="knowledgeGraphDlgVisible" @cancel="knowledgeGraphDlgVisible=false" />
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useCurrentEvent, useDataRefresher } from '@/hooks';
import { apiKnowledgeRecommendObj } from '@/apis/modules/knowledge-recommend';
import recommendlogo from '@/assets/images/event-handling/left-2/recommend-logo.png';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import { IpostKnowledgeFolderFileEventTotalSpace } from '@/apis/modules/knowledge-recommend/model';
import MsdsListDlg from './knowledge-recommend/msds-list-dlg.vue';
import KnowledgeListDlg from './knowledge-recommend/knowledge-list-dlg.vue';
import KnowledgeGraphDlg from './knowledge-recommend/knowledge-graph-dlg.vue';

const totalData = reactive({} as IpostKnowledgeFolderFileEventTotalSpace.Data);
const chemicalCount = ref(0);
const msdsDlgVisible = ref(false);
const knowledgeDlgVisible = ref(false);
const knowledgeDlgParams = reactive<Record<string, any>>({});
const knowledgeGraphDlgVisible = ref(false);

const loadData = async(event: IpostFindEventDetailByIdSpace.Data) => {
  const result = await apiKnowledgeRecommendObj.postKnowledgeFolderFileEventTotal(event.eventTypeName!);
  Object.assign(totalData, result.data);

  if (isChemicalEvent.value) {
    await loadMSDSList();
  }
};

const loadMSDSList = async() => {
  const result = await apiKnowledgeRecommendObj.postMSDSPage({ currentPage: 1, pageSize: 1 });
  chemicalCount.value = result.data.totalRow;
};

const showKnowledgeDlg = (params: Record<string, any>) => {
  Object.assign(knowledgeDlgParams, params);
  knowledgeDlgVisible.value = true;
};

const { isChemicalEvent, currentEvent } = useCurrentEvent(loadData);

useDataRefresher(() => {
  loadData(currentEvent);
});
</script>
<style lang="scss" scoped>
.knowledge {
  .items {
    display: flex;
    justify-content: space-between;
    column-gap: calc(var(--xxs) * 5);
    .recommend-logo {
      width: calc(var(--xxs) * 47.25);
      object-fit: cover;
    }
    .knowledge-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      row-gap: var(--xxs);
      .knowledge-item {
        height: calc(var(--xxs) * 11);
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background-image: url('@/assets/images/overview/right-1/team-item-bg.png');
        background-repeat: no-repeat;
        background-size: cover;
        padding-right: var(--md);
        padding-left: calc(var(--px20) + var(--md));
        font-size: var(--font-lg);
        .name {
          max-width: 8em;
          line-height: calc(var(--font-xxxl));
        }
        &::before {
          content: "";
          position: absolute;
          left: 0;
          background-image: url('@/assets/images/overview/right-1/team-item-icon.png');
          background-size: 100%;
          width: calc(var(--lg) + var(--xxs) / 2);
          height: calc(var(--lg) + var(--xxs) / 2);
        }
      }
    }
  }
}
</style>
