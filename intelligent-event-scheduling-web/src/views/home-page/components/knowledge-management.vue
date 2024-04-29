<template>
  <hl-panel
    class="h-full"
    style="--panel-header-height: calc(var(--xxs) * 18)"
    header-style="gap: 0px;"
    borderless
    padding="var(--xl)"
    header-class="p-y-lg p-x-xl bg-content"
    body-class="display-flex items-center items-middle flex-row gap-xl p-t-sm p-x-xl bg-content"
    body-style="padding-bottom: 32px;"
  >
    <template #header>
      <div class="panel-header-left">
        <hl-icon class="static" type="primary" size="md">
          <FillOrnamentTitle4></FillOrnamentTitle4>
        </hl-icon>
      </div>
      <div class="panel-title">
        <h6 class="text-title">知识管理</h6>
      </div>
      <div class="panel-header-right"></div>
    </template>
    <template #default>
      <hl-row class="show-col m-t-xs" gap="var(--lg)">
        <hl-col
          v-for="(k, kIndex) in eventKnowledge"
          :key="k.knowledgeTypeName + kIndex"
          span="col-12"
        >
          <hl-group
            class="p-y-md p-r-md p-l-xl bg-content border-left solid border-primary w-full box-shadow-md"
            style="--border-left-width: var(--xxs); border-radius: var(--xxs)"
            align="items-left items-middle"
            gap="var(--xl)"
            full
          >
            <hl-group align="items-left items-top" class="w-full" dir="vertical" gap="var(--xxs)">
              <span class="text-regular">{{ k.knowledgeTypeName }}</span>
              <hl-group align="items-left items-top" gap="var(--lg)">
                <span class="text-title font-xxxl font-bold">{{ k.count }}</span>
              </hl-group>
            </hl-group>
            <hl-icon type="primary" size="xxl" effect="light" fill radius>
              <FillBook v-if="k.knowledgeTypeName.includes('案例')" />
              <FillBookOpen v-else-if="k.knowledgeTypeName.includes('预案')" />
              <FillJudge v-else-if="k.knowledgeTypeName.includes('法律')" />
              <FillBook2 v-else />
            </hl-icon>
          </hl-group>
        </hl-col>
      </hl-row>
    </template>
  </hl-panel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiHomePageApiObj } from '@/apis/modules/home-page';

const eventKnowledge = ref([] as Record<string, any>);

const getStatEventKnowledge = async() => {
  const res = await apiHomePageApiObj.getStatEventKnowledge();
  eventKnowledge.value = res.data;
};
onMounted(async() => {
  await getStatEventKnowledge();
});
</script>
