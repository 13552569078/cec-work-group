<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}社会组织减灾能力`"
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
      <hl-form-item label="组织名称" prop="resName">
        <hl-input
          v-model="formData.resName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="统一社会信用代码" prop="companyCode">
        <hl-input
          v-model="formData.companyCode"
          :disabled="pageDisabled || params.type === 'edit'"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
          @blur="check"
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="所属区域" prop="areaCode">
        <hl-cascader
          v-model="formData.areaCode"
          :disabled="pageDisabled"
          :props="areaProps"
          :options="areaCodeList"
          placeholder="请选择"
          block
          :show-all-levels="false"
        />
      </hl-form-item>
      <hl-form-item label="组织级别" prop="orgLevel">
        <hl-select
          v-model="formData.orgLevel"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.ORG_LEVEL"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="机构类型" prop="institutionType">
        <hl-select
          v-model="formData.institutionType"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.ORG_TYPE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="机构类型其他说明" prop="institutionOtherDesc">
        <hl-input
          v-model="formData.institutionOtherDesc"
          :disabled="pageDisabled"
          :maxlength="100"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="注册时间" prop="registerDate">
        <hl-date-picker
          v-model="formData.registerDate"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="date"
          value-format="YYYY-MM-DD"
          block
        />
      </hl-form-item>
      <hl-form-item label="注册地址" prop="registerAddress">
        <hl-group class="w-full">
          <hl-input
            v-model="formData.registerAddress"
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
      <hl-form-item label="登记机关类型" prop="officeType">
        <hl-select
          v-model="formData.officeType"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.REG_AUTH_TYPE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="登记机关类型其他说明" prop="officeOtherDesc">
        <hl-input
          v-model="formData.officeOtherDesc"
          :disabled="pageDisabled"
          :maxlength="100"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="登记机关" prop="officeName">
        <hl-input
          v-model="formData.officeName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="主管业务部门" prop="chargeOfficeName">
        <hl-input
          v-model="formData.chargeOfficeName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="专职人员人数" prop="fullNum">
        <hl-input
          v-model="formData.fullNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="注册志愿者数" prop="volunteerNum">
        <hl-input
          v-model="formData.volunteerNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="应急救援专业技术人员数" prop="technologyNum">
        <hl-input
          v-model="formData.technologyNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="持证师资人数" prop="teachersNum">
        <hl-input
          v-model="formData.teachersNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="办公场所面积（平方米）" prop="officeArea">
        <hl-input
          v-model="formData.officeArea"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="主要业务方向" prop="businessDirection">
        <hl-select
          v-model="formData.businessDirection"
          :disabled="pageDisabled"
          clearable
          multiple
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.MAIN_BUSINESS"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="主要救援技术特长" prop="technicalExpertise">
        <hl-select
          v-model="formData.technicalExpertise"
          :disabled="pageDisabled"
          clearable
          multiple
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.MAIN_RESCUE_SPEC"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="主要救援技术特长其他项说明" prop="technicalOtherDesc">
        <hl-input
          v-model="formData.technicalOtherDesc"
          :disabled="pageDisabled"
          :maxlength="100"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度科普宣教次数" prop="lastPopularizationNum">
        <hl-input
          v-model="formData.lastPopularizationNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度科普宣教活动人次" prop="lastPopularizationPeopleNum">
        <hl-input
          v-model="formData.lastPopularizationPeopleNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度科普宣教受众人次" prop="lastPopularizationAudiencesNum">
        <hl-input
          v-model="formData.lastPopularizationAudiencesNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度总收入（元）" prop="lastRevenue">
        <hl-input
          v-model="formData.lastRevenue"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="政府补贴（元）" prop="governmentSubsidies">
        <hl-input
          v-model="formData.governmentSubsidies"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="社会捐赠（元）" prop="socialDonations">
        <hl-input
          v-model="formData.socialDonations"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度总支出（元）" prop="lastExpenditure">
        <hl-input
          v-model="formData.lastExpenditure"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="其他支出（元）" prop="otherExpenditure">
        <hl-input
          v-model="formData.otherExpenditure"
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
      <hl-form-item label="联系电话" prop="personMobile">
        <hl-input
          v-model="formData.personMobile"
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
    :longitude="+formData.longitude"
    :latitude="+formData.latitude"
    @cancel="locMapDlgShow = false"
    @ok="selectMapPoint"
  />
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
import type { PropType } from "vue";
import type { FormInstance } from "hongluan-ui";
import type { IlistSpace } from '@/apis/modules/area/model';
import type { IpostFindDisasterCommunityReductionByIdSpace } from '@/apis/modules/basic-information/model';
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
  resName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  // areaCode: [{ required: true, message: "请选择所属区域", trigger: "blur" }],
  companyCode: [{ required: true, message: "请输入统一社会信用代码", trigger: "blur" }],
  fullNum: intValidator,
  volunteerNum: intValidator,
  technologyNum: intValidator,
  teachersNum: intValidator,
  lastPopularizationNum: intValidator,
  lastPopularizationPeopleNum: intValidator,
  lastPopularizationAudiencesNum: intValidator,
  personMobile: [{ message: "请输入11位手机号码", validator: validatorMobile }],
  // lnglat: [
  //   {
  //     message: "请输入正确经纬度",
  //     validator: (_: any, value: string, callback: (err?: Error) => void) => {
  //       validatorLongitude(_, formData.value.longitude, callback);
  //       validatorLatitude(_, formData.value.latitude, callback);
  //     },
  //   },
  // ],
});
const pageDisabled = computed(() => props.params.type === "detail");

const check = async() => {
  const res = await apiBasicInformationObj.getCheckDisasterSocietyReduction(formData.value.companyCode);
  if (!res.data) {
    HlMessage.warning('统一社会信用代码重复');
    formData.value.companyCode = '';
  }
};
const selectMapPoint = (info: Record<string, any>) => {
  const { latitude, longitude, address } = info;
  locMapDlgShow.value = false;
  formData.value.longitude = longitude;
  formData.value.latitude = latitude;
  formData.value.lnglat = [longitude, latitude];
  formData.value.registerAddress = address;
};
const handleOK = async() => {
  await formRef.value?.validate();

  if (["add", "edit"].includes(props.params.type)) {
    const text = props.params.type === "add" ? "新增成功" : "编辑成功";
    const addParams = {
      businessDirection: Array.isArray(formData.value.businessDirection) ? formData.value.businessDirection.join(',') : '',
      technicalExpertise: Array.isArray(formData.value.technicalExpertise) ? formData.value.technicalExpertise.join(',') : ''
    };
    await apiBasicInformationObj[props.params.type === "add" ? 'postAddDisasterSocietyReductionk' : 'postModifyDisasterSocietyReduction']({
      ...formData.value,
      ...addParams
    } as any);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};

const initFormData = async() => {
  if (props.params.type !== 'add') {
    const { data } = await apiBasicInformationObj.postFindDisasterSocietyReductionById(props.params.id);
    formData.value = {
      ...data,
      businessDirection: data.businessDirection.split(',').filter(Boolean),
      technicalExpertise: data.technicalExpertise.split(',').filter(Boolean),
      // lnglat: [+data.longitude, +data.latitude]
    };
  }
};

onMounted(async() => {
  await initFormData();
});
</script>
