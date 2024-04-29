<template>
<!-- <layer-switcher-nav /> -->
<hl-group class="footer-bg" full>
  <hl-group align="items-center items-middle" class="m-t-xs" gap="calc(var(--xxl) * 2)">
    <hl-group
      v-for="nav in navs" :key="nav.code"
      class="nav-item cursor-pointer"
      :class="nav.code === currentMode ? 'current' : ''"
      align="items-center items-middle"
      gap="var(--xs)"
      @click="handleClick(nav.code)">
      <img :src="nav.icon" />
      <img :src="nav.iconOn" class="on"/>
      <span class="standard-text">{{ nav.text }}</span>
    </hl-group>
  </hl-group>
</hl-group>
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
import { useGlobalState, useMapTools } from '@/hooks';
import { GlobalAPI } from '@/common';
import userAuth from '@/common/user-auth';
import iconOverview from '@/assets/images/guanghan/footer/overview.png';
import iconOverviewOn from '@/assets/images/guanghan/footer/overview_on.png';
import iconAnalysis from '@/assets/images/guanghan/footer/analysis.png';
import iconAnalysisOn from '@/assets/images/guanghan/footer/analysis_on.png';
import iconLinkage from '@/assets/images/guanghan/footer/analysis.png';
import iconLinkageOn from '@/assets/images/guanghan/footer/analysis_on.png';

const { searchVisible, currentMode, setMode, clearMode } = useGlobalState();
const { measureUtil } = useMapTools();

const emits = defineEmits(['changeNav']);

const props = defineProps({
  currentPage: {
    type: String,
    default: ''
  }
});

const navs = [
  {
    code: 'event-center',
    text: '事件总览',
    icon: iconOverview,
    iconOn: iconOverviewOn,
    handler: () => {
      emits('changeNav', 'event-center');
    }
  },
  {
    code: 'event-analysis',
    text: '监督分析',
    icon: iconAnalysis,
    iconOn: iconAnalysisOn,
    handler: () => {
      emits('changeNav', 'event-analysis');
    }
  },
  {
    code: 'go-linkage',
    text: '联动指挥',
    icon: iconLinkage,
    iconOn: iconLinkageOn,
    handler: () => {
      document.location.href = `${GlobalAPI.config.LINKAGE_URL}?token=${userAuth.getFxToken()}`;
    }
  },
];

watch(() => props.currentPage, () => {
  currentMode.value = props.currentPage;
}, {
  immediate: true
});

const callHandler = (mode: string) => {
  navs.find(item => item.code === mode)?.handler?.call(this);
};

const handleClick = (mode: string) => {
  callHandler(currentMode.value);
  if (currentMode.value !== mode) {
    setMode(mode);
    callHandler(mode);
  } else {
    clearMode();
  }
};

</script>

<style lang='scss' scoped>
  .nav-item {
    img {
      width: calc(var(--xxl) * 0.64);
      height: calc(var(--xxl) * 0.64);
      &.on {
        display: none;
      }
    }
    span {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #BDD4EB;
      line-height: 73px;
    }
    &.current {
      span {
        color: #FFF8EF;
      }
      img {
        display: none;
      }
      img.on {
        display: inline-block;
      }
    }
  }
</style>
