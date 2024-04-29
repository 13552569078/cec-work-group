<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}社区(行政村)减灾能力`"
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
      <hl-form-item label="所属乡镇" prop="areaCode">
        <hl-cascader
          v-model="formData.areaCode"
          :disabled="pageDisabled"
          :props="areaProps"
          :options="areaCodeList"
          placeholder="请选择"
          block
          :show-all-levels="false"
          @change="change('1')"
        />
      </hl-form-item>
      <hl-form-item label="社区(行政村)" prop="commAreaCode">
        <hl-select
          v-model="formData.commAreaCode"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in communityList"
            :key="item.areaCode"
            :label="item.name"
            :value="item.areaCode"
            @change="change('2')"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="社区(行政村)地址" prop="address">
        <hl-input
          v-model="formData.address"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
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
            v-for="item in DICT.COMMUNICSATION_METHOD"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="防灾减灾应急物资储备方式" prop="materialsReserveMethod">
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
      <hl-form-item label="总户数" prop="totalHouseholds">
        <hl-input
          v-model="formData.totalHouseholds"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="常住人口数量" prop="permanentPopulation">
        <hl-input
          v-model="formData.permanentPopulation"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否为全国综合减灾示范社区" prop="nationalDemonstrationCommunity">
        <hl-select
          v-model="formData.nationalDemonstrationCommunity"
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
      <hl-form-item label="0-14岁人数" prop="youngPersonNum">
        <hl-input
          v-model="formData.youngPersonNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否为省级综合减灾示范社区" prop="provincialDemonstrationCommunity">
        <hl-select
          v-model="formData.provincialDemonstrationCommunity"
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
      <hl-form-item label="65岁(含)以上人数" prop="oldPersonNum">
        <hl-input
          v-model="formData.oldPersonNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否有本辖区地质灾害等隐患点清单" prop="hasDangerPoints">
        <hl-select
          v-model="formData.hasDangerPoints"
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
      <hl-form-item label="残障人员人数" prop="disabilityPersonNum">
        <hl-input
          v-model="formData.disabilityPersonNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否有本辖区弱势人群清单" prop="hasVulnerableGroups">
        <hl-select
          v-model="formData.hasVulnerableGroups"
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
      <hl-form-item label="社区医疗卫生服务站或村卫生室数量" prop="healthStationNum">
        <hl-input
          v-model="formData.healthStationNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否有社区(行政村)灾害类地图" prop="hasDisasterMap">
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
      <hl-form-item label="灾害信息员人数" prop="disasterNum">
        <hl-input
          v-model="formData.disasterNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否有社区(行政村)应急预案" prop="hasPlan">
        <hl-select
          v-model="formData.hasPlan"
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
      <hl-form-item label="上一年度组织的防灾减灾培训活动次数" prop="trainingDrillsNum">
        <hl-input
          v-model="formData.trainingDrillsNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="登记注册志愿者人数" prop="volunteerNum">
        <hl-input
          v-model="formData.volunteerNum"
          :disabled="pageDisabled"
          :maxlength="10"
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
      <hl-form-item label="民兵预备役人数" prop="reserveDutyNum">
        <hl-input
          v-model="formData.reserveDutyNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一年度组织的防灾减灾演练活动次数" prop="trainingDrillsActivityNum">
        <hl-input
          v-model="formData.trainingDrillsActivityNum"
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
      <hl-form-item label="上一年度防灾减灾培训活动培训人次" prop="trainingDrillsPersonNum">
        <hl-input
          v-model="formData.trainingDrillsPersonNum"
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
      <hl-form-item label="参与上一年度组织的防灾减灾演练活动的居民人次" prop="trainingDrillsResidentNum">
        <hl-input
          v-model="formData.trainingDrillsResidentNum"
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
import { ACTION_TYPE_DES_MAP, validatorInt,validatorLongitude, validatorLatitude,  } from "@/common";
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
  areaCodeList:{
    type: Array as PropType<IlistSpace.Data[]>,
    default:() => {return []}
  }
});
const emit = defineEmits(["cancel", "refresh"]);

const { areaProps } = useAreaTree();

const locMapDlgShow = ref(false);
const Int = [{ message: "请输入整数", validator: validatorInt }];
const formRef = ref<FormInstance>();
const formData = ref({} as IpostFindDisasterCommunityReductionByIdSpace.Data);
const rules = ref({
  areaCode: [{ required: true, message: "请选择所属乡镇", trigger: "blur" }],
  commAreaCode: [{ required: true, message: "请选择社区(行政村)", trigger: "blur" }],
  totalHouseholds: Int,
  permanentPopulation: Int,
  youngPersonNum: Int,
  oldPersonNum: Int,
  disabilityPersonNum: Int,
  healthStationNum: Int,
  disasterNum: Int,
  trainingDrillsNum: Int,
  volunteerNum: Int,
  reserveDutyNum: Int,
  trainingDrillsActivityNum: Int,
  shelterNum: Int,
  trainingDrillsPersonNum: Int,
  shelterCapacity: Int,
  trainingDrillsResidentNum: Int,
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
const communityList = ref([] as IpostFindCommunityByAreaCodeSpace.Data[]);
const pageDisabled = computed(() => props.params.type === "detail");

const change = async (type:string) => {
  if (type === '1') {
    await getCommunityList(formData.value.areaCode);
    formData.value.commAreaCode = ''
  } else {
    const item = communityList.value.filter(el => el.name === formData.value.name);
    formData.value.areaCode = item[0].parentAreaCode;
  }
}
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
      name: communityList.value.find(el => +el.areaCode === +formData.value.commAreaCode)?.name
    };
    await apiBasicInformationObj[props.params.type === "add"? 'postAddDisasterCommunityReduction':'postModifyDisasterCommunityReduction']({
      ...formData.value,
      ...addParams
    } as any);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};

const getCommunityList = async(code:string) =>{
  const res = await apiAreaCodeObj.postFindCommunityByAreaCode(code);
  console.error('getCommunityList',res)
  communityList.value = res.data;
}
const initFormData = async () => {
  if (props.params.type !== 'add') {
    const { data } = await apiBasicInformationObj.postFindDisasterCommunityReductionById(props.params.id);
    formData.value = {
      ...data,
      disasterReceiveMethod: data.disasterReceiveMethod.length
        ?`${data.disasterReceiveMethod}`.split(",")
        : [] ,
      disasterReportMethod: data.disasterReportMethod.length? `${data.disasterReportMethod}`.split(",") : [],
      disasterSendMethod: data.disasterSendMethod.length? `${data.disasterSendMethod}`.split(","):[],
      materialsReserveMethod: data.materialsReserveMethod.length? `${data.materialsReserveMethod}`.split(","): [],
      lnglat : [data.longitude,data.latitude]
    };
    await getCommunityList(formData.value.areaCode);
  }
};

onMounted(async () => {
  await initFormData();
});
</script>
