<template>
  <common-dialog
    title="开始会议"
    style="width:calc(var(--xl) * 25.32);"
     @close="$emit('close')"
  >
    <hl-group
      class="meeting-area w-full"
      dir="vertical"
    >
    <hl-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-position="['items-left', 'items-top']"
      item-gap="var(--sm)"
    >
      <hl-form-item prop="title" label="会议名称">
        <hl-input v-model="formData.title" maxlength="20"  placeholder="请输入会议名称" block/>
      </hl-form-item>
      <hl-form-item prop="users" label="参加人员">
        <org-user-item v-model="formData.users" tip="参加人员" :currentUserIsDefaultCheck="currentUserIsDefaultCheck" :currentUserId="empid"/>
      </hl-form-item>
      <hl-form-item label="会议类型">
         <hl-group gap="var(--md)">
          <hl-radio v-model="formData.nVoiceIntercom" :label="0">视频会议</hl-radio>
          <hl-radio v-model="formData.nVoiceIntercom" :label="1">纯语音会议</hl-radio>
        </hl-group>
      </hl-form-item>
      <hl-form-item label="会议说明" prop="description">
        <hl-input
          v-model="formData.description"
          native-type="textarea"
          placeholder="请输入会议说明"
          block
          :rows="4"
          resize="none"
        />
      </hl-form-item>
    </hl-form>
      <span class="meeting-footer">
        <hl-button class="user-cancal-btn" @click="$emit('close')">取消</hl-button>
        <hl-button type="primary" class="user-ok-btn m-l-md" :loading="isLoading" @click="confirm">确定</hl-button>
      </span>
    </hl-group>
    <hy-meeting-dlg ref="hyMeetingDlgRef" v-if="showHyDlg"
     />
  </common-dialog>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { FormInstance, HlMessage } from 'hongluan-ui';
import { OrgUserItem } from '@/components';
import { GlobalAPI } from '@/common';
import { IpostCreateMeetingVerificationSpace } from '@/apis/modules/tempApi/command-center-group/model';
import { IpostUsersSpace } from '@/apis/modules/event-detail/model';
import { apiMeetingObj } from '@/apis/modules/meeting/index';
import HyMeetingDlg from './components/hy-meeting-dlg.vue';
import { useMeeting } from '@/hooks';

const {
  showHyDlg,
} = useMeeting();

const emit = defineEmits(['close', 'confirm']);

const hasSelectedPersonData = ref<IpostUsersSpace.List[]>([]);
const empid = ref('');
const hyMeetingDlgRef = ref();
const formRef = ref<FormInstance>();
const formData = reactive({
  meetingType: '1',
  title: '',
  description: '',
  nVoiceIntercom: 0,
  users: [] as IpostUsersSpace.List[]
});
const isLoading = ref(false);
// 当前用户是否默认选中
const currentUserIsDefaultCheck = ref(false);

const rules = {
  title: [{ required: true, message: '会议名称不能为空' }],
  users: [
    {
      required: true,
      message: '参加人员不能为空',
      validator: (_: any, __: any, callback: any) => {
        if (!__.length) {
          callback(new Error('参加人员不能为空'));
        } else {
          callback();
        }
      },
    }
  ],
  description: [
    { required: true, message: '请输入会议说明', trigger: 'blur' }
  ],
};

watch(
  () => formData.users,
  () => {
    formRef.value?.validateField('users');
  },
  {
    deep: true
  }
);

const confirm = async() => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;
  showHyDlg.value = true;
  nextTick(() => {
    hyMeetingDlgRef.value.init(formData);
    emit('confirm');
  });
};

onMounted(async() => {
  // hasSelectedPersonData.value = meetingPassedPerson.value;
  // if (currentUserIsDefaultCheck.value) {
  //   formData.users = [...meetingPassedPerson.value];
  // } else {
  //   formData.users = meetingPassedPerson.value;
  // }
});

</script>
<style lang="scss" scoped>
.meeting-area {
  background: #0A2038;
  .hl-form {
    padding: calc(var(--xl) * 0.48) calc(var(--xl) * 0.8);
  }
  .meeting-footer {
    padding: 0 calc(var(--xl) * 0.8) calc(var(--xl) * 0.48);
    text-align: right;
  }
  .user-cancal-btn {
    width: calc(var(--xl) * 3.28);
    height: calc(var(--xl) * 1.1);
    background: #042441;
    border: 1px solid #159AFF;
    font-size: calc(var(--xl) * 0.58);
    color: #D0DEEE;
  }
  .user-ok-btn {
    width: calc(var(--xl) * 3.28);
    height: calc(var(--xl) * 1.1);
    background: rgba(21,154,255,0.25);
    box-shadow: inset 0px 34px 32px 0px rgba(21,154,255,0.5), inset 0px 0px 12px 0px rgba(46,102,255,0.5);
    font-size: calc(var(--xl) * 0.58);
    color: #D0DEEE;
  }
}
</style>
