<template>
  <common-dialog
    title="下发指令"
    width="calc(var(--xl) * 20)"
    @close="toggleInstructDialog"
  >
    <hl-form
      :model="form"
      :rules="rules"
      :label-position="['items-left', 'items-top']"
      item-gap="var(--md)"
      ref="formRef"
    >
      <hl-form-item label="指令标题" prop="title">
        <hl-input
          v-model="form.title"
          placeholder="请输入指令标题"
          class="w-full"
          show-word-limit
          maxlength="50"
        />
      </hl-form-item>
      <hl-form-item prop="users" label="接收人">
        <org-user-item
          v-model="form.users"
          tip="接收人"
          :currentUserIsDefaultCheck="false"
        />
      </hl-form-item>
      <hl-form-item label="指令内容" prop="content">
        <hl-input
          v-model="form.content"
          native-type="textarea"
          :rows="3"
          block
          placeholder="请输入指令内容"
          show-word-limit
          maxlength="500"
        />
      </hl-form-item>
      <hl-form-item label="指令附件">
        <file-uploader v-model="fileList" :limit="9" />
      </hl-form-item>
      <hl-form-item label="事件编号">
        <span class="text-standard">{{ currentEventCode }}</span>
      </hl-form-item>
    </hl-form>
    <hl-group gap="var(--sm)" align="items-right" class="w-full m-t-lg">
      <hl-button effect="light" @click="toggleInstructDialog">取消</hl-button>
      <hl-button type="primary" effect="light" @click="ok">确认</hl-button>
    </hl-group>
  </common-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { FormInstance, UploadUserFile, HlMessage } from 'hongluan-ui';
import { omit } from 'lodash-es';
import { GlobalAPI } from '@/common/global-api';
import { useGlobalState } from '@/hooks';
import { apiInstructObj } from '@/apis/modules/instruct';
import { IpostCreateMeetingVerificationSpace } from '@/apis/modules/tempApi/command-center-group/model';

const { userInfo } = useGlobalState();

const {
  handleCloseAllEventDialog,
  toggleInstructDialog,
  currentEventId,
  currentEventCode,
} = useGlobalState();

const formRef = ref<FormInstance>();

const fileList = ref<UploadUserFile[]>([]);

const form = ref({
  title: '',
  users: [] as IpostCreateMeetingVerificationSpace.UserDetailDTOList[],
  content: '',
});
const rules = {
  title: [{ required: true, message: '指令标题不能为空' }],
  users: [
    {
      required: true,
      message: '接收人不能为空',
      validator: (_: any, __: any, callback: any) => {
        if (!__.length) {
          callback(new Error('接收人不能为空'));
        } else {
          callback();
        }
      },
    },
  ],
  content: [{ required: true, message: '指令内容不能为空', trigger: 'blur' }],
};

watch(
  () => form.value.users,
  () => {
    formRef.value?.validateField('users');
  },
  {
    deep: true,
  }
);

const ok = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;
  const params = {
    ...omit(form.value, 'users'),
    userIds: form.value.users.map(item => {
      return item.id;
    }),
    sendUserId: userInfo.id || JSON.parse(GlobalAPI.config.DEFAULT_USER).id,
    mediaList: fileList.value.map(item => {
      return {
        mediaPath: (item.response as any).data.url,
        mediaType: 'image',
        mediaName: item.name,
      };
    }),
    eventId: currentEventId.value,
    eventCode: currentEventCode.value,
  };
  await apiInstructObj.postSend(params);
  HlMessage.success({
    message: '指令下发成功',
  });
  handleCloseAllEventDialog();
};
</script>
<style lang="scss" scoped></style>
