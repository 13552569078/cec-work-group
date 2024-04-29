<template>
  <common-dialog
    title="事件地图"
    style="width:calc(var(--xl) * 42.04);height:calc(var(--xl) * 29.64);"
    @close="$emit('close')"
  >
    <div class="event-graph">
      <div class="graph-content">
        <relation-graph
          ref="relationGraph$"
          :options="options"
          @click="clickGraph"
          :on-node-click="clickNode"
          :on-line-click="clickLine"
        >
          <template #node="{node}">
            <div style="padding-top:20px;">节点：{{node.text}}</div>
          </template>
        </relation-graph>
      </div>
      <graph-list ref="graphListRef"  v-if="listVisible" @close="closeList"></graph-list>
    </div>
  </common-dialog>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import RelationGraph, {
  RelationGraphInstance,
  RGJsonData,
  JsonLine,
  JsonNode
} from 'relation-graph/vue3';
import { HlMessage } from 'hongluan-ui';
import GraphList from '@/views/event-center/components/graph-list.vue';
import { GlobalAPI } from '@/common';
import { apiEventGraphDataObj } from '@/apis/modules/graph-data';
import { apiManualHanleObj } from '@/apis/modules/manual-handle';

interface CodeInfo {
  dictValue: string;
  dictLabel: string;
}
const relationGraph$ = ref<RelationGraph>();
const options = {
  defaultExpandHolderPosition: 'right',
  // defaultLineShape: 4,
  debug: false,
  showDebugPanel: false,
};
const originatorSysCode = '';
let noswzxSysCodeOptions:CodeInfo[] = [];

const graphListRef = ref();
const listVisible = ref(false);
const isFullScreen = ref(false);

const getAllEventPlatform = async () => {
  const params = {
    dictType: 'event_platform'
  };
  const res = await apiManualHanleObj.getTcDictDataZiDianAll(params);
  if (res.code === 200) {
    if (res.data && res.data.length) noswzxSysCodeOptions = res.data.filter((val:CodeInfo) => val.dictValue !== '100');
    getEventGraphData();
  }
};
const getEventGraphData = async() => {
  const res = await apiEventGraphDataObj.getEventTypeConfigListData({
    originatorSysCode: '', originalValue: ''
  });
  const useDatas = res.data || [];
  const useNodesList:JsonNode[] = [];

  // 遍历出所有系统节点
  noswzxSysCodeOptions.forEach((val, idx) => {
    const servicelogoclass = val.dictValue === '301' ? 'service-logo-0' : (val.dictValue === '302' ? 'service-logo-1' : (val.dictValue === '303' ? 'service-logo-2' : 'service-logo-3'));
    useNodesList.push({
      id: val.dictValue,
      text: '',
      html: `<div class="nodewrap">
                  <div class="service-logo ${servicelogoclass} service-logo-static"></div>
                  <div class="namebox">
                    <div class="ptn">${val.dictLabel}</div>
                    <div class="act nodeactdrop">
                      <i class="el-icon-more"></i>
                      <div class="caozuo">
                        <div class="add" data-originalsyscode="${val.dictValue}">添加</div>
                        <div class="detail" data-originalsyscode="${val.dictValue}">详情</div>
                      </div>
                    </div>
                  </div>
                </div>`,
      data: {
        originalSysCode: val.dictValue
      },
      styleClass: 'tupu_node_style'
    });
  });

  // 获取所有的事件类型 线 数据
  const useAllLinesList:JsonLine[] = [];
  useDatas.forEach(e => {
    if (e.childrenList && e.childrenList.length > 0) {
      e.childrenList.forEach(j => {
        useAllLinesList.push({
          from: e.originalSysCode,
          to: j.originalSysCode,
          text: j.originalName,
          lineWidth: 4,
          color: '#00DFFF',
          data: {
            originatorSysCode: e.originalSysCode,
            receiverSysCode: j.originalSysCode
          },
          styleClass: 'tupu_line_style'
        });
      });
    }
  });
  // 去重过滤出 线
  const tempUseNodesLinesList = JSON.parse(JSON.stringify(useAllLinesList));
  const fromToList:string[] = [];
  const lastUseNodesLinesList:JsonLine[] = [];
  tempUseNodesLinesList.forEach((val:JsonLine) => {
    if (!fromToList.includes(`${val.from}-${val.to}`)) {
      fromToList.push(`${val.from}-${val.to}`);
      val.text = '0';
      lastUseNodesLinesList.push(val);
    }
  });
  // 双循环统计 节点之间 事件类型线的个数
  tempUseNodesLinesList.forEach((val1:JsonLine) => {
    lastUseNodesLinesList.forEach(val2 => {
      if (val1.from === val2.from && val1.to === val2.to) {
        if (!isNaN(Number(val2.text))) {
          const num = Number(val2.text) + 1;
          val2.text = num + '';
        }
      }
    });
  });
  // 初始化图谱
  const graphJsonData = {
    rootId: originatorSysCode || '301',
    nodes: useNodesList,
    lines: lastUseNodesLinesList
  };
  nextTick(() => {
    renderGraph(graphJsonData);
  });
};
const renderGraph = (graphJson:RGJsonData) => {
  relationGraph$.value &&
      relationGraph$.value.setJsonData(
        graphJson,
        (seeksRGGraph: RelationGraphInstance) => {
          seeksRGGraph.setOptions(
            {
              allowSwitchLineShape: false,
              allowSwitchJunctionPoint: false,
              hideNodeContentByZoom: false,
              allowShowDownloadButton: false,
              allowShowRefreshButton: true,
              allowAutoLayoutIfSupport: false,
              defaultLineWidth: 10,
              showDebugPanel: false,
              layouts: [
                {
                  label: '中心',
                  layoutName: 'center',
                  layoutClassName: 'seeks-layout-center',
                  distance_coefficient: 2,
                },
              ],
            },
            () => {
              // 设置默认缩小值
              if (graphJson.nodes.length > 3) {
                seeksRGGraph.zoom(-40);
              } else {
                seeksRGGraph.zoom(-30);
              }
            }
          );
        }
      );
};
const clickLine = async(line:JsonLine) => {
  // 全屏时候，禁用点击线弹窗
  if (isFullScreen.value) return;
  listVisible.value = true;
  const lineData = {
    originatorSysCode: line.data?.originatorSysCode,
    receiverSysCode: line.data?.receiverSysCode,
  };
  nextTick(() => {
    graphListRef.value?.getGraphList(lineData);
  });
};

