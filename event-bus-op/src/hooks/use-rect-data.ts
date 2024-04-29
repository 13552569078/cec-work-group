import { ref, reactive, computed } from 'vue';
import { apiRectDataObj as api} from '@/apis';
import { IgetRectDataSpace, IgetRectManagerDataSpace } from '@/apis/modules/rect-data/model';
import { RECT_TYPE } from '@/common';
import { EmptyUtils } from 'fx-front-utils';
import { default as convex } from '@turf/convex';
import { default as turfPoint } from 'turf-point';
import { default as featureCollection } from 'turf-featurecollection';

const currentBigRectParams = reactive({
  wglx: '', // 网格类型
  wgbm: '', // 网格编码
  wgmc: '', // 网格名称
  sszjd: '', // 街道
})

const currentMidRectParams = reactive({
  wglx: '', // 网格类型
  wgbm: '', // 网格编码
  wgmc: '', // 网格名称
  sszjd: '', // 街道
})

const nextRectParams = reactive({
  wglx: '', // 网格类型
  wgbm: '', // 网格编
  wgmc: '' // 网格名称
})

const currentHoverRect = reactive({
  bigWgbm: '',
  midWgbm: ''
})

const rectManagerData = ref(); 

const bigRectData = ref<IgetRectDataSpace.RectData[]>([]);
const midRectData = ref<IgetRectDataSpace.RectData[]>([]);

