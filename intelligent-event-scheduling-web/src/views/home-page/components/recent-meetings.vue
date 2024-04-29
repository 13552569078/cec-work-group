<template>
  <hl-panel
    class="h-full"
    style="--panel-header-height: calc(var(--xxs) * 15.5)"
    header-style="gap: 0px;"
    borderless
    padding="var(--xl)"
    header-class="p-y-lg p-x-xl bg-content"
    body-class="p-b-xl p-x-xl p-t-xxs bg-content"
    body-style="padding-top: 0px;"
  >
    <template #header>
      <div class="panel-header-left">
        <hl-icon class="static" type="primary" size="md">
          <FillOrnamentTitle4></FillOrnamentTitle4>
        </hl-icon>
      </div>
      <div class="panel-title">
        <h6 class="text-title">近期会议</h6>
      </div>
    </template>
    <template #default>
      <hl-group class="bg-content w-full" align="items-left" dir="vertical" gap="var(--sm)" full>
        <hl-group
          v-for="meet in meeting"
          :key="meet.title"
          class="bg-content w-full"
          style="border-radius: var(--xxs)"
          align="items-between items-top"
          gap="var(--xxs)"
        >
          <hl-group align="items-center items-top" dir="vertical">
            <span class="text-regular font-md font-bold">{{ meet.title }}</span>
            <span class="text-secondary" style="line-height: calc(var(--xxs) * 5.5)">{{
              meet.startTime
            }}</span>
          </hl-group>
          <hl-tag size="sm" effect="light" :type="meet.status === '未开始' ? 'primary' : 'danger'"
            >{{ meet.status }}
          </hl-tag>
        </hl-group>
      </hl-group>
    </template>
  </hl-panel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiHomePageApiObj } from '@/apis/modules/home-page';

const meeting = ref([] as Record<string, any>);

const getMeetingList = async() => {
  const res = await apiHomePageApiObj.getMeetingList();
  meeting.value = res.data;
};

onMounted(async() => {
  await getMeetingList();
});
</script>
