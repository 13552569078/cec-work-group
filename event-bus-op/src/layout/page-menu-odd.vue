<template>
  <div class="bottom-menu" :class="isCollapse ? 'menu-hide' : ''">
    <div
      class="item"
      :class="$route.name === 'monitor-alarm' ? 'is-active' : ''"
      @click="handleClick('monitor-alarm')"
    >
      <span class="title">监测报警</span>
      <span class="bg"></span>
    </div>

    <div
      class="item center"
      :class="$route.name === 'warning-info' ? 'is-active' : ''"
      @click="handleClick('warning-info')"
    >
      <span class="title">预警信息</span>
      <span class="bg"></span>
    </div>
    <div
      class="item right"
      :class="$route.name === 'stat-analysis' ? 'is-active' : ''"
      @click="handleClick('stat-analysis')"
    >
      <span class="title">统计分析</span>
      <span class="bg"></span>
    </div>
  </div>
  <div class="btn-collapse" :class="isCollapse ? 'menu-hide' : ''" @click="toggleCollapse"></div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PageMenu',
  setup() {
    const router = useRouter();
    const isCollapse = ref(false);
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value;
    };
    const handleClick = (menu: string) => {
      router.push({
        name: menu
      });
    };
    return {
      isCollapse,
      toggleCollapse,
      handleClick
    };
  },
});
</script>
<style lang="scss" scoped></style>
