<template>
  <card-popper
    :title="createAssemblePointParams.title"
    style="--card-top: 6vh;"
    class="create-assemble-point-card"
    @close="closeCreateAssemblePointCard"
  >
    <hl-form
      ref="pointFormRef"
      :model="form"
      :rules="rules"
      :label-position="['left', 'top']"
    >
      <hl-form-item label="集结点名称" prop="assembleTitle">
        <hl-input v-model.trim="form.assembleTitle" placeholder="请输入" clearable block :maxlength="10" />
      </hl-form-item>
      <hl-form-item label="地点" prop="address">
        <hl-input v-model.trim="form.address" placeholder="请输入" clearable block :maxlength="100" />
      </hl-form-item>
      <hl-form-item label="坐标(请点击地图选择点位)" prop="lnglat" class="is-required">
        <hl-group gap-x="var(--sm)">
          <hl-input v-model="form.lnglat[0]" placeholder="经度" block :maxlength="18" type="number" clearable @change="lnglatChange(0, form.lnglat[0])" />
          <hl-input v-model="form.lnglat[1]" placeholder="纬度" block :maxlength="18" type="number" clearable @change="lnglatChange(1, form.lnglat[1])" />
        </hl-group>
      </hl-form-item>
    </hl-form>
    <div class="dlg-footer p-t-lg">
      <hl-button type="primary" class="hover-style normal-width" style="margin-right: calc(var(--xxs) * 4);" @click="closeCreateAssemblePointCard">取消</hl-button>
      <hl-button type="primary" class="hover-style normal-width" @click="submit">确定</hl-button>
    </div>
  </card-popper>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, computed, PropType, inject, onMounted } from 'vue';
import { FormInstance, HlMessage } from 'hongluan-ui';
import { CreateAssemblePointParamsKey, validatorInglat } from '@/common';
import { CreateAssemblePointParams } from '@/types';
import { useMapLayer, useCurrentArea, useCurrentEvent } from '@/hooks';
import { apiSitePersonnelObj } from '@/apis/modules/site-personnel';

const createAssemblePointParams = inject<CreateAssemblePointParams>(CreateAssemblePointParamsKey)!;

const { areaCode } = useCurrentArea();
const { currentEvent } = useCurrentEvent();
const { waitingRefreshLayerMarkers, clickMapMarkerInfo, clearClickMapMarkerInfo } = useMapLayer();

const form = reactive({
  id: '',
  assembleTitle: '',
  address: '',
  lnglat: [] as number[],
});
const rules = {
  assembleTitle: [{ required: true, message: '请输入集结点名称' }],
  address: [{ required: true, message: '请输入地点' }],
  lnglat: [{ required: true, validator: validatorInglat }],
};
const pointFormRef = ref<FormInstance>();

const submit = () => {
  pointFormRef.value?.validate(async valid => {
    if (valid) {
      const params = {
        'eventInfoId': currentEvent.id as string,
        id: form.id,
        'longitude': `${form.lnglat[0]}`,
        'latitude': `${form.lnglat[1]}`,
        'assembleAddress': form.address,
        'assembleTitle': form.assembleTitle
      };
      if (createAssemblePointParams.type === 'add') {
        await apiSitePersonnelObj.postAddCommandCenterAssemblePoint(params);
        HlMessage.success('创建成功');
      } else {
        await apiSitePersonnelObj.postModifyCommandCenterAssemblePoint(params);
        HlMessage.success('编辑成功');
      }
      closeCreateAssemblePointCard();
      waitingRefreshLayerMarkers.value = ['EventAssemblePoints'];
    } else {
      console.log('验证未通过---');
    }
  });
};

const closeCreateAssemblePointCard = () => {
  createAssemblePointParams.title = '';
  createAssemblePointParams.type = 'add';
  createAssemblePointParams.data = {
    id: '',
    assembleTitle: '',
    assembleAddress: '',
    longitude: '',
    latitude: '',
  };
  createAssemblePointParams.show = false;
  clearClickMapMarkerInfo();
};

const lnglatChange = (index: number, val: string) => {
  if (!Number.isNaN(val)) return;
  clickMapMarkerInfo.value.lnglat = index === 0 ? [+val, clickMapMarkerInfo.value.lnglat[1]] : [clickMapMarkerInfo.value.lnglat[0], +val];
};

watch(createAssemblePointParams, val => {
  if (val.data.id) {
    const { id, assembleTitle, assembleAddress, longitude, latitude } = val.data;
    form.id = id;
    form.assembleTitle = assembleTitle;
    form.address = assembleAddress;
    form.lnglat = [+longitude, +latitude];
    clickMapMarkerInfo.value = {
      show: true,
      address: assembleAddress,
      lnglat: [+longitude, +latitude]
    };
  }
}, {
  immediate: true
});

watch(clickMapMarkerInfo, val => {
  if (createAssemblePointParams.show) {
    const { address, lnglat } = val;
    form.address = address;
    form.lnglat = [...lnglat];
    clickMapMarkerInfo.value.show = true;
  }
});

onMounted(() => {
  clickMapMarkerInfo.value.show = true;
});
</script>
