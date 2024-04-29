<template>
  <hl-group full gap="var(--lg)" id="video-main" class="h-full p-lg">
    <hl-group full gap="var(--md)" dir="vertical" class="h-full w-xl static">
      <hl-input
        placeholder="请输入查询内容"
        block
        v-model="filterText"
      >
        <template #prefix>
          <hl-icon>
            <two-search/>
          </hl-icon>
        </template>
      </hl-input>
      <hl-scrollbar ref="treeScrollbarRef">
        <hl-tree
          :data="data"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          ref="tree"
          default-expand-all
          :filter-node-method="filterNode"
          @check-change="handleCheckChange"
        >
          <template #default="{ node, data }">
            <hl-group full gap="var(--xs)" align="items-between">
              <hl-group gap="var(--md)">
                <hb-text-overflow method="length" :length="12" effect="dark">
                  <span :id="data.id" class="custom-video-tree-node">{{ node.label }}</span>
                </hb-text-overflow>
              </hl-group>
              <hl-group gap="var(--md)" class="static p-r-md">
              </hl-group>
            </hl-group>
          </template>
        </hl-tree>
      </hl-scrollbar>
    </hl-group>
    <hl-group full dir="vertical">
      <hl-scrollbar>
        <hl-row
          layout="grid"
          :count="getCount()"
          gap="var(--sm)"
          class="videos"
          v-if="videoList.length === 0"
        >
          <hb-empty style="height: calc(var(--xxs) * 148);" description="暂无播放资源" image-size="20vh" :image="require('@/assets/images/no-data.svg')"/>
        </hl-row>
      <hl-row
        layout="grid"
        :count="getCount()"
        gap="var(--sm)"
        class="videos"
        v-else
      >
        <template v-for="(item, index) in videoList" :key="item.id">
          <hl-col v-if="index < divisionNum" span="col">
            <hl-group full dir="vertical" class="h-full box-shadow-level3">
              <!-- :style="getHeight()"-->
              <play :style="getHeight()" :video-url="item.videoUrl"></play>
              <hl-group
                full="full-x"
                align="items-between"
                class="static bg-light p-md"
              >
                <span class="static">{{ item.label }}</span>
                <!--<hl-tag
                  :type="item.state == '1' ? 'yellow' : 'default'"
                  size="sm"
                  class="static"
                >
                  <template v-if="item.state == '1'">在线</template>
                  <template v-if="item.state == '0'">离线</template>
                </hl-tag>-->
              </hl-group>
            </hl-group>
          </hl-col>
        </template>
      </hl-row>
      </hl-scrollbar>
      <hl-group full align="items-between" class="p-t-md static">
        <hl-group/>
        <hl-group class="static">
          <hl-dropdown trigger="click">
            <hl-button
              class="
                border-transparent
                bg-transparent
                text-secondary
                hover:text-primary
              "
              equal
            >
              <template #icon>
                <hl-icon>
                  <fill-layout/>
                </hl-icon>
              </template>
            </hl-button>
            <template #dropdown>
              <hl-dropdown-menu>
                <hl-dropdown-item
                  v-for="(item, index) in division"
                  :key="index"
                  @click="changeDivision(item.value)"
                >
                  <span
                    :class="item.value === divisionNum ? 'text-warning' : null"
                  >{{ item.label }}</span
                  >
                </hl-dropdown-item>
              </hl-dropdown-menu>
            </template>
          </hl-dropdown>
          <hl-button
            class="
              border-transparent
              bg-transparent
              text-secondary
              hover:text-primary
            "
            equal
            @click="exitFullscreen"
            v-if="isMaxScreen"
          >
            <template #icon>
              <hl-icon>
                <fill-Minimize/>
              </hl-icon>
            </template>
          </hl-button>
          <hl-button
            class="
              border-transparent
              bg-transparent
              text-secondary
              hover:text-primary
            "
            equal
            @click="fullScreen"
            v-else
          >
            <template #icon>
              <hl-icon>
                <fill-Maximize/>
              </hl-icon>
            </template>
          </hl-button>
        </hl-group>
      </hl-group>
    </hl-group>
  </hl-group>
