<template>
  <div :class="['analyse-container', dialogVisible ? 'full' : '']" ref="containerRef">
    <!-- <div class="full-screen" @click="fullScreen"></div> -->
    <div id="container"></div>
    <div class="no-data" v-show="!data2 || (data2 && data2.nodes.length === 0)">
      <Empty type="2" />
    </div>
  </div>
</template>
<script setup lang="ts">
import G6 from '@antv/g6'
import { default as isEmpty } from 'lodash/isEmpty'
import { default as cloneDeep } from 'lodash/cloneDeep'
// import request from '/@/utils/http/axios/interceptors'
import insertCss from 'insert-css'

// tooltips样式
insertCss(`
  .g6-component-tooltip {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`)

//初始化接口
const Fn = ref()
const initFn = (val) => {
  Fn.value = val
}

// 放大全屏
// const dialogVisible = ref(false)
// const fullScreen = () => {
//   dialogVisible.value = !dialogVisible.value
//   nextTick(() => {
//     resizeFn()
//   })
// }
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  list: {
    type: Array,
    default: () => []
  },
  collapse: {
    type: Boolean,
    default: false
  }
})

const timer = ref()
// 初始化G6
let graph
const oldEdg = ref()
const oldNode = ref()
const containerRef = ref()
const initG6 = () => {
  const width = containerRef.value.scrollWidth
  const height = containerRef.value.scrollHeight || 500
  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    fixToNode: [1, 0],
    itemTypes: ['node'], // 允许出现 tooltip 的 item 类型
    getContent(e) {
      const outDiv = document.createElement('div')
      // outDiv.style.width = '428px'
      outDiv.innerHTML = `<div class="g6-detail-info">
          <div class="g6-detail-container">
            <div class="g6-indexContent">
        ${e.item.getModel().info.indexContent || ''}`

      return outDiv
    },
    itemTypes: ['node']
  })

  graph = new G6.Graph({
    container: 'container',
    width,
    height,
    fitView: true,
    fitViewPadding: 10,
    maxZoom: 1,
    zoom: 1,
    plugins: [tooltip], // 配置 Tooltip 插件
    modes: {
      // default: ['drag-canvas', 'drag-node', 'zoom-canvas']
    },
    layout: {
      preventOverlap: true,
      type: 'dagre',
      nodesep: 8,
      ranksep: 50,
      rankdir: 'LR',
      align: 'DL'
    },
    defaultNode: {
      size: 16,
      color: '#36A4FF',
      style: {
        lineWidth: 2,
        fill: 'rgba(54,164,255,0.20)'
      }
    },
    defaultEdge: {
      shape: 'cubic-horizontal',
      size: 1,
      color: '#699BC9'
    }
  })

  // 点击时选中，再点击时取消

  // graph.on('node:dblclick', (ev) => {
  //   // 选中
  //   const node = ev.item
  //   oldNode.value = node
  //   console.log(node)
  //   if (timer.value) clearTimeout(timer.value)
  //   const model = ev.item.get('model')
  //   if (!model.hasClicked) {
  //     request
  //       .post(Fn.value, { eventCode: model.info.eventCode, modelCode: props.data.modelCode })
  //       .then((res) => {
  //         if (res.data) {
  //           let newData = handleData(res.data?.relevantEvents || res.data || [], model.id, false)
  //           // 处理数据
  //           const ids = data2.value.nodes.map((i) => i.id)
  //           const nodes = newData.nodes.filter((e) => ids.indexOf(e.id) === -1)
  //           data2.value.nodes = data2.value.nodes.concat(nodes)
  //           newData.edges.forEach((e) => {
  //             let index = data2.value.edges.findIndex(
  //               (k) =>
  //                 k.source + '-' + k.target === e.source + '-' + e.target ||
  //                 k.source + '-' + k.target === e.target + '-' + e.source
  //             )
  //             if (index === -1) {
  //               data2.value.edges.push(e)
  //             } else if (e.index == 0) {
  //               data2.value.edges.slice(index, 1)
  //               data2.value.edges.push(e)
  //             }
  //           })
  //           if (!isEmpty(data2.value)) {
  //             renderG6(false)
  //             model.hasClicked = true
  //           }
  //         }
  //       })
  //   }
  // })

  if (typeof window !== 'undefined')
    window.onresize = () => {
      resizeFn()
    }
}
onMounted(() => {
  if (graph) {
    graph.destroy()
  }
  if (timer.value) clearTimeout(timer.value)
  if (props.data?.indexId) {
    initData()
  }
})
onBeforeUnmount(() => {
  if (graph) {
    graph.destroy()
  }
  if (timer.value) clearTimeout(timer.value)
})

const resizeFn = () => {
  if (!graph || graph.get('destroyed')) return
  if (!containerRef.value || !containerRef.value.scrollWidth || !containerRef.value.scrollHeight)
    return
  graph.changeSize(containerRef.value.scrollWidth, containerRef.value.scrollHeight)
  graph.fitView()
}

