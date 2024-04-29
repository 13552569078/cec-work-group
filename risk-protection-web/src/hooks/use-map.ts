import { computed, nextTick, markRaw, ref, onBeforeUnmount } from 'vue';
import type { Indexable } from 'fx-front-utils';

const MAP_POPUPS = ref<PopupType[]>([]); // 图层弹窗
const MAP_LAYERS = {
  point: ref<SymbolLayer[]>([]), // 点图层
};
const DEFAULT_LAYER_OPTION: MapLayerOptions = {
  layerType: 'point' // 默认点图层
};
const useMap = () => {
  const pointLayers = computed(() => MAP_LAYERS.point.value);
  /**
   * 显示弹窗
   * @param popup 弹窗对象
   * @param alongside 【暂时不起作用】是否同时显示多个弹窗，默认false。
   */
  const showPopup = (popup: PopupType, alongside = false) => {
    popup.component = markRaw(popup.component);
    const idx = MAP_POPUPS.value.findIndex(m => m.id === popup.id);
    if (!alongside) { // 如果只允许显示一个弹窗，先隐藏所有弹窗
      MAP_POPUPS.value.forEach(p => {
        p.show = false;
      });
    }
    if (idx > -1) { // 如果已经添加了弹窗，那么只需修改弹窗属性
      Object.assign(MAP_POPUPS.value[idx], popup);
    } else {
      MAP_POPUPS.value.push(popup);
    }
  };
  const hidePopup = (popup: PopupType | string | number) => {
    const id = typeof popup === 'object' ? popup.id : popup;
    const idx = MAP_POPUPS.value.findIndex(m => m.id === id);
    if (idx > -1) {
      MAP_POPUPS.value[idx].show = false;
    }
  };
  const hidePopups = (popups: Array<PopupType | string | number>) => {
    popups.forEach(p => hidePopup(p));
  };
  const hideAllPopups = () => {
    MAP_POPUPS.value.forEach(p => {
      p.show = false;
    });
  };
  const getPopup = (popup: PopupType | string | number) => {
    const id = typeof popup === 'object' ? popup.id : popup;
    const idx = MAP_POPUPS.value.findIndex(m => m.id === id);
    return idx > -1 ? MAP_POPUPS.value[idx] : null;
  };
  const removePopup = (popup: PopupType | string | number) => {
    const id = typeof popup === 'object' ? popup.id : popup;
    const idx = MAP_POPUPS.value.findIndex(m => m.id === id);
    if (idx > -1) {
      MAP_POPUPS.value.splice(idx, 1);
    }
  };
  const removePopups = (popups: Array<PopupType | string | number>) => {
    popups.forEach(p => removePopup(p));
  };
  const removeAllPopups = () => {
    MAP_POPUPS.value = [];
  };
  /**
   * 添加新图层
   * @param layer 图层信息
   * @param options 图层默认参数
   */
  const addLayer = (layer: LayerType, options: MapLayerOptions = DEFAULT_LAYER_OPTION) => {
    if (!layer.id) { // 生成默认id
      layer.id = Math.random().toString(36).substr(2, 10);
    }
    const idx = MAP_LAYERS[options.layerType].value.findIndex(l => l.id === layer.id);
    if (idx === -1) { // 没有图层时添加
      MAP_LAYERS[options.layerType].value.push(layer);
    }
    console.log('======> MAP_LAYERS', MAP_LAYERS);
  };
  const removeLayer = (layer: LayerType, options: MapLayerOptions = DEFAULT_LAYER_OPTION) => {
    console.log('removeLayer');
    const idx = MAP_LAYERS[options.layerType].value.findIndex(l => l.id === layer.id);
    if (idx !== -1) {
      MAP_LAYERS[options.layerType].value.splice(idx, 1);
    }
  };
  const removeAllLayer = () => {
    MAP_LAYERS.point.value = [];
  };
  const getLayer = (id: string, options: MapLayerOptions = DEFAULT_LAYER_OPTION) => {
    const idx = MAP_LAYERS[options.layerType].value.findIndex(l => l.id === id);
    return idx > -1 ? MAP_LAYERS[options.layerType].value[idx] : null;
  };

  onBeforeUnmount(() => {
    hideAllPopups();
    removeAllLayer();
    removeAllPopups();
  });

  return {
    // 图层
    pointLayers,
    addLayer,
    removeLayer,
    getLayer,
    // 弹窗
    popups: MAP_POPUPS,
    showPopup,
    hidePopup,
    hidePopups,
    hideAllPopups,
    getPopup,
    removePopup,
    removePopups,
    removeAllPopups,
  };
};
export type PopupType = {
  id: string | number
  coordinates: [number, number]
  show: boolean
  component: any
} & Indexable<any>
export type LayerType = SymbolLayer;
export interface SymbolLayer {
  id: string,
  name?: string;
  zIndex?: number,
  opacity?: number,
  visible: boolean,
  data: Array<{
    lnglat: [number | string, number | string],
    [key: string]: any
  }>,
  zooms?: [number, number],
  alwaysRender?: boolean
  cursor?: string,
  styles?: Array<Record<string, unknown>> | Record<string, unknown>
}
export interface MapLayerOptions {
  layerType: keyof typeof MAP_LAYERS
}
export { useMap };
