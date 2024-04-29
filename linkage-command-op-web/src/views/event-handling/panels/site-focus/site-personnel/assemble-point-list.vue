<template>
  <div class="assemble-point-wrap">
    <div class="list">
      <div class="list-item" v-for="item in assemblePointList" :key="item.id">
        <div class="header-box">
          <div class="title text-ellipsis" @mouseover="showTooltip">
            {{ item.assembleTitle }}：{{ item.assembleAddress }}
          </div>
          <div v-if="!eventIsFinished" class="operate-buttons">
            <span style="margin-right: calc(var(--xxs) * 4);" @click="editAssemblePoint(item)">编辑</span>
            <span :loading="loading" @click=" deleteAssemblePoint(item)">删除</span>
          </div>
        </div>
        <div class="content">
          <div class="top-part">
            <div class="assembled">
              <span class="text">已集结</span>
              <span class="number" @click="clickAssembledCount(item)">{{ item.assembleUserCount }}</span>
            </div>
            <div class="wait-assemble">
              <span class="text">待集结</span>
              <span class="number" @click="clickWaitAssembledCount(item)">{{ item.assemblingUsers.length || 0 }}</span>
            </div>
            <div class="progress">
              <span class="text">集结完成度</span>
              <span class="number">{{ getWidth(item.assembleUserCount, item.userCount) }}</span>
            </div>
          </div>
          <div class="bottom-part">
            <div
              class="assembled-progress"
              :style="{width: getWidth(item.assembleUserCount, item.userCount)}"
            ></div>
          </div>
        </div>
      </div>
      <hb-empty v-if="!assemblePointList.length" description="暂无集结点" :image="NoDataImg" style="padding: 0" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, reactive, inject } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { useCurrentEvent, useMapLayer, useTextOverflow } from '@/hooks';
