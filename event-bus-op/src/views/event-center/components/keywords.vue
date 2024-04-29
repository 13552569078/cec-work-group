<template>
  <hl-group class="hot-wrap" full="full-x" dir="vertical" gap="var(--xxs)" style="height: calc(var(--xl) * 7.5)" v-show="mode === 'cloud'">
    <hot-word-cloud :charts-data="hostWrod" v-show="hostWrod.length > 0" ref="chartsRef"></hot-word-cloud>
    <hb-empty image-size="0" v-show="hostWrod.length === 0" description="暂无数据" />
  </hl-group>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { HotWordCloud } from '@/views/components/echarts';
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
const chartsRef = ref(null);

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

onMounted(() => {
  // 解决ecahrts 无法获取宽高
  nextTick(() => {
    (chartsRef.value as any).resizeChart();
  });
});
</script>
<style scoped lang="scss">
.hot-wrap {
  background-image: url('@/assets/images/echarts/hot-wrod-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
}
</style>
