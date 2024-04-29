<template>
  <hl-group dir="vertical" full="full-x" class="assemble-form p-r-md p-y-md">
    <hl-scrollbar height="calc(var(--xxs) * 153)">
      <hl-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        :label-position="['items-left', 'items-top']"
        class="p-l-lg"
      >
        <hl-form-item prop="assemblePointId" label="集结目的地">
          <hl-select
            v-model="formData.assemblePointId"
            class="display-block"
            placeholder="请选择"
            block
            @change="onAssemblePointChange"
          >
            <hl-option
              v-for="item in assemableList"
              :key="item.id"
              :label="`${item.assembleTitle}：${item.assembleAddress}`"
              :value="item.id"
            >
            </hl-option>
          </hl-select>
        </hl-form-item>

        <hl-form-item label="集结要求" prop="assembleRequire">
          <hl-input v-model="formData.assembleRequire" placeholder="请输入集结要求" :maxlength="500" block native-type="textarea" :rows="3" />
        </hl-form-item>

        <hl-form-item v-if="systemUsers.length || tempUsers.length" prop="usersOrOrg" label="出现场人员或单位">
          <div class="assemble-send-notice-item">
            <div v-if="systemUsers.length" class="system-users">
              <div class="title">系统人员</div>
              <hl-group
                class="w-full p-xs users-list radius-lg m-b-xxs"
                align="items-middle"
                gap-x="var(--md)"
                gap-y="var(--xs)"
                wrap
              >
                <hl-tag
                  v-for="u in systemUsers"
                  :key="u.userId"
                  type="primary"
                  closable
                  @close="delUser(u, false)"
                >{{ u.userName}} </hl-tag>
              </hl-group>

              <div>
                <div class="title">通知内容</div>
                <hl-input v-model="systemUsersContent" native-type="textarea" :rows="3" block show-word-limit :maxlength="500" />
              </div>

              <div class="sender-types m-t-sm">
                <hl-checkbox-group  v-model="systemUsersSendWays" dir="horizontal" gap="var(--md)">
                  <hl-checkbox v-for="item in SYSTEM_USER_SENDWAYS" :key="item.value" :label="item.value" :disabled="item.disabled">{{ item.label }}</hl-checkbox>
                </hl-checkbox-group>
              </div>
            </div>

            <div v-if="tempUsers.length" :class="[systemUsers.length ? 'temp-users m-t-lg' : '']">
              <div class="title">临时人员</div>
              <hl-group
                class="w-full p-xs users-list radius-lg m-b-xxs"
                align="items-middle"
                gap-x="var(--md)"
                gap-y="var(--xs)"
                wrap
              >
                <hl-tag
                  v-for="u in tempUsers"
                  :key="u.id"
                  type="primary"
                  closable
                  @close="delUser(u, true)"
                >{{ u.userName}} </hl-tag>
              </hl-group>
              <div>
                <div class="title">通知内容</div>
                <hl-input v-model="tempUsersContent" native-type="textarea" :rows="3" block show-word-limit :maxlength="500" />
              </div>
              <div class="sender-types m-t-sm">
                <hl-checkbox-group  v-model="tempUsersSendWays" dir="horizontal" gap="var(--md)">
                  <hl-checkbox v-for="item in TEMP_USER_SENDWAYS" :key="item.value" :label="item.value" :disabled="item.disabled">{{ item.label }}</hl-checkbox>
                </hl-checkbox-group>
              </div>
            </div>
          </div>
        </hl-form-item>

        <hl-form-item prop="deadlineDate" label="集结时限">
          <hl-group v-if="formData.fixed === 0" full="full-x" gap="var(--md)">
            <hl-select
              v-model="formData.deadlineDate"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="请选择"
            >
              <hl-option v-for="item in 9" :key="item" :label="item" :value="item" />
            </hl-select>
            <hl-select
              v-model="formData.deadlineType"
              placeholder="请选择"
            >
              <hl-option v-for="item in deadlineOptions" :key="item.code" :label="item.label" :value="item.code"></hl-option>
            </hl-select>
            <hl-button type="link" @click="formData.fixed = 1">使用指定时间</hl-button>
          </hl-group>
          <hl-group v-else full gap="var(--md)" class="w-full">
            <hl-date-picker v-model="formData.appointAt" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="选择日期时间" />
            <hl-button type="link" @click="formData.fixed = 0">使用固定时限</hl-button>
          </hl-group>
        </hl-form-item>
      </hl-form>
    </hl-scrollbar>
    <hl-group class="dialog-footer m-t-lg w-full m-b-xs" align="items-middle items-center">
      <hl-button class="p-x-md" @click="$emit('cancel')">取消</hl-button>
      <hl-button type="primary" class="p-x-md m-l-md" :loading="isLoading" @click="confirm">确定</hl-button>
    </hl-group>
  </hl-group>
