<template>
  <div>
    <hv-panel title="监测设备">
      <template #action> </template>
      <hl-group full="full-x" gap="var(--md)" class="m-t-md">
        <hl-group class="card-flag" style="--card-padding-x: var(--xs); --card-padding-y: var(--md)" full="full-x" align="items-middle" dir="vertical">
          <span class="text-secondary">监测点</span>
          <h2 class="font-din m-t-xxs">{{ monitorControl.monitorPointNumber }}</h2>
        </hl-group>
        <hl-group class="card-flag" style="--card-padding-x: var(--xs); --card-padding-y: var(--md)" full="full-x" align="items-middle" dir="vertical">
          <span class="text-secondary">视频监控</span>
          <h2 class="font-din m-t-xxs">{{ monitorControl.monitorVideoEquipNumber }}</h2>
        </hl-group>
        <hl-group class="card-flag" style="--card-padding-x: var(--xs); --card-padding-y: var(--md)" full="full-x" align="items-middle" dir="vertical">
          <span class="text-secondary">传感设备</span>
          <h2 class="font-din m-t-xxs">{{ monitorControl.monitorIotEquipNumber }}</h2>
        </hl-group>
      </hl-group>
      <hl-group full dir="vertical" gap="var(--md)" class="m-t-md">
        <hl-group gap="var(--md)">
          <hl-radio-group v-model="treeType" full custom merge @change="getTreeData">
            <hl-radio :label="0">
              <hl-button size="md" block>按监测类型</hl-button>
            </hl-radio>
            <hl-radio :label="1">
              <hl-button size="md" block>按设备类型</hl-button>
            </hl-radio>
          </hl-radio-group>
          <hl-input v-model="equipName" block placeholder="输入关键字进行过滤">
            <template #prefix>
              <hl-icon><two-search /></hl-icon>
            </template>
          </hl-input>
        </hl-group>
        <hl-scrollbar style="height: calc(var(--xxs) * 50)">
          <hl-tree
            v-if="treeData.length>0"
            ref="tree"
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            highlight-current>
            <template #default="{ node, data }">
              <hl-group full gap="var(--xs)" align="items-between">
                <span style="display: inline-block; width: calc(var(--xxl) * 5)">{{ node.label }}</span>
                <template v-if="treeType == 0">
                  <fill-monitor
                    @click.stop="getVideo(data.id)"
                    v-if="!data.children&&data.type==='video'"
                    style="width: 1.5em; height: 1.5em; stroke-width: 1.5; fill: none;float: right;"/>
                  <fill-sensor
                    @click.stop="getIot(data.id)"
                    v-if="data.iotEquipTreeVOList&&data.iotEquipTreeVOList.length>0"
                    style="width: 1.5em; height: 1.5em; stroke-width: 1.5; fill: none;float: right;"/>
                </template>
              </hl-group>
            </template>
          </hl-tree>
        </hl-scrollbar>
      </hl-group>
    </hv-panel>
    <modalMonitorPoint ref="modalMonitorPointRef" />
    <!-- 视频监控 -->
    <!-- <hl-dialog v-model="dialogVisible" title="视频监控列表" full-body width="calc(var(&#45;&#45;xxl) * 32)" height="calc(var(&#45;&#45;xxl) * 20)">
      <video-play v-if="dialogVisible"></video-play>
    </hl-dialog> -->
<!--    <modalVideo v-model="dialogVisible" :equipCode="equipCode"/>-->
  </div>
</template>

<script lang="ts" setup>
import { inject, reactive, ref, watch } from 'vue';
import modalMonitorPoint from '../../components/modalMonitorPoint.vue';

import { apiRegionAlarmObj } from '@/apis/modules/regionAlarm';
import {
  IgetFindRegionMonitorControlSpace,
  IgetListRegionEventTypeEquipTreesSpace,
  IgetListRegionEquipTreesSpace
} from '@/apis/modules/regionAlarm/model';
import { Emitter } from 'mitt';
// import VideoPlay from '@/views/video-play/index.vue';
// import modalVideo from '@/components/dialogs/eventInfo/modalVideo.vue';
const $mitter = inject('$mitter') as Emitter;

