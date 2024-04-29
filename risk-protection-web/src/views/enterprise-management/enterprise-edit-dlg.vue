<template>
  <hl-dialog
    :title="title"
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 260)"
    @close="$emit('cancel')"
  >
    <hl-scrollbar height="calc(var(--xxs) * 150)">
      <hl-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        class="m-l-sm count-2 grid grid-direction-vertical hl-row p-b-sm"
        style="--row-gap-x: calc(var(--xxs) * 5);--row-gap-y: calc(var(--xxs) * 5)"
      >
        <hl-form-item label="企业名称" prop="companyName">
          <hl-input v-model="formData.companyName" :disabled="actionType==='detail'" :maxlength="50" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="统一社会信息代码" prop="companyCode">
          <hl-input v-model="formData.companyCode" :disabled="actionType!=='add'" :maxlength="30" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="所属区域" prop="areaCode">
          <hl-cascader
            v-model="formData.areaCode"
            :disabled="actionType==='detail'"
            :props="areaProps"
            :options="areaTreeData"
            placeholder="请选择"
            block
            :show-all-levels="false"
          />
        </hl-form-item>
        <hl-form-item label="成立日期" prop="establishTime">
          <hl-date-picker v-model="formData.establishTime" :disabled="actionType==='detail'" placeholder="请选择" type="date" value-format="YYYY-MM-DD" block/>
        </hl-form-item>
        <hl-form-item label="注册登记时间" prop="regTime">
          <hl-date-picker v-model="formData.regTime" :disabled="actionType==='detail'" placeholder="请选择" type="date" value-format="YYYY-MM-DD" block/>
        </hl-form-item>
        <hl-form-item label="资产总额（万元）" prop="assets">
          <hl-input v-model="formData.assets" :disabled="actionType==='detail'" :maxlength="20" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="经营范围" prop="businessScope" class="col-span-2">
          <hl-input v-model="formData.businessScope" :disabled="actionType==='detail'" native-type="textarea" :maxlength="500" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="法定代表人" prop="legalPerson">
          <hl-input v-model="formData.legalPerson" :disabled="actionType==='detail'" :maxlength="30" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="法定代表人联系方式" prop="legalPersonPhone">
          <hl-input v-model.trim="formData.legalPersonPhone" :disabled="actionType==='detail'" :maxlength="11" placeholder="请输入" block></hl-input>
        </hl-form-item>
        <hl-form-item label="企业联系人" prop="principalPerson">
          <hl-input v-model="formData.principalPerson" :disabled="actionType==='detail'" :maxlength="30" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="企业联系方式" prop="principalPersonPhone">
          <hl-input v-model.trim="formData.principalPersonPhone" :disabled="actionType==='detail'" :maxlength="11" placeholder="请输入" block></hl-input>
        </hl-form-item>
        <hl-form-item label="企业类型" prop="category">
          <hl-select v-model="formData.category" block disabled>
            <hl-option v-for="item in GlobalAPI.config?.JINGXIANDICT?.ENTERPRISE_TYPE || []" :key="item.value" :label="item.label" :value="item.value" />
          </hl-select>
        </hl-form-item>
        <hl-form-item label="安监行业类别" prop="ajCategory">
          <hl-select v-model="formData.ajCategory" block :disabled="actionType==='detail'">
            <hl-option v-for="item in GlobalAPI.config?.JINGXIANDICT?.AJ_CATEGORY || []" :key="item.value" :label="item.label" :value="item.value" />
          </hl-select>
        </hl-form-item>
        <hl-form-item label="注册地址" prop="regAddress">
          <hl-input v-model="formData.regAddress" :disabled="actionType==='detail'" :maxlength="100" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="安全许可证" prop="securityLicense">
          <hl-input v-model="formData.securityLicense" :disabled="actionType==='detail'" :maxlength="30" placeholder="请输入" block show-word-limit></hl-input>
        </hl-form-item>
        <hl-form-item label="标准化等级" prop="securityLevel">
          <hl-select v-model="formData.securityLevel" block :disabled="actionType==='detail'">
            <hl-option v-for="item in GlobalAPI.config?.JINGXIANDICT?.GENERAL_LEVEL || []" :key="item.value" :label="item.label" :value="item.value" />
          </hl-select>
        </hl-form-item>
        <hl-form-item label="安全许可证有效期" prop="securityLicenseValidity">
          <hl-date-picker v-model="formData.securityLicenseValidity" :disabled="actionType==='detail'" placeholder="请选择" type="date" value-format="YYYY-MM-DD" block/>
        </hl-form-item>
        <hl-form-item label="通信地址" prop="address">
          <hl-group full>
            <hl-input v-model="formData.address" :disabled="actionType==='detail'" :maxlength="100" placeholder="请输入" block show-word-limit></hl-input>
              <hl-button class="static" equal @click="showMapDlg">
                <template #icon>
                  <hl-icon>
                    <two-Point />
                  </hl-icon>
                </template>
              </hl-button>
          </hl-group>
        </hl-form-item>
        <hl-form-item label="经纬度" prop="lnglat">
          <hl-group full class="items-middle">
            <hl-input v-model="formData.longitude" :disabled="actionType==='detail'" placeholder="请输入"></hl-input><span class="m-x-sm self-no-full">-</span><hl-input v-model="formData.latitude" :disabled="actionType==='detail'" placeholder="请输入"></hl-input>
          </hl-group>
        </hl-form-item>
      </hl-form>
    </hl-scrollbar>
   
    <template #footer>
      <div class="dlg-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button v-if="actionType!=='detail'" class="m-l-lg" type="primary" @click="handleOK">确定</hl-button>
      </div>
    </template>
    <location-map v-if="mapDlgVisible" :longitude="formData.longitude" :latitude="formData.latitude" @cancel="mapDlgVisible=false" @ok="markPoint" />
  </hl-dialog>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { HlMessage } from 'hongluan-ui';
