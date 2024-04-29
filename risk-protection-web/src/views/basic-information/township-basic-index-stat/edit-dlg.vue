<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}乡镇基础指标统计`"
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
      <hl-form-item label="年度" prop="yearly">
        <hl-date-picker
          v-model="formData.yearly"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="year"
          value-format="YYYY"
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
      <hl-form-item label="农作物总播种面积（公顷）" prop="cropsSownAreaTotal">
        <hl-input
          v-model="formData.cropsSownAreaTotal"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="小麦播种面积（公顷）" prop="wheatSownArea">
        <hl-input
          v-model="formData.wheatSownArea"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="玉米播种面积（公顷）" prop="cornSownArea">
        <hl-input
          v-model="formData.cornSownArea"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="水稻播种面积（公顷）" prop="riceSownArea">
        <hl-input
          v-model="formData.riceSownArea"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="行政区域面积（公顷）" prop="administrativeArea">
        <hl-input
          v-model="formData.administrativeArea"
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
  yearly: [{ required: true, message: "请选择年度", trigger: "blur" }],
  areaCode: [{ required: true, message: "请选择所属区域", trigger: "blur" }],
  personMobile: [{ message: "请输入11位手机号码", validator: validatorMobile }],
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
    await apiBasicInformationObj[props.params.type === "add" ? 'postAddDisasterTownsIndicatorStatistics' : 'postModifyDisasterTownsIndicatorStatistics']({
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
    const { data } = await apiBasicInformationObj.postFindDisasterTownsIndicatorStatisticsById(props.params.id);
    formData.value = {
      ...data,
      yearly: data.yearly + ''
      // lnglat: [data.longitude, data.latitude]
    };
  }
};

onMounted(async() => {
  await initFormData();
});
</script>
