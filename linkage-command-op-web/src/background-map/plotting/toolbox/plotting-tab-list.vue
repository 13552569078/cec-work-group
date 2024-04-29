<template>
  <hl-scrollbar class="plotting-tab-list">
    <hl-group
      v-for="item in list"
      :key="item.id"
      class="p-y-md"
      full="full-x"
      dir="vertical"
      gap="var(--xxs)"
      style="border-bottom: 1px solid #2F5787;"
    >
      <hl-group align="items-middle" merge indent full class="cursor-pointer">
        <hl-group align="items-middle" @click="checkCurMark(item)">
          <span class="font-lg font-bold ellipsis">
            {{ item.markOther?.title || item.markOther?.properties?.name || '暂无内容' }}
          </span>
          <hl-tag
            v-if="item.markName || item.markOther?.properties?.name || item.markOther?.zhLabel"
            size="sm"
            class="static m-l-xs mark-tag"
          >{{
            item.markName || item.markOther?.properties?.name || item.markOther?.zhLabel
          }}</hl-tag>
        </hl-group>
        <hl-group class="static" @click="handleChangeMarkVisible(item)">
          <hl-icon v-if="currentPlottingInfo.markShapeVisibleMap[item.id]" :disabled="!canEdit">
            <two-show />
          </hl-icon>
          <hl-icon v-if="!currentPlottingInfo.markShapeVisibleMap[item.id]" :disabled="!canEdit">
            <two-hide />
          </hl-icon>
        </hl-group>
        <hl-icon class="static m-l-sm"  :disabled="!canEdit" @click="deleteMark(item)">
          <two-delete />
        </hl-icon>
      </hl-group>
      <div class="text-secondary">{{ item.updatedAt }}</div>
    </hl-group>
  </hl-scrollbar>
</template>
<script lang="ts" setup>
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { useMap, useMapPlotting } from '@/hooks';
import { apiPlotInfoListObj } from '@/apis/modules/plotInfo-list';
import { IpostFindCertPlottingMarkPagePlottingSpace } from '@/apis/modules/plot-icon/model';

const route = useRoute();
const { setCenter } = useMap();
const { layerId, currentPlottingInfo, canEdit, getLayerDetail, deletePlottingData } = useMapPlotting();

const list = ref<IpostFindCertPlottingMarkPagePlottingSpace.List[]>([]);

const deleteMark = async(item: { id: any }) => {
  if (!canEdit.value) return;
  await deletePlottingData(item.id);
  getList();
};
const checkCurMark = (item: any) => {
  if (!canEdit.value) return;

  const coordinates = item.markOther.geometry.coordinates[0][0] && Array.isArray(item.markOther.geometry.coordinates[0][0])
    ? item.markOther.geometry.coordinates[0][0]
    : item.markOther.geometry.coordinates[0] && Array.isArray(item.markOther.geometry.coordinates[0])
      ? item.markOther.geometry.coordinates[0]
      : item.markOther.geometry.coordinates;
  setCenter([coordinates[0], coordinates[1]]);
};
const handleChangeMarkVisible = (item: any) => {
  if (!canEdit.value) return;
  currentPlottingInfo.markShapeVisibleMap[item.id] = !currentPlottingInfo.markShapeVisibleMap[item.id];

  item.markOther.properties.visible = currentPlottingInfo.markShapeVisibleMap[item.id];
  currentPlottingInfo.curFeatureData = item.markOther;
};

const getList = async() => {
  const res = await apiPlotInfoListObj.postFindCertPlottingMarkPagePlotting({
    layerId: route.query.layerId,
    pageSize: 100
  });

  const result: IpostFindCertPlottingMarkPagePlottingSpace.List[] = [];
  res.data.list.forEach(ele => {
    const item = {
      ...ele,
      markOther: JSON.parse(ele.markOther || '{}'),
    };
    result.push(item);
    if (typeof currentPlottingInfo.markShapeVisibleMap[ele.id] !== 'boolean') {
      currentPlottingInfo.markShapeVisibleMap[ele.id] = true;
    }
  });
  list.value = result;
};

watch(() => route.query.layerId, lId => {
  lId && getList();
}, {
  immediate: true,
  deep: true,
});
watch(() => currentPlottingInfo.needRefresh, val => {
  val && getList();
});
</script>
<style lang="scss" scoped>
.plotting-tab-list {
  flex: 1 0 0;
  .mark-tag {
    --tag-bg-color: rgba(113, 248, 252, 0.24);
    --tag-border-color: rgba(113, 248, 252, 0.24);
    --tag-radius: calc(var(--xxs) * 0.5);
    --tag-padding-x: var(--xxs);
    color: #71F8FC;
  }
}
</style>