const data2 = ref()
// 获取并处理关系数据，渲染画布
const initData = () => {
  if (!graph) initG6()
  data2.value = handleData(props.list, String(props.data.indexId), true)
  if (!isEmpty(data2.value)) {
    renderG6(true)
  }
}
// 处理数据
const handleData = (list, selectId, first) => {
  const data = list || []

  let obj = {}
  obj.nodes = [
    {
      hasClicked: false,
      id: String(props.data.indexId),
      label: props.data.indexContent
        ? props.data.indexContent.length > 10
          ? props.data.indexContent.slice(0, 10) + '...'
          : props.data.indexContent
        : '指标' + props.data.indexId,
      level: 1,
      info: props.data
    }
  ]
  data.forEach((e) => {
    obj.nodes.push({
      hasClicked: false,
      id: String(e.indexId),
      label: e.indexContent
        ? e.indexContent.length > 10
          ? e.indexContent.slice(0, 10) + '...'
          : e.indexContent
        : '指标' + e.indexId,
      level: first ? 2 : 3,
      info: e
    })
  })

  obj.edges = []
  data.forEach((i, index) => {
    obj.edges.push({
      source: selectId,
      target: String(i.indexId),
      value: i.prob,
      index: index
    })
  })

  return obj
}

// 渲染画像
const renderG6 = (isReset = true) => {
  // 清除画布元素
  graph.clear()
  // 清除边点击展示的数据
  if (isReset) {
    oldEdg.value = undefined
    oldNode.value = undefined
  }

  const nodes = data2.value.nodes
  // randomize the node size
  nodes.forEach((node) => {
    if (node.level === 1) {
      node.type = 'rect'
      node.style = {
        width: 140,
        height: 30,
        fill: 'l(109) 0:#78C2FF 1:#36A4FF',
        lineWidth: 0,
        // shadowOffsetX: 10,
        // shadowOffsetY: 10,
        // shadowColor: 'rgba(54,164,255,0.40)',
        // shadowBlur: 36,
        radius: 2
      }
      node.labelCfg = {
        style: {
          fill: '#ffffff'
        }
      }
    } else if (node.level === 2) {
      node.type = 'rect'
      node.style = {
        width: 140,
        height: 30,
        fill: '#06124F',
        lineWidth: 1,
        stroke: '#044F7C',
        radius: 2
      }
      node.labelCfg = {
        style: {
          fill: '#ffffff'
        }
      }
    } else {
      node.size = 16
      node.labelCfg = {
        position: node.children && node.children.length > 0 ? 'left' : 'right',
        style: {
          fontSize: 14
        }
      }
    }
  })

  graph.edge(function (edge) {
    edge.labelCfg = {
      position: 'center', // 其实默认就是 center，这里写出来便于理解
      autoRotate: true,
      style: {
        fontSize: 12,
        fill: '#B8C2CC'
      }
    }
    if (edge.index == 0) {
      edge.color = '#699BC9'
      edge.labelCfg.style.fill = 'rgba(255,102,102,1)'
    }
    return {
      type: 'cubic-horizontal',
      label: edge.value
    }
  })
  graph.data(cloneDeep(data2.value))

  // 渲染画布
  graph.render()
  graph.fitView()
}

// 监听数据变化
watch(
  () => props.data,
  (nVal) => {
    data2.value = null
    if (graph) {
      graph.clear()
    }
    if (timer.value) clearTimeout(timer.value)
    if (nVal?.indexId) initData()
  },
  {
    deep: true
  }
)

watch(
  () => props.list,
  (nVal) => {
    data2.value = null
    if (graph) {
      graph.clear()
    }
    if (timer.value) clearTimeout(timer.value)
    if (nVal) initData()
  },
  {
    deep: true
  }
)

watch(
  () => props.collapse,
  () => {
    setTimeout(() => {
      resizeFn()
    }, 1000)
  }
)

defineExpose({ initFn })
</script>

<style lang="scss" scoped>
.analyse-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  // .full-screen {
  //   z-index: 99;
  //   position: absolute;
  //   right: 20px;
  //   top: 20px;
  //   width: 32px;
  //   height: 32px;
  //   background: url('/@/assets/icons/full-screen.svg') no-repeat;
  //   background-size: 100% 100%;
  //   cursor: pointer;
  // }
  #container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .no-data {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.full {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  background-color: #ffffff;
}
</style>
<style lang="scss">
.g6-detail-container {
  display: flex;
}
.g6-detail-info {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #4b4b4b;
  line-height: 16px;
  font-weight: 400;

  .g6-indexContent {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #202020;
    font-weight: 500;
    margin-bottom: 6px;
  }
  .g6-topic {
    margin-left: 12px;
    padding: 0 6px;
    height: 16px;
    line-height: 16px;
    background-image: linear-gradient(101deg, #78c2ff 0%, #36a4ff 100%);
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
    font-weight: 400;
  }
  .g6-scroll-container {
    margin-top: 8px;
    max-height: 200px;
    overflow-y: auto;
    .g6-text {
      margin-bottom: 8px;
    }
  }
}
</style>
