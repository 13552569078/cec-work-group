<template>
  <hl-panel radius="0px" class="content" style="width: 100%; --panel-header-height: 60px;" borderless
    padding="var(--xl);" header-class="bg-content" body-padding="60px"
    body-class="display-flex items-left items-top flex-col content" footer-style
    :body-style="onlyInfo ? 'padding: 0' : 'padding: var(--xl); padding-top: 0;'">
    <template #header v-if="!onlyInfo">
      <div class="panel-header-left">
        <hl-icon class="static" type="primary" size="md">
          <FillOrnamentTitle4 />
        </hl-icon>
      </div>
      <div class="panel-title">
        <h5 class="text-title w-full">{{ detailOpt.title ?? '基本信息' }}</h5>
      </div>
      <div class="panel-header-right"></div>
    </template>
    <template #default>
      <hl-row layout="grid" :count="count" gap-x="var(--md)" gap-y="var(--xl)"
        :class="['show-col', 'w-full']">
        <hl-col v-for="item in cols" :span="item.span ? 'col ' + item.span : 'col'" :key="item.key">
          <hl-group align="items-left items-top" class="w-full" dir="vertical" gap="var(--xxs)">
            <div class="text-secondary">{{ item.label }}</div>
            <div class="text-regular font-md font-bold" v-if="!item.slot" style="word-break: break-all;">
              {{ detailOpt.data[item.key] ? detailOpt.data[item.key] : '--' }}
            </div>
            <div class="text-regular font-md w-full" v-else>
              <slot :name="item.slot" :detail="detailOpt.data"></slot>
            </div>
          </hl-group>
        </hl-col>
      </hl-row>
      <!-- 相关图片 -->
      <hl-row v-if="detailOpt?.imageOpt?.show" class="m-t-lg" count="count-xl-4 count-lg-3 count-md-2"
        gap-x="var(--xxl)" gap-y="var(--xl)">
        <hl-group align="items-left items-top" class="w-full" dir="vertical" gap="var(--xxs)">
          <div class="text-secondary">{{ detailOpt?.imageOpt.title ?? '相关图片' }}</div>
          <hl-group gap="var(--md)" v-if="detailOpt?.imageOpt?.list.length > 0">
            <hl-thumb v-for="item in detailOpt?.imageOpt?.list" :key="item"
              style="width: calc(var(--lg) * 5); height: calc(var(--lg) * 5)" :src="item" fit="cover"
              :preview-src-list="detailOpt.imageOpt.list" />
          </hl-group>
        </hl-group>
      </hl-row>
      <!-- 相关图片/视频 -->
      <hl-row v-if="detailOpt?.imageVideoOpt?.show" class="m-t-lg" count="count-xl-4 count-lg-3 count-md-2"
        gap-x="var(--xxl)" gap-y="var(--xl)">
        <hl-group align="items-left items-top" class="w-full" dir="vertical" gap="var(--xxs)">
          <div class="text-secondary">{{ detailOpt?.imageVideoOpt.title ?? '相关图片/视频' }}</div>
          <hl-group gap="var(--md)" v-if="detailOpt?.imageVideoOpt?.list.length > 0">
            <hl-group v-for="item in detailOpt?.imageVideoOpt?.list" :key="item">
              <hl-thumb v-if="item.attachmentType === 'IMAGE'"
                style="width: calc(var(--lg) * 5); height: calc(var(--lg) * 5)" :src="item.url" fit="cover"
                @click.stop='handlePreview(item)' />
              <hl-group v-if="item.attachmentType === 'VIDEO'" class="thumb border" align="items-center items-middle"
                @click.stop='handlePreview(item)' style="width: calc(var(--lg) * 5); height: calc(var(--lg) * 5)">
                <hl-icon style="display: inline-block;" size="lg" type="info">
                  <FillFileVideo />
                </hl-icon>
              </hl-group>
              <hl-group v-if="item.attachmentType === 'PDF'" class="thumb border" align="items-center items-middle"
                @click.stop='handlePreview(item)' style="width: calc(var(--lg) * 5); height: calc(var(--lg) * 5)">
                <hl-icon style="display: inline-block;" size="lg" type="danger">
                  <FillFilePdf />
                </hl-icon>
              </hl-group>
            </hl-group>
          </hl-group>
        </hl-group>
      </hl-row>
      <!-- 相关附件 -->
      <hl-row v-if="detailOpt?.fileOpt?.show" class="m-t-lg" count="count-xl-4 count-lg-3 count-md-2" gap-x="var(--xxl)"
        gap-y="var(--xl)">
        <hl-group align="items-left items-top" class="w-full" dir="vertical" gap="var(--xxs)">
          <div class="text-secondary m-b-xxs">{{ detailOpt?.fileOpt.title ?? '相关附件' }}</div>
          <hl-group gap="var(--xxs)" v-if="detailOpt?.fileOpt?.list.length > 0" dir="vertical">
            <div class="text-link" v-for="item in detailOpt?.fileOpt?.list" :key="item.id" block>{{ item.name }}</div>
          </hl-group>
        </hl-group>
      </hl-row>
      <!-- slot -->
      <hl-row class="m-t-lg">
        <slot />
      </hl-row>
    </template>
  </hl-panel>

  <hl-dialog v-model="dialogVisible" title="查看" width="600px">
    <video v-if="dialogFile.attachmentType === 'VIDEO'" :src="dialogFile.url" class="item-thumb w-full"
      controls></video>
    <hl-thumb v-else :src="dialogFile.url" class="full" />
  </hl-dialog>
</template>
<script lang="ts" setup>
import { ref, PropType, nextTick, onUnmounted, computed } from 'vue';
import { Indexable } from 'fx-front-utils';

const props = defineProps({
  detailOpt: {
    type: Object as PropType<Indexable<any>>,
    default: () => {
      return {};
    },
  },
  onlyInfo: {
    type: Boolean,
    default: false,
  },
  count: {
    type: String,
    default: 'xl:count-4 md:count-3 count-md-2',
  },
});

const dialogFile = ref();
const dialogVisible = ref(false);

const handlePreview = (file: any) => {
  dialogFile.value = file;
  if (file.attachmentType === 'PDF') {
    window.open(file.url);
    return;
  }
  nextTick(() => {
    dialogVisible.value = true;
  });
};

const cols = computed(() => {
  return props.detailOpt.cols.filter((item: { show: boolean; }) => { return item.show !== false; });
});

onUnmounted(() => {
  dialogFile.value = null;
  dialogVisible.value = false;
});
</script>
