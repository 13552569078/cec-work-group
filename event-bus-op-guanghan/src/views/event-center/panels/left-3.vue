<template>
  <hv-panel title="高频热词">
    <template #action>
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
        <c-tabs v-model="mode" :tabs="tabs" />
      </hl-group>
    </template>
    <hl-group class="hot-wrap" full="full-x" dir="vertical" gap="var(--xxs)" style="height: calc(var(--xl) * 7.5)" v-show="mode === 'cloud'">
      <hot-word-cloud :charts-data="hostWrod" v-if="hostWrod.length > 0"></hot-word-cloud>
      <hb-empty image-size="0" v-else description="暂无数据" />
    </hl-group>
    <stripe-list :list="list" :cols="cols" :height="'calc(var(--xl) * 7.50)'" v-show="mode === 'list'" />
  </hv-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HotWordCloud } from '@/views/components/echarts';
import { StripeList } from '@/components';
import { useGlobalState } from '@/hooks';
import { apiIndexPageObj } from '@/apis';
import { IlistSpaceHot } from '@/apis/modules/index-page/model';
import { EMPTY_STRING } from '@/common';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData(params);
  }
});

const mode = ref('cloud');

const hostWrod = ref<{ name: string; value: number }[]>([]);
const list = ref<IlistSpaceHot.Data[]>([]);

const getData = async (params: any) => {
  // 热词list
  const { data } = await apiIndexPageObj.list(params.endTime, params.startTime);
  list.value = data.map(d => ({ ...d, linkRate: d.linkRate !== EMPTY_STRING ? d.linkRate + '%' : EMPTY_STRING + '%' }));
  hostWrod.value = data.map(item => {
    return {
      name: item.keyword,
      value: item.hotDegree
    };
  });
};

getData(searchParams);

const tabs = [
  {
    label: '词云',
    value: 'cloud'
  },
  {
    label: '列表',
    value: 'list'
  }
];
const cols = [
  {
    title: '序号',
    minWidth: '2em',
    align: 'left',
    slotName: 'tableIndex',
    fixed: 'left'
  },
  { title: '关键词', prop: 'keyword' },
  { title: '热度', prop: 'hotDegree' },
  { title: '环比', prop: 'linkRate' }
];
</script>
<style scoped lang="scss">
.hot-wrap {
  background-image: url('@/assets/images/echarts/hot-wrod-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
}
</style>
