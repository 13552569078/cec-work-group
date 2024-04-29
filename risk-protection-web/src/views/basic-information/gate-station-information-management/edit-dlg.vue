<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}水闸`"
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
      <hl-form-item label="水闸名称" prop="resName">
        <hl-input
          v-model="formData.resName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="所属区域" prop="areaCode">
        <hl-cascader
            v-model="formData.areaCode"
            :disabled="pageDisabled"
            :props="areaProps"
            :options="areaTreeData"
            placeholder="请选择"
            block
            :show-all-levels="false"
        />
      </hl-form-item>
      <hl-form-item label="所属河流" prop="riverId">
        <hl-select
          v-model="formData.riverId"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in riverList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="水闸类型" prop="gateType">
        <hl-select
          v-model="formData.gateType"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.SLUICE_TYPE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="竣工完成日期" prop="finishDate">
        <hl-date-picker
          v-model="formData.finishDate"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="date"
          value-format="YYYY-MM-DD"
          block
        />
      </hl-form-item>
      <hl-form-item label="设计过闸流量(m³/s)" prop="waterFlow">
        <hl-input
          v-model="formData.waterFlow"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="工程规模" prop="projectScale">
        <hl-select
          v-model="formData.projectScale"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.RIVER_PROJECT_SCALE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="管理单位" prop="manageUnit">
        <hl-input
          v-model="formData.manageUnit"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上级主管单位" prop="superManageUnit">
        <hl-input
          v-model="formData.superManageUnit"
          :disabled="pageDisabled"
          :maxlength="50"
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
import { ACTION_TYPE_DES_MAP, MAX_PAGE_SIZE,  validatorLongitude, validatorLatitude, } from "@/common";
import { LocationMap } from "@/components";
import { useAreaTree } from '@/hooks';
import { DICT } from "../generic-methods";
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import type { PropType } from "vue";
import type { FormInstance } from "hongluan-ui";
import type { IpostFindDisasterGateStationByIdSpace,IpostFindDisasterRiverPageSpace } from '@/apis/modules/basic-information/model';
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
});
const emit = defineEmits(["cancel", "refresh"]);

const { getAreaTree, areaProps, areaTreeData } = useAreaTree();


const locMapDlgShow = ref(false);
const formRef = ref<FormInstance>();
const formData = ref({} as IpostFindDisasterGateStationByIdSpace.Data);
const rules = ref({
  resName: [{ required: true, message: "请输入水闸名称", trigger: "blur" }],
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
const riverList = ref([] as IpostFindDisasterRiverPageSpace.List[]);

const pageDisabled = computed(() => props.params.type === "detail");

const selectMapPoint = (info: Record<string, any>) => {
  const { latitude, longitude, citycode } = info;
  locMapDlgShow.value = false;
  formData.value.longitude = longitude;
  formData.value.latitude = latitude;
  formData.value.lnglat = [longitude,latitude];
  // formData.value.areaCode = `${citycode}`;
};

const handleOK = async () => {
  await formRef.value?.validate();
  if (["add", "edit"].includes(props.params.type)) {
    const text = props.params.type === "add" ? "新增成功" : "编辑成功";
    await apiBasicInformationObj[props.params.type === "add"? 'postAddDisasterGateStation':'postModifyDisasterGateStation'](formData.value);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};

const getRiverList = async() => {
  const { data } = await apiBasicInformationObj.postFindDisasterRiverPage({
    currentPage:1,
    pageSize: MAX_PAGE_SIZE
  });
  riverList.value = data.list || [];
}
const initFormData = async () => {
  if (props.params.type !== 'add') {
    const { data } = await apiBasicInformationObj.postFindDisasterGateStationById(props.params.id);
    formData.value = data;
    formData.value.lnglat = [data.longitude,data.latitude];
  }
};

onMounted(async () => {
  await getAreaTree();
  await getRiverList();
  await initFormData();
});
</script>
