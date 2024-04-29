<template>
  <div v-if="!expandable" class="collapsed h-full">
    <div v-for="v in collapsedVideos" :key="v.id" class="video-item" @click="previewVideo(v)">
      <video :src="v.videoUrl"/>
      <span class="name">{{ v.videoName }}</span>
    </div>
    <div v-for="v in (CollapsedVideoCount - collapsedVideos.length)" :key="v" class="video-item empty">
      <hb-empty :image="NoDataImg"></hb-empty>
      <span class="name">暂无视频</span>
    </div>
  </div>
  <div v-else class="expanded h-full display-flex flex-col">
    <div class="total-bg m-b-md">
      <h5 class="txt">共计 <span class="num">{{totalVideos}}</span> 路</h5>
      <hl-button type="primary" class="hover-style normal-width" @click="playVideos">播放视频</hl-button>
    </div>
    <hl-scrollbar class="self-grow">
      <hl-tree
        ref="treeRef"
        class="video-tree"
        node-key="id"
        :props="treeProps"
        :data="treeData"
        :default-expanded-keys="defaultExpandedKeys"
        show-checkbox
      >
        <template #default="{ node, data }">
          <h5 v-if="node.level <=2" class="top-dir">{{ node.label }}</h5>
          <hl-group v-else full class="w-full overflow-hidden" gap="var(--xs)" align="items-middle items-between">
            <hl-group>
              <span style="max-width: 12em" class="text-ellipsis" @mouseover="showTooltip">{{ node.label }}</span>
              <hl-tag
                v-if="data.isDevice"
                size="sm"
                class="m-l-xs"
                :style="{'--tag-font-color': videoStateDict.get(data.videoState)?.textColor}"
                :type="videoStateDict.get(data.videoState)?.type"
              >{{ videoStateDict.get(data.videoState)?.name }}</hl-tag>
            </hl-group>
            <div v-if="data.isDevice" class="static text-right">&nbsp;<span class="num">{{ data.dist || '--' }}</span>&nbsp;km</div>
          </hl-group>
        </template>
      </hl-tree>
    </hl-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, inject, nextTick, onMounted, ref, watch } from 'vue';
import { usePreviewer } from 'fx-front-framework';
import { ExpandableCardParamsKey, GlobalAPI, playFixedVideos, videoStateDict } from '@/common';
import { ExpandableCardParams } from '@/types';
import { useMapBuffer, useTextOverflow } from '@/hooks';
import { apiFixedVideoObj } from '@/apis/modules/fixed-video';
import NoDataImg from '@/assets/images/empty/no-video-data.png';
import { IpostFindEventFixedDeviceListSpace } from '@/apis/modules/fixed-video/model';
import { HlMessage } from 'hongluan-ui';

const CollapsedVideoCount = 4;
const { right2: expandable } = inject<ExpandableCardParams>(ExpandableCardParamsKey)!;

const { queryParams } = useMapBuffer();
const { openPreviewer } = usePreviewer();
const { showTooltip } = useTextOverflow();

const collapsedVideos = ref<IpostFindEventFixedDeviceListSpace.Data[]>([]);
const totalVideos = ref(0);
const treeRef = ref();
const treeProps = {
  label: 'name',
  children: 'children',
};
const treeData = ref([
  {
    id: '-1',
    name: '视频目录',
    children: [] as any[]
  },
]);
const defaultExpandedKeys = computed(() => ['-1']);

const loadCollapsedVideo = async() => {
  const result = await apiFixedVideoObj.postFindEventFixedDeviceList({ ...queryParams.value, pageSize: CollapsedVideoCount });
  collapsedVideos.value = result.data.list;
  collapsedVideos.value.forEach((item, idx) => {
    if (!item.videoUrl && GlobalAPI.config.FIXED_VIDEOS[idx]) {
      item.videoUrl = GlobalAPI.config.VIDEO_SERVICE_VIEW + GlobalAPI.config.FIXED_VIDEOS[idx];
    }
  });
};

const loadExpandedVideo = async() => {
  const result = await apiFixedVideoObj.postFindEventFixedDeviceTree({
    ...queryParams.value
  });
  totalVideos.value = result.data.total;
  treeData.value[0].children = result.data.tree;
};

const previewVideo = (item: IpostFindEventFixedDeviceListSpace.Data) => {
  openPreviewer({
    sourceType: 2,
    id: '' + item.id,
    name: '视频预览',
    url: item.videoUrl,
    showCollapse: false,
  });
};

const playVideos = () => {
  const checkedNodes: IpostFindEventFixedDeviceListSpace.Data[] = treeRef.value.getCheckedNodes(true);
  if (checkedNodes.length <= 0) {
    HlMessage.error('请选择需要播放的视频');
    return;
  }
  if (checkedNodes.length > 4) {
    HlMessage.error('最多可播放4路视频');
    return;
  }

  checkedNodes.forEach((item, idx) => {
    if (!item.videoUrl && GlobalAPI.config.FIXED_VIDEOS[idx]) {
      item.videoUrl = GlobalAPI.config.VIDEO_SERVICE_VIEW + GlobalAPI.config.FIXED_VIDEOS[idx];
    }
  });
  playFixedVideos(checkedNodes);
};

const loadData = async() => {
  if (expandable.value) {
    await loadExpandedVideo();
  } else {
    await loadCollapsedVideo();
  }
};

watch(expandable, () => {
  nextTick(async() => {
    await loadData();
  });
}, {
  immediate: true
});

watch(queryParams, async() => {
  await loadData();
});
</script>

<style lang="scss" scoped>
.collapsed {
  display: flex;
  column-gap: var(--md);
  row-gap: var(--md);
  flex-wrap: wrap;
  .video-item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: calc(var(--xxs) * 53);
    &.empty {
      background-image: url('@/assets/images/event-handling/right-2/video/empty-video-bg.png');
      background-size: 100%;
      background-repeat: no-repeat;
    }
    video, :deep(.hb-empty) {
      height: calc(var(--xxs) * 30);
    }
    :deep(.hb-empty) {
      .empty-description {
        display: none;
      }
    }
    .name {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(var(--xxs) * 10);
      background-image: url('@/assets/images/event-handling/right-2/video/name-bg.png');
      background-size: 100%;
      background-repeat: no-repeat;
      font-size: var(--font-lg);
      line-height: 1.5;
      font-weight: (--font-weight-bold);
    }
  }
}
.expanded {
  .total-bg {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: calc(var(--xxs) * 11);
    background-image: url('@/assets/images/event-handling/right-2/video/video-total-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    padding: calc(var(--xxs) * 2.5) var(--md);
    .num {
      color: #FFEA44;
    }
  }
  :deep(.video-tree) {
    --tree-height: calc(var(--xxs) * 9);
    --tree-bg-color: transparent;
    --tree-child-bg-color: transparent;
    .num {
      color: #FFEA44;
    }
  }
}
</style>
<style lang="scss">
.hb-modeless-dialog.multi-video-player-dialog.fullscreen {
  .multi-video-player {
    width: 100%;
    height: 100%;
    video {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
