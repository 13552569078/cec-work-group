<template>
  <hl-dialog
    :model-value="$props.modelValue"
    title="物联网设备"
    width="90%"
    full-body
    @closed="handleClosed"
    :append-to-body="true">
  <hl-group full gap="var(--lg)" id="video-main" class="h-full p-lg">
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
      <hl-scrollbar style="height: calc(var(--lg) * 34)" ref="treeScrollbarRef">
        <hl-tree
          :data="data"
          node-key="id"
          :props="defaultProps"
          ref="tree"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          highlight-current
        >
          <template #default="{ node, data }">
            <hl-group full gap="var(--xs)" align="items-between">
              <hl-group gap="var(--md)">
                <!--<span>{{ node.label }}</span>-->
                <span :id="data.id" class="custom-iot-tree-node">{{ node.label }}</span>
              </hl-group>
              <hl-group gap="var(--md)" class="static p-r-md">
              </hl-group>
            </hl-group>
          </template>
        </hl-tree>
      </hl-scrollbar>
    </hl-group>

    <hl-group full>
      <modal-event-monitor-data :pointIdData="pointIdData" v-if="pointIdData!=''"/>
      <hl-row
        layout="grid"
        :count="1"
        gap="var(--sm)"
        class="videos"
        v-else
      >
        <hb-empty image-size="20vh" :image="require('@/assets/images/no-data.svg')" :style="getHeight()"/>
      </hl-row>
    </hl-group>
  </hl-group>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive, watch, nextTick } from 'vue';
import { apiMonitorCenterObj } from '@/apis/modules/monitorCenter';
import { IgetListMonitorPointTreeVOsSpace } from '@/apis/modules/monitorCenter/model';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  pointId: String
});

const handleNodeClick = async(data: { pointId: string; }) => {
  // console.log(data);
  pointIdData.value = '';
  await nextTick();
  if (data.pointId) {
    pointIdData.value = data.pointId;
  } else {
    pointIdData.value = '';
  }
};
const handleClosed = () => {
  emit('update:modelValue', false);
};
const filterText = ref('');
const tree = ref();
const data = ref<IgetListMonitorPointTreeVOsSpace.Data[]>([]);
const pointIdData = ref('');

const treeScrollbarRef = ref();
const getTreeData = async() => {
  const params = {
    useFor: 1,
    regionTypeCodeList: [], // 监测主体类型Code
    eventTypeCodeList: [] // 事件类型Code
  };
  const result = await apiMonitorCenterObj.getListMonitorPointTreeVOs(params.useFor, params.regionTypeCodeList, params.eventTypeCodeList);
  const treeData = result.data;
  // 处理tree数据
  treeData.forEach(item1 => {
    item1.label = item1.regionTypeName;
    item1.id = item1.regionTypeId;
    item1.monitorRegionTreeVOList.forEach(item2 => {
      item2.label = item2.regionName;
      item2.id = item2.regionId;
      item2.monitorPointTreeVOList.forEach(item3 => {
        item3.label = item3.pointName;
        item3.id = item3.pointId;
        // item3.videoEquipTreeVOList.forEach(item4 => {
        //   item4.label = item4.equipName;
        //   item4.id = item4.equipId;
        // });
        // item3.children = item3.videoEquipTreeVOList;
      });
      item2.children = item2.monitorPointTreeVOList;
    });
    item1.children = item1.monitorRegionTreeVOList;
  });
  data.value = treeData;

  // 默认选中数据
  await nextTick();

  if (props.pointId) {
    // console.log('iot', props.pointId);
    tree.value.setCurrentKey(props.pointId);
    handleNodeClick({ pointId: props.pointId as string });
  }

  // 定位
  if (props.pointId) {
    const treeNodeElements = document.getElementsByClassName('custom-iot-tree-node');
    const elementList = [...treeNodeElements].map(it => { return it.getAttribute('id'); });
    const count = elementList.findIndex(item => item === props.pointId);
    console.log('计数', count);
    treeScrollbarRef.value.setScrollTop((count + 1) * 34);
  }
};

getTreeData();

const divisionNum = ref('1');
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
const getHeight = () => {
  return divisionNum.value === '1'
    ? 'height: calc(var(--xxs) * 140'
    : 'height: calc(var(--xxs) * 60';
};
</script>
<style lang="scss" scoped>
.video-el {
  object-fit: fill;
}
</style>
