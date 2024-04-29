<!--
  部门-人员选择组件
-->
<template>
  <common-dialog
    title="邀请参会"
    style="width:calc(var(--xl) * 32);"
    @close="$emit('cancel')"
    v-model="dialogVisible"
  >
    <hl-group
      class="user-area w-full"
      dir="vertical"
    >
     <hl-row>
      <hl-col span="col-8" class="p-r-md border-right">
        <hl-group class="tree-panel static h-full" dir="vertical" full>
          <div>
            <hl-input v-model="filterOrgText" placeholder="机构名称" block class="m-b-sm">
              <template #suffix>
                <hl-icon>
                  <two-search />
                </hl-icon>
              </template>
            </hl-input>
          </div>
          <hl-scrollbar height="calc(var(--xxl) * 12)">
            <hl-tree
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
              node-key="id"
              ref="orgTree"
              highlight-current
              :expand-on-click-node="false"
              gap="0"
              default-expand-all
              :filter-node-method="filterNode"
            />
          </hl-scrollbar>
        </hl-group>
      </hl-col>
      <hl-col class="p-x-md border-right" span="col-16">
        <div class="w-full text-right m-b-sm">
          <hl-input v-model="filterUserText" class="text-left" placeholder="人员名称">
            <template #suffix>
              <hl-icon><two-search /></hl-icon>
            </template>
          </hl-input>
        </div>
        <hl-scrollbar height="calc(var(--xxl) * 12)">
          <hl-simple-table row-key="id" :cols="cols" :data="tableData" fixed-header >
            <!-- <template #firstCol>
              <hl-checkbox v-if="tableData.length" v-model="selectedAll" @change="selectAll" />
            </template>
            <template #tableIndex="{ row }">
              <hl-checkbox v-model="selectedRows" :label="row.id" @change="selectRow(row)">{{ '' }}</hl-checkbox>
            </template> -->
            <template #handle="{ row }">
              <hl-button type="link" @click="handleInvite(row)">邀请</hl-button>
            </template>
          </hl-simple-table>
        </hl-scrollbar>
      </hl-col>
      <!-- <hl-col class="p-l-md" span="col-6">
        <hl-group dir="vertical">
          <div class="display-flex items-middle" style="height: calc(var(--xxs) * 8)">已选择人员({{ tags.length }}人)</div>
          <hl-scrollbar height="calc(var(--xxl) * 12)">
            <hl-tag
              class="m-xxs"
              v-for="(tag, index) in tags"
              :key="tag.id"
              closable
              @close="handleClose(tag.id, index)"
            >
              {{ tag.name }}
            </hl-tag>
          </hl-scrollbar>
        </hl-group>
      </hl-col> -->
    </hl-row>
      <!-- <span class="user-footer">
         <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="m-l-md" @click="ok">确定</hl-button>
      </span> -->
    </hl-group>
  </common-dialog>

</template>

<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { HlMessage } from 'hongluan-ui';
import { apiEventDetailObj } from '@/apis/modules/event-detail';
import { IgetTreeSpace, IpostUsersSpace } from '@/apis/modules/event-detail/model';
import { useMeeting } from '@/hooks';
import { GlobalAPI } from '@/common';

const {
  inviteNewUser
} = useMeeting();
const { strUserDomainCode } = JSON.parse(GlobalAPI.config.HY_LOGIN_CONFIG);

const props = defineProps({
  selectedUsers: {
    type: Array as PropType<IpostUsersSpace.List[]>,
    default: () => []
  },
  // 当前用户是否默认选中
  currentUserIsDefaultCheck: {
    type: Boolean,
    default: false
  },
  currentUserId: String
});
const emit = defineEmits(['cancel', 'confirm']);

const route = useRoute();

const filterOrgText = ref('');
const filterUserText = ref('');
const dialogVisible = ref(true);
const orgTree = ref<any>();
const treeData = ref<IgetTreeSpace.Data[]>([]);
const defaultProps = ref({
  children: 'children',
  label: 'name',
});
const selectedAll = ref(false);
const selectedRows = ref<string[]>([]);
const tableData = ref<IpostUsersSpace.List[]>([]);
const cols = ref([
  { title: '#', slotName: 'tableIndex', headerSlotName: 'firstCol', width: '40px' },
  { title: '用户名', prop: 'username' },
  { title: '姓名', prop: 'name' },
  { title: '手机号', prop: 'phone' },
  { title: '操作', slotName: 'handle', align: 'center', width: '80px' },
]);
const tags = ref<IpostUsersSpace.List[]>([]);

const handleNodeClick = async(n: any) => {
  const res = await apiEventDetailObj.postUsers(n.id, 1, 999);
  tableData.value = res.data.list;
  handleSelectedRows();
  selectedRows.value = [];
  tableData.value.forEach(d => {
    if (tags.value.find(t => d.id === t.id)) {
      selectedRows.value.push(d.id as string);
    }
  });
};

const handleSelectedRows = () => {
  selectedAll.value = tableData.value.every(d => tags.value.find(t => d.id === t.id));
};

const selectAll = () => {
  if (selectedAll.value) {
    tableData.value.forEach(d => {
      if (!tags.value.find(t => d.id === t.id)) {
        tags.value.push(d);
      }
    });
    selectedRows.value = tableData.value.map(t => t.id) as string[];
  } else {
    tableData.value.forEach(d => {
      const idx = tags.value.findIndex(t => d.id === t.id);
      if (idx > -1) {
        tags.value.splice(idx, 1);
      }
    });
    selectedRows.value = [];
  }
};
const selectRow = (row: IpostUsersSpace.List) => {
  const index = tags.value.findIndex(ele => ele.id === row.id);
  if (index > -1) {
    tags.value.splice(index, 1);
  } else {
    tags.value.push(row);
  }
  handleSelectedRows();
};

const filterNode = (value: string, d: any) => {
  if (!value) return true;
  return d.orgName.indexOf(value) !== -1;
};

const handleClose = (id: string) => {
  tags.value.splice(tags.value.findIndex(t => t.id === id), 1);

  const idx = selectedRows.value.findIndex(t => t === id);
  if (idx > -1) {
    selectedRows.value.splice(idx, 1);
  }
  handleSelectedRows();
};

const getOrgTree = async() => {
  const { data: tree } = await apiEventDetailObj.getTree();
  treeData.value = tree;
};

const handleInvite = (row: IpostUsersSpace.List) => {
  const newUser =
  {
    strUserDomainCode: strUserDomainCode,
    strUserID: row.id + '' as string,
    strUserName: row.name,
    nDevType: 1
  };
  inviteNewUser(newUser);
};

const ok = async() => {
  // if (!tags.value.length) {
  //   HlMessage.warning('人员不能为空');
  //   return;
  // }

  // if (props.currentUserIsDefaultCheck) {
  //   const index = tags.value.findIndex(item => {
  //     return item.id === props.currentUserId;
  //   });
  //   if (index === -1) {
  //     HlMessage.warning({
  //       message: '当前登录用户不可删除,请重新选中',
  //     });
  //     return;
  //   }
  // }
  // dialogVisible.value = false;
  emit('cancel');
  // emit('confirm', cloneDeep(tags.value));
};

watch(filterOrgText, val => {
  orgTree.value.filter(val);
});

watch(() => props.selectedUsers, () => {
  tags.value = [...props.selectedUsers];
  handleSelectedRows();
}, {
  immediate: true,
  deep: true,
});

onMounted(() => {
  getOrgTree();
});
</script>

<style lang="scss">
.user-area {
  .user-footer {
    margin-top: calc(var(--xxl) * 0.6);
    text-align: right;
  }
}
</style>