import { CreateAssemblePointParams } from '@/types';
import { CreateAssemblePointParamsKey } from '@/common';
import { apiSitePersonnelObj } from '@/apis/modules/site-personnel';
import NoDataImg from '@/assets/images/empty/no-data.png';
import type { IpostFindCommandCenterAssemblePointListSpace } from '@/apis/modules/site-personnel/model';
import type { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';

const emit = defineEmits(['update', 'show-users']);

const createAssemblePointParams = inject<CreateAssemblePointParams>(CreateAssemblePointParamsKey)!;

const { waitingRefreshLayerMarkers, clearClickMapMarkerInfo } = useMapLayer();
const { showTooltip } = useTextOverflow();

const assemblePointList = ref<IpostFindCommandCenterAssemblePointListSpace.Data[]>([]);

const isShow = reactive({
  showAssembledUserListDlg: false,
});
const loading = ref(false);
const assemblePointId = ref();
const curAssembleAddress = ref('');
const curAssembleUsers = ref<IpostFindCommandCenterAssemblePointListSpace.AssemblingUser[]>();

const editAssemblePoint = (item: IpostFindCommandCenterAssemblePointListSpace.Data) => {
  const { id, assembleTitle, assembleAddress, longitude, latitude } = item;
  createAssemblePointParams.title = '编辑集结点';
  createAssemblePointParams.type = 'edit';
  createAssemblePointParams.data = { id, assembleTitle, assembleAddress, longitude, latitude };
  createAssemblePointParams.show = true;
};
const closeCreateAssemblePointCard = () => {
  createAssemblePointParams.title = '';
  createAssemblePointParams.type = 'add';
  createAssemblePointParams.data = {
    id: '',
    assembleTitle: '',
    assembleAddress: '',
    longitude: '',
    latitude: '',
  };
  createAssemblePointParams.show = false;
  clearClickMapMarkerInfo();
};

const deleteAssemblePoint = async(item: IpostFindCommandCenterAssemblePointListSpace.Data) => {
  if (loading.value) return;
  closeCreateAssemblePointCard();
  await HlMessageBox.confirm('您确定要删除此集结点吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });
  loading.value = true;
  try {
    await apiSitePersonnelObj.postDeleteCommandCenterAssemblePoint(item.id);
    HlMessage.success('删除成功');
  } catch {
    HlMessage.error('删除失败');
  } finally {
    loading.value = false;
    waitingRefreshLayerMarkers.value = ['EventAssemblePoints'];
  }
};

const afterCreateAssemblePoint = async() => {
  await getAssemblePointList(currentEvent);
  emit('update');
};

const getAssemblePointList = async(event: IpostFindEventDetailByIdSpace.Data) => {
  apiSitePersonnelObj.postFindCommandCenterAssemblePointList(event.id as string).then(res => {
    assemblePointList.value = res.data.map(item => {
      return {
        ...item,
        assembleUserCount: item.assembleUserCount || 0,
        userCount: item.userCount || 0
      };
    });
  });
};

const getWidth = (num: number, total: number) => {
  if (total === 0) return '--';
  const percent = ((num / total) * 100);
  return Number.isInteger(percent) ? `${percent}%` : `${percent.toFixed(2)}%`;
};

const clickAssembledCount = (item: IpostFindCommandCenterAssemblePointListSpace.Data) => {
  if (eventIsFinished.value) return;
  const { id, assembledUsers } = item;
  if (assembledUsers.length === 0) {
    HlMessage.warning('无已集结人员！');
    return;
  }
  emit('show-users', 'assembled', item);
};

const clickWaitAssembledCount = (item: IpostFindCommandCenterAssemblePointListSpace.Data) => {
  if (eventIsFinished.value) return;
  const { id, assemblingUsers, assembleAddress } = item;
  if (assemblingUsers.length === 0) {
    HlMessage.warning('无待集结人员！');
    return;
  }
  emit('show-users', 'assembling', item);
};

watch(waitingRefreshLayerMarkers, val => { // 地图更新，删除集结点
  if (val.includes('EventAssemblePoints')) {
    getAssemblePointList(currentEvent);
  }
});

const { currentEvent, eventIsFinished } = useCurrentEvent(getAssemblePointList);

defineExpose({
  getAssemblePointList,
});
</script>
<style lang="scss" scoped>
.assemble-point-wrap {
  .list {
    overflow-x: hidden;
    .list-item {
      background: rgba(0,158,247,0.12);
      margin-bottom: var(--xxs);
      .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: url("@/assets/images/event-handling/right-2/site-personnel/list-item-title-bg.png") no-repeat center;
        background-size: 100%;
        padding: 0 calc(var(--xxs) * 4);
        height: calc(var(--xxs) * 10);
        .title {
          display: flex;
          align-items: center;
          max-width: 80%;
          font-size: var(--font-lg);
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
          padding-top: calc(var(--xxs) * 0.75);
        }
        .operate-buttons {
          display: flex;
          font-size: var(--font-md);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #71F8FC;
          cursor: pointer;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        padding: calc(var(--xxs) * 4);
        .top-part {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: calc(var(--xxs) * 5);
          div {
            display: flex;
            align-items: center;
            .text {
              margin-right: calc(var(--xxs) * 4);
              font-size: var(--font-lg);
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #B5CEE3;
            }
            .number {
              font-size: var(--font-xxl);
              font-family: Impact;
            }
          }
          div.assembled {
            .number {
              color: #fff;
              cursor: pointer;
            }
          }
          div.wait-assemble {
            .number {
              color: #FFEA44;
              cursor: pointer;
            }
          }
          div.progress {
            color: #72F5AC;
          }
        }
        .bottom-part {
          width: 100%;
          height: var(--xxs);
          background-color: #023e69;
          margin-top: calc(var(--xxs) * 4);
          margin-bottom: calc(var(--xxs) * 2);
          .assembled-progress {
            position: relative;
            height: var(--xxs);
            background: linear-gradient(270deg, #71F8FC 0%, rgba(6,137,150,0.5) 100%);
            border-radius: 0px calc(var(--xxs) * 0.75) calc(var(--xxs) * 0.75) 0px;
            &:after {
              position: absolute;
              content: '';
              right: calc(var(--xxs) * -5);
              top: calc(var(--xxs) * -4.5);
              width: calc(var(--xxs) * 10);
              height: calc(var(--xxs) * 10);
              background: url("@/assets/images/event-handling/right-2/site-personnel/progress-icon.png") no-repeat center;
              background-size: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
