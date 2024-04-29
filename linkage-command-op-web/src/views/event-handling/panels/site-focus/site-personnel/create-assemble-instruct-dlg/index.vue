<template>
  <org-user-selector-dlg
    ref="orgDlgRef"
    class="create-assemble-instruct-dlg"
    show-as="table"
    title="集结指令"
    :show-actions="false"
    :show-org-tab="false"
    :show-group-tab="false"
    :show-organization="false"
    force-hide-tree-tab
    :items-section-width="[10, 14]"
    @submit="addUsers"
    @cancel="$emit('cancel')"
  >
    <template #selectedItems>
      <assemble-form :users="users" @delUser="delUser" @cancel="$emit('cancel')" @ok="$emit('ok')" />
    </template>
  </org-user-selector-dlg>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { OrgUserSelectorDlg } from '@/components';
import CommandPersonList from './command-person-list.vue';
import AssembleForm from './assemble-form.vue';

const emit = defineEmits(['cancel', 'ok']);

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
.create-assemble-instruct-dlg {
  .content {
    height: calc(var(--xxs) * 175) !important;
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
      }
    }
  }
}
</style>
