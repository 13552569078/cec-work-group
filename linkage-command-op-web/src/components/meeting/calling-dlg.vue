<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 90)"
    height="calc(var(--xxs) * 112)"
    top="20%"
    borderless
    custom-class="calling-dlg"
    :show-close="false"
    :close-on-press-escape="true"
    :close-on-click-modal="false"
    :append-to-body="true"
    title="语音通话"
    @close="$emit('cancel')"
  >
    <div class="wrapper">
      <div class="user-name">{{ user.userName.substr(-2, 2) }}</div>
      <div class="mobile"><h2>{{ user.mobile }}</h2></div>
      <div class="tip font-lg">{{ duration }}</div>
      <img src="@/assets/images/common/hangout.svg" class="hangout" @click="hangup();$emit('cancel')"/>
      <div class="hangout-txt font-lg">挂断</div>
      <audio ref="audioDomRef" id="voiceTag" autoplay class="display-none"></audio>
    </div>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useCalling } from '@/hooks';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['cancel']);

const { audioDomRef, duration, startCalling, hangup } = useCalling({
  cancelCb: () => {
    emit('cancel');
  }
});

onMounted(() => {
  console.log('mobile:', props.user.mobile);
  startCalling(props.user.mobile);
});
</script>
<style lang="scss">
.calling-dlg {
  --panel-header-height: 0;
  --panel-body-padding: 0;
  .panel-header {
    background-image: url(@/assets/images/common/calling-dlg-header-bg.png) !important;
    background-size: 100% 100% !important;
  }
  .panel-body {
    height: 100%;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: calc(var(--xxs) * 10);
    padding-bottom: calc(var(--xxs) * 10);
    .user-name {
      border-radius: 50% 50%;
      width: calc(var(--xxs) * 25);
      height: calc(var(--xxs) * 25);
      background: linear-gradient(180deg, #EEF6FF 0%, #D9EAFF 100%);
      font-size: calc(var(--font-lg) * 2);
      color: #36A4FF;
      line-height: 1.40625;
      margin-bottom: calc(var(--xxs) * 3);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile {
      color: #202020;
      margin-bottom: var(--xxs);
    }
    .tip {
      color: #8A8A8A;
      margin-bottom: calc(var(--xxs) * 12.5);
    }
    .hangout {
      width: calc(var(--xxs) * 14);
      height: calc(var(--xxs) * 14);
      margin-bottom: var(--xxs);
      cursor: pointer;
    }
    .hangout-txt {
      color: #8A8A8A;
    }
  }
}
.calling-dlg.dark {
  background: rgba(189,199,255,0.12);
  backdrop-filter: blur(10px);
  .wrapper {
    .calling-txt, .tip, .hangout-txt {
      color: #B5CEE3;
    }
    .user-name {
      background: linear-gradient(180deg, rgba(224,229,255,0.32) 0%, rgba(189,199,255,0.32) 100%);
    }
    .user-name, .mobile h2 {
      color: #FFFFFF;
    }
  }
}
</style>
