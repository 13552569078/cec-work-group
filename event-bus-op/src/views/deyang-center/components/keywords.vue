<template>
  <hl-group class="hot-wrap" full="full" dir="vertical">
    <hl-group full="full-x" class="hottest-wrap static m-b-xs" style="height: calc(var(--xxs) * 14.75)">
      <div class="w-50 text-center">
        <p class="ellipsis">{{ hottest.name }}</p>
        <span>最热关键词</span>
      </div>
      <div class="w-50 text-center">
        <p>{{ hottest.value }}</p>
        <span>热度</span>
      </div>
    </hl-group>
    <div class="static chart-wrap" style="height: calc(var(--xxs) * 41.5)">
      <hot-word-cloud :charts-data="hostWrod" v-show="hostWrod.length > 0" ref="chartsRef"></hot-word-cloud>
      <hb-empty image-size="0" v-show="hostWrod.length === 0" description="暂无数据" />
    </div>
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

const chartsRef = ref(null);

const hostWrod = ref<{ name: string; value: number }[]>([]);
const hottest = ref({ name: '--', value: 0 });

const getData = async (params: any) => {
  // 热词list
  const { data } = await apiIndexPageObj.situationAnalysisKeywords(params);
  const hottestObj = { name: '--', value: 0 };
  hostWrod.value = data.map(item => {
    if (item.hotDegree > hottestObj.value) {
      hottestObj.name = item.keyword;
      hottestObj.value = item.hotDegree;
    }
    return {
      name: item.keyword,
      value: item.hotDegree
    };
  });
  hottest.value = hottestObj;
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
.hottest-wrap {
  padding-left: calc(var(--xxs) * 16);
  background-image: url('@/assets/images/echarts/hottest-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  color: #DDF2FF;
  font-size: calc(var(--xxs) * 4);
  p {
    margin-bottom: calc(var(--xxs) * 1.5);
    line-height: calc(var(--xxs) * 4.5);
    font-size: calc(var(--xxs) * 4.5);
    font-family: PangMenZhengDao;
    color: #FFFFFF;
    background: linear-gradient(180deg, #FFFFFF 0%, #00E6FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.chart-wrap {
  overflow: hidden;
}
</style>
