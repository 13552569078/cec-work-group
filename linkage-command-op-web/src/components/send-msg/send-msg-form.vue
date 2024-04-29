<template>
  <hl-scrollbar class="send-msg-form">
    <hl-form ref="formRef" :model="formData" :rules="rules">
      <template v-if="showAllUserTypes ? true : formData.systemUsers.length">
        <hl-form-item class="is-required asterisk-left" label="系统人员" prop="systemUsers">
          <div class="tag-wrapper w-full">
            <hl-tag v-for="u in formData.systemUsers" :key="u.userId" size="sm" closable @close="delUser(u, 'systemUsers')">{{ u.userName }} </hl-tag>
          </div>
        </hl-form-item>
        <hl-form-item class="is-required asterisk-left" label="通知内容" prop="systemUsersContent">
          <hl-input v-model="formData.systemUsersContent" class="m-t-sm" native-type="textarea" :rows="4" block show-word-limit :maxlength="600" />
        </hl-form-item>
        <hl-form-item label="" prop="systemUsersSendWays">
          <hl-checkbox-group  v-model="formData.systemUsersSendWays" dir="horizontal" gap="var(--md)">
            <hl-checkbox v-for="item in SYSTEM_USER_SENDWAYS" :key="item.value" :label="item.value" :disabled="item.disabled">{{ item.label }}</hl-checkbox>
          </hl-checkbox-group>
        </hl-form-item>
        <img :src="separatorImg" class="separator" />
      </template>
      <template v-if="showAllUserTypes ? true : formData.tempUsers.length">
        <hl-form-item class="is-required asterisk-left" label="临时人员" prop="tempUsers">
          <div class="tag-wrapper w-full">
            <hl-tag v-for="u in formData.tempUsers" :key="u.userId" size="sm" closable @close="delUser(u, 'tempUsers')">{{ u.userName }} </hl-tag>
          </div>
        </hl-form-item>
        <hl-form-item class="is-required asterisk-left" label="通知内容" prop="tempUsersContent">
          <hl-input v-model="formData.tempUsersContent" class="m-t-sm" native-type="textarea" :rows="4" block show-word-limit :maxlength="600" />
        </hl-form-item>
        <hl-form-item label="" prop="tempUsersSendWays">
          <hl-checkbox-group  v-model="formData.tempUsersSendWays" dir="horizontal" gap="var(--md)">
            <hl-checkbox v-for="item in TEMP_USER_SENDWAYS" :key="item.value" :label="item.value" :disabled="item.disabled">{{ item.label }}</hl-checkbox>
          </hl-checkbox-group>
        </hl-form-item>
      </template>
    </hl-form>
    <span class="dialog-footer">
      <hl-button v-if="showCancelButton" class="normal-width m-r-md" @click="$emit('cancel')">取消</hl-button>
      <hl-button type="primary" class="normal-width hover-style" :loading="isLoading" @click="send">发送</hl-button>
    </span>
  </hl-scrollbar>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { FormInstance, HlMessage, HlMessageBox } from 'hongluan-ui';
import { useCurrentEvent } from '@/hooks';
import { SYSTEM_USER_SENDWAYS, TEMP_USER_SENDWAYS } from '@/common';
import { apiQuickDispatcherObj } from '@/apis/modules/quick-dispatcher';
import separatorImg from '@/assets/images/event-handling/left-2/separator.png';
import { IpostMessageSpace } from '@/apis/modules/quick-dispatcher/model';

