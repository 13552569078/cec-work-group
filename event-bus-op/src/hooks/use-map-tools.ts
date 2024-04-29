import { ref } from 'vue';
import { GlobalAPI } from '@/common';
import * as HongtuUtil from '@hongtu-next/util';
import '@hongtu-next/util/dist/measure-util.css';
import customStyles from '@/assets/styles/mapDraw/style.js';

let { MAP_CONFIG } = GlobalAPI.config;
MAP_CONFIG = typeof MAP_CONFIG === 'string' ? JSON.parse(MAP_CONFIG) : MAP_CONFIG;

const $gisUtil: any = HongtuUtil;
const measureUtil = ref<any>();

const defaultCenter = MAP_CONFIG.center || [116.40, 39.91];
const defaultZoom = MAP_CONFIG.zoom || 16;

const mapInstance = ref<{
  easeTo: any
} | null>(null)

type FlyToOptions = {
  center: number[],
  zoom?: number,
  duration?: number
}

type BufferOptions = {
  center: number[],
  radius: number
}

const lastFlyToOptions = ref<FlyToOptions | null>(null);
const bufferOptions = ref<BufferOptions | null>(null);

function useMapTools () {
  const setMapInstance = (map: any) => {
    mapInstance.value = map;
  }
  const flyTo = (options: FlyToOptions, saveOptions: boolean = false) => {
    mapInstance.value?.easeTo(options);
    if (saveOptions) {
      lastFlyToOptions.value = options;
    }
  }

  const flyToLast = () => {
    if (lastFlyToOptions.value) {
      mapInstance.value?.easeTo(lastFlyToOptions.value);
    }
  }

  const flyToDefault = () => {
    flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
    })
  }

  const setBufferOptions = (options: BufferOptions | null) => {
    bufferOptions.value = options
  }

  const closeBuffer = () => {
    setBufferOptions(null)
  }

  const initMapUtils = (map: any) => {
    measureUtil.value = new $gisUtil.measureUtil(map.$map,  {
      styles: customStyles,
      showTooltip: true,
    });
    map.resize();
  }
  return {
    mapInstance,
    setMapInstance,
    flyTo,
    flyToLast,
    flyToDefault,
    bufferOptions,
    setBufferOptions,
    closeBuffer,
    measureUtil,
    initMapUtils
  }
}

export { useMapTools }