const props = defineProps({
  regionId: {
    type: Number,
    default: 0
  }
});

const monitorControl = ref({} as IgetFindRegionMonitorControlSpace.Data);
const getMonitorControlt = async() => {
  // 监测布控统计
  const { data } = await apiRegionAlarmObj.getFindRegionMonitorControl(props.regionId);
  monitorControl.value = data;
};
getMonitorControlt();

const treeType = ref(0);
const equipName = ref('');
watch(equipName, () => {
  getTreeData();
});
const tree = ref(null);
const treeData = ref<IgetListRegionEventTypeEquipTreesSpace.MonitorPointEquipTreeVOList[]|any[]>([

]);
const defaultProps = ref({
  children: 'children',
  label: 'label'
});
const equipId = ref<string[]>([]);
const pointId = ref<string[]>([]);
const getTreeData = async() => {
  treeData.value = [];
  if (treeType.value === 0) {
    const { data } = await apiRegionAlarmObj.getListRegionEventTypeEquipTrees(equipName.value, props.regionId);
    // 处理数据
    if (data.length > 0) {
      data.forEach(item => {
        item.monitorPointEquipTreeVOList.forEach(item2 => {
          item2.label = item2.pointName;
          item2.id = String(item2.pointId);
          const children:any[] = [];
          item2.videoEquipTreeVOList && item2.videoEquipTreeVOList.forEach(item3 => {
            item3.label = item3.equipName;
            item3.id = item3.equipId;
            item3.type = 'video';
            item3.pointId = item2.pointId;
            children.push(item3);
          });
          /* item2.iotEquipTreeVOList && item2.iotEquipTreeVOList.forEach(item4 => {
            item4.label = item4.equipName;
            item4.id = item4.equipId;
            item4.type = 'iot';
            item4.pointId = item2.pointId;
            children.push(item4);
          }); */
          item2.children = children;
        });
      });
      treeData.value = data[0].monitorPointEquipTreeVOList;
    } else {
      treeData.value = [];
    }
  } else {
    const { data } = await apiRegionAlarmObj.getListRegionEquipTrees(equipName.value, props.regionId);
    console.log('设备', data);
    const treeData2 = [
      {
        label: '监控视频',
        id: 1,
        children: [] as IgetListRegionEquipTreesSpace.VideoEquipList[]
      },
      {
        label: '物联网监测',
        id: 2,
        children: [] as IgetListRegionEquipTreesSpace.IotEquipList[]
      },
    ];
    data.videoEquipList && data.videoEquipList.forEach(item => {
      item.id = item.equipId;
      item.label = item.equipName;
      item.type = item.equipType === 0 ? 'video' : 'iot';
    });
    data.iotEquipList && data.iotEquipList.forEach(item => {
      item.id = item.equipId;
      item.label = item.equipName;
      item.type = item.equipType === 0 ? 'video' : 'iot';
    });
    treeData2[0].children = data.videoEquipList ? data.videoEquipList : [];
    treeData2[1].children = data.iotEquipList ? data.iotEquipList : [];
    treeData.value = treeData2;
  }
};
getTreeData();

const modalMonitorPointRef = ref();
const handleNodeClick = (data: any) => {
  console.log('点击节点', data);
  // pointId 监测点
  if (!data.children)modalMonitorPointRef.value?.openDialog(data);
};

const dialogVisible = ref(false);
const getVideo = (id: string) => {
  // alert('打开视频');
  equipId.value = [];
  equipId.value.push(id);
  dialogVisible.value = true;
  $mitter.emit('OPEN_DIALOG:videoInfo', [equipId.value]);
};

const getIot = (id: string) => {
  // alert('打开物联网');
  // console.log('pointId', id);
  // pointId.value = [];
  // pointId.value.push(id);
  dialogVisible.value = true;
  $mitter.emit('OPEN_DIALOG:iotInfo', id);
};
</script>
