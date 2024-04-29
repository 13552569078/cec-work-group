<template>
  <hl-dialog
    :model-value="true"
    :title="editId ?  '编辑岗位职责' : '新增岗位职责'"
    :borderless="false"
    :close-on-click-modal="false"
    width="calc(var(--xxl) * 15)"
    padding="var(--xl)"
    @close="$emit('cancel')"
  >
    <hl-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-position="['items-left', 'items-middle']"
    >
      <hl-form-item label="岗位职责名称" prop="roleName">
        <hl-input v-model="formData.roleName" placeholder="请输入岗位职责名称" block maxlength="50"/>
      </hl-form-item>
      <hl-form-item label="岗位职级" prop="level">
        <hl-input v-model="formData.level" placeholder="请输入岗位职级" block :min="1" native-type="number" />
      </hl-form-item>
      <hl-form-item label="数量限制" prop="roleLimitNum">
        <hl-group v-if="isLimit === '1'" full="full-x">
          <hl-select v-model="isLimit">
            <hl-option value="1" label="限制"></hl-option>
            <hl-option value="2" label="不限制"></hl-option>
          </hl-select>
          <hl-input class="personnel-limit-input" v-if="isLimit === '1'" v-model="formData.roleLimitNum" placeholder="数量限制" block :min="1" native-type="number">
            <template #suffix>
              <span>个</span>
            </template>
          </hl-input>
          <span></span>
        </hl-group>

        <hl-group v-if="isLimit === '2'" full="full-x">
          <hl-select v-model="isLimit">
            <hl-option value="1" label="限制"></hl-option>
            <hl-option value="2" label="不限制"></hl-option>
          </hl-select>
          <hl-input class="personnel-limit-input" v-model="noLimitString" placeholder="数量限制" block disabled>
            <template #suffix>
              <span>个</span>
            </template>
          </hl-input>
        </hl-group>
      </hl-form-item>
      <hl-form-item label="岗位职责说明" prop="roleDesc">
        <hl-input v-model="formData.roleDesc" placeholder="请输入岗位职责说明" native-type="textarea" maxlength="50" :rows="5" show-word-limit block />
      </hl-form-item>
    </hl-form>
    <template #footer>
      <span class="dialog-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="m-l-md" :loading="isLoading" @click="confirm">{{ editId ? '保存' : '确定' }}</hl-button>
      </span>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, PropType, reactive, ref, watch } from 'vue';
import { FormInstance } from 'hongluan-ui';
import { apiRoleManagementObj } from '@/apis/modules/role-management';
import { IgetEventTreeSpace, IgetFindUsedEventTypeSpace } from '@/apis/modules/role-management/model';

const props = defineProps({
  editId: {
    type: String,
  },
  eventTypeList: {
    type: Array as PropType<IgetFindUsedEventTypeSpace.Data[]>,
  },
  eventCode: {
    type: String
  }
});
const emit = defineEmits(['cancel', 'confirm']);

const formRef = ref<FormInstance>();
const formData = ref<any>({
  roleName: '',
  level: '',
  roleLimitNum: 1,
  roleDesc: '',
});
const isLimit = ref('1');
const noLimitString = '不限';
const isLoading = ref(false);
const rules = {
  roleName: [{ required: true, message: '岗位职责名称不能为空' }],
  roleLimitNum: [{ required: true, message: '数量限制不能为空' }],
  level: [{ required: true, message: '岗位职级不能为空' }],
};

const handleNodeClick = (data: any) => {
  console.log(data);
};
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

const confirm = async() => {
  console.log(formData.value);
  const isValid = await formRef.value?.validate();
  if (isValid) {
    isLoading.value = true;
    if (isLimit.value === '2') {
      formData.value.roleLimitNum = -1;
    }
    try {
      if (props.editId) {
        // 编辑
        await apiRoleManagementObj.postModifyCommandSysUserPoolRole(formData.value);
      } else {
        // 新增
        await apiRoleManagementObj.postAddCommandSysUserPoolRole(
          Object.assign({}, formData.value)
        );
      }
    } finally {
      isLoading.value = false;
    }
    emit('confirm');
  }
};

const getDetail = async() => {
  if (!props.editId) return;
  const res = await apiRoleManagementObj.postFindCommandSysUserPoolRoleById(props.editId);
  nextTick(() => {
    formData.value = {
      ...res.data,
    };
    if (formData.value.roleLimitNum < 0) isLimit.value = '2';
  });
};

onMounted(async() => {
  await getDetail();
});
</script>

<style lang="scss">
  .personnel-limit-input {
    padding-left: 0 !important;
    padding-right: 0 !important;
    .input-affixe.prefix {
      margin-left: 0 !important;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .input-affixe.suffix {
      margin-right: 0 !important;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      background: var(--panel-bg-color);
    }
    .input-affixe {
      padding: 0 12px;
      height: 100%;
      background:#F6F9FB;;
      margin-left: 0;
    }
  }

  .hb-tree-selector-popper .selector-dropdown-wrap {
    max-height: 240px;
    min-height: 150px;
  }
  .personnel-tree-selector .input-affixe.prefix{
    display: none;
  }
</style>
