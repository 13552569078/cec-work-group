<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}乡镇减灾能力`"
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
      <hl-form-item label="乡镇名称" prop="areaCode">
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
      <hl-form-item label="乡镇地址" prop="address">
        <hl-input
          v-model="formData.address"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="影响乡镇主要灾害类型" prop="disasterType">
        <hl-select
          v-model="formData.disasterType"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
          multiple
        >
          <hl-option
            v-for="item in DICT.DISASTER_TYPE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="灾害预警信息接收方式" prop="disasterReceiveMethod">
        <hl-select
          v-model="formData.disasterReceiveMethod"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
          multiple
        >
          <hl-option
            v-for="item in DICT.REPORTING_METHO"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="灾情信息上报方式" prop="disasterReportMethod">
        <hl-select
          v-model="formData.disasterReportMethod"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
          multiple
        >
          <hl-option
            v-for="item in DICT.REPORTING_METHO"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="灾害预警信息传达方式" prop="disasterSendMethod">
        <hl-select
          v-model="formData.disasterSendMethod"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
          multiple
        >
          <hl-option
            v-for="item in DICT.REPORTING_METHO"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="救灾物资储备方式" prop="materialsReserveMethod">
        <hl-select
          v-model="formData.materialsReserveMethod"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
          multiple
        >
          <hl-option
            v-for="item in DICT.RESERVE_METHOD"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="年末总户数" prop="totalHouseholds">
        <hl-input
          v-model="formData.totalHouseholds"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="常住人口总数" prop="permanentPopulation">
        <hl-input
          v-model="formData.permanentPopulation"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否开展乡镇(街道)灾害风险评估" prop="hasRiskAssessment">
        <hl-select
          v-model="formData.hasRiskAssessment"
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
      <hl-form-item label="本级灾害管理工作人员总数" prop="workPersonNum">
        <hl-input
          v-model="formData.workPersonNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否有乡镇(街道)灾害类地图" prop="hasDisasterMap">
        <hl-select
          v-model="formData.hasDisasterMap"
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
      <hl-form-item label="本级灾害信息员人数" prop="disasterNum">
        <hl-input
          v-model="formData.disasterNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="乡镇(街道)综合减灾工作经费保障方式" prop="fundsGuaranteeMethod">
        <hl-select
          v-model="formData.fundsGuaranteeMethod"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.GUARANTEE_METHOD"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="近3年编制或修订自然灾害应急预案数量" prop="planNum">
        <hl-input
          v-model="formData.planNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="近3年针对自然灾害启动应急响应次数" prop="runResponseNum">
        <hl-input
          v-model="formData.runResponseNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="应急通信设备数量" prop="communicationDeviceNum">
        <hl-input
          v-model="formData.communicationDeviceNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度组织的应急管理培训和演练次数" prop="trainingDrillsNum">
        <hl-input
          v-model="formData.trainingDrillsNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="应急供水设备数量" prop="waterSupplyEquipNum">
        <hl-input
          v-model="formData.waterSupplyEquipNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度组织的应急管理培训和演练参与人次" prop="trainingDrillsPersonNum">
        <hl-input
          v-model="formData.trainingDrillsPersonNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="应急医疗设备数量" prop="medicalEquipNum">
        <hl-input
          v-model="formData.medicalEquipNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度防灾减灾救灾资金投入总金额" prop="disasterFundsInput">
        <hl-input
          v-model="formData.disasterFundsInput"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="现有储备物资、装备折合金额" prop="equipAmount">
        <hl-input
          v-model="formData.equipAmount"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="本级救灾物资、装备储备点数量" prop="materialsNum">
        <hl-input
          v-model="formData.materialsNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="本级灾害应急避难场所数量" prop="shelterNum">
        <hl-input
          v-model="formData.shelterNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="本级储备点救灾物资、装备数量" prop="equipNum">
        <hl-input
          v-model="formData.equipNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="本级灾害应急避难场所容量" prop="shelterCapacity">
        <hl-input
          v-model="formData.shelterCapacity"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="应急电源或应急发电设备数量" prop="powerEquipNum">
        <hl-input
          v-model="formData.powerEquipNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="经纬度" prop="lnglat">
        <hl-group class="w-full">
          <hl-group gap="var(--lg)" align="items-middle" full>
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
          <hl-button type="primary" :disabled="pageDisabled" @click="locMapDlgShow = true" equal>
            <hl-icon>
              <TwoPoint />
            </hl-icon>
          </hl-button>
        </hl-group>
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
    :longitude="formData.longitude"
    :latitude="formData.latitude"
    @cancel="locMapDlgShow = false"
    @ok="selectMapPoint"
  />
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { HlMessage } from "hongluan-ui";
import { ACTION_TYPE_DES_MAP, validatorInt, validatorFloat, validatorLongitude, validatorLatitude } from "@/common";
import { LocationMap } from "@/components";
import { useAreaTree } from '@/hooks';
import { apiBasicInformationObj } from "@/apis/modules/basic-information";
import { DICT } from "../generic-methods";
import type { PropType } from "vue";
import type { FormInstance } from "hongluan-ui";
import type { ActionType } from "@/types";
import type { IlistSpace } from "@/apis/modules/area/model";
import type { IpostFindDisasterTownshipReductionByIdSpace } from "@/apis/modules/basic-information/model";

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
    default: () => {
      return [];
    },
  },
});
const emit = defineEmits(["cancel", "refresh"]);

const { areaProps } = useAreaTree();

const Int = [{ message: "请输入整数", validator: validatorInt }];

const locMapDlgShow = ref(false);
const formRef = ref<FormInstance>();
const formData = ref({} as IpostFindDisasterTownshipReductionByIdSpace.Data);
const rules = ref({
  areaCode: [{ required: true, message: "请选择乡镇名称", trigger: "blur" }],
  disasterType: [{ required: true, message: "影响乡镇主要灾害类型", trigger: "blur" }],
  totalHouseholds: Int,
  permanentPopulation: Int,
  workPersonNum: Int,
  disasterNum: Int,
  planNum: Int,
  runResponseNum: Int,
  communicationDeviceNum: Int,
  trainingDrillsNum: Int,
  waterSupplyEquipNum: Int,
  trainingDrillsPersonNum: Int,
  medicalEquipNum: Int,
  disasterFundsInput: [{ decimalLen: 20, message: "请输入数值类型", validator: validatorFloat }],
  equipAmount: [{ decimalLen: 20, message: "请输入数值类型", validator: validatorFloat }],
  materialsNum: Int,
  shelterNum: Int,
  equipNum: Int,
  shelterCapacity: Int,
  powerEquipNum: Int,
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
  const { latitude, longitude } = info;
  locMapDlgShow.value = false;
  formData.value.longitude = longitude;
  formData.value.latitude = latitude;
  formData.value.lnglat = [longitude,latitude];
};
const handleOK = async () => {
  await formRef.value?.validate();

  if (["add", "edit"].includes(props.params.type)) {
    const text = props.params.type === "add" ? "新增成功" : "编辑成功";
    const addParams = {
      disasterType: formData.value.disasterType.length
        ? (formData.value.disasterType as string[]).join(",")
        : "",
      disasterReceiveMethod: formData.value.disasterReceiveMethod.length
        ? (formData.value.disasterReceiveMethod as string[]).join(",")
        : "",
      disasterReportMethod: formData.value.disasterReportMethod.length
        ? (formData.value.disasterReportMethod as string[]).join(",")
        : "",
      disasterSendMethod: formData.value.disasterSendMethod.length
        ? (formData.value.disasterSendMethod as string[]).join(",")
        : "",
      materialsReserveMethod: formData.value.materialsReserveMethod.length
        ? (formData.value.materialsReserveMethod as string[]).join(",")
        : "",
      name:props.areaCodeList.find(el => el.code === formData.value.areaCode)?.name
    };

    await apiBasicInformationObj[
      props.params.type === "add"
        ? "postAddDisasterTownshipReduction"
        : "postModifyDisasterTownshipReduction"
    ]({
      ...formData.value,
      ...addParams,
    } as any);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};
const initFormData = async () => {
  if (props.params.type !== "add") {
    const { data } = await apiBasicInformationObj.postFindDisasterTownshipReductionById(
      props.params.id
    );
    formData.value = {
      ...data,
      disasterType: data.disasterType.length ? `${data.disasterType}`.split(",") : [],
      disasterReceiveMethod: data.disasterReceiveMethod.length
        ?`${data.disasterReceiveMethod}`.split(",")
        : [] ,
      disasterReportMethod: data.disasterReportMethod.length? `${data.disasterReportMethod}`.split(",") : [],
      disasterSendMethod: data.disasterSendMethod.length? `${data.disasterSendMethod}`.split(","):[],
      materialsReserveMethod: data.materialsReserveMethod.length? `${data.materialsReserveMethod}`.split(","): [],
      lnglat: [data.longitude,data.latitude]
    };
  }
};

onMounted(async () => {
  await initFormData();
});
</script>
