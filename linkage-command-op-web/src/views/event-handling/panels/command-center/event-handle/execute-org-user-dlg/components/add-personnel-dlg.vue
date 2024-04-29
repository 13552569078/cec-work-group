<template>
  <hl-dialog
    :model-value="true"
    :title="personId ?  '编辑人员' : '添加临时处置人员'"
    :borderless="false"
    :close-on-click-modal="false"
    width="calc(var(--xxl) * 18)"
    padding="var(--xl)"
    @close="$emit('cancel')"
  >
    <hl-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :width="['col-5','col-18']"
      :label-position="['items-right', 'items-middle']"
      item-gap="var(--lg)"
    >
      <hl-form-item label="头像" class="col grid-col-span-2">
        <hl-upload
          :action="uploadUrl"
          :show-file-list="false"
          :on-change="handleChangeUpload"
          :limit="1"
          :disabled="personId && !isTempUser"
          :class="{ 'is-disabled': personId && !isTempUser }"
        >
          <hl-thumb v-if="formData.profilePicture" radius :src="formData.profilePicture" fit="cover" />
          <div v-else class="text-center">
            <span class="upload-icon"></span>
            <div class="m-t-xxs upload-txt">上传头像</div>
          </div>
        </hl-upload>
      </hl-form-item>
      <hl-form-item label="姓名" prop="userName">
        <hl-input
          block
          v-model="formData.userName"
          placeholder="请输入内容"
          value-key="userName"
          maxlength="50"
          clearable
          :disabled="personId && !isTempUser"
        />
      </hl-form-item>
      <hl-form-item label="性别" prop="gender">
        <hl-radio-group v-model="formData.gender" :disabled="personId && !isTempUser" gap="var(--md)" type="primary" size="md">
          <hl-radio label="1">男</hl-radio>
          <hl-radio label="0">女</hl-radio>
          <hl-radio label="2">未知</hl-radio>
        </hl-radio-group>
      </hl-form-item>
      <hl-form-item v-if="isTempUser" label="所属机构" prop="orgName">
        <hl-input
          block
          v-model="formData.orgName"
          placeholder="请输入内容"
          value-key="orgName"
          maxlength="50"
        />
      </hl-form-item>
      <hl-form-item v-else label="所属机构" prop="orgId">
        <!-- <hl-input v-model="formData.orgName" placeholder="请输入" block disabled/> -->
        <hb-tree-selector
          class="personnel-tree-selector"
          ref="treeSelector"
          style="width: 100%"
          v-model="formData.orgId"
          :clearable="true"
          :collapse-tags="false"
          :tree-props="treeProps"
          :disabled="personId && !isTempUser"
        >
        </hb-tree-selector>
      </hl-form-item>
      <!-- <hl-form-item label="  " v-if="!personId">
        <hl-checkbox v-model="formData.addGroupOrg">同时添加到参与机构</hl-checkbox>
      </hl-form-item> -->
      <hl-form-item label="岗位职责" prop="roleIds" :label-position="['items-right', 'items-top']">
        <hl-group full gap="var(--sm)">
          <hl-select v-model="formData.roleIds" multiple placeholder="请选择" block popper-class="role-select-popper" style="overflow:hidden;">
            <hl-option
                v-for="item in roleList"
                :key="item.id"
                class="role-select-item"
                :label="item.roleName"
                :value="item.id"
              >
                <div>{{ item.roleName }}</div>
                <div class="text-secondary font-sm">{{item.roleDesc}}</div>
              </hl-option>
          </hl-select>
          <!-- <hl-button @click="addRole">添加岗位职责</hl-button> -->
        </hl-group>
      </hl-form-item>
      <hl-form-item label="工作职责">
        <hl-input v-model="formData.jobDescription" native-type="textarea" :rows="3" maxlength="250" show-word-limitblock block/>
      </hl-form-item>
      <hl-form-item label="联络方式" prop="communicationMode" :label-position="['items-right', 'items-top']">
        <hl-button v-if="!personId || isTempUser" class="m-b-md" effect="light" icon-position="left" @click="addDevice">
          添加联络方式
          <template #icon>
            <hl-icon>
              <fill-plus />
            </hl-icon>
          </template>
        </hl-button>
        <hl-group v-for="(item, index) in formData.communicationMode" :key="index" full style="padding-bottom: var(--xs)">
          <hl-select :disabled="personId && !isTempUser" v-model="item.mode">
            <hl-option v-for="ele in modeList" :key="ele.mode" :value="ele.mode" :label="ele.modeName" :disabled="ele.mode === 'system' && isTempUser" ></hl-option>
          </hl-select>
          <hl-input
            v-model="item.value"
            placeholder="请输入电话号码"
            :maxlength="item.mode == 'mobile' ? 11 : 30"
            clearable
            @keyup="() => { if (item.mode == 'mobile' || item.mode == 'phone') { item.value = item.value.replace(/[^\d]/g,'') }}"  block :disabled="personId && !isTempUser"
          >
          </hl-input>
          <hl-button effect="light" class="m-l-sm" equal @click.prevent="removeDevice(index)" :disabled="personId && !isTempUser">
            <template #icon>
              <hl-icon><two-delete /></hl-icon>
            </template>
          </hl-button>
        </hl-group>
      </hl-form-item>
    </hl-form>
    <template #footer>
      <span class="dialog-footer">
        <hl-button class="normal-width normal-height" @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="m-l-md normal-width normal-height" :loading="isLoading" @click="confirm">{{ form ? '保存' : '确定' }}</hl-button>
      </span>
    </template>
  </hl-dialog>
  <add-role-dlg v-if="dlgVisible" @cancel="dlgVisible=false" @confirm="roleConfirm" :eventCode="eventCode"></add-role-dlg>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, PropType, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { FormInstance, HlMessageBox, HlMessage, UploadFile } from 'hongluan-ui';
