<template>
  <hl-group class="task-details" full dir="vertical" gap="var(--md)">
    <div class="item-card">
      <hl-group full-x align="items-middle items-left">
        <hb-text-overflow
          method="length"
          :length="30"
          effect="dark"
          style="color: #ffffff; font-size: var(--font-lg); font-weight: var(--font-weight-bold)"
        >{{ detailsData.taskTitle }}</hb-text-overflow>
        <hl-tag
          v-if="urgencyDegreeMap.get(detailsData.urgencyDegree)"
          class="static"
          size="sm"
          style="margin-left: var(--xs)"
          :type="urgencyDegreeMap.get(detailsData.urgencyDegree)?.type"
        >{{ urgencyDegreeMap.get(detailsData.urgencyDegree)?.name }}</hl-tag>
      </hl-group>

      <hl-group wrap>
        <hl-tag v-for="tag in detailsData.taskLabel" :key="tag" class="task-tag">{{ tag.label }}</hl-tag>
      </hl-group>

      <hl-group class="w-full m-t-md p-t-md created" gap="var(--xl)">
        <hl-group align="items-middle">
          <span class="label">创建时间</span>
          <span class="value">{{ detailsData.createdAt }}</span>
        </hl-group>

        <hl-group align="items-middle">
          <span class="label">创建人</span>
          <span class="value">{{ detailsData.createdUserName || '--' }}</span>
        </hl-group>
      </hl-group>

      <div class="w-full p-x-md p-y-sm m-t-xs" style="background-color: rgba(0, 158, 247, 0.10)">{{ detailsData.taskDesc }}</div>
    </div>

    <div class="item-card">
      <span class="title">执行人</span>
      <hl-group gap="var(--xs)" class="m-t-md" wrap>
        <hl-group
          v-for="item in detailsData.taskUserInfoDetail"
          :key="item.id"
          gap="var(--xs)"
          align="items-middle"
          class="p-x-sm p-y-xxs cursor-pointer"
          style="background-color: rgba(0, 158, 247, 0.12)"
          @click="currentCallingUser = item"
        >
          <hl-popover placement="top" trigger="hover" :content="userStateIcons[item.taskState].text">
            <template #reference>
              <span class="user-name">
                <img
                 class="icon"
                 style="width: var(--sm); height: var(--sm); margin-right: var(--xxs)"
                 :src="userStateIcons[item.taskState].url"
                >
                {{ item.userName }}
                <img
                  v-if="item.mobile"
                  class="icon"
                  style="width: var(--sm); height: var(--sm); margin-left: var(--xxs)"
                  :src="mobileIcon"
                >
                </span>
            </template>
          </hl-popover>
        </hl-group>
      </hl-group>
    </div>

    <template v-if="detailsData.endAt && detailsData.endAt.length">
      <div class="item-card">
        <span class="title">截止时间</span>
        <hl-group
          align="items-middle"
          gap="var(--xs)"
          class="p-x-sm p-y-xs m-t-md"
          style="background-color: rgba(0, 158, 247, 0.12);"
        >
          <span class="text-regular">{{ `${detailsData.endAt} 截止` }}</span>
        </hl-group>
      </div>
    </template>

    <div class="item-card">
      <span class="title">任务提醒</span>
      <hl-group gap="var(--xs)" wrap>
        <hl-group
          v-for="item in detailsData.taskRemind"
          :key="item.reminderTime"
          gap="var(--xs)"
          align="items-middle"
          class="p-x-sm p-y-xs m-t-md"
          style="background-color: rgba(0, 158, 247, 0.12);"
        >{{ item.reminderTime }}</hl-group>
      </hl-group>
    </div>

    <hl-group class="item-card">
      <span class="title">重复任务</span>
      <hl-group wrap gap="var(--xs)">
        <hl-group
          align="items-middle"
          gap="var(--xs)"
          class="p-x-sm p-y-xs m-t-md"
          style="background-color: rgba(0, 158, 247, 0.12);"
        >
          <span class="text-regular">
            {{
              +detailsData?.isRepeat === 0
                ? "不重复"
                : getRepeatTaskTips({
                  repeatNum: detailsData?.repeatNum,
                  repeatSeondary: detailsData?.repeatSeondary,
                  repeatType: detailsData?.repeatType,
                  isRepeatTaskCustom: detailsData?.isRepeatTaskCustom,
                })
            }}
          </span>
        </hl-group>
      </hl-group>
    </hl-group>

    <div class="item-card">
      <span class="title">相关附件</span>
      <hl-group gap="var(--xs)" dir="vertical" class="m-t-md">
        <hl-group
          v-for="item in detailsData.taskAttachmentDetailDTOS"
          :key="item.reminderTime"
          gap="var(--sm)"
          full-x
          align="items-middle items-between"
          style="height: calc(var(--xxs) * 10);"
        >
          <hl-group class="w-60" align="items-middle" gap="var(--sm)">
            <hl-icon size="xs" style="overflow: hidden" v-if="['gif', 'jpg', 'jpeg', 'png'].includes(item.taskAttachmentName.split('.')[1])">
              <img class="cursor-pointer" :src="getRemoteFilePath(item.taskAttachmentUrl)" style="width: var(--xxl)" @click="clickDetail(item.taskAttachmentUrl)" />
            </hl-icon>
            <hl-icon size="xs" style="overflow: hidden" v-else-if="['mp4', 'webm', 'avi', 'ogg', 'mov', 'mpeg', 'mpg', 'flv'].includes(item.taskAttachmentName.split('.')[1]?.toLowerCase())">
              <video :src="getRemoteFilePath(item.taskAttachmentUrl)" crossorigin="anonymous" style="width: var(--xxl); cursor: pointer;" @click="clickDetail(item.taskAttachmentUrl)"></video>
            </hl-icon>
            <hl-icon size="xs" v-else>
              <svg width="18px" height="20px" viewBox="0 0 18 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>编组</title>
                <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="编组" fill-rule="nonzero">
                    <path d="M18,7 L18,18.9925 C18,19.5511 17.5552,20 17.0066,20 L0.9934,20 C0.44495,20 0,19.556 0,19.0082 L0,0.9918 C0,0.45531 0.44694,0 0.99826,0 L11,0 L11,6 C11,6.55228 11.4477,7 12,7 L18,7 Z M5,5 L5,7 L8,7 L8,5 L5,5 Z M5,9 L5,11 L13,11 L13,9 L5,9 Z M5,13 L5,15 L13,15 L13,13 L5,13 Z" id="形状" fill="#FFCA28"></path>
                    <polygon id="路径" fill="#FFE8A1" points="18 5 13 5 13 0.00318"></polygon>
                  </g>
                </g>
              </svg>
            </hl-icon>
            <span class="ellipsis" style="font-size: var(--font-lg)" :title="item.taskFileName">{{ item.taskFileName }}</span>
          </hl-group>

          <hl-group align="items-middle">
            <span>{{ item.createdAt }}</span>
            <hl-group gap="var(--md)" align="items-middle items-right"  class="m-l-md" style="width: calc(var(--xxs) * 20);">
              <span
                v-if="['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'avi', 'ogg', 'mov', 'mpeg', 'mpg', 'flv'].includes(item.taskAttachmentName.split('.')[1])"
                class="cursor-pointer"
                style="color: #71F8FC; font-size: var(--font-md)"
                @click="clickDetail(item.taskAttachmentUrl)"
              >
                预览
              </span>
              <span
                v-if="item.fileId !== ''"
                class="cursor-pointer"
                style="color: #71F8FC; font-size: var(--font-md)"
                @click="downloadFile(item.fileId)"
              >
                下载
              </span>
            </hl-group>
          </hl-group>
        </hl-group>
      </hl-group>
    </div>

    <template v-if="detailsData.parentTaskName">
      <div class="item-card">
        <span class="title">父任务</span>
        <hl-row gap-x="var(--md)">
          <hl-col span="md:col-12" @click="showAssociatedTaskDetails(detailsData.parentId)">
            <div
              class="bg-light p-x-sm cursor-pointer ellipsis"
              style="line-height: calc(var(--xxs) * 9)"
            >{{ detailsData.parentTaskName }}</div>
          </hl-col>
        </hl-row>
      </div>
    </template>

    <template v-if="detailsData.subTaskDTOS?.length">
      <div class="item-card">
        <span class="title">子任务</span>
        <hl-row gap-x="var(--md)" gap-y="var(--xs)">
          <hl-col span="md:col-12" v-for="item in detailsData.subTaskDTOS" :key="item.id">
            <div
              style="line-height: calc(var(--xxs) * 9)"
              class="bg-light p-x-sm cursor-pointer ellipsis"
              @click.prevent="showAssociatedTaskDetails(`${item.id}`)"
            >{{ item.taskTitle }}({{ item.taskState }})</div>
          </hl-col>
        </hl-row>
      </div>
    </template>

    <div class="item-card">
      <span class="title">关联事件</span>
      <hl-row gap-y="var(--xs)">
        <hl-col span="md:col-12">
          <div
            style="line-height: calc(var(--xxs) * 9); background-color: rgba(0, 158, 247, 0.12);"
            class="p-x-sm ellipsis m-t-md"
          >{{ detailsData.correlatedEvents && detailsData.correlatedEvents.eventName }}</div>
        </hl-col>
      </hl-row>
    </div>
  </hl-group>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { Constants } from 'fx-front-utils';
