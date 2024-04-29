import { ref, computed, inject, onUnmounted } from 'vue';
import { Emitter } from "mitt";
import * as hongtuUtil from "@hongtu-next/util";
import { apiMonitorCenterObj as api } from '@/apis/modules/monitorCenter'
import {
  IgetFindWarningInfoListPageSpace,
  IgetListRegionTypeListVOsSpace,
  IgetListEventTypeListVOsSpace,
  IgetListMonitorRegionMapVOsSpace,
  IgetListMonitorPointMapVOsSpace, IgetListWarningInfoListVOsSpace
} from '@/apis/modules/monitorCenter/model'

import { apiSubjectObj } from '@/apis/modules/subjectDetail';
import { IgetFindMonitorEventPointSpace } from '@/apis/modules/subjectDetail/model';


const useMonitorCenter = () => {
  const $eventBus = inject("$mitter") as Emitter;
  /**
   * 响应式变量 ref
   */

  // 当前报警
  const currentWarningList = ref<IgetListWarningInfoListVOsSpace.Data[]>([]);
  // 当前报警数
  const currentWarningNumber = ref();
  // 监测主体类型
  const regionTypeList = ref<IgetListRegionTypeListVOsSpace.Data[]>([]);
  // 事件类型
  const eventTypeList = ref<IgetListEventTypeListVOsSpace.Data[]>([]);
  // 选中的监测主体
  const selectedRegionTypeIds = ref<string[]>([])
  // 选中的监测主体
  const selectedEventTypeIds = ref<string[]>([])
  // 监测事件的监测点信息
  const eventMonitorPointData = ref();
  // 地图打点 - 监测主体
  const mapRegions = ref();
  // 地图打点 - 事件
  const mapEvents = ref();
  // 地图打点 - 监测点
  const mapMonitorPoints = ref();
  // 监测点下设备列表
  const equipmentList = ref();

  /**
   * 计算属性
   */

  // 监测主体总数
  const totalRegionNumber = computed(() => {
    return regionTypeList.value.reduce((acc, current) => {
      return acc + current.regionNumber
    }, 0)
  })
  // 监测主体 已选中数
  const selectedRegionNumber = computed(() => {
    const selectedRegionType = regionTypeList.value.filter(item => selectedRegionTypeIds.value.includes(item.id))
    return selectedRegionType.reduce((acc, current) => {
      return acc + current.regionNumber
    }, 0)
  })

  // 监测事件总数
  const totalEventNumber = computed(() => {
    return eventTypeList.value.reduce((acc, current) => {
      return acc + current.monitorPointNumber
    }, 0)
  })

  // 已选中的事件类型
  const selectedEventType = computed(() => {
    return eventTypeList.value.filter(item => selectedEventTypeIds.value.includes(item.eventTypeCode))
  })

  // 监测事件 已选中数
  const selectedEventNumber = computed(() => {
    return selectedEventType.value.reduce((acc, current) => {
      return acc + current.monitorPointNumber
    }, 0)
  })

  // 视频设备总数
  const totalVideoNumber = computed(() => {
    return eventTypeList.value.reduce((acc, current) => {
      return acc + current.videoEquipNumber
    }, 0)
  })

  // 物联网设备总数
  const totalIotNumber = computed(() => {
    return eventTypeList.value.reduce((acc, current) => {
      return acc + current.iotEquipNumber
    }, 0)
  })

  // 已选中视频设备总数
  const selectedVideoNumber = computed(() => {
    return selectedEventType.value.reduce((acc, current) => {
      return acc + current.videoEquipNumber
    }, 0)
  })

  // 已选中物联网设备总数
  const selectedIotNumber = computed(() => {
    return selectedEventType.value.reduce((acc, current) => {
      return acc + current.iotEquipNumber
    }, 0)
  })

  /**
   * 操作变量的方法
   */

  const selectAllRegionType = () => {
    selectedRegionTypeIds.value = regionTypeList.value?.map(item => item.id)
  }

  const clearRegionType = () => {
    selectedRegionTypeIds.value = []
  }

  const selectAllEventType = () => {
    selectedEventTypeIds.value = eventTypeList.value?.map(item => item.eventTypeCode)
  }

  const clearEventType = () => {
    selectedEventTypeIds.value = []
  }

  /**
   * API 对接
   */

  // 获取 top X 报警/预警信息
  const getTopXWarningList = async () => {
    const res = await api.getListWarningInfoListVOs()
    currentWarningList.value = res.data
    return res.data
  }
  // 获取完整报警/预警信息列表
  const getWarningList = async (params: IgetFindWarningInfoListPageSpace.RequestParams) => {
    const res = await api.getFindWarningInfoListPage(params)
    return res.data
  }
  // 当前报警数
  const getWarningNumber = async () => {
    const res = await api.getFindCurrentWarningNumber()
    currentWarningNumber.value = res.data
    return res.data
  }
  // 监测主体类型
  const getRegionTypeList = async () => {
    const res = await api.getListRegionTypeListVOs()
    regionTypeList.value = res.data;
    return res.data
  }
  // 监测事件
  const getEventTypeList = async (regionTypeCode?: string[]) => {
    const codeArr = regionTypeCode?.join() || selectedRegionTypeIds.value.join()
    const res = await api.getListEventTypeListVOs(codeArr)
    eventTypeList.value = res.data
    return res.data
  }
  // 获取监测事件的监测点信息
  const getEventPointData = async (eventId: string, pointId: string) => {
    // TODO
    const res = await apiSubjectObj.getFindMonitorEventPoint(eventId, pointId, "")
    const temp = res.data;
    if(temp.monitorFactorVOList&&temp.monitorFactorVOList.length>0){
      temp.monitorFactorVOList.forEach(item=> {
        item.show = true;
        if(item.strategyRuleFactorVOS&&item.strategyRuleFactorVOS.length>0){
          item.strategyRuleFactorVOS.forEach(item2 => {
            item2.factorValue = JSON.parse(item2.factorValue)
          })
        }
      })
    }
    eventMonitorPointData.value = temp;
    return res.data
  };

  // 获取监测点下设备列表
  const getEquipmentList = async (monitorPointId: string) => {
    const res = await api.getListMonitorEquipListMapVOs(monitorPointId);
    equipmentList.value = res.data;
  }

  const getRegionCenter = (region: IgetListMonitorRegionMapVOsSpace.Data) => {
    if (!region.gisOutline) return;
    let node = JSON.parse(region.gisOutline);
    return node.center = hongtuUtil.center(node).geometry.coordinates;
  }

  // 地图 - 监测主体轮廓
  const getMapRegionData = async (params: IgetListMonitorRegionMapVOsSpace.RequestParams) => {
    const res = await api.getListMonitorRegionMapVOs(params);
    mapRegions.value = res.data.map(region => {
      region.center = getRegionCenter(region)
      return region;
    });
    return res.data;
  }

  // 地图 - 监测事件
  const getMapEvent = async(params = {
    regionTypeCodeList: '',
    eventTypeCodeList: '',
    monitorRegionId: ''
  }) => {
    const res = await api.getListMonitorEventMaps(params);
    mapEvents.value = res.data;
  }

  // 地图 - 监测点
  const getMapMonitorPoints = async(params: IgetListMonitorPointMapVOsSpace.RequestParams) => {
    const res = await api.getListMonitorPointMapVOs(params);
    mapMonitorPoints.value = res.data;
  }

  return {
    // 响应式变量
    currentWarningList,
    currentWarningNumber,
    regionTypeList,
    eventTypeList,
    selectedRegionTypeIds,
    selectedEventTypeIds,
    eventMonitorPointData,
    equipmentList,
    mapRegions,
    mapEvents,
    mapMonitorPoints,
    // 计算属性
    totalRegionNumber,
    selectedRegionNumber,
    totalEventNumber,
    selectedEventNumber,
    totalVideoNumber,
    totalIotNumber,
    selectedVideoNumber,
    selectedIotNumber,
    // API 对接
    getTopXWarningList,
    getWarningList,
    getWarningNumber,
    getRegionTypeList,
    getEventTypeList,
    getEventPointData,
    getEquipmentList,
    getMapRegionData,
    getMapEvent,
    getMapMonitorPoints,
    // 操作本页变量的方法
    selectAllRegionType,
    clearRegionType,
    selectAllEventType,
    clearEventType
  }
}

export { useMonitorCenter }