import { GlobalAPI } from '@/common';
import { apiRoleManagementObj } from '@/apis/modules/role-management';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { IgetFindOrgTreeSpace } from '@/apis/modules/user-center/model';
import { IpostFindCommandSysCommunicationMetadataSpace } from '@/apis/modules/command-center/model';
import { IpostFindCommandSysUserPoolRolePageSpace } from '@/apis/modules/role-management/model';
import { AddRoleDlg } from './index';

const props = defineProps({
  form: {
    type: Object,
  },
  groupId: {
    type: String
  },
  personId: {
    type: String
  },
  strategyInfoId: String,
  isAddTempUser: {
    type: Boolean,
    default: false,
  }
});
const emit = defineEmits(['cancel', 'confirm']);

const route = useRoute();

const treeProps = reactive({
  nodeKey: 'id',
  props: {
    label: 'orgName',
  },
  checkStrictly: true,
  data: [] as IgetFindOrgTreeSpace.Data[]
});

const dlgVisible = ref(false);

const uploadUrl = GlobalAPI.config.BASE_URL + '/swan-file/files';
const isSelectUser = ref(false);
const outerVisible = ref(true);
const formRef = ref<FormInstance>();
const formData = ref<Record<string, any>>({
  groupId: props.groupId,
  strategyInfoId: props.strategyInfoId,
  userName: '',
  gender: '',
  addGroupOrg: false,
  addUser: false,
  orgId: '',
  orgName: '',
  roleIds: [],
  communicationMode: [],
  jobDescription: '',
  assembleStatus: 0,
});
const orgId = ref('');
const isLoading = ref(false);
const modeList = ref<IpostFindCommandSysCommunicationMetadataSpace.Data[]>([]);
const roleList = ref<IpostFindCommandSysUserPoolRolePageSpace.List[]>([]);
const isEditTempUser = ref(false);

const isTempUser = computed(() => {
  return props.isAddTempUser || isEditTempUser.value;
});

const checkDevice = (_: any, value: any, callback: (err?: Error) => void) => {
  const mobileItems = formData.value.communicationMode.filter((ele: { value: string, mode: string }) => {
    return ele.mode === 'mobile';
  });
  const hasMobileVals = mobileItems.filter((ele: { value: string, mode: string }) => {
    return ele.value;
  });
  const mobilReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
  const isLegalMobiles = hasMobileVals.filter((ele: { value: string, mode: string }) => {
    return mobilReg.test(ele.value);
  });
  if (mobileItems.length === 0 || mobileItems.length !== hasMobileVals.length) {
    callback(new Error('联络方式移动电话必填'));
  } else {
    if (isLegalMobiles.length === 0 || isLegalMobiles.length !== hasMobileVals.length) {
      callback(new Error('移动电话格式不正确'));
    } else {
      const deviceListEmpty = !!formData.value.communicationMode.find((ele: { value: number; }) => !ele.value);
      if (deviceListEmpty) {
        callback(new Error('号码不可为空'));
      } else {
        callback();
      }
    }
  }
};
const rules = {
  userName: [{ required: true, message: '姓名不能为空' }],
  orgId: [{ required: true, message: '所属机构不能为空' }],
  communicationMode: [{ required: true, validator: checkDevice }],
};

const handleSelect = (item: any) => {
  isSelectUser.value = true;
  Object.assign(formData.value, item, { userName: item.userName, userId: item.id });
};

