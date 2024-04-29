<template>
  <div class="bottom-menu" :class="isCollapse ? 'menu-hide' : ''" style="z-index:1000">
    <!--    <div class="item" :class="currentScene === 'sceneRisk' ? 'is-active' : ''" @click="handleClick('sceneRisk')">
      <span class="title">风险一张图</span>
      <span class="bg"></span>
    </div>-->
    <div class="item" :class="currentScene === 'sceneCheck' ? 'is-active' : ''" @click="handleClick('video')">
      <span class="title text-inverse">现场监控</span>
      <span class="bg"></span>
    </div>
    <div class="item collapse" @click="toggleCollapse">
      <span class="title text-inverse">收起</span>
      <span class="bg"></span>
    </div>
    <div class="item right" :class="currentScene === 'sceneHidden' ? 'is-active' : ''" @click="handleClick('weather')">
      <span class="title text-inverse">天气信息</span>
      <span class="bg"></span>
    </div>
    <!--    <div class="item right" :class="currentScene === 'sceneAccident' ? 'is-active' : ''" @click="handleClick('sceneAccident')">
      <span class="title">报警一张图</span>
      <span class="bg"></span>
    </div>-->
  </div>
  <div class="btn-collapse" :class="isCollapse ? 'menu-hide' : ''" @click="toggleCollapse"></div>
</template>
<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Emitter } from 'mitt';

export default defineComponent({
  name: 'PageMenu',
  setup() {
    const $mitter = inject('$mitter') as Emitter;
    const currentScene = ref('');
    const isCollapse = ref(false);
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value;
    };
    const handleClick = (type: string) => {
      if (type === 'video') {
        $mitter.emit('OPEN_DIALOG:videoInfo', []);
      }
      if (type === 'weather') {
        $mitter.emit('OPEN_DIALOG:weather');
      }
    };
    return {
      currentScene,
      isCollapse,
      toggleCollapse,
      handleClick
    };
  }
});
</script>
<style lang="scss" scoped></style>
