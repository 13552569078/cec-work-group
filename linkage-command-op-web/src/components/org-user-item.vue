<template>
  <hl-group
    class="w-full p-xxs org-user-item radius-md"
    align="items-middle"
    gap="var(--md)"
  >
    <hl-group wrap gap="var(--xs)">
      <hl-tag
        v-for="tag in tagsData.users"
        :key="tag.userId"
        closable
        type="primary"
        :disable-transitions="false"
        @close="tagsClose('users', tag)"
      >
        {{ tag.userName }}
      </hl-tag>
      <hl-tag
        v-for="tag in tagsData.orgs"
        :key="tag.orgId"
        closable
        type="primary"
        :disable-transitions="false"
        @close="tagsClose('orgs', tag)"
      >
        {{ tag.orgName ?? tag.name }}
      </hl-tag>
      <hl-tag
        v-for="tag in tagsData.groups"
        :key="tag.id"
        closable
        type="primary"
        :disable-transitions="false"
        @close="tagsClose('groups', tag)"
      >
        {{ tag.name ?? tag.groupName }}
      </hl-tag>
      <hl-button
        class="static"
        size="sm"
        type="primary"
        @click="addOrganization"
      >添加人员</hl-button>
    </hl-group>
  </hl-group>
  <org-user-selector-dlg
    v-if="usersData.showOrgUserSelectorDlg"
    :selected="[
      ...tagsData.users,
      ...tagsData.orgs,
      ...tagsData.groups
    ]"
    v-bind="orgUserSelectorProps"
    @cancel="usersData.showOrgUserSelectorDlg = false"
    @submit="submit"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watchEffect } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { OrgUserSelectorDlg } from '@/components';
import { apiUserCenterObj } from '@/apis/modules/user-center';

import type { PropType } from 'vue';
import type { Users, Performer, TagKeys, IdKeys } from '@/types';

const props = defineProps({
  users: {
    type: Array as PropType<Performer[]>,
    default: () => [],
  }, // 组织机构执行人
  orgs: {
    type: Array as PropType<Performer[]>,
    default: () => [],
  }, // 组织机构执行机构
  groups: {
    type: Array as PropType<Performer[]>,
    default: () => [],
  }, // 指挥体系包括人/机构/分组
  orgUserSelectorProps: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['change']);

const tagsData = ref({
  users: props.users,
  orgs: props.orgs,
  groups: props.groups,
});
const usersData = reactive({
  showInput: false,
  showOrgUserSelectorDlg: false,
  addVal: ''
});
const options = ref<Users[]>([]);
const tagsKeyMap = new Map([
  ['users', 'userId'],
  ['orgs', 'orgId'],
  ['groups', 'id'],
]);

const tagsClose = (type: string, tagItem: Performer) => {
  tagsData.value[type as TagKeys].splice(
    tagsData.value[type as TagKeys].findIndex(
      el => el[tagsKeyMap.get(type) as IdKeys] === tagItem[tagsKeyMap.get(type) as IdKeys]
    ),
    1
  );
  emit('change', tagsData.value);
};

const addOrganization = () => {
  usersData.showOrgUserSelectorDlg = true;
  nextTick(() => {
    usersData.showInput = false;
    usersData.addVal = '';
  });
};
const submit = (val: { [key: string]: any }) => {
  usersData.showOrgUserSelectorDlg = false;
  tagsData.value.users = [...val.organization.user, ...val.commandSystem.user, ...val.other.user];
  tagsData.value.orgs = [...val.organization.org, ...val.commandSystem.org, ...val.other.org];
  tagsData.value.groups = [...val.commandSystem.group];
  emit('change', tagsData.value);
};
</script>
<style scoped lang="scss">
.org-user-item {
  background: rgba(0,158,247,0.12);
  min-height: calc(var(--xxs) * 9.5);
  border: var(--border-width) solid #07578f;
  &:hover {
     border-color: var(--form-border-color);
   }
}
</style>
