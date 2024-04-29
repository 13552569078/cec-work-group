<template>
  <card-popper
    title="标绘列表"
    class="plotting-list"
    :class="[showMask ? 'map-tools-right-show' : 'map-tools-moving-right']"
    @close="$emit('cancel')">
    <div class="content-section">
      <div class="search-section">
        <hl-input v-model="keyword" block @keypress.enter="refreshList">
          <template #suffix>
            <hl-icon @click="refreshList"><fill-search /></hl-icon>
          </template>
        </hl-input>
        <hl-button class="create-plotting primary hover-style" @click="showCreateDlg=true">新建标绘</hl-button>
      </div>
      <hl-scrollbar class="self-grow">
        <div class="list-section">
          <div v-for="item in list" :key="item.id" class="list-item">
            <div class="top">
              <img src="@/assets/images/map/plotting/plotting-icon.png" >
              <div class="txt">
                <h5 class="name">{{ item.layerName }}</h5>
                <span class="time text-secondary font-md">{{ item.lastDateTime }}</span>
              </div>
            </div>
            <div class="line"></div>
            <div class="bottom font-md">
              <div><span class="text-secondary">创建人</span>&nbsp;&nbsp;<span>{{ item.createMan }}</span></div>
              <div class="action">
                <div v-if="item.myCreated">
                  <span class="m-r-xs" @click="enterPlotting(item, item.hasEdit)">编辑</span><span @click="deletePlotting([item.layerId])">删除</span>
                </div>
                <div v-else>
                  <span @click="enterPlotting(item, item.hasEdit)">编辑</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hb-empty class="empty-box position-absolute" v-if="list.length===0" :image="NoDataImg"/>
      </hl-scrollbar>
    </div>
    <create-plotting-dlg v-if="showCreateDlg" @ok="createOk" @cancel="showCreateDlg=false"/>
  </card-popper>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { useLayout, useMapPlotting } from '@/hooks';
import { MAP_PLOTTING_TYPE } from '@/common';
import { apiLayerListObj } from '@/apis/modules/layer-list';
import { apiPlottingIconConfigObj } from '@/apis/modules/plot-icon-config';
import NoDataImg from '@/assets/images/empty/no-data.png';
import CreatePlottingDlg from './create-plotting-dlg.vue';

import type { IpostLayerListOnePicSpace } from '@/apis/modules/layer-list/model';

defineEmits(['cancel']);

const route = useRoute();
const router = useRouter();
const { showMask } = useLayout();
const { startPlotting } = useMapPlotting();

const keyword = ref('');
const list = ref<IpostLayerListOnePicSpace.List[]>([]);
const showCreateDlg = ref(false);
let rootId: string = '';

const refreshList = async() => {
  const res = await apiLayerListObj.postLayerListOnePic({ 'layerName': keyword.value, 'resourceId': route.query.id });
  list.value = res.data;
};

const enterPlotting = async(item: IpostLayerListOnePicSpace.List, hasEdit: number) => {
  if (!rootId) {
    await getTopicsList();
  }
  startPlotting({ layerId: item.layerId, hasEdit, rootId });
};
const getTopicsList = async() => {
  const res = await apiPlottingIconConfigObj.postTopics();
  res.data.forEach(item => {
    if (`${MAP_PLOTTING_TYPE}` === `${item.layerType}`) {
      rootId = `${item.rootId}`;
    }
  });
};

const createOk = (data: IpostLayerListOnePicSpace.List) => {
  showCreateDlg.value = false;
  enterPlotting(data, 1);
};
const deletePlotting = async(ids: string[]) => {
  await HlMessageBox.confirm('确认删除此标绘吗？');
  await apiLayerListObj.postDeleteCertPlottingLayerPlotting(ids);
  HlMessage.success('删除成功');
  refreshList();
};

onMounted(() => {
  refreshList();
});
</script>
<style lang="scss" scoped>
.plotting-list {
  --card-popper-width: calc(var(--xxs) * 90);
  --extra-right: calc(var(--px20) * 2 + calc(var(--xxs) * 16.5) + var(--md));
  --card-popper-header-img: url('@/assets/images/overview/right-4/header.png');
  --form-radius: var(--xxs);
  --form-bg-color: rgba(0,158,247,0.12);
  --form-border-color: rgba(0,158,247,0.24);
  position: absolute !important;
  top: calc(var(--panels-top) + var(--xxs) * 30);
  height: calc(var(--xxs) * 180);
  .content-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: calc(var(--xxs) * 3);
    .search-section {
      --search-height: calc(var(--xxs) * 8);
      display: flex;
      column-gap: calc(var(--xxs) * 4.5);
      :deep(.hl-input) {
        flex: 1;
        --input-height: var(--search-height);
      }
      .create-plotting {
        width: calc(var(--xxs) * 18);
        height: var(--search-height);
      }
    }
    .list-section {
      display: flex;
      flex-direction: column;
      row-gap: calc(var(--xxs) * 2);
      .list-item {
        background-color: rgba(0, 158, 247, 0.12);
        padding: var(--md) var(--md) calc(var(--xxs) * 2.5) var(--md);
        .top {
          display: flex;
          column-gap: calc(var(--xxs) * 3);
          img {
            width: calc(var(--xxs) * 10);
            height: calc(var(--xxs) * 10);
          }
          .txt {
            display: flex;
            flex-direction: column;
          }
        }
        .line {
          width: 100%;
          height: 1px;
          background: #2F5787;
          margin-top: calc(var(--xxs) * 3.5);
          margin-bottom: calc(var(--xxs) * 2.5);
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          .action {
            color: #71F8FC;
            cursor: pointer;
          }
        }
      }
    }
  }
  .empty-box {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