function useRectData () {

  const rectBigColor = {
    normal: {
      fillColor: 'rgba(0, 30, 52, 0)',
      outlineColor: '#ffc97a'
    },
    hover: {
      fillColor: 'rgba(21, 154, 255, 0.4)',
      outlineColor: '#71c2ff'
    }
  }

  const rectMidColor = {
    normal: {
      fillColor: 'rgba(21, 154, 255, 0.4)',
      outlineColor: '#71c2ff'
    },
    hover: {
      fillColor: 'rgba(225, 134, 0, 0.4)',
      outlineColor: '#ffc97a'
    }
  }

  const outline = ref();
  const bigHoverData = ref();
  const bigRectOutlineData = ref();
  const midHoverData = ref();
  const midRectOutlineData = ref();

  const updateHoverData = (data: IgetRectDataSpace.RectData, type: string) => {
    if (type === 'big') {
      if (currentHoverRect.bigWgbm) {
        bigHoverData.value?.splice(1, 1, getOutline([data])[0])
      } else {
        bigHoverData.value = getOutline([data])
      }
    } else {
      if (currentHoverRect.midWgbm) {
        midHoverData.value?.splice(1, 1, getOutline([data])[0])
      } else {
        midHoverData.value = getOutline([data])
      }
    }
  }

  const rectDataWrapper = (data: IgetRectDataSpace.RectData[], currentWgbm?: string) => {
    return data.map((rect: IgetRectDataSpace.RectData) => {
      let fillColor = '';
      let outlineColor = '';
      if (rect.wglx === RECT_TYPE.BIG ) {
        if (currentWgbm === rect.wgbm || currentBigRectParams.wgbm === rect.wgbm) {
          fillColor = rectBigColor.hover.fillColor;
          outlineColor = rectBigColor.hover.outlineColor;
          updateHoverData(rect, 'big')
        } else {
          fillColor = rectBigColor.normal.fillColor;
          outlineColor = rectBigColor.normal.outlineColor;
        }
      }
      if (rect.wglx === RECT_TYPE.MID ) {
        if (currentWgbm === rect.wgbm || currentMidRectParams.wgbm === rect.wgbm) {
          fillColor = rectMidColor.hover.fillColor;
          outlineColor = rectMidColor.hover.outlineColor;
          updateHoverData(rect, 'mid')
        } else {
          fillColor = rectMidColor.normal.fillColor;
          outlineColor = rectMidColor.normal.outlineColor;
        }
      }
      return {
        coordinates: JSON.parse(rect.bjdw),
        properties: {
          wgbm: rect.wgbm,
          wgmc: rect.wgmc,
          wglx: rect.wglx,
          sszjd: rect.sszjd,
          fillColor,
          outlineColor
        }
      }
    }) 
  }

  const getRectOutline =  (data: IgetRectDataSpace.RectData[]) => {
    const points = data.reduce((acc: string[], current: IgetRectDataSpace.RectData) => acc = acc.concat(JSON.parse(current.bjdw)), []);
    const turfPoints = featureCollection(points.map(point => turfPoint(point)))
    const turfOutline = convex(turfPoints)
    turfOutline!.properties = {
      ...rectBigColor.normal
    }
    return [{
      coordinates: turfOutline?.geometry.coordinates[0]
    }]
  }

  const getOutline = (data: IgetRectDataSpace.RectData[]) => {
    return data.map(rect => ({
      coordinates: JSON.parse(rect.bjdw)
    }))
  }

  const mapBigRectData = computed(() => {
    return rectDataWrapper(bigRectData.value, currentHoverRect.bigWgbm)
  })

  const mapMidRectData = computed(() => {
    return rectDataWrapper(midRectData.value, currentHoverRect.midWgbm)
  })

  const rectManagerList = computed(() => {
    return rectManagerData.value ? EmptyUtils.formatData(rectManagerData.value.list) : []
  })

  // 获取网格员信息
  const getRectManagerData = async (pageNum: number) => {
    const res = await api.getRectManagerData({
      pageNum,
      ...(currentMidRectParams.wglx ? currentMidRectParams : currentBigRectParams),
      pageSize: 10
    });
    rectManagerData.value = res.data;
    return res.data;
  }

  // 获取网格信息
  const getRectData = async () => {
    const res = await api.getRectData({
      ...nextRectParams
    })
    if (bigRectData.value.length === 0) {
      bigRectData.value = res.data;
      bigRectOutlineData.value = getOutline(res.data)
      // outline.value = getRectOutline(res.data)
    } else {
      midRectData.value = res.data;
      midRectOutlineData.value = getOutline(res.data)
    }
  }

  const clearMidRectData = () => {
    midRectData.value = []
  }

  const setCurrentBigRectParams = (params: IgetRectDataSpace.RequestParams) => {
    currentBigRectParams.wgbm = params.wgbm as string;
    currentBigRectParams.wglx = params.wglx as string;
    currentBigRectParams.wgmc = params.wgmc as string;
    currentBigRectParams.sszjd = params.sszjd as string;
  }

  const setCurrentMidRectParams = (params: IgetRectDataSpace.RequestParams) => {
    currentMidRectParams.wgbm = params.wgbm as string;
    currentMidRectParams.wglx = params.wglx as string;
    currentMidRectParams.wgmc = params.wgmc as string;
    currentMidRectParams.sszjd = params.sszjd as string;
  }

  const clearCurrentBigRectParams = () => {
    currentBigRectParams.wgbm = '';
    currentBigRectParams.wglx = '';
    currentBigRectParams.wgmc = '';
    currentBigRectParams.sszjd = '';
  }

  const clearCurrentMidRectParams = () => {
    currentMidRectParams.wgbm = '';
    currentMidRectParams.wglx = '';
    currentMidRectParams.wgmc = '';
    currentMidRectParams.sszjd = '';
  }

  const setNextRectParams = (params: IgetRectDataSpace.RequestParams) => {
    nextRectParams.wgbm = params.wgbm as string;
    nextRectParams.wglx = params.wglx as string;
    nextRectParams.wgmc = params.wgmc as string;
  }

  const resetRectMap = () => {
    clearMidRectData();
    clearCurrentBigRectParams();
    clearCurrentMidRectParams();
  }

  const handleRectHover = (rect: any) => {
    if (rect.properties.wglx === RECT_TYPE.BIG) {
      currentHoverRect.bigWgbm = rect.properties.wgbm
    } else {
      currentHoverRect.midWgbm = rect.properties.wgbm
    }
  }

  const handleClearHover = (type: string) => {
    currentHoverRect.bigWgbm = '';
    currentHoverRect.midWgbm = '';
    if (type === 'big') {
      bigHoverData.value = [];
    } else {
      midHoverData.value = [];
    }
    
  }

  return {
    mapBigRectData,
    mapMidRectData,
    getRectData,
    rectManagerData,
    rectManagerList,
    currentBigRectParams,
    currentMidRectParams,
    getRectManagerData,
    setCurrentBigRectParams,
    setCurrentMidRectParams,
    clearCurrentMidRectParams,
    clearCurrentBigRectParams,
    setNextRectParams,
    resetRectMap,
    currentHoverRect,
    handleRectHover,
    handleClearHover,
    outline,
    bigRectOutlineData,
    bigHoverData,
    midHoverData,
    midRectOutlineData
  }
}

export { useRectData };