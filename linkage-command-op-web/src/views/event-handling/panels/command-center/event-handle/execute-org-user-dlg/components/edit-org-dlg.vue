<template>
  <hl-dialog
    :model-value="true"
    title="编辑"
    :borderless="false"
    :close-on-click-modal="false"
    width="calc(var(--xxl) * 24)"
    padding="var(--xl)"
    @close="$emit('cancel')"
  >
    <hl-scrollbar height="calc(var(--xxl) * 8)">
      <div class="p-lg">
        <hl-simple-table
          table-fixed
          :cols="cols"
          :data="checkTreeList"
        >
          <template #role="{ row }">
            <hl-select v-model="row.poolRoleIds" multiple placeholder="请选择岗位职责" block popper-class="role-select-popper">
              <hl-option v-for="item in roleList" :key="item.id" class="role-select-item" :label="item.roleName" :value="item.id">
                <div>{{ item.roleName }}</div>
                <div class="text-secondary font-sm">{{item.roleDesc}}</div>
              </hl-option>
            </hl-select>
          </template>
          <template #jobDescription="{row}">
            <hl-input v-model="row.jobDescription" maxlength="250" show-word-limit block/>
          </template>
        </hl-simple-table>
      </div>
    </hl-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <hl-button class="m-l-md" @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="m-l-md" @click="confirm">确定</hl-button>
      </span>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import { HlMessage } from 'hongluan-ui';
import { IpostFindCommandSysUserPoolRolePageSpace } from '@/apis/modules/role-management/model';
import { apiRoleManagementObj } from '@/apis/modules/role-management';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import { IpostFindStrategyCommandOrgPageSpace, IpostFindCommandSysGroupOrgPageSpace } from '@/apis/modules/command-center/model';

const props = defineProps({
  row: {
    type: Object as PropType<IpostFindStrategyCommandOrgPageSpace.List>,
    required: true
  }
});
const emit = defineEmits(['cancel', 'confirm']);

const route = useRoute();

const cols = ref([
  { title: '机构名称', prop: 'orgName' },
  { title: '组内岗位职责', prop: 'poolRoleIds', slotName: 'role' },
  { title: '职责描述', prop: 'jobDescription', slotName: 'jobDescription' },
]);

const checkTreeList = ref<Array<IpostFindStrategyCommandOrgPageSpace.List & {poolRoleIds: string[]}>>([]);

const roleList = ref<IpostFindCommandSysUserPoolRolePageSpace.List[]>([]);

const getRoleList = async() => {
  const params = {
    search: '',
    currentPage: 1,
    pageSize: 100,
    eventType: [],
  };
  const result = await apiRoleManagementObj.postFindCommandSysUserPoolRolePage(params);
  roleList.value = result.data.list;
};

const confirm = async() => {
  await apiCommandCenterObj.postModifyStrategyCommandOrgRole(
    checkTreeList.value[0].id,
    checkTreeList.value[0].poolRoleIds,
    checkTreeList.value[0].jobDescription
  );
  HlMessage.success('修改成功');
  emit('confirm');
};

onMounted(() => {
  getRoleList();
  checkTreeList.value = [{
    ...props.row,
    poolRoleIds: props.row.poolRoles.map(ele => `${ele.poolRoleId}`),
  }];
});
</script>

<style lang="scss" scoped>
</style>
