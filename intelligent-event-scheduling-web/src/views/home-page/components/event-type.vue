<template>
  <!-- 进度条 -->
  <hl-panel
    class="w-full content h-full"
    style="--panel-header-height: calc(var(--xxs) * 18)"
    header-class="gap-xs content"
    borderless
    padding="var(--xl)"
    body-class="content"
    body-style="padding-top: 0px;"
  >
    <template #header>
      <hl-group style="height: calc(var(--xxs) * 18)" align="items-middle">
        <div class="panel-header-left">
          <hl-icon class="static" type="primary" size="md">
            <FillOrnamentTitle4></FillOrnamentTitle4>
          </hl-icon>
        </div>
        <div class="panel-title">
          <h6 class="title">高发事件类型TOP5</h6>
        </div>
      </hl-group>
      <!-- <div class="panel-header-right">
                    <hl-tabs class="static" type="button">
                      <hl-tab-pane label="事件类型"></hl-tab-pane>
                      <hl-tab-pane label="事件区域"></hl-tab-pane>
                    </hl-tabs>
                  </div> -->
    </template>
    <template #default>
      <hl-list hover>
        <hl-list-item v-for="(item, index) in eventTopList" :key="index">
          <template #prefix>
            <img
              v-if="+index === 0"
              src="../../../assets/images/home-page/icon-top01.png"
              style="width: calc(var(--xl))"
            />
            <img
              v-else-if="+index === 1"
              src="../../../assets/images/home-page/icon-top02.png"
              style="width: calc(var(--xl))"
            />
            <img
              v-else-if="+index === 2"
              src="../../../assets/images/home-page/icon-top03.png"
              style="width: calc(var(--xl))"
            />
            <div
              v-else
              align="items-left items-top"
              style="width: calc(var(--xl)); text-align: center"
            >
              <span class="text-light text-justify font-sm">{{ index + 1 }}</span>
            </div>
          </template>
          <template #suffix>
            <span class="text-regular">{{ item.count }}</span>
          </template>
          <hl-group class="w-full" gap="var(--xs)" align="items-middle">
            <div class="text-regular static font-h6" style="width: calc(var(--xxs) * 30)">
              <hb-text-overflow method="length" :length="8" effect="light">
                {{ item.eventTypeName }}
              </hb-text-overflow>
            </div>
            <hl-progress
              class="w-full"
              :type="+index === 0 ? 'error' : +index === 1 ? 'warning' : ''"
              :percentage="+item.ratio * 100"
              track-color="#F6F9FB"
              round
              :show-text="false"
              stroke-width="8px"
            />
          </hl-group>
        </hl-list-item>
      </hl-list>
    </template>
  </hl-panel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { apiHomePageApiObj } from '@/apis/modules/home-page';

const eventTopList = ref([] as Record<string, any>);

const getStatEventTopByType = async() => {
  const res = await apiHomePageApiObj.getStatEventTopByType();
  eventTopList.value = res.data;
};

onMounted(async() => {
  await getStatEventTopByType();
});
</script>
