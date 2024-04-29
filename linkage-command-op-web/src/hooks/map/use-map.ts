import { onMounted, ref } from 'vue';
import { GlobalAPI, resolveMap } from '@/common';
import { XMap } from '@hongtu-next/core';

const center = ref<number[]>([]);
const zoom = ref<number>();
const mapType = ref('dark');
let mapboxInst: any;
function useMap() {
  const { center: defaultCenter, zoom: defaultZoom, maxzoom = 20 } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;

  const setCenter = (c: number[]) => {
    console.log('..///mapCenter', c);
    center.value = c;
  };
  const setZoom = (z: number) => {
    zoom.value = z;
  };
  // 放大
  const zoomIn = () => {
    zoom.value!++;
  };
  // 缩小
  const zoomOut = () => {
    zoom.value!--;
  };
  const resetCenterZoom = () => {
    center.value = [...defaultCenter];
    zoom.value = defaultZoom;
  };
  const changeTheme = (type: 'dark' | 'light' | 'image') => {
    mapType.value = type;
  };

  const getView = () => {
    return {
      center: { lng: center.value[0], lat: center.value[1] },
      zoom: zoom.value,
      bearing: mapboxInst.getBearing(),
      pitch: mapboxInst.getPitch(),
    };
  };

  const setView = (option: ReturnType<typeof getView>) => {
    center.value = option.center ? [option.center.lng, option.center.lat] : center.value;
    zoom.value = option.zoom || zoom.value;
    mapboxInst.easeTo({
      bearing: option.bearing || mapboxInst.getBearing(),
      pitch: option.pitch || mapboxInst.getPitch(),
    });
  };

  const downloadMap = (name: string) => {
    const img = mapboxInst.getCanvas().toDataURL('image/png');
    const link = document.createElement('a');
    link.href = img;
    link.download = name + '.png';
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    link.dispatchEvent(clickEvent);
  };

  const mapCreated = (map: XMap) => {
    mapboxInst = map.$map;
    resolveMap();
  };

  const getMapboxInst = () => mapboxInst;

  onMounted(() => {
    if (!center.value.length) { // 初始化赋值一次
      resetCenterZoom();
    }
  });

  return {
    center,
    zoom,
    maxzoom,
    mapType,
    setCenter,
    setZoom,
    zoomIn,
    zoomOut,
    resetCenterZoom,
    changeTheme,
    getView,
    setView,
    downloadMap,
    getMapboxInst,
    mapCreated,
  };
}

export {
  useMap
};
