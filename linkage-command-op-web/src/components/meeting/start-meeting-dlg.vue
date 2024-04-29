<template>
  <hl-dialog
    :model-value="true"
    title="开始会议"
    :borderless="false"
    :close-on-click-modal="false"
    width="calc(var(--xxl) * 24)"
    padding="var(--xl)"
    @close="$emit('cancel')"
  >
    <hl-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-position="['items-left', 'items-top']"
    >
      <hl-form-item prop="title" label="会议名称">
        <hl-input v-model="formData.title" maxlength="20" block/>
      </hl-form-item>
      <hl-form-item prop="users" label="参加人员">
        <org-user-item
          :users="formData.users"
          :org-user-selector-props="{title: '参加人员', showCommandSystem, showOrgTab: false, forceHideTreeTab, showGroupTab: false }"
          @change="updateUsers"
        />
      </hl-form-item>
      <hl-form-item label="会议说明" prop="description">
        <hl-input
          v-model="formData.description"
          native-type="textarea"
          placeholder="请输入会议说明"
          block
          :rows="4"
          resize="none"
          :maxlength="100"
          show-word-limit
        />
      </hl-form-item>
    </hl-form>
    <template #footer>
      <span class="dialog-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="m-l-md" :loading="isLoading" @click="confirm">确定</hl-button>
      </span>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed, PropType, h } from 'vue';
import { FormInstance, HlMessage } from 'hongluan-ui';
import { ModelessDialogManager } from 'hongluan-business-ui';
import { useRoute } from 'vue-router';
import { useUser } from 'fx-front-ucenter';
import { GlobalAPI } from '@/common';
import { apiMeetingObj } from '@/apis/modules/meeting';
import OrgUserItem from '../org-user-item.vue';
import MeetingContainer from './meeting-container.vue';

import type { OrgUserItem as OrgUserItemType } from '../org-user-selector-dlg/types';

const props = defineProps({
  meetingPassedPerson: {
    type: Array as PropType<OrgUserItemType[]>,
    default: () => []
  }
});
const emit = defineEmits(['cancel', 'confirm']);

const route = useRoute();
const { getToken } = useUser();

const { empid } = GlobalAPI.userInfo;
const hasSelectedPersonData = ref<OrgUserItemType[]>([]);
const formRef = ref<FormInstance>();
const formData = reactive({
  loginUserId: empid,
  meetingType: '1',
  title: '',
  description: '',
  users: [] as OrgUserItemType[]
});
const isLoading = ref(false);
// 当前用户是否默认选中
const currentUserIsDefaultCheck = ref(true);

const rules = {
  title: [{ required: true, message: '会议名称不能为空' }],
  users: [
    {
      required: true,
      message: '参与人员不能为空',
      validator: (_: any, __: any, callback: any) => {
        if (!__.length) {
          callback(new Error('参与人员不能为空'));
        } else {
          callback();
        }
      },
    }
  ],
  description: [
    { required: false, message: '请输入会议说明', trigger: 'blur' }
  ],
};

const showCommandSystem = computed(() => route.name === 'event-handling');
const forceHideTreeTab = computed(() => route.name !== 'event-handling');

const confirm = async() => {
  console.log('formData', formData);
  const isValid = await formRef.value?.validate();
  if (!isValid) return;
  if (currentUserIsDefaultCheck.value) {
    const index = formData.users.findIndex((u: any) => {
      return u.userId === getCurrentUserInfo().userId;
    });
    if (index === -1) {
      HlMessage.warning('当前预约人不可删除，请重新选择');
      return;
    }
  }

  emit('confirm');
  const result = await apiMeetingObj.postAddMeeting(formData);
  if (GlobalAPI.config.MEETING_EMBED_MODE === 'dialog') {
    ModelessDialogManager.show({
      title: '协同会商',
      useDock: false,
      snapshot: false,
      body: h(MeetingContainer, { meetingParams: result.data }),
      resize: true,
      showCollapse: false,
      customClass: 'meeting-dialog',
    });
  } else {
    const url = `
${import.meta.env.PROD ? window.location.origin : 'http://localhost:8010'}
/swan-collaborative-meeting/login?theme=dark&id=${result.data.id}&outRoomCode=${result.data.outRoomCode}&token=${getToken()}
`;
    window.open(url, '_blank');
  }
};

const getCurrentUserInfo = () => {
  const { userName, empid: userId, empname, orgid: orgId, orgname: orgName, tenantId, mobileNo, gender, } = GlobalAPI.userInfo;
  return {
    account: userName,
    userId,
    userName: empname,
    orgId,
    orgName,
    tenantId,
    mobile: mobileNo,
    gender,
    children: []
  } as OrgUserItemType;
};

const updateUsers = ({ users }: { users: OrgUserItemType[] }) => {
  formData.users = users;
};

onMounted(async() => {
  hasSelectedPersonData.value = props.meetingPassedPerson;
  if (currentUserIsDefaultCheck.value) {
    const currentUserIndex = hasSelectedPersonData.value.findIndex(p => {
      return p.userId === getCurrentUserInfo().userId;
    });
    if (currentUserIndex === -1) {
      formData.users = [getCurrentUserInfo(), ...props.meetingPassedPerson];
    } else {
      formData.users = props.meetingPassedPerson;
    }
  } else {
    formData.users = props.meetingPassedPerson;
  }
  formData.users.forEach(u => {
    u.type = 'user';
    u.treeType = 'organization'; // 否则数据丢失
  });
});
</script>
