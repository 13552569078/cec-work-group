<template>
  <hl-group full gap="var(--md)" dir="vertical" class="h-full w-xl static">
    <hl-input
      placeholder="请输入查询内容"
      block
      v-model="filterText"
    >
      <template #prefix>
        <hl-icon>
          <two-search />
        </hl-icon>
      </template>
    </hl-input>
    <hl-scrollbar style="height: calc(var(--xxl) * 12)" ref="treeScrollbarRef">
      <hl-tree
        :data="data"
        node-key="id"
        :props="defaultProps"
        ref="tree"
        default-expand-all
        :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
          <hl-group full gap="var(--xs)" align="items-between">
            <hb-text-overflow method="length" :length="10" effect="dark" style="width: calc(var(--xxl) * 4)">
              <span :id="data.id" class="custom-address-tree-node">{{ node.label }}</span>
            </hb-text-overflow>
            <fill-monitor
              @click.stop="getVideo(data.videoEquipTreeVOList)"
              v-if="data.videoEquipTreeVOList&&data.videoEquipTreeVOList.length>0"
              style="width: 1.5em; height: 1.5em; stroke-width: 1.5; fill: none;"/>
            <fill-sensor
              @click.stop="getIot(data.id)"
              v-if="data.iotEquipTreeVOList&&data.iotEquipTreeVOList.length>0"
              style="width: 1.5em; height: 1.5em; stroke-width: 1.5; fill: none;"/>
          </hl-group>
        </template>
      </hl-tree>
    </hl-scrollbar>
  </hl-group>
</template>

<script setup lang="ts">
import { inject, ref, watch, PropType, nextTick } from 'vue';
import { apiMonitorCenterObj } from '@/apis/modules/monitorCenter';
import { Emitter } from 'mitt';

const props = defineProps({
  regionTypeCodeList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  eventTypeCodeList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  selectedRegionTypeIds: {
    type: Array as PropType<string[]>,
    default: () => []
  },
});

const $mitter = inject('$mitter') as Emitter;

const show = ref(false);

const filterText = ref('');
const tree = ref();
const data = ref<any[]>([]);
const defaultProps = ref({
  children: 'children',
  label: 'label',
});

watch(filterText, val => {
  tree.value.filter(val);
});

const filterNode = (value: any, dataTree: { label: string | any[]; }) => {
  if (!value) return true;
  return dataTree.label.indexOf(value) !== -1;
};
const getVideo = (videoList: { equipId: any; }[]) => {
  $mitter.emit('OPEN_DIALOG:videoInfo', videoList.map((item: { equipId: any; }) => { return item.equipId; }));
};

const getIot = (id: string) => {
  console.log('pointId', id);
  $mitter.emit('OPEN_DIALOG:iotInfo', id);
};

const treeScrollbarRef = ref();

const initData = async() => {
  const params = {
    useFor: 1,
    regionTypeCodeList: props.regionTypeCodeList, // 监测主体类型Code
    eventTypeCodeList: props.eventTypeCodeList // 事件类型Code
  };
  const result = await apiMonitorCenterObj.getListMonitorPointTreeVOs(params.useFor, params.regionTypeCodeList, params.eventTypeCodeList);
  const templateTee = result.data;
  templateTee.forEach(item => {
    item.label = item.regionTypeName;
    item.id = item.regionTypeId;
    item.monitorRegionTreeVOList.forEach(item2 => {
      item2.label = item2.regionName;
      item2.id = item2.regionId;
      item2.monitorPointTreeVOList.forEach(item3 => {
        item3.label = item3.pointName;
        item3.id = item3.pointId;
      });
      item2.children = item2.monitorPointTreeVOList;
    });
    item.children = item.monitorRegionTreeVOList;
  });
  data.value = templateTee;

  // 获取dom节点
  await nextTick();
  const treeNodeElements = document.getElementsByClassName('custom-address-tree-node');
  const elementList = [...treeNodeElements].map(it => { return it.getAttribute('id'); });
  const count = elementList.findIndex(item => item === props.selectedRegionTypeIds[0]);

  // console.log('tree节点', treeNodeElements);
  // console.log('count', count);
  treeScrollbarRef.value.setScrollTop((count + 1) * 34);
};
initData();

</script>