import { usePreviewer } from 'fx-front-framework';
import { useCalling, useIcons } from '@/hooks';
import { useTask } from '@/views/event-handling/panels/task-track/add-task-dlg/use-task';
import { getRemoteFilePath, GlobalAPI, isImage, isVideo, REMINDERDICT } from '@/common';
import { apiTaskObj } from '@/apis/modules/task';
import type { IpostFindTaskInfoByIdSpace } from '@/apis/modules/task/model';

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['updateDetailsId']);

const { getRepeatTaskTips } = useTask();
const { openPreviewer } = usePreviewer();
const { userStateIcons, mobileIcon } = useIcons();
const { currentCallingUser } = useCalling();

const urgencyDegreeMap = new Map([
  [0, { name: '非常紧急', type: 'danger' }],
  [1, { name: '紧急', type: 'orange' }],
  [2, { name: '普通', type: 'success' }],
  [3, { name: '较低', type: 'blue' }],
  [4, { name: '其他', type: 'blue' }],
]);
const isCreator = ref(false);
const detailsData = ref({} as IpostFindTaskInfoByIdSpace.Data);

const getList = async(id: string) => {
  const res = await apiTaskObj.postFindTaskInfoById(id);
  detailsData.value = res.data;
  isCreator.value = +res.data.creator === 1;// 创建人
};
const reminderName = (type: string[]) => {
  return type
    .map(el => {
      return REMINDERDICT.find(i => i.value === el)?.label;
    })
    .join('+');
};
const downloadFile = async(id: string) => {
  await apiTaskObj.getFileDownload(id);
};
const showAssociatedTaskDetails = async(id: string) => {
  // 分权限 查看关联任务详情
  const res = await apiTaskObj.postRefTask(id);
  const isRefTask = res.data;
  +isRefTask === 1 || isCreator.value
    ? emit('updateDetailsId', id) :
    HlMessage.warning({
      message: '您不是这个任务的执行人，暂时无法查看任务详情!',
    });// 即不是子任务或父任务的执行人，也不是任务的创建者
};

const clickDetail = (url:string) => {
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

watchEffect(() => {
  getList(props.id);
});

defineExpose({
  isCreator,
  detailsData
});
</script>
<style lang="scss" scoped>
.task-details {
  .item-card {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 158, 247, 0.10);
    padding: var(--lg);
    .task-tag {
      margin-top: var(--xs);
      margin-right: var(--xs);
      background-color: rgba(0, 158, 247, 0.12);
    }
    .created {
      border-top: calc(var(--xxs) * 0.25) solid rgba(0, 158, 247, 0.10);
      font-size: var(--font-lg);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .hl-group.horizontal {
        &:last-child {
          margin-left: var(--lg);
        }
        .label {
          color: #B5CEE3;
        }
        .value {
          margin-left: var(--lg);
          color: #FFFFFF;
        }
      }
    }
    .title {
      font-size: var(--font-lg);
      font-family: PingFangSC-Semibold, PingFang SC;
    }
  }
}

.user-name {
  display: flex;
  align-items: center;
  .task-state-icon {
    margin-right: var(--xs);
  }
}
</style>