</template>

<script lang="ts" setup>
import { onMounted, PropType, reactive, ref, computed, watch } from 'vue';
import { FormInstance, HlMessage } from 'hongluan-ui';
import { useCurrentEvent } from '@/hooks';
import { SYSTEM_USER_SENDWAYS, TEMP_USER_SENDWAYS } from '@/common';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import { IpostAddCommandCenterAssembleSpace, IpostFindCommandCenterAssemblePointListSpace } from '@/apis/modules/command-center/model';
import { IpostMessageSpace } from '@/apis/modules/quick-dispatcher/model';
import { apiQuickDispatcherObj } from '@/apis/modules/quick-dispatcher';

const props = defineProps({
  users: Array,
});
const emit = defineEmits(['cancel', 'delUser', 'ok']);

const { currentEvent } = useCurrentEvent();

const deadlineOptions = [
  { label: '天', code: 'day' },
  { label: '小时', code: 'hour' },
  { label: '分钟', code: 'minute' },
];
const systemUsersContent = ref();
const tempUsersContent = ref();
const systemUsers = ref<Record<string, any>[]>([]);
const tempUsers = ref<Record<string, any>[]>([]);

const systemUsersSendWays = ref(['letter']);
const tempUsersSendWays = ref(['note']);

const formRef = ref<FormInstance>();
const formData = reactive<IpostAddCommandCenterAssembleSpace.RequestParams>({
  eventInfoId: currentEvent.id as string,
  assemblePointId: '',
  assembleAddress: '',
  personIds: [],
  orgIds: [],
  assembleRequire: '', // 集结要求
  deadlineDate: '',
  deadlineType: '',
  appointAt: '',
  fixed: 0,
});
const isLoading = ref(false);
const assemableList = ref<IpostFindCommandCenterAssemblePointListSpace.Data[]>();
const assembleSendNoticeRef = ref<FormInstance>();

const rules = {
  assemblePointId: [{ required: true, message: '集结目的地不能为空' }],
  assembleRequire: [{ required: true, message: '集结要求不能为空' }],
  usersOrOrg: [
    {
      required: true,
      validator: (_: any, __: any, callback: any) => {
        if (!systemUsers.value.length && !tempUsers.value.length) {
          callback(new Error('请选择人员或单位'));
        } else {
          callback();
        }
      }
    },
  ],
  deadlineDate: [
    { required: true,
      validator: (_: any, __: any, callback: any) => {
        if ((!formData.appointAt?.length && formData.fixed === 1) || (!(`${formData.deadlineDate}`.length && formData.deadlineType?.length) && formData.fixed === 0)) {
          callback(new Error('请选择集结时限'));
        } else {
          callback();
        }
      } }
  ]
};

const onAssemblePointChange = (val: string) => {
  formData.assembleAddress = assemableList.value?.find(el => el.id === val)!.assembleAddress;
  systemUsersContent.value = `事件：【${currentEvent.name}】，请收到通知后，立即赶往集结点：【${formData.assembleAddress}】集合，并等待后续调度通知 `;
  tempUsersContent.value = systemUsersContent.value;
};
const getAssembleData = async() => {
  const res = await apiCommandCenterObj.postFindCommandCenterAssemblePointList(currentEvent.id as string);
  assemableList.value = res.data;
};

