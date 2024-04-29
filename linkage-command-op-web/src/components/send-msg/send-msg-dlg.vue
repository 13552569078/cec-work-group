<template>
  <org-user-selector-dlg
    ref="orgDlgRef"
    class="send-msg-dlg"
    show-as="table"
    title="发送通知"
    :show-actions="false"
    :show-org-tab="false"
    :show-group-tab="false"
    :items-section-width="[10, 14]"
    @submit="addUsers"
    @cancel="$emit('cancel')"
  >
    <template #selectedItems>
      <send-msg-form :content="content" :message-title="messageTitle" :users="users" @delUser="delUser" @ok="$emit('cancel')" />
    </template>
  </org-user-selector-dlg>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { OrgUserSelectorDlg } from '@/components';
import SendMsgForm from './send-msg-form.vue';

const props = defineProps({
  content: String,
  messageTitle: {
    type: String,
    default: '通知'
  }
});

defineEmits(['cancel']);

const orgDlgRef = ref();
const users = ref<unknown[]>([]);

const addUsers = ({ organization: { user: ouser }, commandSystem: { user: cuser } }: Record<string, any>) => {
  users.value = [...ouser, ...cuser];
};
const delUser = (u: Record<string, any>) => {
  orgDlgRef.value.delSelectedItem(u);
};
</script>
<style lang="scss">
.send-msg-dlg {
  .content {
    // height: calc(var(--xxs) * 160) !important;
    .right-part {
      margin-left: calc(var(--md) * -1);
      background-color: transparent !important;
    }
    .left-list-wrap  {
      background-color: rgba(0, 158, 247, 0.1);
    }
    .right-list-wrap {
      background-color: transparent;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      .send-msg-form {
        background-color: rgba(0, 158, 247, 0.1);
        height: 100%;
      }
    }
  }
}
</style>
