<template>
  <hl-group
    dir="vertical"
    class="list-cell w-full p-r-sm"
    @click="handleClickResource(data)"
  >
    <!-- <h3 class="m-t-xs"><span class="m-r-md">{{ index + 1 }}</span>{{ data.name }}</h3> -->
    <hl-group class="event-top" align="items-between">
      <hl-group align="items-middle items-center m-t-xxs" style="height: calc(var(--xl))">
        <div class="event-index">
          {{ index + 1 }}
        </div>
        <hl-popover
          placement="bottom"
          :content="data.name"
          :disabled="data.name?.length < 22"
          trigger="hover"
          popper-style="--popover-bg-color:rgba(14,23,38,0.96);"
        >
          <template #reference>
            <span class="event-title ellipsis m-l-md">
              {{ data.name }}
            </span>
          </template>
        </hl-popover>
      </hl-group>
    </hl-group>
    <hl-group class="p-sm" align="items-between">
      <span v-if="data.typeName">{{ data.typeName }}</span>
      <span v-else class="display-flex items-middle">
        <img
          class="status-icon"
          :src="data.status === 1 ? online : ''"
          v-if="data.status"
        />
        {{ data.statusName }}
      </span>
      <span class="event-address ellipsis cursor-pointer" @click="handleLocate(data)">
        <hl-group class="pos-icon" align="items-center">
          <hl-icon
            class="static"
            type="primary"
            width="calc(var(--xl) * 0.48)"
            height="calc(var(--xl) * 0.48)"
            color="#D7EBFF"
          >
            <FillPoint />
          </hl-icon>
        </hl-group>
        {{ data.address }}
      </span>
    </hl-group>
  </hl-group>
</template>
<script lang="ts" setup>
import { useGlobalState, useMapTools } from '@/hooks';
import { SHOW_CAMERA } from '@/views/event-center/constant';
import online from '@/assets/images/eventCenter/online.png';

const props = defineProps({
  data: Object,
  index: Number,
});
const { flyTo } = useMapTools();
const { layerSwitch, handleShowCamera, handleShowResource } = useGlobalState();

const handleClickResource = (item: any) => {
  // 资源点位
  if (item.typeName) {
    handleShowResource(item);
  } else {
    // 视频点位
    handleShowCamera(item.channelId);
  }
};

const handleLocate = (item: any) => {
  // 资源点位
  if (item.typeName) {
    if (!layerSwitch.resourcesSelected.find(resource => item.type === resource)) {
      layerSwitch.resourcesSelected.push(item.type);
    }
  } else {
    // 视频点位
    if (!layerSwitch.videosSelected.length) {
      layerSwitch.videosSelected.push(SHOW_CAMERA);
    }
  }

  flyTo({
    center: [item.longitude, item.latitude],
    zoom: 14,
  });
};
</script>
<style lang="scss" scoped>
.list-cell {
  margin-bottom: calc(var(--xl) * 0.32);
  // height: calc(var(--xl) * 4.06);
  background-image: url("@/assets/images/eventCenter/cell-bg-2.png");
  background-repeat: no-repeat;
  background-size: 100%;
  font-size: calc(var(--xl) * 0.56);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  height: calc(var(--xl) * 2.7);
  cursor: pointer;
  .event-index {
    width: calc(var(--xl) * 1.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .event-title {
    width: calc(var(--xl) * 9);
    line-break: anywhere;
  }
}
.status-icon {
  width: calc(var(--xl) * 0.58);
  height: calc(var(--xl) * 0.58);
  margin-right: calc(var(--xl) * 0.28);
}
</style>
