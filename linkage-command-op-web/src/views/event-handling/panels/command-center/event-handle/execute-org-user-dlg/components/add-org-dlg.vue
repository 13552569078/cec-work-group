<template>
  <org-user-selector-dlg
    class="execute-orgs-selector-dlg"
    title="新增单位"
    :disabled="existedOrgs"
    :show-command-system="false"
    :show-user-tab="false"
    show-as="table"
    :show-actions="false"
    force-hide-tree-tab
    :items-section-width="[10, 14]"
    @submit="selectOrgs"
    @cancel="$emit('cancel')"
  >
    <template #selectedItems>
      <div class="org-role-config h-full w-full p-sm">
        <hl-scrollbar class="self-grow">
          <hl-simple-table
            table-fixed
            :cols="cols"
            :data="orgList"
          >
            <template #role="{ row }">
              <hl-select v-model="row.poolRoleIds" multiple placeholder="请选择岗位职责" block popper-class="role-select-popper">
                <hl-option v-for="item in roleList" :key="item.id" class="role-select-item" :label="item.roleName" :value="item.id">
                  <div>{{ item.roleName }}</div>
                  <div class="text-secondary font-sm">{{item.roleDesc}}</div>
                </hl-option>
              </hl-select>
            </template>
            <template #roleDesc="{row}">
              <hl-input v-model="row.roleDesc" maxlength="250" native-type="textarea" :rows="1" :autosize="{ minRows: 1, maxRows: 4 }" block/>
            </template>
          </hl-simple-table>
        </hl-scrollbar>
        <span class="dialog-footer">
          <hl-button class="m-l-md" @click="$emit('cancel')">取消</hl-button>
          <hl-button type="primary" class="m-l-md" @click="confirm">确定</hl-button>
        </span>
      </div>
    </template>
  </org-user-selector-dlg>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { HlMessage, HlMessageBox, HlTree } from 'hongluan-ui';
import { OrgUserSelectorDlg } from '@/components';
import { IpostFindCommandSysGroupOrgPageSpace } from '@/apis/modules/command-center/model';
import { apiRoleManagementObj } from '@/apis/modules/role-management';
import { IpostFindCommandSysUserPoolRolePageSpace } from '@/apis/modules/role-management/model';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { IgetFindOrgTreeSpace } from '@/apis/modules/user-center/model';

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  selecedtAgencyData: {
    type: Array as PropType<IpostFindCommandSysGroupOrgPageSpace.List[]>,
    default: () => [],
    required: true
  },
  strategyInfoId: String
});

const emit = defineEmits(['cancel', 'confirm']);

const cols = ref([
  { title: '机构名称', prop: 'orgName', width: 'calc(var(--xxs) * 40)' },
  { title: '组内岗位职责', prop: 'poolRoleIds', slotName: 'role' },
  { title: '职责描述', prop: 'roleDesc', slotName: 'roleDesc' },
]);
const orgList = ref<Record<string, any>[]>([]);
const roleList = ref<IpostFindCommandSysUserPoolRolePageSpace.List[]>([]);

const existedOrgs = computed(() => {
  return props.selecedtAgencyData.map(d => ({ ...d, type: 'org' }));
});

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

const selectOrgs = ({ organization: { org } }: Record<string, any>) => {
  orgList.value = org.map((ele: Record<string, any>) => ({ ...ele, poolRoleIds: [], roleDesc: '' }));
};

const confirm = async() => {
  if (orgList.value.length === 0) {
    HlMessage.warning('请选择单位');
    return;
  }
  const params = {
    groupId: props.groupId,
    strategyInfoId: props.strategyInfoId,
    orgs: orgList.value.map((item: any) => ({ orgId: item.orgId, orgName: item.orgName, jobDescription: item.roleDesc, roleIds: item.poolRoleIds }))
  };
  await apiCommandCenterObj.postAddStrategyCommandOrg(params);
  HlMessage.success('添加成功');
  emit('confirm');
};

onMounted(() => {
  getRoleList();
});
</script>
<style lang="scss">
.execute-orgs-selector-dlg {
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
      .org-role-config {
        background-color: rgba(0, 158, 247, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        row-gap: var(--md);
        .dialog-footer {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
.role-select-popper {
  max-width: calc(var(--xxs) * 75.5);
  .role-select-item {
    display: block !important;
  }
}
</style>
