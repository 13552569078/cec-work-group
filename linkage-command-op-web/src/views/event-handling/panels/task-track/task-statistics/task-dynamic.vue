<template>
  <hl-group dir="vertical" class="w-full">
    <template v-if="activities.length">
      <hl-timeline class="w-full p-x-md p-y-md" style="--timeline-dot-color-hover: var(--primary); background-color: rgba(0, 158, 247, 0.12);">
        <hl-timeline-item
          v-for="(item, index) in activities"
          :key="item.id + index"
          hide-timestamp
          :active="index === 0"
        >
          <!--            任务反馈-->
          <hl-group v-if="+item.certTaskDynamicReplyConfigId === 100029" class="w-full" dir="vertical" gap="var(--xs)">
            <span style="color: #fff">{{ item.createdAt }}</span>
            <hl-group dir="vertical" class="p-x-sm item-content">
              <h5 v-html="getFeedbackData(item.content).title" class="p-y-sm"></h5>
              <span class="p-y-sm">反馈内容：{{ getFeedbackData(item.content).desc }}</span>
              <span class="p-y-xs" style="border-top: calc(var(--xxs) * 0.25) solid rgba(0, 158, 247, 0.10);">反馈附件：</span>
              <hl-group v-for="file in getFeedbackData(item.content).fileList" :key="file" class="p-y-sm" align="items-between items-middle" gap="var(--md)" style="height: calc(var(--xxs) * 10);">
                <hl-group align="items-middle" gap="var(--sm)">
                  <hl-icon size="xs" style="overflow: hidden" v-if="['gif', 'jpg', 'jpeg', 'png'].includes(file.name.split('.')[1])">
                    <img class="cursor-pointer" :src="getRemoteFilePath(file.url)" style="width: var(--xxl)" @click="open(file.url)" />
                  </hl-icon>
                  <hl-icon size="xs" style="overflow: hidden" v-else-if="['mp4', 'webm', 'avi', 'ogg', 'mov', 'mpeg', 'mpg', 'flv'].includes(file.name.split('.')[1]?.toLowerCase())">
                    <video :src="getRemoteFilePath(file.url)" crossorigin="anonymous" style="width: var(--xxl); cursor: pointer;" @click="open(file.url)"></video>
                  </hl-icon>
                  <hl-icon size="xs" v-else>
                    <svg width="18px" height="20px" viewBox="0 0 18 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>编组</title>
                      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="编组" fill-rule="nonzero">
                          <path d="M18,7 L18,18.9925 C18,19.5511 17.5552,20 17.0066,20 L0.9934,20 C0.44495,20 0,19.556 0,19.0082 L0,0.9918 C0,0.45531 0.44694,0 0.99826,0 L11,0 L11,6 C11,6.55228 11.4477,7 12,7 L18,7 Z M5,5 L5,7 L8,7 L8,5 L5,5 Z M5,9 L5,11 L13,11 L13,9 L5,9 Z M5,13 L5,15 L13,15 L13,13 L5,13 Z" id="形状" fill="#fff"></path>
                          <polygon id="路径" fill="#FFE8A1" points="18 5 13 5 13 0.00318"></polygon>
                        </g>
                      </g>
                    </svg>
                  </hl-icon>
                  <span class="ellipsis">{{ file.name }}</span>
                </hl-group>
                <div>
                <span
                  v-if="['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'avi', 'ogg', 'mov', 'mpeg', 'mpg', 'flv'].includes(file.name.split('.')[1])"
                  style="color: var(--primary); font-size: var(--font-md)"
                  class="m-r-lg cursor-pointer"
                  @click="open(file.url)"
                >预览</span>
                  <span
                    style="color: var(--primary); font-size: var(--font-md)"
                    class="cursor-pointer"
                    @click="downloadFile(file.id)"
                  >下载</span>
                </div>
              </hl-group>
            </hl-group>
          </hl-group>
          <!--            任务退回-->
          <hl-group v-else-if="+item.certTaskDynamicReplyConfigId === 100022" class="w-full" dir="vertical" gap="var(--xs)">
            <span style="color: #fff">{{ item.createdAt }}</span>
            <hl-group dir="vertical" class="p-x-sm item-content">
              <h5 v-html="getReturnTaskData(item.content).title" class="p-y-sm"></h5>
              <span class="p-y-sm">退回原因：{{ getReturnTaskData(item.content).reason }}</span>
            </hl-group>
          </hl-group>
          <!--        执行人完成任务-->
          <hl-group v-else-if="+item.certTaskDynamicReplyConfigId === 100009" class="w-full" dir="vertical" gap="var(--xs)">
            <span style="color: #fff">{{ item.createdAt }}</span>
            <hl-group dir="vertical" class="p-x-sm item-content">
              <h5 v-html="getCompleteExecutorData(item.content).title" class="p-y-sm"></h5>
              <span class="p-y-sm">提交说明：{{ getCompleteExecutorData(item.content).reason }}</span>
            </hl-group>
          </hl-group>
          <hl-group v-else class="w-full" dir="vertical" gap="var(--xs)">
            <span style="color: #fff">{{ item.createdAt }}</span>
            <hl-group dir="vertical" class="p-x-sm item-content">
              <h5 v-html="item.content" class="p-y-sm"></h5>
              <hl-group
                v-if="+item.attachment === 1"
                class="p-y-sm"
                style="border-top: calc(var(--xxs) * 0.25) solid rgba(0, 158, 247, 0.10);"
                align="items-between items-middle"
                gap="var(--md)"
              >
                <hl-group align="items-middle" gap="var(--sm)">
                  <hl-icon size="xs" style="overflow: hidden" v-if="['gif', 'jpg', 'jpeg', 'png'].includes(item.attachmentName.split('.')[1])">
                    <img class="cursor-pointer" :src="getRemoteFilePath(item.attachmentUrl)" style="width: var(--xxl)" @click="open(item.attachmentUrl)" />
                  </hl-icon>
                  <hl-icon size="xs" style="overflow: hidden" v-else-if="['mp4', 'webm', 'avi', 'ogg', 'mov', 'mpeg', 'mpg', 'flv'].includes(item.attachmentName.split('.')[1]?.toLowerCase())">
                    <video :src="getRemoteFilePath(item.attachmentUrl)" crossorigin="anonymous" style="width: var(--xxl); cursor: pointer;" @click="open(item.attachmentUrl)"></video>
                  </hl-icon>
                  <hl-icon size="xs" v-else>
                    <svg width="18px" height="20px" viewBox="0 0 18 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>编组</title>
                      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="编组" fill-rule="nonzero">
                          <path d="M18,7 L18,18.9925 C18,19.5511 17.5552,20 17.0066,20 L0.9934,20 C0.44495,20 0,19.556 0,19.0082 L0,0.9918 C0,0.45531 0.44694,0 0.99826,0 L11,0 L11,6 C11,6.55228 11.4477,7 12,7 L18,7 Z M5,5 L5,7 L8,7 L8,5 L5,5 Z M5,9 L5,11 L13,11 L13,9 L5,9 Z M5,13 L5,15 L13,15 L13,13 L5,13 Z" id="形状" fill="#fff"></path>
                          <polygon id="路径" fill="#FFE8A1" points="18 5 13 5 13 0.00318"></polygon>
                        </g>
                      </g>
                    </svg>
                  </hl-icon>
                  <span class="ellipsis">{{ item.attachmentName }}</span>
                </hl-group>
                <div v-if="item.attachmentUrl.length">
                <span
                  v-if="['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'avi', 'ogg', 'mov', 'mpeg', 'mpg', 'flv'].includes(item.attachmentName.split('.')[1])"
                  style="color: var(--primary); font-size: var(--font-md)"
                  class="m-r-lg cursor-pointer"
                  @click="open(item.attachmentUrl)"
                >预览</span>
                  <span
                    style="color: var(--primary); font-size: var(--font-md)"
                    class="cursor-pointer"
                    @click="downloadFile(item.fileId)"
                  >下载</span>
                </div>
              </hl-group>
            </hl-group>
          </hl-group>
        </hl-timeline-item>
      </hl-timeline>
    </template>
    <hb-empty v-else :image="NoDataImg" description="暂无数据" class="h-full" />
  </hl-group>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted, watch } from 'vue';
