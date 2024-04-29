import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cloneDeep, pick } from 'lodash-es';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { useUser } from 'fx-front-ucenter';
import { GlobalAPI, createSocket } from '@/common';
import { apiUserRelationListObj } from '@/apis/modules/user-relation-list';
import { apiPlotInfoListObj } from '@/apis/modules/plotInfo-list';
import { apiLayerListObj } from '@/apis/modules/layer-list';
import { IpostFindCertPlottingLayerByIdPlottingSpace } from '@/apis/modules/layer-list/model';
import { useMap } from './use-map';
import { useLayout } from '../use-layout';

const INIT_PLOTTING_DATA = {
  activeTab: 'plotting',
  needRefresh: false,
  drawShape: '',
  shapeCount: 0,
  markShapeVisibleMap: {} as Record<string, boolean>,
  activeLayer: {} as IpostFindCertPlottingLayerByIdPlottingSpace.Data,
  curMarkVoListData: [] as IpostFindCertPlottingLayerByIdPlottingSpace.MarkVoList[],
  curFeatureData: {} as Record<string, any>,
  measureFeatureIds: new Set<string>()
};
const showPlottingList = ref(false);
const currentPlottingInfo = reactive(cloneDeep(INIT_PLOTTING_DATA));
let socketInstance: ReturnType<typeof createSocket> | null;
function useMapPlotting() {
  const route = useRoute();
  const router = useRouter();
  const { hideMask, displayMask } = useLayout();
  const { getUserInfo } = useUser();
  const { getView, setView } = useMap();

  const isPlotting = computed(() => !!route.query.layerId);
  const canEdit = computed(() => route.query.hasEdit === '1');
  const layerId = computed(() => route.query.layerId as string);

  const startPlotting = (params: Record<string, any>) => {
    router.push({
      query: Object.assign({}, route.query, params)
    });
  };
  const stopPlotting = () => {
    if (layerId.value) {
      router.push({
        query: pick(route.query, 'id')
      });
    }
  };
  const clearPlottingData = () => {
    socketInstance?.close();
    socketInstance = null;

    Object.assign(currentPlottingInfo, cloneDeep(INIT_PLOTTING_DATA));
  };

  const listening = async() => {
    const userInfo = await getUserInfo();
    if (socketInstance) {
      socketInstance.close();
    }
    let baseurl = GlobalAPI.config.BASE_URL;
    if (process.env.NODE_ENV === 'production') {
      baseurl = window.location.origin + GlobalAPI.config.BASE_URL;
    }
    baseurl = baseurl.replace('http', 'ws');
    socketInstance = createSocket(
      `${baseurl}/ws?channelId=${userInfo.empid}&groupId=${layerId.value}`,
      async(res: any) => {
        try {
          const data = JSON.parse(res.data);
          const { msgTitle, msgContent } = data;
          const msgData = JSON.parse(msgContent)?.data;
          if (msgTitle === '同步视野') {
            await HlMessageBox.confirm('确定接收同步视野操作？', '确认信息', {
              confirmButtonText: '接收',
              cancelButtonText: '取消',
              lockScroll: false,
              closeOnClickModal: false,
            });
            setTimeout(() => {
              setView({
                center: msgData.center,
                zoom: msgData.zoom,
                bearing: msgData.bearing,
                pitch: msgData.pitch,
              });
            }, 0);
          } else if (
            msgTitle === '删除协同标绘协同人员' &&
            msgData?.layerId === layerId.value
          ) {
            await HlMessageBox.alert('您已被踢出此图层的协作', '提示', {
              confirmButtonText: '好的',
              showClose: false,
            });
            await apiUserRelationListObj.posRemoveWebSocketPlotting({
              layerId: layerId.value as string,
              userIdList: [userInfo.empid] as any,
            });
            stopPlotting();
          } else if (msgData?.layerId) {
            getLayerDetail(`${msgData?.layerId}`);
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
    socketInstance.init({ closeNow: true });
  };

  const getLayerDetail = async(id?: string | number) => {
    const res = await apiLayerListObj.postFindCertPlottingLayerByIdPlotting(id || layerId.value);
    if (+res.code === 0) {
      if (layerId.value) {
        currentPlottingInfo.activeLayer = res.data;
        currentPlottingInfo.curMarkVoListData = res.data.markVoList || [];
        currentPlottingInfo.curMarkVoListData.forEach(item => {
          const markOther = JSON.parse(item.markOther as string);
          const isVisible = currentPlottingInfo.markShapeVisibleMap[item.id as unknown as string];
          markOther.properties.visible = isVisible || isVisible === undefined;
          item.markOther = JSON.stringify(markOther);
        });
      }
      currentPlottingInfo.needRefresh = true;
      nextTick(() => {
        currentPlottingInfo.needRefresh = false;
      });
    }
  };
  const addPlottingData = async(feature: Record<string, any>) => {
    const userInfo = await getUserInfo();
    currentPlottingInfo.curFeatureData = feature;
    if (currentPlottingInfo.curMarkVoListData.length === 0) {
      _addPlottingData();
    } else {
      const curMarkData = currentPlottingInfo.curMarkVoListData.map(ele => ({
        id: ele.id,
        markData: JSON.parse(ele.markOther as string),
      }));
      const curMarkIndex = curMarkData.findIndex(v => v.markData.id === feature.id);
      if (curMarkIndex < 0) {
        _addPlottingData();
      }
    }
  };
  const _addPlottingData = async() => {
    const userInfo = await getUserInfo();
    const res = await apiPlotInfoListObj.postAddCertPlottingMarkPlotting({
      layerId: layerId.value,
      userId: userInfo.empid,
      markName: currentPlottingInfo.curFeatureData.properties.name,
      markOther: JSON.stringify(currentPlottingInfo.curFeatureData),
      mapMarkId: currentPlottingInfo.curFeatureData.properties['image-id'] || '',
    });
    if (+res.code === 0) {
      getLayerDetail();
    }
  };
  const modifyPlottingData = async(feature: Record<string, any>) => {
    const userInfo = await getUserInfo();
    currentPlottingInfo.curFeatureData = feature;
    const id = currentPlottingInfo.curMarkVoListData.find(m => m.markOther!.indexOf(feature.id) > -1)!.id;
    if (!id) return;
    const res = await apiPlotInfoListObj.postModifyCertPlottingMarkPlotting({
      id,
      layerId: layerId.value,
      userId: userInfo.empid,
      markOther: JSON.stringify(feature),
    });
    if (+res.code === 0) {
      getLayerDetail();
    }
  };
  const deletePlottingData = async(id: string) => {
    await HlMessageBox.confirm('确定删除当前标记吗?', '提示', {
      confirmButtonText: '确定',
      confirmButtonType: 'danger',
      cancelButtonText: '取消',
    });
    const res = await apiPlotInfoListObj.postDeleteCertPlottingMarkPlotting(id);
    HlMessage(res.desc);
    getLayerDetail(layerId.value);
  };
  const syncView = async() => {
    const userInfo = await getUserInfo();
    const options = getView();
    const res = await apiLayerListObj.postSyncViewPlotting({
      layerId: layerId.value,
      userId: userInfo.empid,
      ...options,
    });
    if (+res.code === 0) {
      HlMessage('已将同步视野操作发送给协作者');
    }
  };

  const changeTab = (t: string) => {
    currentPlottingInfo.activeTab = t;
  };

  watch(isPlotting, val => {
    if (val) {
      showPlottingList.value = false;
      hideMask();
    } else {
      displayMask();
    }
  }, {
    immediate: true,
  });

  return {
    showPlottingList,
    canEdit,
    isPlotting,
    layerId,
    currentPlottingInfo,
    startPlotting,
    stopPlotting,
    clearPlottingData,
    listening,
    getLayerDetail,
    modifyPlottingData,
    addPlottingData,
    deletePlottingData,
    syncView,
    changeTab,
  };
}

export {
  useMapPlotting
};
