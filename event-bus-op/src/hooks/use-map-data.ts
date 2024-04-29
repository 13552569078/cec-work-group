import { ref } from 'vue';
import {
  apiIndexPageObj as api,
  apiIndexPageWaitingObj as apiWaiting,
  apiIndexPagePendingObj as apiPending,
  apiIndexPageFinishedObj as apiFinished,
  apiEventAnalysisObj as apiEvent,
  apiEventResourcesObj as apiResources,
  apiSelfHanleObj as apiSelfHandle,
} from '@/apis';
import { IlistSpace } from '@/apis/modules/index-page/model';
import { IpostDotRadiusStatByCoordinateSpace, IResourcelistSpace } from '@/apis/modules/event-resources/model';
import { IpostVideoMapPointSpace } from '@/apis/modules/event-analysis/model'
import { streetLocation, SEARCH_SOURCE_TYPE_OPTION } from '@/common';
import {
  ALL,
  WAITING,
  PENDING,
  FINISHED
} from '@/views/event-center/constant';
import { Indexable } from 'fx-front-utils';

import mockVideoRes from './mockVideoRes';

const eventIconMapper = {
  [WAITING]: 'event-waiting',
  [PENDING]: 'event-pending',
  [FINISHED]: 'event-finished'
}

// 事件打点
const eventData = ref();
// 视频
const cameraData = ref<IpostVideoMapPointSpace.MapPoint[]>([]);
// 资源数据
const resourcesList = ref<any[]>([]);

// 聚合数据
const aggregationData = ref();

