<template>
  <div v-if="showWarning" class="warning-card">
    <img src="@/assets/images/warning/icon.png" class="left-icon" />
    <div class="content self-grow" @click="showWarningListDlg=true">
      <span class="self-grow h4 display-flex cursor-pointer">
        <span>预警：</span>
        <vue3-marquee pause-on-hover pause-on-click :duration="20">
          <span v-for="w in currentWarningList" :key="w.id" class="m-r-md">{{ w.title }}</span>
        </vue3-marquee>
      </span>
      <span class="position-relative">
        <img src="@/assets/images/warning/list.png" class="right-icon cursor-pointer" />
        <hl-badge :value="currentWarningList.length" :hidden="!currentWarningList.length" type="danger" position="rt" round />
      </span>
    </div>
    <warning-list-dlg v-if="showWarningListDlg" @cancel="showWarningListDlg=false" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Vue3Marquee } from 'vue3-marquee';
import { useWarning } from '@/hooks';
import WarningListDlg from './warning-list-dlg.vue';

const { showWarning, currentWarningList } = useWarning();

const showWarningListDlg = ref(false);
</script>
<style lang="scss" scoped>
.warning-card {
  z-index: 1;
  display: flex;
  position: absolute;
  width: calc(var(--xxs) * 150);
  height: calc(var(--xxs) * 14.5);
  left: 50%;
  top: calc(var(--panels-top) + var(--xxs) * 12);
  transform: translateX(-50%);
  background-image: url('@/assets/images/warning/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .left-icon {
    height: 100%;
    width: calc(var(--xxs) * 14);
  }
  .content {
    padding: calc(var(--xxs) * 4) calc(var(--xxs) * 5) calc(var(--xxs) * 4) 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FFFFFF;
    .right-icon {
      width: calc(var(--xxs) * 7);
      height: calc(var(--xxs) * 7);
    }
  }
  :deep(.hl-badge.danger) {
    --badge-bg-color: var(--danger);
  }
  :deep(.vue3-marquee) {
    --min-width: auto !important;
    display: inline-flex !important;
    // width: calc(var(--xxs) * 82.5);
    flex: 1 0 0;
    margin-right: var(--px20);
  }
}
</style>