const clickNode = (nodeObject: JsonNode) => {
  const curClickNodeSysCode = nodeObject.data?.originalSysCode;
  const allNodes = relationGraph$.value?.getNodes();
  const allLines = relationGraph$.value?.getLinks();
  console.log(curClickNodeSysCode, allNodes, allLines);
  const targetLightNodes = nodeObject.targetNodes.map(e => e.data).map(e => e.originalSysCode);
  allNodes.forEach((node: JsonNode) => {
    if (node.data?.originalSysCode === curClickNodeSysCode) {
      node.opacity = 1;
    } else if (targetLightNodes.includes(node.data.originalSysCode)) {
      node.opacity = 0.8;
    } else {
      node.opacity = 0.05;
    }
  });
  // if (curClickNodeSysCode === 'clear') {
  //   _all_lines.forEach(thisLine => {
  //     thisLine.relations.forEach(val => {
  //       val.styleClass = 'tupu_line_style';
  //       val.color = '#78C2FF';
  //       val.lineWidth = 2;
  //     });
  //   });

  allLines.forEach((line:JsonLine) => {
    console.log('line', line);
    line.relations.forEach(val => {
      if (+val.data.originatorSysCode === +curClickNodeSysCode) {
        val.styleClass = 'tupu_line_style c-rg-line-checked';
        val.color = '#00FF6B';
      } else if (+val.data.receiverSysCode === +curClickNodeSysCode) {
        val.styleClass = 'tupu_line_style c-rg-line-checked';
        val.color = '#FFE200';
      } else {
        val.styleClass = 'tupu_line_style';
        val.color = 'rgba(0, 223, 255, 0.05)';
      }
    });
  });
};

const clickGraph = ($event: any) => {
  const fullScreenTextAndIcon = ['全屏', '退出', 'icon-resize'];
  const refreshTextAndIcon = ['刷新', 'icon-ico_reset'];
  if (fullScreenTextAndIcon.concat(refreshTextAndIcon).includes($event.target.innerText) || fullScreenTextAndIcon.concat(refreshTextAndIcon).findIndex(e => $event.target?.outerHTML.indexOf(e) > -1 || $event.target?.innerHTML.indexOf(e) > -1) > -1) {
    if (fullScreenTextAndIcon.includes($event.target.innerText) || fullScreenTextAndIcon.findIndex(e => $event.target?.outerHTML.indexOf(e) > -1 || $event.target?.innerHTML.indexOf(e) > -1) > -1) {
      isFullScreen.value = !isFullScreen.value;
    }
    nextTick(() => {
      getEventGraphData();
    });
  }
};