const useMapData = () => {

  const eventApi: Indexable<any> = {
    all: api.getPage.bind(api),
    [WAITING]: apiWaiting.postPage.bind(apiWaiting),
    [PENDING]: apiPending.postHandlingListPage.bind(apiPending),
    [FINISHED]: apiFinished.postEndListPage.bind(apiFinished),
    selfHandle: apiSelfHandle.list.bind(apiSelfHandle),
  }

  // 获取聚合点位
  const getAggregationPoint = async (searchParams: IlistSpace.RequestParams) => {
    const res = await api.daggregationList(searchParams);
    const validPoint = res.data.filter(point => Object.keys(streetLocation).includes(point.areaCode) )
    aggregationData.value = validPoint.map(point => {
      const location = streetLocation[point.areaCode as keyof typeof streetLocation];
      point.coordx = location[0];
      point.coordy = location[1];
      return point;
    });
    return res.data;
  }

  // 将事件包装为地图打点数据
  const eventMapWrapper = (point: any, iconSize: number = 0.3) => {
    return {
      coordinates: [Number(point.coordx), Number(point.coordy)],
      properties: {
        id: point.id || point.eventId,
        event: point,
        name: point.title,
        eventStatus: point.eventStatus || point.eventState,
        eventUrgent: point.eventUrgent,
        emit: 'OPEN_DIALOG:eventInfo',
        pointType: 'event',
        icon: eventIconMapper[`${(point.eventStatus || point.eventState) as keyof typeof eventIconMapper}`],
        iconSize: iconSize,
      }
    }
  }

    // 将事件包装为地图打点数据
    const selfHnadleEventMapWrapper = (point: any, iconSize: number = 0.3) => {
      return {
        coordinates: [Number(point.coordx), Number(point.coordy)],
        properties: {
          id: point.id,
          event: point,
          name: point.eventTitle,
          dealStatus: point.dealStatus,
          eventStatus: '-1',
          eventUrgent: point.eventUrgent,
          emit: 'OPEN_DIALOG:selfHandleEventInfo',
          pointType: 'event',
          icon: 'event-self-handle',
          iconSize: iconSize,
        }
      }
    }

  const getSelfHandleEventPoint = async (searchParams: IlistSpace.RequestParams) => {
    const res = await eventApi.selfHandle(searchParams);
    return res.data.list && res.data.list.length ? res.data.list.filter((item: any) => !isNaN(+item.coordx) && !isNaN(+item.coordy)).map((point: any) => {
      return selfHnadleEventMapWrapper(point);
    }) : [];
  }

  // const demoData = [
  //   {
  //     "id": 2799,
  //     "title": "【多系统处置-演示构造数据】2023年12月15日，应急系统上报突发火灾事故",
  //     "platformSrc": null,
  //     "platformSrcName": null,
  //     "eventTypeLName": "事务总线",
  //     "eventTypeMName": "预警事件",
  //     "eventTypeName": "火灾",
  //     "eventTime": "2023-12-15 13:32:54",
  //     "eventAddress": "德阳市/广汉市",
  //     "coordx": "104.286",
  //     "coordy": "30.9534",
  //     "dispatchOverTime": "1",
  //     "handleOverTime": "1",
  //     "endOverTime": "3",
  //     "sendPlatform": "应急",
  //     "receivePlatform": [
  //       "协同中心",
  //       "指挥调度"
  //     ],
  //     "eventStatus": 3,
  //     "eventUrgent": '2'
  //   },
  //   {
  //     "id": 2796,
  //     "title": "协同上报事件-20231211000008",
  //     "platformSrc": null,
  //     "platformSrcName": null,
  //     "eventTypeLName": "应急处置类",
  //     "eventTypeMName": "管道破裂",
  //     "eventTypeName": "热力管道破裂",
  //     "eventTime": "2023-12-11 14:31:56",
  //     "eventAddress": "缘生源茶楼",
  //     "coordx": "104.28420066833498",
  //     "coordy": "30.983948758597272",
  //     "dispatchOverTime": "1",
  //     "handleOverTime": "1",
  //     "endOverTime": "3",
  //     "sendPlatform": "协同中心",
  //     "receivePlatform": [
  //       "指挥调度"
  //     ],
  //     "eventStatus": 5,
  //     "eventUrgent": '2'
  //   },
  //   {
  //     "id": 2799,
  //     "title": "协同上报事件-20231208000009",
  //     "platformSrc": null,
  //     "dealStatus": 1,
  //     "platformSrcName": null,
  //     "eventTypeLName": "应急处置类",
  //     "eventTypeMName": "管道破裂",
  //     "eventTypeName": "热力管道破裂",
  //     "eventTime": "2023-12-08 17:28:41",
  //     "eventAddress": "福云阁",
  //     "coordx": "104.28420066833498",
  //     "coordy": "30.983948758597272",
  //     "dispatchOverTime": "1",
  //     "handleOverTime": "1",
  //     "endOverTime": "1",
  //     "sendPlatform": "协同中心",
  //     "receivePlatform": [
  //       "指挥调度"
  //     ],
  //     "eventStatus": 5,
  //     "eventUrgent": '1'
  //   },
  //   {
  //     "id": 2794,
  //     "title": "协同上报事件-20231208000004",
  //     "platformSrc": null,
  //     "platformSrcName": null,
  //     "eventTypeLName": "应急处置类",
  //     "eventTypeMName": "管道破裂",
  //     "eventTypeName": "热力管道破裂",
  //     "eventTime": "2023-12-08 16:09:45",
  //     "eventAddress": "广汉炉食庭院火锅",
  //     "coordx": "104.28420066833498",
  //     "coordy": "30.983948758597272",
  //     "dispatchOverTime": "1",
  //     "handleOverTime": "1",
  //     "endOverTime": "1",
  //     "sendPlatform": "协同中心",
  //     "receivePlatform": [
  //       "指挥调度"
  //     ],
  //     "eventStatus": 5,
  //     "eventUrgent": '1'
  //   }
  // ]

  // 获取事件点位
  const getEventPoint = async (searchParams: IlistSpace.RequestParams) => {
    eventData.value = [];
    searchParams.pageSize = 1000;
    searchParams.pageNum = 1;
    searchParams.districtCode = searchParams.district;
    let func = null;
    if (searchParams.eventStatus === ALL) {
      func = eventApi.all;
    } else {
      func = eventApi[searchParams.eventStatus as string]
    }
    const res = await func(searchParams);
    const eventList = res.data.list || res.data
    // const eventList = demoData;
    eventData.value = eventList && eventList.length ? eventList.filter((item: any) => !isNaN(+item.coordx) && !isNaN(+item.coordy)).map((point: any) => {
      return eventMapWrapper(point);
    }) : [];
    const selfHandleEventData = await getSelfHandleEventPoint(searchParams);
    eventData.value = eventData.value.concat(selfHandleEventData);
    return res.data
  }

  const setEventData = (data: any) => {
    eventData.value = data;
  }

  const videoMapWrapper = (point: any) => {
    return {
      coordinates: [Number(point.longitude), Number(point.latitude)],
      properties: {
        emit: 'OPEN_DIALOG:camera',
        pointType: 'video',
        icon: 'camera',
        iconSize: 0.3,
        ...point
      }
    };
  };
  const getVideoMapPoint = async () => {
    const { data } = await apiResources.list({
      'name': '',
    });
    // const data  = mockVideoRes;
    cameraData.value = data.filter(item => !isNaN(+item.longitude) && !isNaN(+item.latitude) && item.longitude!== '0.0' && item.latitude!== '0.0').map(item => {
      return videoMapWrapper(item);
    });
  };

  const resourceMapWrapper = (point: IResourcelistSpace.Data[], iconSize: number = 0.3) => {
    const result = point
      .filter(item => !isNaN(+item.longitude) && !isNaN(+item.latitude))
      .map(item => {
      return {
        type: item.type,
        coordinates: [Number(item.longitude), Number(item.latitude)],
        properties: {
          emit: 'OPEN_DIALOG:resouce',
          pointType: 'resource',
          icon: SEARCH_SOURCE_TYPE_OPTION.filter(item2 => { return Number(item2.value) === Number(item.type)})[0].prop,
          iconSize: iconSize,
          ...item
        }
      }
    });
    // 按照资源类型分组地图图层
    const data = result.reduce(
      (acc: any, item) => ({
        ...acc,
        [item.type + '' as string]: [...(acc[item.type + '' as string] ?? []), item],
      }),
      {},
    );
    console.log('资源结果~', data);
    const tempArr = [];
    for (let key in data) {
      tempArr.push({
        type: key,
        children: data[key]
      });
    }
    return tempArr;
  };
  // 查询资源图层数据
  const getResourcesList = () => {
    apiResources.postResourcelist('', [])
      .then(res => {
        const result = resourceMapWrapper(res.data);
        resourcesList.value = result;
      });
  };

  // 清除相关图层
  const clearMapLayerPoint = () => {
    cameraData.value = [];
    resourcesList.value = [];
  };

  const mapResourcesTotal = ref<any>({
    'eventStat': {
      'completedNum': 0,
      'disposalNum': 0,
      'preDispatchNum': 0
    },
    'resourceStat': {
      'businessHubNum': 0,
      'hospitalNum': 0,
      'hotelNum': 0,
      'schoolNum': 0,
      'threeSmallPlacesNum': 0,
      'transportHubNum': 0
    },
    'videoStat': {
      'monitorVideoNum': 0
    }
  });
  const getMapResourcesTotal = async (params: IpostDotRadiusStatByCoordinateSpace.RequestParams) => {
    const { data } = await apiResources.postDotRadiusStatByCoordinate(params);
    // console.log(data);
    mapResourcesTotal.value = data;
  };

  return {
    aggregationData,
    getAggregationPoint,
    eventData,
    getEventPoint,
    eventMapWrapper,
    selfHnadleEventMapWrapper,
    setEventData,
    cameraData,
    getVideoMapPoint,

    resourcesList,
    getResourcesList,
    clearMapLayerPoint,

    mapResourcesTotal,
    getMapResourcesTotal,

    resourceMapWrapper,
    videoMapWrapper
  }
}

export { useMapData };

function async() {
  throw new Error('Function not implemented.');
}
