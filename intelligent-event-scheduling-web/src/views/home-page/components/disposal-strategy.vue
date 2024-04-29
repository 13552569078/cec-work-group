<template>
  <hl-panel
    class="h-full"
    style="--panel-header-height: calc(var(--xxs) * 18)"
    header-style="gap: 0px;"
    borderless
    padding="var(--xl)"
    header-class="p-y-lg p-x-xl bg-content"
    body-class="p-b-xl p-x-xl bg-content"
    body-style="padding-top: 0px;"
  >
    <template #header>
      <div class="panel-header-left">
        <hl-icon class="static" type="primary" size="md">
          <FillOrnamentTitle4></FillOrnamentTitle4>
        </hl-icon>
      </div>
      <div class="panel-title">
        <h6 class="text-title">辅助决策</h6>
      </div>
      <div class="panel-header-right"></div>
    </template>
    <hl-group class="w-full h-full" dir="vertical" gap="var(--sm)">
      <hl-group class="p-md bg-primary-light-5 w-full" align="items-middle" gap="var(--md)" full>
        <hl-icon size="sm" fill class="radius-lg" type="primary">
          <FillBookOpen></FillBookOpen>
        </hl-icon>
        <hl-group align="items-left items-middle" class="w-full" full>
          <div class="text-regular font-bold">处置措施</div>
          <div class="text-regular font-xxl font-bold static">
            {{
              eventStrategy.length &&
              eventStrategy.filter((el: any) => el.typeName === "处置措施").length
                ? eventStrategy.filter((el: any) => el.typeName === "处置措施")[0].count
                : 0
            }}
          </div>
        </hl-group>
      </hl-group>
      <hl-group class="p-md bg-success-light-5 w-full" align="items-middle" gap="var(--md)" full>
        <hl-icon size="sm" fill class="radius-lg" type="success">
          <FillAssemblyArea></FillAssemblyArea>
        </hl-icon>
        <hl-group align="items-left items-middle" class="w-full" full>
          <div class="text-regular font-bold">指挥体系</div>
          <div class="text-regular font-xxl font-bold static">
            {{ eventCommand?.count }}
          </div>
        </hl-group>
      </hl-group>
      <hl-group class="p-md bg-warning-light-5 w-full" align="items-middle" gap="var(--md)" full>
        <hl-icon size="sm" fill class="radius-lg" type="warning">
          <FillNews></FillNews>
        </hl-icon>
        <hl-group align="items-left items-middle" class="w-full" full>
          <div class="text-regular font-bold">响应策略</div>
          <div class="text-regular font-xxl font-bold static">
            {{
              eventStrategy.length &&
              eventStrategy.filter((el: any) => el.typeName === "响应策略").length
                ? eventStrategy.filter((el: any) => el.typeName === "响应策略")[0].count
                : 0
            }}
          </div>
        </hl-group>
      </hl-group>
    </hl-group>
  </hl-panel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiHomePageApiObj } from '@/apis/modules/home-page';

const eventCommand = ref({} as Record<string, any>);
const eventStrategy = ref([] as Record<string, any>);

const getStatEventCommand = async() => {
  const res = await apiHomePageApiObj.getStatEventCommand();
  eventCommand.value = res.data;
};
const getStatEventStrategy = async() => {
  const res = await apiHomePageApiObj.getStatEventStrategy();
  eventStrategy.value = res.data;
};
onMounted(async() => {
  await getStatEventStrategy();
  await getStatEventCommand();
});
</script>
