<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}政府灾害管理能力`"
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
      :width="['col-24', 'col-24']"
      class="m-l-sm count-2 grid grid-direction-vertical hl-row"
      style="--row-gap-x: calc(var(--xxs) * 5); --row-gap-y: calc(var(--xxs) * 5)"
    >
      <hl-form-item label="单位名称" prop="resName">
        <hl-input
          v-model="formData.resName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="机构编码" prop="institutionCode">
        <hl-input
          v-model="formData.institutionCode"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="单位地址" prop="address">
        <hl-group class="w-full">
          <hl-input
            v-model="formData.address"
            :disabled="pageDisabled"
            placeholder="请输入"
            :maxlength="100"
            block
            show-word-limit
          />
          <!-- <hl-button type="primary" :disabled="pageDisabled" @click="locMapDlgShow = true" equal>
            <hl-icon>
              <TwoPoint />
            </hl-icon>
          </hl-button> -->
        </hl-group>
      </hl-form-item>
      <hl-form-item label="单位级别" prop="unitLevel">
        <hl-select
          v-model="formData.unitLevel"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.AGENCY_LEVEL"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="灾害管理领域" prop="disasterManagementField">
        <hl-select
          v-model="formData.disasterManagementField"
          :disabled="pageDisabled"
          clearable
          multiple
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.DISASTER_MGMT_DOMAIN"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="直属涉灾事业单位数" prop="publicInstitutionsNumber">
        <hl-input
          v-model="formData.publicInstitutionsNumber"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="灾害管理人员总数" prop="disasterManagementPersonnelTotal">
        <hl-input
          v-model="formData.disasterManagementPersonnelTotal"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="正式聘用专家总数" prop="officiallyEmployedExpertsTotal">
        <hl-input
          v-model="formData.officiallyEmployedExpertsTotal"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="制定的防灾减灾规划数量" prop="disasterPreventionReductionPlansNumber">
        <hl-input
          v-model="formData.disasterPreventionReductionPlansNumber"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="规划名称" prop="planName">
        <hl-input
          v-model="formData.planName"
          :disabled="pageDisabled"
          :maxlength="100"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="规划制定时间" prop="planFormulationTime">
        <hl-date-picker
          v-model="formData.planFormulationTime"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="date"
          value-format="YYYY-MM-DD"
          block
        />
      </hl-form-item>
      <hl-form-item label="灾害相关预案总数" prop="disasterRelatedPlansNumber">
        <hl-input
          v-model="formData.disasterRelatedPlansNumber"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="支出年度" prop="expenditureYear">
        <hl-date-picker
          v-model="formData.expenditureYear"
          :disabled="pageDisabled"
          placeholder="请选择"
          value-format="YYYY"
          type="year"
          block
        />
      </hl-form-item>
      <hl-form-item label="教育支出（万元）" prop="educationExpenditure">
        <hl-input
          v-model="formData.educationExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="科学技术支出（万元）" prop="scienceTechnologyExpenditure">
        <hl-input
          v-model="formData.scienceTechnologyExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="农林水支出（万元）" prop="agricultureForestryWaterExpenditure">
        <hl-input
          v-model="formData.agricultureForestryWaterExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="自然资源海洋气象等支出（万元）" prop="naturalMarineMeteorologyExpenditure">
        <hl-input
          v-model="formData.naturalMarineMeteorologyExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="粮油物资储备支出（万元）" prop="grainOilMaterialReservesExpenditure">
        <hl-input
          v-model="formData.grainOilMaterialReservesExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="灾害防治及应急支出（万元）" prop="disasterPreventionEmergencyExpenditures">
        <hl-input
          v-model="formData.disasterPreventionEmergencyExpenditures"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="应急管理服务（万元）" prop="emergencyManagementServices">
        <hl-input
          v-model="formData.emergencyManagementServices"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="自然灾害防治支出（万元）" prop="naturalDisasterPreventionControlExpenditure">
        <hl-input
          v-model="formData.naturalDisasterPreventionControlExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="自然灾害救助及恢复重建支出（万元）" prop="naturalDisasterReliefRecoveryReconstructionExpenditure">
        <hl-input
          v-model="formData.naturalDisasterReliefRecoveryReconstructionExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="单位负责人" prop="personName">
        <hl-input
          v-model="formData.personName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="填报日期" prop="fillDate">
        <hl-date-picker
          v-model="formData.fillDate"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="date"
          value-format="YYYY-MM-DD"
          block
        />
      </hl-form-item>
      <div v-if="params.type !== 'add'" class="hl-row col-span-2">
        <div class="display-flex items-between m-b-sm">
          <span class="font-bold">政府灾害相关预案</span>
          <hl-link v-if="!pageDisabled" type="primary" @click="showPlanDlg=true">+ &nbsp; 添加</hl-link>
        </div>
        <hl-simple-table :cols="cols" :data="planList" class="w-full">
          <template #tableIndex="{ rowIndex }">{{ rowIndex + 1 }}</template>
        </hl-simple-table>
      </div>
    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button v-if="params.type !== 'detail'" class="m-l-lg" type="primary" @click="handleOK"
          >确定</hl-button
        >
      </div>
    </template>
  </hl-dialog>
  <location-map
    v-if="locMapDlgShow"
    :longitude="formData.longitude"
    :latitude="formData.latitude"
    @cancel="locMapDlgShow = false"
    @ok="selectMapPoint"
  />
  <AddPlanDlg v-if="showPlanDlg" @ok="addPlanItem" @cancel="showPlanDlg=false" />
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { HlMessage } from "hongluan-ui";
import { ACTION_TYPE_DES_MAP, validatorInt, validatorMobile, validatorLongitude, validatorLatitude, } from "@/common";
import { LocationMap } from "@/components";
import { useAreaTree } from '@/hooks';
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import { apiAreaCodeObj } from '@/apis/modules/area';
import { DICT } from "../generic-methods";
import AddPlanDlg from './add-plan-dlg.vue';
import type { PropType } from "vue";
import type { FormInstance } from "hongluan-ui";
import type { IlistSpace } from '@/apis/modules/area/model';
import type { IpostFindDisasterCommunityReductionByIdSpace, IpostFindDisasterGovernmentManagementPlanPageSpace } from '@/apis/modules/basic-information/model';
import type { IpostFindCommunityByAreaCodeSpace } from '@/apis/modules/area/model';
import type { ActionType } from '@/types';

const props = defineProps({
  params: {
    type: Object as PropType<{
      id: string;
      type: ActionType;
    }>,
    default: () => {
      return {
        id: "",
        type: "",
      };
    },
  },
  areaCodeList: {
    type: Array as PropType<IlistSpace.Data[]>,
    default: () => { return []; }
  }
});
const emit = defineEmits(["cancel", "refresh"]);

const { areaProps } = useAreaTree();

const locMapDlgShow = ref(false);
const intValidator = [{ message: "请输入整数", validator: validatorInt }];
const formRef = ref<FormInstance>();
const formData = ref({} as Record<string, any>);
const rules = ref({
  resName: [{ required: true, message: "请输入园区名称", trigger: "blur" }],
  areaCode: [{ required: true, message: "请选择所属区域", trigger: "blur" }],
  personMobile: [{ message: "请输入11位手机号码", validator: validatorMobile }],
  publicInstitutionsNumber: intValidator,
  disasterManagementPersonnelTotal: intValidator,
  officiallyEmployedExpertsTotal: intValidator,
  disasterPreventionReductionPlansNumber: intValidator,
  disasterRelatedPlansNumber: intValidator,
});
const pageDisabled = computed(() => props.params.type === "detail");

const showPlanDlg = ref(false);
const cols = [
  {
    title: "序号",
    slotName: "tableIndex",
    prop: "tableIndex",
    align: "center",
    width: "30px",
  },
  { title: '预案名称', prop: 'resName', align: 'center' },
  { title: '预案制定或最新修订的时间', prop: 'planDate', align: 'center' }
];
const planList = ref<IpostFindDisasterGovernmentManagementPlanPageSpace.List[]>([]);

const selectMapPoint = (info: Record<string, any>) => {
  const { latitude, longitude, address } = info;
  locMapDlgShow.value = false;
  formData.value.longitude = longitude;
  formData.value.latitude = latitude;
  formData.value.lnglat = [longitude, latitude];
  formData.value.address = address;
};
const handleOK = async() => {
  await formRef.value?.validate();

  if (["add", "edit"].includes(props.params.type)) {
    const text = props.params.type === "add" ? "新增成功" : "编辑成功";
    const addParams = {
      disasterManagementField: Array.isArray(formData.value.disasterManagementField) ? formData.value.disasterManagementField.join(',') : '',
    };
    await apiBasicInformationObj[props.params.type === "add" ? 'postAddDisasterGovernmentManagement' : 'postModifyDisasterGovernmentManagement']({
      ...formData.value,
      ...addParams
    } as any);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};
const addPlanItem = async(plan: Record<string, string>) => {
  await apiBasicInformationObj.postAddDisasterGovernmentManagementPlan({
    disasterGovernmentManagementId: props.params.id,
    ...plan,
  });
  showPlanDlg.value = false;
  loadPlans();
};
const loadPlans = async() => {
  const { data: data2 } = await apiBasicInformationObj.postFindDisasterGovernmentManagementPlanPage(props.params.id);
  planList.value = data2;
};
const initFormData = async() => {
  if (props.params.type !== 'add') {
    const { data } = await apiBasicInformationObj.postFindDisasterGovernmentManagementById(props.params.id);
    formData.value = {
      ...data,
      disasterManagementField: data.disasterManagementField.split(',').filter(Boolean),
      // lnglat: [data.longitude, data.latitude]
    };

    loadPlans();
  }
};

onMounted(async() => {
  await initFormData();
});
</script>
