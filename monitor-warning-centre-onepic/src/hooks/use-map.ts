import { inject, onUnmounted } from 'vue';
import { Emitter } from "mitt";
import * as hongtuUtil from "@hongtu-next/util";

const useMap = () => {
  const $eventBus = inject("$mitter") as Emitter;

  // 地图 - 面数据处理
  const updatePolygonData = (dataArr: any) => {
    const polygonData:any = {
      type: "FeatureCollection",
      features: []
    };
    dataArr.forEach((region: any) => {
      if (!region.gisOutline) return;
      let node = null;
      node = JSON.parse(region.gisOutline);
      node.center = hongtuUtil.center(node).geometry.coordinates;
      node.properties.id = region.regionId;
      node.properties.warningNumber = region.alarmNumber;
      node.properties.name = region.name;
      node.properties.emit = 'OPEN_DIALOG:regionDetail';
      node.properties.borderColor="#E7BB22",
      node.properties.fillColor= "rgba(231, 187, 34, 0.24)"
      node.properties.regionType = region.regionTypeCode;
      polygonData.features.push(node);
    });
    $eventBus.emit('UPDATE_MAP:polygon', polygonData);
  }

  // 地图 - 点数据处理
  const updatePointData = (dataArr: any) => {
    let pointData: any = []
    dataArr.forEach((point: any) => {
      let node = {
        coordinates: [point.longitude, point.latitude],
        properties: {}
      };
      // 事件
      if (point.eventId) {
        node.properties = {
          id: point.eventId,
          event: point,
          emit: 'OPEN_DIALOG:eventInfo',
          pointType: 'event',
          icon: point.eventLevel || point.eventLevelCode
        }
      }
      // 监测点
      if (point.pointId) {
        node.properties = {
          id: point.pointId,
          regionId: point.regionId,
          pointType: 'monitor-point',
          pointName: point.pointName,
          icon: 'monitor-point',
          iconSize: 0.5,
          emit: 'POPUP:equip',
        }
      }
      pointData.push(node);
    })
    $eventBus.emit('UPDATE_MAP:point', pointData);
  }

  // 重置面图层
  const resetMapPolygen = () => {
    $eventBus.emit('UPDATE_MAP:resetPolygen');
  }
  // 重置点图层
  const resetMapPoint = () => {
    $eventBus.emit('UPDATE_MAP:resetPoint');
  }
  // 重置地图图层
  const resetMapAll = () => {
    $eventBus.emit('UPDATE_MAP:resetAll');
  }

  onUnmounted(() => {
    resetMapAll();
    $eventBus.emit('SET_MAP:resetMap');
  });

  return {
    // 地图方法
    updatePolygonData,
    updatePointData,
    resetMapPolygen,
    resetMapPoint,
    resetMapAll
  }
}

export { useMap }