const closeList = async() => {
  listVisible.value = false;
};
onMounted(async () => {
  getAllEventPlatform();
});
</script>

<style lang="scss" scoped>
.event-graph {
  width: 100%;
  height: 100%;
  .graph-content {
    width: 100%;
    height: calc(var(--xl) * 26.24);
  }
  :deep(.nodewrap) {
    padding: 10px;
    border-radius: 50%;
    // &.nodewrap-zhu {
    //   box-shadow: 0px 0px 20px #FF0000;
    // }
    // &.nodewrap-fu {
    //   box-shadow: 0px 0px 20px #e1e1e1;
    // }
    .service-logo {
      height: calc(var(--xl) * 2.4);
      width: calc(var(--xl) * 2.4);
      scale: 3.2;
      margin: 0 auto;
      background-image: url("~@/assets/images/nodeImages/12345-sprite.png");
      background-size: 100% calc(var(--xl) * 146.4);
      background-position-y: 0;
      animation: move 1s steps(1, start);
      &:hover {
        animation: movea 1s steps(1, start);
        background-position-y: calc(var(--xl) * 76.8);
      }
    }
    .service-logo-0 {
      background-image: url("~@/assets/images/nodeImages/12345-sprite.png");
    }
    .service-logo-1 {
      background-image: url("~@/assets/images/nodeImages/chengguan-sprite.png");
    }
    .service-logo-2 {
      background-image: url("~@/assets/images/nodeImages/zongzhi-sprite.png");
    }
    .service-logo-3 {
      background-image: url("~@/assets/images/nodeImages/chengguan-sprite.png");
    }
    // .service-logo-checked {
    //   animation: moveaaa 1.8s steps(1, start) infinite;
    //   background-position-y: calc(var(--xl) * 146.4);
    //   &:hover {
    //     animation: moveaaa 1.8s steps(1, start) infinite;
    //     background-position-y: calc(var(--xl) * 146.4);
    //   }
    // }
    @keyframes move {
      $n: 30;
      $x: 3.33%;
      from {
        background-position-y: calc(var(--xl) * 76.8);
      }
      @for $i from 1 to $n {
        $position: calc(($n - $i + 1) * (var(--xl) * 2.4));
        $pre: $i - 1;
        #{$pre * $x},
        #{$i * $x} {
          background-position-y: $position;
        }
      }
      to {
        background-position-y: 0;
      }
    }
    @keyframes movea {
      $n: 30;
      $x: 3.33%;
      from {
        background-position-y: calc(var(--xl) * 146.4);
      }
      // @for $i from 1 to $n {
      //   $position: calc(((var(--xl) * 146.4)) - $i * (var(--xl) * 2.4));
      //   $pre: $i - 1;
      //   #{$pre * $x},
      //   #{$i * $x} {
      //     background-position-y: $position;
      //   }
      // }
      to {
        background-position-y: calc(var(--xl) * 76.8);
      }
    }
    @keyframes moveaaa {
      $n: 61;
      $x: 1.64%;
      from {
        background-position-y: calc(var(--xl) * 146.4);
      }
      @for $i from 1 to $n {
        $position: calc(((var(--xl) * 146.4)) - $i * (var(--xl) * 2.4));
        $pre: $i - 1;
        #{$pre * $x},
        #{$i * $x} {
          background-position-y: $position;
        }
      }
      to {
        background-position-y: 0px;
      }
    }

    .namebox {
      width: calc(var(--xl) * 3.98);
      height: calc(var(--xl) * 1.09);
      margin: 0 auto;
      margin-top: calc(var(--xl) * 2.1);
      background: url("~@/assets/images/nodeImages/title-bg.png") no-repeat;
      background-size: 100% 100%;
      scale: 1.6;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .ptn {
        font-family: PingFangSC-Medium;
        font-size: calc(var(--xl) * 0.52);
        color: #ffffff;
        font-weight: bold;
      }
      .act {
        position: absolute;
        top: 11px;
        right: 55px;
        .el-icon-more {
          transform: rotate(90deg);
          font-size: calc(var(--xl) * 0.52);
          color: #ffffff;
        }
        .caozuo {
          display: none;
          position: absolute;
          top: calc(var(--xl) * 0.15);
          left: calc(var(--xl) * -0.2);
          width: calc(var(--xl) * 0.6);
          background: #ffffff;
          box-shadow: 0px 4px 8px 0px rgba(41, 48, 64, 0.2);
          padding: calc(var(--xl) * 0.05) 0;
          .add,
          .detail {
            width: 100%;
            height: calc(var(--xl) * 0.32);
            text-align: center;
            line-height: calc(var(--xl) * 0.32);
            font-family: PingFangSC-Regular;
            font-size: calc(var(--xl) * 0.52);
            color: #4b4b4b;
            cursor: pointer;
            &:hover {
              background: #f9fafe;
              color: #36a4ff;
            }
          }
        }
        &:hover {
          .caozuo {
            display: block;
          }
        }
      }
    }
  }
  :deep(.rel-map) {
    background: url("~@/assets/images/nodeImages/star-bg.png")  no-repeat !important;
    background-size: 100% 85%!important;
    background-position-y: bottom!important;
  }
  .rel-map-canvas {
    // margin-left: -125px !important;
    // margin-top: -235px !important;
  }
  :deep(.c-mini-toolbar) {
    border:1px solid #159AFF;
    box-shadow: 0 0 8px rgba(15, 24, 42, 0.4);
    position: absolute;
    width: calc(var(--xl) * 1.32);
    right: calc(var(--xl) * 1.34);
    top: 50%;
    transform: translateY(-50%);
    margin-left: 0!important;
    margin-top: 0!important;
    background-color: #042441!important;
    >div {
      background-color: #042441!important;
      color: #96BEE0!important;
      height: calc(var(--xl) * 0.6)!important;
      width: calc(var(--xl) * 1.34)!important;
      font-size: calc(var(--xl) * 0.3)!important;
      line-height: calc(var(--xl) * 0.6)!important;
      border-right: 1px solid #159AFF;
    }
    .c-mb-button {
      height: calc(var(--xl) * 1.34)!important;
      line-height: calc(var(--xl) * 1.34)!important;
      font-size: calc(var(--xl) * 0.54)!important;
      padding-top: calc(var(--xl) * 0.12);
      border-top:1px solid #159AFF;
      border-right: 1px solid #159AFF;
      background: #042441;
      color: #96BEE0;
      .rg-icon {
        width: calc(var(--xl) * 0.48);
        height: calc(var(--xl) * 0.48);
        vertical-align: calc(var(--xl) * 0.18);
      }
      .c-mb-text {
        height: calc(var(--xl) * 0.42);
        width: calc(var(--xl) * 1.26);
        font-size: calc(var(--xl) * 0.36);
        line-height: calc(var(--xl) * 0.36);
        margin-top: calc(var(--xl) * 0.72);
        margin-left: calc(var(--xl) * -0.84);
        color:#96BEE0;
      }
    }
  }
  :deep(.c-rg-line) {
    // cursor: pointer;
    stroke-dasharray: 10, 10, 10;
    stroke-dashoffset: 3px;
    stroke-linecap: butt;
  }
  :deep(.c-rg-line-checked) {
    stroke-dasharray: 10, 10, 10 !important;
  }
  :deep(.c-rg-line-text) {
    font-family: PingFangSC-Medium;
    font-size: calc(var(--xl) * 0.72);
    cursor: pointer;
    text-decoration: underline;
  }
  :deep(.rel-linediv .c-rg-line-checked) {
    animation: ACTRGLineChecked linear 10s infinite;
  }
  :deep(.whhbtn_auto, .whhbtn_reflesh, .whhbtn_download) {
    display: none;
  }
}
// .relationbox {
//   .resulttupu {
//     height: calc(100vh - 280px);
//   }
// }
// .tupuNodesTable,
// .tupuLinesTable {
//   width: calc(100% - 20px);
//   height: calc(100vh - 157px);
//   padding: 10px;
//   position: absolute;
//   top: 74px;
//   left: 10px;
//   z-index: 1000;
//   background: #ffffff;
//   .comtablebox {
//     margin-top: 10px;
//   }
//   .comtablepages {
//     margin-top: 20px;
//   }
//   // .actbtn {
//   //   color: #36a4ff;
//   //   cursor: pointer;
//   //   margin-right: 8px;
//   // }
// }
</style>
