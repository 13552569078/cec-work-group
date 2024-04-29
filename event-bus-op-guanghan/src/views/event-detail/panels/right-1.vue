<template>
  <hv-panel title="事件依赖关系发现">
    <div class="w-full" style="height: calc(var(--xl) * 10.26)">
      <event-link-graph :chartsData="chartsData" @clickGraph="clickGraph" />
    </div>
    <event-link-list v-if="listVisible" :keyword="keyword" :platFormCode="platFormCode" @close="closeList"/>
  </hv-panel>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Emitter } from 'mitt';
import { apiEventAnalysisObj } from '@/apis';
import { EventLinkGraph } from '@/views/components/echarts';
import EventLinkList from '@/views/event-analysis/components/event-link-list.vue';
import { GraphChartData, GraphChartLink, GraphChartCategories } from '@/types/echarts';

const props = defineProps({
  eventId: {
    type: String,
    default: () => ''
  },
  eventTitle: {
    type: String,
    default: () => ''
  }
});

const chartsData = ref();
const list = ref();
const listVisible = ref(false);
const showBack = ref(false);
const keyword = ref('');
const greenItemColor = 'rgb(129, 196, 98)';
const orangeItemColor = 'rgb(248, 110, 65)';
const purpleItemColor = 'rgb(67, 88, 186)';

const clickGraph = data => {
  if (data.dataIndex === 0) return;
  keyword.value = data.data.name;
  listVisible.value = true;
};

const getEventKeyWords = async () => {
  const res = await apiEventAnalysisObj.postEventKeywordList(props.eventId);
  const seriesData:GraphChartData[] = [{
    id: 0,
    name: props.eventTitle,
    symbolSize: 320,
    draggable: 'true',
    value: 27,
    eventId: `${props.eventId}`,
    label: {
      position: 'inside',
      color: '#fff'
    },
    itemStyle: {
      color: greenItemColor
    }
  }];
  const links:GraphChartLink[] = []; const categories:GraphChartCategories[] = [];
  res.data.forEach((e, i) => {
    seriesData.push({
      id: i + 1,
      name: `${e}`,
      category: `${e}`,
      symbolSize: 200,
      draggable: 'true',
      value: +`${e}`,
      label: {
        position: 'inside',
        color: '#fff'
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
  chartsData.value = {
    data: seriesData,
    links,
    categories,
    repulsion: document.body.offsetHeight > 1280 ? 30000 : 2500,
  };
};

const closeList = async() => {
  listVisible.value = false;
};

onMounted(() => {
  getEventKeyWords();
});

</script>
