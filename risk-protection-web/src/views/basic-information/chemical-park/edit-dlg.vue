<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}化工园区`"
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
      <hl-form-item label="园区名称" prop="resName">
        <hl-input
          v-model="formData.resName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="园区设立时间" prop="establishDate">
        <hl-date-picker
          v-model="formData.establishDate"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="date"
          value-format="YYYY-MM-DD"
          block
        />
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
      <hl-form-item label="园区内企业数量" prop="enterprisesNum">
        <hl-input
          v-model="formData.enterprisesNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="园区认定情况" prop="hasParkRecognition">
        <hl-select
          v-model="formData.hasParkRecognition"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.PARK_CERT"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="园区认定其他说明" prop="parkOtherDesc">
        <hl-input
          v-model="formData.parkOtherDesc"
          :disabled="pageDisabled"
          :maxlength="100"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="危险化学品企业数" prop="hazardousEnterprisesNum">
        <hl-input
          v-model="formData.hazardousEnterprisesNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="危险化学品生产企业数" prop="productionHazardousEnterprisesNum">
        <hl-input
          v-model="formData.productionHazardousEnterprisesNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="危险化学品经营（储存）企业数" prop="operateHazardousEnterprisesNum">
        <hl-input
          v-model="formData.operateHazardousEnterprisesNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="电源路数" prop="sourceNum">
        <hl-input
          v-model="formData.sourceNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="公用变电站数量" prop="substationNum">
        <hl-input
          v-model="formData.substationNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="园区电厂数量" prop="plantNum">
        <hl-input
          v-model="formData.plantNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="供水能力（万吨/天）" prop="supplyWater">
        <hl-input
          v-model="formData.supplyWater"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="用水负荷（万吨/天）" prop="waterLoad">
        <hl-input
          v-model="formData.waterLoad"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="污水处理能力（万吨/天）" prop="treatmentSewage">
        <hl-input
          v-model="formData.treatmentSewage"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="最大污水排放量（万吨/天）" prop="sewageMaximum">
        <hl-input
          v-model="formData.sewageMaximum"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="园区公共事故应急池（立方米）" prop="responseEmergency">
        <hl-input
          v-model="formData.responseEmergency"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否有应急救援指挥信息平台" prop="hasEmergencyPlatform">
        <hl-select
          v-model="formData.hasEmergencyPlatform"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.OPTION"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="是否有专职危化应急救援队伍" prop="hasHazardousTeam">
        <hl-select
          v-model="formData.hasHazardousTeam"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.OPTION"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="是否统一管理公用管廊" prop="hasManagementCorridor">
        <hl-select
          v-model="formData.hasManagementCorridor"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.OPTION"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
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
      <hl-form-item label="详细地址" prop="address">
        <hl-group class="w-full">
          <hl-input
            v-model="formData.address"
            :disabled="pageDisabled"
            placeholder="请输入"
            :maxlength="100"
            block
            show-word-limit
          />
          <hl-button type="primary" :disabled="pageDisabled" @click="locMapDlgShow = true" equal>
            <hl-icon>
              <TwoPoint />
            </hl-icon>
          </hl-button>
        </hl-group>
      </hl-form-item>
      <hl-form-item label="经纬度" prop="lnglat">
        <hl-group class="w-full" gap="var(--lg)" align="items-middle" full>
          <hl-input
            v-model="formData.longitude"
            :disabled="pageDisabled"
          ></hl-input>
          <span>一</span>
          <hl-input
            v-model="formData.latitude"
            :disabled="pageDisabled"
          ></hl-input>
        </hl-group>
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
  // areaCode: [{ required: true, message: "请选择所属区域", trigger: "blur" }],
  resName: [{ required: true, message: "请输入园区名称", trigger: "blur" }],
  // establishDate: [{ required: true, message: "请选择园区设立时间", trigger: "blur" }],
  enterprisesNum: intValidator,
  hazardousEnterprisesNum: intValidator,
  productionHazardousEnterprisesNum: intValidator,
  operateHazardousEnterprisesNum: intValidator,
  sourceNum: intValidator,
  substationNum: intValidator,
  plantNum: intValidator,
  personMobile: [{ message: "请输入11位手机号码", validator: validatorMobile }],
  lnglat: [
    {
      message: "请输入正确经纬度",
      validator: (_: any, value: string, callback: (err?: Error) => void) => {
        validatorLongitude(_, formData.value.longitude, callback);
        validatorLatitude(_, formData.value.latitude, callback);
      },
    },
  ],
});
const pageDisabled = computed(() => props.params.type === "detail");

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
    const addParams = {};
    await apiBasicInformationObj[props.params.type === "add" ? 'postAddDisasterChemicalIndustrialPark' : 'postModifyDisasterChemicalIndustrialPark']({
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
    const { data } = await apiBasicInformationObj.postFindDisasterChemicalIndustrialParkById(props.params.id);
    formData.value = {
      ...data,
      lnglat: [+data.longitude, +data.latitude]
    };
  }
};

onMounted(async() => {
  await initFormData();
});
</script>
