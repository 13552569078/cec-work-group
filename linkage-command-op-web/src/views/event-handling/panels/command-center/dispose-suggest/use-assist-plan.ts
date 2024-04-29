import { ref } from 'vue';
import { useMapBuffer, useCurrentEvent, useResourceData } from '@/hooks';
import { apiDisposeSuggestObj } from '@/apis/modules/dispose-suggest';
import { apiDataResourceObj } from '@/apis/modules/data-resource';
import { cloneDeep } from 'lodash-es';

const { queryParams } = useMapBuffer();
const { ALL_RESOURCES_TREE_NEW } = useResourceData();

const bufferOptions = ref<Array<{label: string; value:string;}>>([]);

const updateAssistPlanListDateStamp = ref(0);
const allConfigResourceType = ref<any>([]);
function useAssistPlan() {
  const { currentEvent } = useCurrentEvent();

  const handleGetBufferSize = async() => {
    const res2 = await apiDisposeSuggestObj.getBufferSize();
    bufferOptions.value = res2.data.map((i: any) => {
      return { label: `${i}km`, value: `${i * 1000}` };
    });
    if (queryParams.value.distance) bufferOptions.value.push({ label: '缓冲区', value: `${+queryParams.value.distance * 1000}` });
    bufferOptions.value.push({ label: '不限', value: '' });
  };

  const getResourceType = async() => {
    const result = await apiDataResourceObj.postStatEventSurroundingItems({
      ...queryParams.value,
      strategyId: currentEvent.strategyInfoId
    });
    const tree = cloneDeep(ALL_RESOURCES_TREE_NEW.value);
    tree.forEach(t => {
      for (let i = t.children.length - 1; i >= 0; i--) {
        const child = result.data.find(r => r.resoureType === t.children[i].value);
        if (child) {
          t.children[i].sum = `${child.sum}`;
        } else {
          t.children.splice(i, 1);
        }
      }
      t.sum = '' + t.children.reduce((prev, cur) => prev + Number(cur.sum), 0);
    });
    allConfigResourceType.value = tree;
  };

  return {
    updateAssistPlanListDateStamp,
    bufferOptions,
    allConfigResourceType,
    getResourceType,
    handleGetBufferSize,
  };
}

export {
  useAssistPlan
};
