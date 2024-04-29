<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 360)"
    height="calc(var(--xxs)*241.5)"
    title="知识图谱"
    class="knowledge-graph-dlg full-body"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <div class="wrapper">
      <relation-graph ref="relationGraphRef" :options="options" :on-node-click="previewFile" />
    </div>
    <knowledge-doc-dlg v-if="showDocDlg" :current-doc="currentDoc" @cancel="showDocDlg=false" />
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, PropType, onMounted, reactive, nextTick } from 'vue';
import RelationGraph from 'relation-graph/vue3';
import { useCurrentEvent } from '@/hooks';
import { apiKnowledgeRecommendObj } from '@/apis/modules/knowledge-recommend';
import { IpostFindKnowledgeEventTreeSpace } from '@/apis/modules/knowledge-recommend/model';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import KnowledgeDocDlg from './knowledge-doc-dlg.vue';

const relationGraphRef = ref();
const showDocDlg = ref(false);
const currentDoc = ref({} as IpostFindKnowledgeEventTreeSpace.Children);
const options = {
  defaultExpandHolderPosition: 'right',
  allowShowMiniToolBar: false,
  layouts: [
    {
      label: '中心',
      layoutName: 'center',
      layoutClassName: 'seeks-layout-center',
      distance_coefficient: 1
    }
  ],
};

const loadData = async(event: IpostFindEventDetailByIdSpace.Data) => {
  const result = await apiKnowledgeRecommendObj.postFindKnowledgeEventTree({
    fileType: '',
    eventName: event.name,
    eventTypeName: event.eventTypeName
  });

  const nodes: Record<string, any>[] = [];
  const lines: Record<string, any>[] = [];
  nodes.push({ id: '$Root', text: result.data.name, styleClass: 'level1', pId: null });
  result.data.children.forEach((child, idx) => { // 第一级
    const cid = '$' + child.name;
    nodes.push({ id: cid, text: child.name, styleClass: `level2 l${idx + 1}`, pId: '$Root', });
    lines.push({ from: '$Root', to: cid, isHideArrow: true, color: '#62D1F3' });
    child.children.forEach(subChild => { // 第二级
      nodes.push({ id: subChild.id, text: subChild.name, styleClass: 'level3', pId: cid, data: subChild });
      lines.push({ from: cid, to: subChild.id, isHideArrow: true, color: '#62D1F3' });
    });
  });

  const jsonData = {
    rootId: '$Root',
    nodes,
    lines,
  };
  nextTick(() => {
    relationGraphRef.value.setJsonData(jsonData);
  });
};

const previewFile = (node: { data: IpostFindKnowledgeEventTreeSpace.Children }) => {
  if (node.data?.knowledgeFileId) {
    console.log('../////ssss', node);
    currentDoc.value = node.data!;
    showDocDlg.value = true;
  }
};

useCurrentEvent(loadData);
</script>
<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
}
:deep(.relation-graph) {
  .rel-map {
    background: transparent;
  }
  .rel-node-peel{
    font-size: var(--font-lg);
  }
  // .c-btn-open-close {
  //   display: none;
  // }
  .rel-linediv {
    .c-rg-line {
      stroke-dasharray: 4;
    }
  }
  .level1 {
    border: 1px solid #FFFFFF;
    background-color: #FF6800;
    box-shadow: none;
    font-weight: 500;
  }
  .level2-1 {
    border: 1px solid #FFFFFF;
    background-color: #A6A3EF !important;
    box-shadow: none;
    font-weight: 500;
    font-size: var(--font-lg);
    width: calc(var(--xxs) * 16);
  }
  .level2 {
    border: 1px solid #FFFFFF;
    box-shadow: none;
    font-weight: 500;
    font-size: var(--font-lg);
    width: calc(var(--xxs) * 14);
    height: calc(var(--xxs) * 14);
    &.l1 {
      background-color: #5096FF !important;
    }
    &.l2 {
      background-color: #D9BC43 !important;
    }
    &.l3 {
      background-color: #D47A4D !important;
    }
    &.l4 {
      background-color: #C056FF !important;
    }
  }
  .level3 {
    color: #9A9FE1 !important;
    background-color: #BD43ED !important;
    font-size: var(--font-lg);
    position: relative;
    width: calc(var(--xxs) * 3.5);
    height: calc(var(--xxs) * 3.5);
    cursor: pointer;
    .c-node-text {
      position: absolute;
      bottom: calc(var(--xxs) * -5);
      width: calc(var(--xxs) * 40);
      justify-content: start;
    }
  }
}
</style>