const handleChangeName = (value: string) => {
  isSelectUser.value = false;
};

const getModeList = async() => {
  const res = await apiCommandCenterObj.postFindCommandSysCommunicationMetadata('user');
  modeList.value = res.data;
};

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

const getOrgData = async() => {
  const { data: tree } = await apiUserCenterObj.getFindOrgTree();
  treeProps.data = tree;
  await nextTick();
  formData.value.orgId = orgId.value;
};

const getDetail = async() => {
  if (!props.personId) return;
  const res = await apiCommandCenterObj.postFindStrategyCommandUserById(props.personId);
  if (res.data.communicationMode && Array.isArray(res.data.communicationMode)) {
    isEditTempUser.value = !res.data.communicationMode.find((i: any) => i.mode === 'system');
  }
  formData.value = {
    ...res.data,
    roleIds: res.data.roleIds ? res.data.roleIds.split(',') : []
  };
  orgId.value = res.data.orgId + '';
  formData.value.orgId = '';
  if (res.data.jobDescription) {
    formData.value.jobDescription = res.data.jobDescription;
  } else {
    if (res.data.roleIds.length > 0) {
      formData.value.jobDescription = (res.data.roleIds.split(',').map(d => roleList.value.find(ele => ele.id === d)?.roleDesc)).join(',');
    }
  }
};

const handleChangeUpload = (file: UploadFile) => {
  if (file.status === 'success') {
    const { dirUrl } = (file.response! as Record<string, any>).data;
    formData.value.profilePicture = `${GlobalAPI.config.FILE_VIEW}/${dirUrl}`;
  }
};

const addDevice = () => {
  if (formData.value.communicationMode.length > 10) {
    HlMessage.warning('最多添加10条数据');
    return;
  }
  formData.value.communicationMode.push({ value: '', mode: 'mobile' });
};

const removeDevice = (index: number) => {
  formData.value.communicationMode.splice(index, 1);
};

const addRole = () => {
  dlgVisible.value = true;
};

const roleConfirm = () => {
  dlgVisible.value = false;
  getRoleList();
};

const confirm = async() => {
  const isValid = await formRef.value?.validate();
  if (isValid) {
    isLoading.value = true;
    try {
      formData.value.orgName = (isEditTempUser.value || isTempUser) ? formData.value.orgName : getOrgName(formData.value.orgId, treeProps.data);
      if (props.personId) {
        // 编辑
        const params = { ...formData.value };
        await apiCommandCenterObj.postModifyStrategyCommandUser(params);
      } else {
        // 新增
        const params = Object.assign({}, formData.value);
        params.addUser = false;
        await apiCommandCenterObj.postAddStrategyCommandUser(params);
      }
    } finally {
      isLoading.value = false;
    }
    HlMessage.success('成功');
    emit('confirm');
  }
};
const getOrgName = (_orgId: string, list: IgetFindOrgTreeSpace.Data[]) => {
  let name: string = '';
  for (let i = 0; i < list.length; i++) {
    const { id, orgName, children } = list[i];
    if (id === _orgId) {
      return orgName;
    } else {
      name = getOrgName(_orgId, children);
      if (name) {
        return name;
      }
    }
  }
  return name;
};

watch(() => formData.value.roleIds, () => {
  if (!formData.value.jobDescription && formData.value.roleIds.length > 0) {
    formData.value.jobDescription = roleList.value.find(ele => ele.id === formData.value.roleIds[0])?.roleDesc;
  }
}, {
  deep: true,
  immediate: true
});

onMounted(() => {
  getOrgData();
  getDetail();
  getModeList();
  getRoleList();
});
</script>
<style scoped lang="scss">
:deep(.hl-upload) {
  .handle-text {
    width: calc(var(--xxs) * 30);
    height: calc(var(--xxs) * 30);
    background: rgba(0,158,247,0.12);
    border-radius: var(--xxs);
    border: 1px solid #06558C;
    align-items: center;
    justify-content: center;
    .hl-thumb {
      width: 100%;
      height: 100%;
    }
    .upload-icon {
      display: inline-block;
      width: var(--xl);
      height: var(--xl);
      background-image: url(@/assets/images/common/upload-icon.png);
      background-size: 100% 100%;
    }
  }
  &.is-disabled {
    .handle-text {
      background: rgba(0,158,247,0.08);
      border: 1px solid #014371;
      .upload-icon {
        background-image: url(@/assets/images/common/upload-disabled-icon.png);
      }
      .upload-txt {
        color: #6F8EA8;
      }
    }
  }
}
</style>
<style lang="scss">
.personnel-tree-selector .input-affixe.prefix {
  display: none;
}
</style>