const addUsers = () => {
  systemUsers.value.splice(0, systemUsers.value.length);
  tempUsers.value.splice(0, tempUsers.value.length);
  const ids = new Set();
  props.users?.forEach((u: any) => {
    if (!ids.has(u.userId)) {
      if (u.tempUser || u.temporaryPersonnel) {
        tempUsers.value.push(u);
      } else {
        systemUsers.value.push(u);
      }
      ids.add(u.userId);
    }
  });
};
const delUser = (u: Record<string, any>, isTemp: boolean) => {
  if (isTemp) {
    tempUsers.value.splice(tempUsers.value.findIndex(user => user === u), 1);
  } else {
    systemUsers.value.splice(tempUsers.value.findIndex(user => user === u), 1);
  }
  emit('delUser', u);
};

const getNoticeContent = () => {
  let deadlineText;
  if (formData.fixed === 1) {
    deadlineText = formData.appointAt;
  } else {
    const dateTypeLabel = deadlineOptions.find(el => el.code === formData.deadlineType)?.label;
    deadlineText = `${formData.deadlineDate}${dateTypeLabel}`;
  }
  return `事件：【${currentEvent.name}】，请收到通知后，立即赶往集结点：【${formData.assembleAddress}】集合，集结要求：【${formData.assembleRequire}】，集结时限：【${deadlineText}】，并等待后续调度通知。`;
};

const sendNotice = async() => {
  const params = {
    system: {
      content: systemUsersContent.value,
      users: systemUsers.value,
      sendWays: systemUsersSendWays.value,
    },
    temp: {
      content: tempUsersContent.value,
      users: tempUsers.value,
      sendWays: tempUsersSendWays.value,
    }
  };
  const p: Array<Promise<IpostMessageSpace.Model>> = [];
  if (params.system.users.length) {
    const systemResult = apiQuickDispatcherObj.postMessage({
      eventInfoId: currentEvent.id,
      messageTitle: '创建集结指令',
      messageContent: getNoticeContent(),
      receivers: params.system.users,
      sendWays: params.system.sendWays
    });
    p.push(systemResult);
  }
  if (params.temp.users.length) {
    const tempResult = apiQuickDispatcherObj.postMessage({
      eventInfoId: currentEvent.id,
      messageTitle: '创建集结指令',
      messageContent: getNoticeContent(),
      receivers: params.temp.users,
      sendWays: params.temp.sendWays
    });
    p.push(tempResult);
  }
  const result = await Promise.all(p);

  if (result.every(r => !Number(r.code))) {
    HlMessage.success('发送通知成功');
  } else {
    HlMessage.error('发送通知失败');
  }
  emit('cancel');
};

const confirm = async() => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;
  if (!systemUsers.value.length && !tempUsers.value.length) {
    HlMessage.warning('请选择集结人员');
    return;
  }
  if ((systemUsers.value.length && !systemUsersContent.value) || (tempUsers.value.length && !tempUsersContent.value)) {
    HlMessage.warning('请填写通知内容');
    return;
  }
  isLoading.value = true;
  try {
    const params = {
      ...formData,
      orgIds: [],
      personIds: [...systemUsers.value, ...tempUsers.value].map((u: Record<string, any>) => u.userId),
    };
    await apiCommandCenterObj.postAddCommandCenterAssemble(params);
    HlMessage.success('创建集结指令成功');
    emit('ok');
    await sendNotice();
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.users, () => {
  addUsers();
}, {
  immediate: true,
  deep: true,
});

onMounted(() => {
  getAssembleData();
});
</script>
<style lang="scss" scoped>
.assemble-form {
  background: rgba(0,158,247,0.12);
  height: auto;
}
.assemble-send-notice-item {
  width: 100%;
  .title {
    display: flex;
    align-items: center;
    padding: var(--xs) 0;
  }
  .users-list {
    background: rgba(0,158,247,0.12);
    min-height: calc(var(--xxs) * 9.5);
    border: var(--border-width) solid #07578f;
    &:hover {
      border-color: var(--form-border-color);
    }
  }
  .temp-users {
    border-top: 1px solid rgba(14, 61, 108, 1);
  }
}
</style>
