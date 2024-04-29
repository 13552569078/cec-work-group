import { computed, ref } from 'vue';
import { GlobalAPI } from '@/common';

const mapBuffers = ref<MapBuffer[]>([]);
function useMapBuffer() {
  const { MAP_BUFFER_DEFAULT_RADIUS = 1 } = GlobalAPI.config;

  const currentMapBuffer = computed(() => mapBuffers.value.length ? mapBuffers.value[0] : null);
  const queryParams = computed(() => {
    const ignoreBuffer = {
      distance: '', longitude: currentMapBuffer.value?.longitude, latitude: currentMapBuffer.value?.latitude
    };
    return currentMapBuffer.value?.show ?
      Object.assign({}, ignoreBuffer, { distance: currentMapBuffer.value.radius })
      : ignoreBuffer;
  });

  const updateBuffer = ({ longitude, latitude, radius, id = 'default' }: Partial<MapBuffer>) => {
    const idx = mapBuffers.value.findIndex(b => b.id === id);
    if (idx > -1) {
      Object.assign(mapBuffers.value[idx], { longitude, latitude, radius });
    }
  };

  const toggleBufferShow = (id = 'default', show?: boolean) => {
    console.log('toggleBufferShow', id, show);
    const idx = mapBuffers.value.findIndex(b => b.id === id);
    if (idx > -1) {
      mapBuffers.value[idx].show = show === undefined ? !mapBuffers.value[idx].show : show;
    }
  };

  const initBuffer = (longitude: number | string, latitude: number | string, radius = +MAP_BUFFER_DEFAULT_RADIUS) => {
    mapBuffers.value = [{ id: 'default', longitude: +longitude, latitude: +latitude, radius, show: true }];
  };

  const clearBuffers = () => {
    mapBuffers.value = [];
  };

  return {
    mapBuffers,
    currentMapBuffer,
    queryParams,
    initBuffer,
    updateBuffer,
    clearBuffers,
    toggleBufferShow,
  };
}

export type MapBuffer = {
  id: string | number;
  longitude: number;
  latitude: number;
  radius: number;
  name?: string;
  show: boolean;
}

export {
  useMapBuffer
};