import { Constants } from 'fx-front-utils';
import { usePreviewer } from 'fx-front-framework';
import { getRemoteFilePath, GlobalAPI, isImage, isVideo } from '@/common';
import NoDataImg from '@/assets/images/event-handling/right-3/task-statistics/paint-empty.png';
import { apiTaskObj } from '@/apis/modules/task';
import { getFeedbackData, getReturnTaskData, getCompleteExecutorData } from '../task-utils';

import type { IpostFindTaskDynamicReplyPageSpace } from '@/apis/modules/task/model';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  activeDynamicType: {
    type: String,
    default: '',
  }
});

const { openPreviewer } = usePreviewer();

const params = ref({
  msgType: '',
  content: '',
  taskState: [],
  navKeys: [],
});
const activities = ref([] as IpostFindTaskDynamicReplyPageSpace.List[]);

const getList = async() => {
  const res = await apiTaskObj.postFindTaskDynamicReplyPage({
    ...params.value,
    taskInfoId: props.id,
    pageSize: -1,
    currentPage: 1,
    sort: 0,
    dynamicType: props.activeDynamicType,
  });
  activities.value = res.data.list;
};

const downloadFile = async(id: string) => {
  await apiTaskObj.getFileDownload(id);
};

const open = (url: string) => {
  if (isImage(url) || isVideo(url)) {
    openPreviewer({
      sourceType: isImage(url) ? 1 : 2,
      id: Math.random() * 100 + '',
      name: '',
      url: getRemoteFilePath(url)
    });
  } else {
    window.open(getRemoteFilePath(url), '_blank');
  }
};

watch(() => props.activeDynamicType, () => {
  getList();
}, {
  immediate: true
});
</script>

<style scoped lang="scss">
.item-content {
  background-color: rgba(28, 77, 133, 0.20);
  span {
    font-size: var(--font-lg);
  }
}
</style>
