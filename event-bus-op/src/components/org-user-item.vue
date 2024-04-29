<template>
  <hl-group
    wrap
    gap="var(--xs)"
    class="w-full self-grow border items-middle user-item-area"
    style="padding: var(--form-padding-y) var(--form-padding-x)"
  >
    <hl-tag
      v-for="tag in selectedUsers"
      class="user-tag"
      :key="tag"
      closable
      type="primary"
      :disable-transitions="false"
      @close="usersTagsClose(tag)"
    > <div> {{ tag.name }}</div>
      <div class="tag-line"></div></hl-tag>
    <!-- <hl-select
        v-if="usersData.showInput"
        v-model="usersData.addVal"
        size="sm"
        clearable
        filterable
        :placeholder="`请添加${tip}`"
      >
        <hl-option
          v-for="item in userOptions"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId"
          @click="usersConfirm(item)"
        />
      </hl-select> -->
    <!-- <hl-button v-else class="sm static" @click="usersData.showInput = true;">+ 添加{{ tip }}</hl-button> -->
    <hl-button
      class="static primary sm light batch-btn"
      @click="userDlgShow=true"
    >批量选择</hl-button>
  </hl-group>
  <org-user-selector
    :selected-users="selectedUsers"
    v-if="userDlgShow"
    @cancel="userDlgShow = false"
    @confirm="addUsers"
    :currentUserIsDefaultCheck="currentUserIsDefaultCheck"
    :currentUserId="currentUserId"
  />
</template>
<script lang="ts" setup>
import { HlMessage } from 'hongluan-ui';
import { PropType, reactive, ref, watch } from 'vue';
import { OrgUserSelector } from './index';
import { IpostUsersSpace } from '@/apis/modules/event-detail/model';

const props = defineProps({
  modelValue: {
    type: Array as PropType<IpostUsersSpace.List[]>,
    default: () => [],
  },
  tip: String,
  // 当前用户是否默认选中
  currentUserIsDefaultCheck: {
    type: Boolean,
    default: false,
  },
  currentUserId: String,
});
const emit = defineEmits(['update:modelValue']);

const userDlgShow = ref(false);
const usersData = reactive({
  showInput: false,
  showOrganization: false,
  addVal: '',
});
const selectedUsers = ref<IpostUsersSpace.List[]>([]);
const userOptions = ref<IpostUsersSpace.List[]>([]);

const usersTagsClose = (tag: IpostUsersSpace.List) => {
  if (props.currentUserIsDefaultCheck && props.currentUserId === tag.id) {
    HlMessage.warning({
      message: '当前账户登录人员不可删除',
    });
    return;
  }
  selectedUsers.value.splice(
    selectedUsers.value.findIndex(el => el.id === tag.id),
    1
  );
  emit('update:modelValue', selectedUsers.value);
};

const usersConfirm = (user: IpostUsersSpace.List) => {
  const selectedID = selectedUsers.value.length
    ? selectedUsers.value.map(el => el.id)
    : [];
  if (selectedID.includes(`${user.id}`)) {
    HlMessage.warning({
      message: '已添加该人员',
    });
  } else {
    selectedUsers.value.push(user);
    usersData.showInput = false;
  }
  usersData.addVal = '';
  emit('update:modelValue', selectedUsers.value);
};

const addUsers = (users: IpostUsersSpace.List[]) => {
  selectedUsers.value = [...users];
  emit('update:modelValue', selectedUsers.value);
};

// const getAllUsers = async() => {
//   const result = await apiAgencyPoolPersonnelObj.postFindCommandSysUserPage({
//     pageSize: 9999999,
//     currentPage: 1,
//     userName: usersData.addVal,
//     orgId: ''
//   });
//   userOptions.value = result.data.list;
//   console.log(result.data);
// };

watch(
  () => props.modelValue,
  () => {
    selectedUsers.value = [...props.modelValue];
  },
  {
    immediate: true,
    deep: true,
  }
);

// getAllUsers();
</script>
<style lang="scss" scoped>
.user-item-area {
  .user-tag {
    padding-right: calc(var(--xl) * 0.32)!important;
    height: calc(var(--xl) * 0.78)!important;
    background: #042441!important;
    border: 1px solid #159AFF!important;
    border-radius: calc(var(--xl) * 0.16)!important;
    background-image: url('@/assets/images/panelBox/selet-tag.png')!important;
    background-repeat: no-repeat!important;
    background-size: 100% 100%!important;
    color: #D0DEEE!important;
    .tag-line {
      margin-left: calc(var(--xl) * 0.32);
      margin-right: calc(var(--xl) * 0.12);
      height: calc(var(--xl) * 0.39)!important;
      border-right: 1px solid #159AFF!important;
    }
  }
  :deep(.hl-tag span) {
    display: flex!important;
    align-items: center!important;
  }
  .batch-btn {
    width: calc(var(--xl) * 2.52)!important;
    height: calc(var(--xl) * 0.81)!important;
    font-size: calc(var(--xl) * 0.48)!important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #D0DEEE!important;
    background-image: url('@/assets/images/dialog/batch_btn.png')!important;
    background-repeat: no-repeat!important;
    background-size: 100% 100%!important;
  }
  .user-footer {
    margin-top: calc(var(--xl) * 0.6);
    text-align: right;
  }
}
</style>