const props = defineProps({
  content: String,
  messageTitle: {
    type: String,
    default: '通知'
  },
  users: Array,
  showCancelButton: Boolean,
  showAllUserTypes: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits(['ok', 'cancel', 'delUser']);

const { currentEvent } = useCurrentEvent();

const orgDlgRef = ref();
const isLoading = ref(false);
const formRef = ref<FormInstance>();
const formData = reactive({
  systemUsersSendWays: ['letter'],
  tempUsersSendWays: ['note'],
  systemUsersContent: props.content,
  tempUsersContent: props.content,
  systemUsers: [] as Record<string, any>[],
  tempUsers: [] as Record<string, any>[],
});
const rules = {
  systemUsersContent: [{ validator: contentValidator('systemUsersContent') }],
  tempUsersContent: [{ validator: contentValidator('tempUsersContent') }],
  systemUsers: [{ validator: usersValidator }],
  tempUsers: [{ validator: usersValidator }]
};

const addUsers = () => {
  formData.systemUsers.splice(0, formData.systemUsers.length);
  formData.tempUsers.splice(0, formData.tempUsers.length);
  const ids = new Set();
  props.users?.forEach((u: any) => {
    if (!ids.has(u.userId)) {
      if (u.tempUser || u.temporaryPersonnel) {
        formData.tempUsers.push(u);
      } else {
        formData.systemUsers.push(u);
      }
      ids.add(u.userId);
    }
  });
};
const delUser = (u: Record<string, any>, type: 'tempUsers' | 'systemUsers') => {
  formData[type].splice(formData[type].findIndex(user => user === u), 1);
  emit('delUser', u);
};

const send = () => {
  formRef.value?.validate(isValid => {
    if (isValid) {
      beginSend();
    }
  });
};

const beginSend = async() => {
  const p: Array<Promise<IpostMessageSpace.Model>> = [];
  if (formData.systemUsers.length) {
    const systemResult = apiQuickDispatcherObj.postMessage({
      eventInfoId: currentEvent.id,
      messageTitle: props.messageTitle,
      messageContent: formData.systemUsersContent,
      receivers: formData.systemUsers,
      sendWays: formData.systemUsersSendWays
    });
    p.push(systemResult);
  }
  if (formData.tempUsers.length) {
    const tempResult = apiQuickDispatcherObj.postMessage({
      eventInfoId: currentEvent.id,
      messageTitle: props.messageTitle,
      messageContent: formData.tempUsersContent,
      receivers: formData.tempUsers,
      sendWays: formData.tempUsersSendWays
    });
    p.push(tempResult);
  }
  isLoading.value = true;
  const result = await Promise.all(p);

  if (result.every(r => !Number(r.code))) {
    HlMessage.success('发送成功');
  } else {
    HlMessage.error('发送失败');
  }
  isLoading.value = false;
  emit('ok');
};

function contentValidator(type: string) {
  return (rule: any, v: string, callback: (err?: Error) => void) => {
    if (type === 'systemUsersContent') {
      if (formData.systemUsers.length) {
        v ? callback() : callback(new Error('请输入通知内容'));
      } else callback();
    } else if (type === 'tempUsersContent') {
      if (formData.tempUsers.length) {
        v ? callback() : callback(new Error('请输入通知内容'));
      } else callback();
    }
  };
}

function usersValidator(rule: any, v: string, callback: (err?: Error) => void) {
  if (formData.systemUsers.length || formData.tempUsers.length) {
    callback();
  } else {
    callback(new Error('请选择人员'));
  }
}

watch(() => props.users, () => {
  addUsers();
}, {
  immediate: true,
  deep: true,
});
</script>
<style lang="scss" scoped>
.send-msg-form {
  padding: var(--px20);
  padding-bottom: var(--sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: var(--md);
  .tag-wrapper {
    display: flex;
    align-items: center;
    column-gap: var(--xxs);
    row-gap: var(--xxs);
    flex-wrap: wrap;
    min-height: calc(var(--xxs) * 8);
    background: rgba(0,158,247,0.12);
    border-radius: 4px;
    border: 1px solid rgba(0,158,247,0.24);
    padding: calc(var(--xxs) / 2) calc(var(--xxs) * 2);
    .hl-tag {
      background-image: url('@/assets/images/button/tag-bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .separator {
    height: 1px;
    width: 100%;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
