<template>
  <hl-dialog
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="send-assemble-supervise-dlg"
    width="calc(var(--xxs) * 140)"
    title="发送通知"
    @close="$emit('cancel')"
  >
    <send-msg-form
      :content="content"
      :users="simpleUsers"
      show-cancel-button
      message-title="集结督办通知"
      :show-all-user-types="false"
      max-height="calc(var(--xxs) * 170)"
      @ok="$emit('cancel')"
      @cancel="$emit('cancel')"
    />
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, PropType, computed } from 'vue';
import { SendMsgForm } from '@/components';
import { IpostFindCommandCenterAssemblePointListSpace } from '@/apis/modules/site-personnel/model';

const props = defineProps({
  content: String,
  users: {
    type: Array as PropType<IpostFindCommandCenterAssemblePointListSpace.AssemblingUser[]>,
    default: () => ([])
  }
});

const simpleUsers = computed(() => props.users.map(u => ({
  userId: u.userId,
  userName: u.userName,
  orgId: u.orgId,
  orgName: u.orgName,
  temporaryPersonnel: u.temporaryPersonnel
})));
</script>
<style lang="scss">
.send-assemble-supervise-dlg {
  .send-msg-form {
    padding: 0;
    .dialog-footer {
      margin-top: var(--sm);
    }
  }
}
</style>
