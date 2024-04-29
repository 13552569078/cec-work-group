<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[actionType]}重大危险源`"
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 260)"
    @close="$emit('cancel')"
  >
    <hl-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      class="m-l-sm count-2 grid grid-direction-vertical hl-row"
      style="--row-gap-x: calc(var(--xxs) * 5);--row-gap-y: calc(var(--xxs) * 5)"
    >
      <hl-form-item label="重大危险源名称" prop="name">
        <hl-input v-model="formData.name" :disabled="actionType==='detail'" :maxlength="50" placeholder="请输入" block show-word-limit></hl-input>
      </hl-form-item>
      <hl-form-item label="所在企业" prop="companyId">
        <hl-select v-model="formData.companyId" :disabled="actionType==='detail'" clearable filterable placeholder="请选择" block >
          <hl-option v-for="item in companyList" :key="item.id" :label="item.companyName" :value="item.id" />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="重大危险源位置" prop="address" class="col-span-2">
        <hl-input v-model="formData.address" :disabled="actionType==='detail'" :maxlength="50" placeholder="请输入" block show-word-limit></hl-input>
      </hl-form-item>
      <hl-form-item label="重大危险源描述" prop="remark" class="col-span-2">
        <hl-input v-model="formData.remark" :disabled="actionType==='detail'" native-type="textarea" :maxlength="200" placeholder="请输入" block show-word-limit></hl-input>
      </hl-form-item>
    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button v-if="actionType!=='detail'" class="m-l-lg" type="primary" @click="handleOK">确定</hl-button>
      </div>
    </template>
  </hl-dialog>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { HlMessage } from 'hongluan-ui';
import type { FormInstance } from 'hongluan-ui';
import { ACTION_TYPE_DES_MAP, MAX_PAGE_SIZE } from '@/common';
import { apiMajorHazardManagementObj } from '@/apis/modules/major-hazard-management';
import { IpostFindMajorHazardPageSpace } from '@/apis/modules/major-hazard-management/model';
import { IpostFindCompanyPageSpace } from '@/apis/modules/enterprise-management/model';
import { apiEnterpriseManagementObj } from '@/apis/modules/enterprise-management';

const props = defineProps({
  actionType: {
    type: String,
  },
  editId: {
    type: String,
  },
});
const emit = defineEmits(['cancel', 'refresh']);

const formRef = ref<FormInstance>();
const formData = ref({} as IpostFindMajorHazardPageSpace.List);
const rules = ref({
  name: [{ required: true, message: '请输入', trigger: 'blur' }],
  companyId: [{ required: true, message: '请选择', trigger: 'change' }],
});
const companyList = ref([] as IpostFindCompanyPageSpace.List[]);

const handleOK = async() => {
  await formRef.value?.validate();
  if (props.actionType === 'add') {
    await apiMajorHazardManagementObj.postAddMajorHazard(formData.value);
    HlMessage.success('新增成功');
    emit('cancel');
    emit('refresh');
  }
  if (props.actionType === 'edit') {
    await apiMajorHazardManagementObj.postModifyMajorHazard(formData.value);
    HlMessage.success('编辑成功');
    emit('cancel');
    emit('refresh');
  }
};

const initFormData = async() => {
  if (props.actionType !== 'add') {
    const { data } = await apiMajorHazardManagementObj.postFindMajorHazardById(String(props.editId));
    formData.value = data;
  }
};
const initCompanyList = async() => {
  const { data } = await apiEnterpriseManagementObj.postFindCompanyPage({ pageSize: MAX_PAGE_SIZE, currentPage: 1 });
  companyList.value = data.list;
};
initCompanyList();
initFormData();

</script>