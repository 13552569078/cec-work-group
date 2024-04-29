import { computed, reactive, ref } from 'vue';
import { EVENT_FINISHED, EVENT_HANDLING, GlobalAPI } from '@/common';

const MAP_LAYERS = reactive<Record<string, LayerType>>({});
const MAP_MARKERS = reactive<Record<string, MarkerType[]>>({});
const imageIcons = ref<any[]>([]);
const waitingRefreshLayerMarkers = ref<string[]>([]);
const clickMapMarkerInfo = ref({} as MapMarkerInfo);
function useMapLayer() {
  const tempResourceItemMarkerKey = 'tempResourceItemMarker';

  const handlingEventsLayer = computed(() => MAP_LAYERS[EVENT_HANDLING]);
  const finishedEventsLayer = computed(() => MAP_LAYERS[EVENT_FINISHED]);
  const resourceLayers = computed(() =>
    Object.keys(MAP_LAYERS)
      .filter(k => ![EVENT_HANDLING, EVENT_FINISHED].includes(k))
      .map(k => MAP_LAYERS[k])
  );

  const tempResourceItemMarker = computed(() => MAP_MARKERS[tempResourceItemMarkerKey]);

  const getAllLayerKeys = () => Object.keys(MAP_LAYERS);
  const updateLayer = (key: string, layer: LayerType) => {
    MAP_LAYERS[key] = layer;
  };
  const removeLayer = (key: string) => {
    delete MAP_LAYERS[key];
  };
  const removeLayers = (keys: string[]) => {
    keys.forEach(removeLayer);
  };

  const updateMarker = (key: string, markers: MarkerType[]) => {
    MAP_MARKERS[key] = markers;
  };
  const removeMarker = (key: string) => {
    delete MAP_MARKERS[key];
  };

  const addIcon = (name: string, url: string, size?: number[]) => {
    const hasExisted = getIcon(name);
    if (!hasExisted) {
      imageIcons.value.push({
        name,
        type: 'link:svg',
        url,
        size,
      });
    }
  };
  const getIcon = (name: string) => {
    return imageIcons.value.find(i => i.name === name);
  };

  const clearLayers = () => {
    Object.keys(MAP_LAYERS).forEach(k => {
      delete MAP_LAYERS[k];
    });
  };
  const clearClickMapMarkerInfo = () => {
    Object.assign(clickMapMarkerInfo.value, { show: false, lnglat: [], address: '' });
  };
  const clearMarkers = () => {
    Object.keys(MAP_MARKERS).forEach(k => {
      delete MAP_MARKERS[k];
    });
    clearClickMapMarkerInfo();
  };
  const clearAll = () => {
    clearLayers();
    clearMarkers();
    imageIcons.value = [];
    waitingRefreshLayerMarkers.value = [];
  };

  return {
    clickMapMarkerInfo,
    tempResourceItemMarkerKey,
    waitingRefreshLayerMarkers,
    imageIcons,
    handlingEventsLayer,
    finishedEventsLayer,
    resourceLayers,
    tempResourceItemMarker,
    getAllLayerKeys,
    updateLayer,
    removeLayer,
    removeLayers,
    updateMarker,
    removeMarker,
    addIcon,
    getIcon,
    clearLayers,
    clearMarkers,
    clearClickMapMarkerInfo,
    clearAll,
  };
}

export type LayerType = {
  [key: string]: any;
  data: Array<{
    coordinates: number[];
    properties: Record<string, any>;
  }>
}
export type MarkerType = {
  [key: string]: any;
  coordinates: number[]
  iconUrl: string;
  iconSize: number[];
}
export interface MapMarkerInfo {
  show: boolean;
  address: string;
  lnglat: number[];
}
export {
  useMapLayer
};
