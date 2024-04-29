<template>
  <div class="total-section">
    <div class="total-count" @click="openDlg('')">
      <h4>应急预案总数</h4>
      <span class="big-num">{{ total }}</span>
    </div>
  </div>
  <div class="plans-list">
    <div
      v-for="(item, index) in items"
      :key="item.name"
      :class="['plan-item', 'p-r', `itemBackImg${index + 1}`]"
      @click="openDlg(item.prop)"
    >
      <component :is="item.background" />
      <div class="content">
        <span class="xmid-num">{{ item.count }}</span>
        <span class="plan-name">{{ item.name }}</span>
      </div>
    </div>
  </div>
  <plan-list-dlg v-if="dlgVisible" @cancel="dlgVisible=false" :typeInfo="typeInfo" />
</template>
<script lang="ts" setup>
import { markRaw, ref } from 'vue';
import { get } from 'lodash-es';
import { useCurrentArea } from '@/hooks';
import { apiEventListObj } from '@/apis/modules/event-list/index';
import PlanListDlg from './plan-list-dlg.vue';
import { Plan1Anim, Plan2Anim, Plan3Anim, Plan5Anim } from './anims';

const { areaCode } = useCurrentArea();

const items = ref([
  { name: '总体预案', count: 0, background: markRaw(Plan1Anim), prop: 'PlansForNature_1' },
  { name: '专项预案', count: 0, background: markRaw(Plan2Anim), prop: 'PlansForNature_2' },
  { name: '部门预案', count: 0, background: markRaw(Plan3Anim), prop: 'PlansForNature_3' },
  { name: '大型企业预案', count: 0, background: markRaw(Plan5Anim), prop: 'PlansForNature_5' },
]);
const total = ref(0);
const dlgVisible = ref(false);
const typeInfo = ref('');

const openDlg = (prop: string) => {
  typeInfo.value = prop;
  dlgVisible.value = true;
};

const loadData = async() => {
  const result = await apiEventListObj.getFindReservePlanStat(areaCode.value);
  items.value.forEach(item => {
    const r = result.data.find(i => i.code === item.prop)!;
    item.count = r.val;
  });
  total.value = result.data.find(i => i.code === 'PlansForNature_all')!.val;
};

useCurrentArea(loadData);
</script>
<style lang="scss" scoped>
.total-section {
  .total-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: calc(var(--xxs) * 4);
    padding-right: calc(var(--xxs) * 10.25);
    height: calc(var(--xxs) * 14);
    background-image: url('@/assets/images/overview/left-3/background.png');
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
.plans-list {
  margin-top: calc(var(--xxs) * 2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: calc(var(--xxs) * 3.75);
  row-gap: calc(var(--xxs) * 3);
  .itemBackImg1 {
    background-image: url('@/assets/images/overview/left-3/left-bg.png');
    // &:hover, &.active {
    //   background-image: url('@/assets/images/overview/left-3/card1-hover.png');
    // }
  }
  .itemBackImg2 {
    background-image: url('@/assets/images/overview/left-3/right-bg.png');
    // &:hover, &.active {
    //   background-image: url('@/assets/images/overview/left-3/card2-hover.png');
    // }
  }
  .itemBackImg3 {
    background-image: url('@/assets/images/overview/left-3/left-bg.png');
    // &:hover, &.active {
    //   background-image: url('@/assets/images/overview/left-3/card3-hover.png');
    // }
  }
  .itemBackImg4 {
    background-image: url('@/assets/images/overview/left-3/right-bg.png');
    // &:hover, &.active {
    //   background-image: url('@/assets/images/overview/left-3/card4-hover.png');
    // }
  }
  .plan-item {
    position: relative;
    height: calc(var(--xxs) * 21.5);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    cursor: pointer;
    .content {
      display: flex;
      flex-direction: column;
    }
    .plan-name {
      max-width: 7em;
      font-size: var(--font-lg);
    }
  }
  .p-r {
    padding-left:calc(var(--xxs) * 29);
  }
}
</style>
