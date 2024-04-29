<template>
  <hl-scrollbar class="plotting-tab-list">
    <hl-group class="p-y-md" v-for="item in records" :key="item.id" full="full-x" dir="vertical" gap="var(--xxs)"
      style="border-bottom: 1px solid #2F5787;">
      <hl-row class="record-item" gap-x="calc(var(--xxs) * 10)">
        <hl-col span="col-4" class="left-part"><span></span></hl-col>
        <hl-col span="col-20" class="right-part">
          <hl-group align="items-middle" merge indent full>
            <span class="ellipsis font-bold font-lg">
              {{ item.personName }}-{{ item.orgName }}
            </span>
          </hl-group>
          <div>{{ dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}</div>
          <hl-group class="m-t-xs" align="items-middle" full>
            <hl-tag v-if="item.operationTypeName" size="sm" class="static record-tag">{{ item.operationTypeName }}</hl-tag>
            <hl-tag v-if="item.markName" size="sm" class="static m-l-xs record-tag">{{ item.markName }}</hl-tag>
          </hl-group>
        </hl-col>
      </hl-row>
    </hl-group>
  </hl-scrollbar>
</template>
<script lang="ts" setup>
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { useMapPlotting } from '@/hooks';
import { apiPlotHistoryListObj } from '@/apis/modules/plot-history-list';
import { IpostFindLogListPlottingSpace } from '@/apis/modules/plot-history-list/model';

const route = useRoute();
const { currentPlottingInfo } = useMapPlotting();

const records = ref<IpostFindLogListPlottingSpace.Data[]>([]);

const getList = async() => {
  const res = await apiPlotHistoryListObj.postFindLogListPlotting(route.query.layerId as string);
  records.value = res.data;
};

watch(() => route.query.layerId, layerId => {
  layerId && getList();
}, {
  immediate: true,
});
watch(() => currentPlottingInfo.needRefresh, val => {
  val && getList();
});
</script>
<style lang="scss" scoped>
.plotting-tab-list {
  flex: 1 0 0;
  .record-item {
    .left-part {
      padding-top: var(--xxs);
      span {
        display: inline-block;
        width: calc(var(--xxs) * 10);
        height: calc(var(--xxs) * 10);
        background: url('@/assets/images/map/plotting/plotting-icon.png') no-repeat center;
        background-size: 100%;
      }
    }
    .right-part {
      .record-tag {
        --tag-bg-color: rgba(113, 248, 252, 0.24);
        --tag-border-color: rgba(113, 248, 252, 0.24);
        --tag-radius: calc(var(--xxs) * 0.5);
        --tag-padding-x: var(--xxs);
        color: #71F8FC;
      }
    }
  }
}
</style>
