<template>
  <div class="meeting-container" v-loading="loading" loading-background="rgba(16, 51, 91, 0.9)">
    <iframe
      ref="iframeRef"
      allowfullscreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      :src="iframeSrc"
      style="width: 100%; height: 100%"
      scrolling="auto"
      frameborder="0"
      id="iframe"
      @load="loading=false"
    >
    </iframe>
    <org-user-selector-dlg
      v-if="userDlgVisible"
      :show-org-tab="false"
      :show-group-tab="false"
      :default-tree="meetingDetail.eventId ? 'commandSystem' : 'organization'"
      :event-id="meetingDetail.eventId"
      :disabled="meetingDetail.allUsers"
      :show-command-system="!!meetingDetail.eventId"
      :force-hide-tree-tab="!meetingDetail.eventId"
      @submit="selectPersonalConfirm"
      @cancel="userDlgVisible = false"
    />
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, PropType, reactive, ref, toRaw } from 'vue';
import { useUser } from 'fx-front-ucenter';
import { HlLoadingDirective as vLoading } from 'hongluan-ui';
import { useCalling } from '@/hooks';
import OrgUserSelectorDlg from '../org-user-selector-dlg/index.vue';
import type { SubmitEvent } from '../org-user-selector-dlg/types';

const props = defineProps({
  meetingParams: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  }
});

const { getToken } = useUser();
const { currentCallingUser } = useCalling();

const loading = ref(true);
const iframeSrc = ref('');
const iframeRef = ref<HTMLIFrameElement>();
const userDlgVisible = ref(false);
const meetingDetail = reactive<Record<string, any>>({});

const handleMeetingMessage = (event: MessageEvent) => {
  if (event.data.$cmd === 'calling') {
    currentCallingUser.value = event.data.user;
  } else if (event.data.$cmd === 'user-list') {
    const meeting = event.data.meeting;
    meeting.allUsers = meeting.allUsers?.map((u: Record<string, any>) => ({ ...u, type: 'user' }));
    Object.assign(meetingDetail, meeting);
    userDlgVisible.value = true;
  }
};

const selectPersonalConfirm = (event: SubmitEvent) => {
  iframeRef.value?.contentWindow?.postMessage({
    $cmd: 'add-users',
    user: [...event.organization.user.map(toRaw), ...event.commandSystem.user.map(toRaw)]
  }, '*');
  userDlgVisible.value = false;
};

onMounted(() => {
  iframeSrc.value = `
${import.meta.env.PROD ? window.location.origin : 'http://localhost:8010'}
/swan-collaborative-meeting/login?theme=dark&useContainerAbility=1&id=${props.meetingParams.id}&outRoomCode=${props.meetingParams.outRoomCode}&token=${getToken()}
`;
  window.addEventListener('message', handleMeetingMessage);
});
onBeforeUnmount(() => {
  window.removeEventListener('message', handleMeetingMessage);
});
</script>
<style lang="scss" scoped>
</style>
