<template>
  <common-dialog :title="title" width="calc(var(--xl) * 29.32)" @close="handleClose">
    <hl-group style="height: calc(var(--xl) * 21.48);position: relative;" full="full-x">
      <hl-button v-if="showBack" type="primary" style="position: absolute;z-index:1;" @click="backTopic">返回话题</hl-button>
      <event-link-graph :chartsData="chartsData" @clickGraph="clickGraph" />
    </hl-group>
    <event-link-list v-if="listVisible" :keyword="keyword" :platFormCode="platFormCode" @close="closeList" @closeAll="closeAll"/>
  </common-dialog>
</template>
<script lang='ts' setup>
import { ref, onBeforeUnmount } from 'vue';
import { apiEventAnalysisObj } from '@/apis';
import { EventLinkGraph } from '@/views/components/echarts';
import { throttle } from 'lodash-es';
import EventLinkList from '@/views/event-analysis/components/event-link-list.vue';
import { GraphChartData, GraphChartLink, GraphChartCategories } from '@/types/echarts';

import { useGlobalState } from '@/hooks';

const emit = defineEmits(['close']);

const props = defineProps({
  topicName: {
    type: String,
    default: ''
  },
  platFormCode: {
    type: String,
    default: ''
  },
});

const {
  searchParams, currentEventId, handleShowEventDetail
} = useGlobalState();

const title = '诉求事件关系图谱';
const chartsData = ref();
const list = ref();
const listVisible = ref(false);
const showBack = ref(false);
const keyword = ref('');
const greenItemColor = 'rgb(129, 196, 98)';
const orangeItemColor = 'rgb(248, 110, 65)';
const purpleItemColor = 'rgb(67, 88, 186)';

let throttleFlag = false;
let clickTimer:any;

const clickGraph = data => {
  if (throttleFlag) return;
  if (showBack.value) {
    if (data?.dataIndex === 0) {
      currentEventId.value = data.data.eventId;
      handleShowEventDetail(data.data.eventId);
    } else {
      if (data?.data?.eventId) return;
      keyword.value = data.data?.name;
      listVisible.value = true;
    }
  } else {
    if (data?.dataIndex === 0) return;
    getEventKeyWords({ name: data?.data?.name, value: data?.data?.value, eventId: data?.data?.eventId });
  }
  throttleFlag = true;
  clickTimer = setTimeout(() => {
    throttleFlag = false;
  }, 1200);
};

const backTopic = async() => {
  getTopicEvent();
};
const closeList = async() => {
  listVisible.value = false;
};

const closeAll = async() => {
  listVisible.value = false;
  emit('close');
};

const getTopicEvent = async () => {
  const params = {
    startTime: searchParams.startTime,
    endTime: searchParams.endTime,
    topicName: props.topicName,
    platFormCode: props.platFormCode
  };
  const res = await apiEventAnalysisObj.postTopicEventList(params);
  const seriesData:GraphChartData[] = [{
    id: 0,
    name: props.topicName,
    symbolSize: 320,
    draggable: 'true',
    value: 27,
    label: {
      position: 'inside',
      color: '#fff'
    },
    itemStyle: {
      color: purpleItemColor
    }
  }];
  const links:GraphChartLink[] = []; const categories:GraphChartCategories[] = [];
  if (res.data?.length) {
    res.data.forEach((e, i) => {
      seriesData.push({
        id: i + 1,
        name: `${e.eventTitle}`,
        category: `${e.eventTitle}`,
        symbolSize: 200,
        draggable: 'true',
        value: `${e.eventCode}`,
        eventId: `${e.id}`,
        label: {
          position: 'inside',
          formatter: '{c}\n{b}',
          color: '#fff'
        },
        itemStyle: {
          color: greenItemColor
        }
      });
      links.push({
        source: 0,
        target: i + 1,
      });
      categories.push({
        name: `${e.eventTitle}`,
      });
    });
  }
  chartsData.value = {
    data: seriesData,
    links,
    categories,
    repulsion: document.body.offsetHeight > 1280 ? 70000 : 5000,
  };
  showBack.value = false;
};
getTopicEvent();

const getEventKeyWords = async (data: {name: string, value: string, eventId: string }) => {
  const res = await apiEventAnalysisObj.postEventKeywordList(data.eventId);
  const seriesData:GraphChartData[] = [{
    id: 0,
    name: data.name,
    symbolSize: 320,
    draggable: 'true',
    value: `${data.value}`,
    eventId: `${data.eventId}`,
    label: {
      position: 'inside',
      color: '#fff',
      formatter: '{c}\n{b}',
    },
    itemStyle: {
      color: greenItemColor
    }
  }];
  const links:GraphChartLink[] = []; const categories:GraphChartCategories[] = [];
  if (res.data?.length) {
    res.data.forEach((e, i) => {
      seriesData.push({
        name: `${e}`,
        id: i + 1,
        category: `${e}`,
        symbolSize: 200,
        draggable: 'true',
        value: +`${e}`,
        label: {
          position: 'inside',
          color: '#fff',
        },
        itemStyle: {
          color: orangeItemColor
        }
      });
      links.push({
        source: 0,
        target: i + 1,
      });
      categories.push({
        name: `${e}`,
      });
    });
  }
  chartsData.value = {
    data: seriesData,
    links,
    categories,
    repulsion: document.body.offsetHeight > 1280 ? 70000 : 5000,
  };
  showBack.value = true;
};
const handleClose = () => {
  emit('close');
};

onBeforeUnmount(() => {
  if (clickTimer) {
    clearTimeout(clickTimer);
  }
});
</script>