import type { FormInstance } from 'hongluan-ui';
import { GlobalAPI } from '@/common';
import { useAreaTree } from '@/hooks';
import { LocationMap } from '@/components';
import { apiEnterpriseManagementObj } from '@/apis/modules/enterprise-management';
import { IpostFindCompanyPageSpace } from '@/apis/modules/enterprise-management/model';

const props = defineProps({
  enterpriseType: {
    type: String,
  },
  actionType: {
    type: String,
  },
  enterpriseTypeDesc: {
    type: String,
  },
  enterpriseId: {
    type: String,
  }
});
const emit = defineEmits(['cancel', 'refresh']);

const { areaProps, areaTreeData } = useAreaTree();

const title = computed(() => {
  let titleStr;
  switch(props.actionType) {
    case 'detail':
      titleStr = `查看${props.enterpriseTypeDesc}`;
      break;
    case 'add':
      titleStr = `新增${props.enterpriseTypeDesc}`;
      break;
    case 'edit':
      titleStr = `编辑${props.enterpriseTypeDesc}`;
      break;
  }
  return titleStr;
});
const formRef = ref<FormInstance>();
const formData = ref({
  category: props.enterpriseType,
} as IpostFindCompanyPageSpace.List);
const validatorPhone = (rule: any, value: string, callback: (err?: Error) => void) => {
  if (value && (Number.isNaN(+value) || value.indexOf('.') !== -1 || +value < 0 || value.length < 11)) {
    callback(new Error('联系方式格式有误，请重新输入'));
  } else {
    callback();
  }
};
const validatorlnglat = (rule: any, value: string, callback: (err?: Error) => void) => {
  if (formData.value.longitude && Number.isNaN(+formData.value.longitude) || formData.value.latitude && Number.isNaN(+formData.value.latitude)) {
    callback(new Error('请正确填写地理坐标'));
  } else {
    callback();
  }
};
const validatorPositiveNumber = (rule: any, value: string, callback: (err?: Error) => void) => {
  if (value && (Number.isNaN(+value) || +value <= 0)) {
    callback(new Error('格式有误，请输入正数'));
  } else {
    callback();
  }
};
const rules = ref({
  companyName: [{ required: true, message: '请输入', trigger: 'blur' }],
  companyCode: [{ required: true, message: '请输入', trigger: 'blur' }],
  areaCode: [{ required: true, message: '请选择', trigger: 'change' }],
  category: [{ required: true, message: '请选择', trigger: 'change' }],
  legalPersonPhone: [{ trigger: 'blur', validator: validatorPhone }],
  principalPersonPhone: [{ trigger: 'blur', validator: validatorPhone }],
  lnglat: [{ trigger: 'blur', validator: validatorlnglat }],
  assets: [{ trigger: 'blur', validator: validatorPositiveNumber}]
});
const mapDlgVisible = ref(false);

const showMapDlg = () => {
  mapDlgVisible.value = true;
};
const markPoint = (result: Record<string, any>) => {
  mapDlgVisible.value = false;
  formData.value.address = result.address;
  formData.value.longitude = result.longitude + '';
  formData.value.latitude = result.latitude + '';
};
const handleOK = async() => {
  await formRef.value?.validate();
  console.error('校验通过', formData.value);
  if (props.actionType === 'add') {
    await apiEnterpriseManagementObj.postAddCompany(formData.value);
    HlMessage.success('新增成功');
    emit('cancel');
    emit('refresh');
  }
  if (props.actionType === 'edit') {
    await apiEnterpriseManagementObj.postModifyCompany(formData.value);
    HlMessage.success('编辑成功');
    emit('cancel');
    emit('refresh');
  }
};

const initFormData = async() => {
  if (props.actionType !== 'add') {
    const { data } = await apiEnterpriseManagementObj.postFindCompanyById(String(props.enterpriseId));
    formData.value = data;
  }
};
initFormData();

</script>
