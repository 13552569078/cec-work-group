<template>
  <common-dialog
    :title="meetingTitle"
    style="width:calc(var(--xl) * 25.32);min-height:calc(var(--xl) * 20.72);"
    @close="closeDialog"
  >
    <div id="meetingPlayer"></div>
    <hl-scrollbar max-height="calc(var(--xl) * 5)">
      <div id="meetingUser"></div>
    </hl-scrollbar>
    <div class="handle-meeting-area">
      <hl-button
        class="m-r-md other-meeting-btn"
        type="primary"
        hover="primary"
        @click="userDlgShow=true"
      >
        邀请其他人员
      </hl-button>
      <hl-button
        class="finish-meeting-btn"
        type="primary"
        hover="primary"
        @click="cancel"
      >
        结束会议
      </hl-button>
    </div>
  </common-dialog>
  <meeting-user-invite
  :selected-users="selectedUsers"
    v-if="userDlgShow"
    @cancel="userDlgShow = false"
    @confirm="addUsers"
    :currentUserIsDefaultCheck="currentUserIsDefaultCheck"
    :currentUserId="currentUserId"/>
</template>

<script lang="ts" setup>
import {
  onMounted,
  PropType,
  nextTick,
  computed,
  watch,
  onUnmounted,
  ref,
} from 'vue';
import MeetingUserInvite from './meeting-user-invite.vue';
import { useMeeting } from '@/hooks';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { IpostUsersSpace } from '@/apis/modules/event-detail/model';
import { GlobalAPI } from '@/common';

const {
  createMeeting,
  startMeeting,
  quitMeeting,
  stopMeeting,
  showHyDlg,
  calledUserList,
} = useMeeting();

const { strUserDomainCode } = JSON.parse(GlobalAPI.config.HY_LOGIN_CONFIG);

const meetingType = ref('singleVideo');
const meetingTitle = ref('');

const userDlgShow = ref(false);
const selectedUsers = ref<IpostUsersSpace.List[]>([]);
const currentUserIsDefaultCheck = false;
const currentUserId = '';

const cancel = () => {
  HlMessageBox.confirm('是否确认关闭会议?', '提示', {
    confirmButtonText: '确认',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
  }).then(async () => {
    closeDialog();
  });
};

const closeDialog = () => {
  stopMeeting();
  showHyDlg.value = false;
};
const init = async (params: any) => {
  // meetingType.value = params.type;
  await nextTick();
  meetingTitle.value = `会议主题：${params.title}`;
  createMeeting({
    strMeetingName: params.title,
    strMeetingDesc: params.description,
    nVoiceIntercom: params.nVoiceIntercom,
    lstMeetingUserInfo: params.users.map(e => {
      return {
        strUserDomainCode: strUserDomainCode,
        strUserID: e.id + '',
        strUserName: e.username + '',
        nDevType: 1,
      };
    })
    // 互联网环境 测试账号
    // lstMeetingUserInfo: [
    //   {
    //     strUserDomainCode: strUserDomainCode,
    //     strUserID: 'lvxh1002',
    //     strUserName: 'lvxh1002',
    //     nDevType: 1,
    //   },
    //   {
    //     strUserDomainCode: strUserDomainCode,
    //     strUserID: 'guanghanOP',
    //     strUserName: 'guanghanOP',
    //     nDevType: 1,
    //   },
    // ],
    // app 德政通
    // lstMeetingUserInfo: [...calledUserList]
  });
};

const addUsers = (users: IpostUsersSpace.List[]) => {
  selectedUsers.value = [...users];
  // emit('update:modelValue', selectedUsers.value);
};

defineExpose({
  init,
});
</script>

<style lang="scss">
#meetingPlayer {
  height: calc(var(--xl) * 11);
}
#meetingUser {
  margin-top: calc(var(--xl) * 0.2);
  width: 100%;
  .table {
    width: 100%;
    text-align: center;
  }
  li,
  ul {
    list-style: none !important;
    padding: 5px 10px !important;
    // a {
    //   visibility: hidden!important;
    // }
  }
}
.handle-meeting-area {
  text-align: right;
  margin-top:  calc(var(--xl) * 0.4);
  margin-bottom: calc(var(--xl) * -0.8);
}
.other-meeting-btn {
  height: calc(var(--xl) * 1.1);
  background: rgba(21,154,255,0.25)!important;
  box-shadow: inset 0px 34px 32px 0px rgba(21,154,255,0.5), inset 0px 0px 12px 0px rgba(46,102,255,0.5)!important;
  font-size: calc(var(--xl) * 0.58);
  color: #D0DEEE!important;
}
.finish-meeting-btn {
  width: calc(var(--xl) * 3.28);
  height: calc(var(--xl) * 1.1);
  box-shadow: inset 0px 0px 12px 0px rgba(255,46,46,0.5)!important;
  border: 3px solid #E02020!important;
  font-size: calc(var(--xl) * 0.58);
  font-weight: 400;
  color: #E02020!important;
  background-image: none!important;
}
</style>