</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive, watch, nextTick, PropType } from 'vue';
import Play from './play.vue';
import { apiMonitorCenterObj } from '@/apis/modules/monitorCenter';
import { IgetListMonitorPointTreeVOsSpace } from '@/apis/modules/monitorCenter/model';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  equipId: {
    type: Array as PropType<string[]>,
    default: () => []
  },
});

const filterText = ref('');
const tree = ref();
const isMaxScreen = ref(false);
const data = ref<IgetListMonitorPointTreeVOsSpace.Data[]>([]);

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
        item3.videoEquipTreeVOList.forEach(item4 => {
          item4.label = item4.equipName;
          item4.id = item4.equipId;
          item4.videoUrl = require('./test.mp4');
        });
        item3.children = item3.videoEquipTreeVOList;
      });
      item2.children = item2.monitorPointTreeVOList;
    });
    item1.children = item1.monitorRegionTreeVOList;
  });
  data.value = treeData;

  // 默认选中数据
  await nextTick();
  // console.log('接收的', props.equipId);
  tree.value.setCheckedKeys(props.equipId);

  // 定位
  if (props.equipId.length > 0 || route.query.monitorRegionId) {
    const treeNodeElements = document.getElementsByClassName('custom-video-tree-node');
    const elementList = [...treeNodeElements].map(it => { return it.getAttribute('id'); });
    const count = elementList.findIndex(item => item === props.equipId[0] || item === route.query.monitorRegionId);
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
const countMap = new Map([
  ['1', 'count-1'],
  ['4', 'count-2'],
  ['6', 'count-3'],
  ['9', 'count-3'],
  ['12', 'count-4'],
  ['16', 'count-4'],
]);
// 播放视频组
const videoList = ref([]);
const division = [
  {
    label: '一屏',
    value: '1',
  },
  {
    label: '四屏',
    value: '4',
  },
  {
    label: '六屏',
    value: '6',
  },
  {
    label: '九屏',
    value: '9',
  },
  {
    label: '十二屏',
    value: '12',
  },
  {
    label: '十六屏',
    value: '16',
  },
];

watch(filterText, val => {
  tree.value.filter(val);
});
watch(videoList, val => {
  const len = videoList.value.length;
  if (len <= 1) {
    divisionNum.value = '1';
  } else if (len <= 4) {
    divisionNum.value = '4';
  } else if (len > 4 && len <= 6) {
    divisionNum.value = '6';
  } else if (len > 6 && len <= 9) {
    divisionNum.value = '9';
  } else if (len > 9 && len <= 12) {
    divisionNum.value = '12';
  } else if (len > 12) {
    divisionNum.value = '16';
  }
});

const filterNode = (value: any, dataTree: { label: string | any[]; }) => {
  if (!value) return true;
  return dataTree.label.indexOf(value) !== -1;
};
const changeDivision = (num: string) => {
  divisionNum.value = num;
};
const getCount = () => {
  return countMap.get(divisionNum.value);
};
const heightMap = new Map([
  ['1', 'calc(var(--xxs) * 140'],
  ['4', 'calc(var(--xxs) * 70'],
  ['6', 'calc(var(--xxs) * 70'],
  ['9', 'calc(var(--xxs) * 45'],
  ['12', 'calc(var(--xxs) * 35'],
  ['16', 'calc(var(--xxs) * 35'],
]);
const getHeight = () => {
  // return divisionNum.value === '1'
  //   ? 'height: calc(var(--xxs) * 140'
  //   : 'height: calc(var(--xxs) * 60';

  return `height: ${heightMap.get(divisionNum.value)}`;
};
// 操作树
const handleCheckChange = () => {
  videoList.value = tree.value.getCheckedNodes().filter((item: any) => {
    return item.videoUrl;
  });
};

const fullScreen = () => {
  const full = document.getElementById('video-main');
  launchIntoFullscreen(full);
};
const launchIntoFullscreen = (element: any) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
  isMaxScreen.value = true;
};
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    (document as any).mozCancelFullScreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  }
  isMaxScreen.value = false;
};
</script>
<style lang="scss" scoped>
.video-el {
  object-fit: fill;
}
</style>
