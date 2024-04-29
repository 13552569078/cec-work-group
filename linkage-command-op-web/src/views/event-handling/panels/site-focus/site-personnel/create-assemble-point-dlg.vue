<template>
  <hl-dialog
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="create-assemble-point-dlg"
    width="calc(var(--xxs) * 116)"
    height="calc(var(--xxs) * 106)"
    top="calc(var(--xxs) * 30)"
    body-padding="var(--md)"
    :title="title"
    append-to-body
    @close="$emit('cancel')">
    <hl-form
      ref="pointFormRef"
      :model="form"
      :rules="rules"
      :label-position="['left', 'top']"
    >
      <hl-form-item label="集结点名称" prop="assembleTitle">
        <hl-input v-model.trim="form.assembleTitle" placeholder="请输入" block :maxlength="10" />
      </hl-form-item>
      <hl-form-item label="地点" prop="address">
        <hl-input v-model.trim="form.address" placeholder="请输入" block :maxlength="100" />
      </hl-form-item>
      <hl-form-item label="坐标" prop="lnglat" class="is-required">
        <hl-group gap-x="var(--sm)">
          <hl-input v-model="form.lnglat[0]" placeholder="经度" block :maxlength="10" />
          <hl-input v-model="form.lnglat[1]" placeholder="纬度" block :maxlength="10" />
          <hl-button class="static btn-map-point" equal @click="showMapDlg"></hl-button>
        </hl-group>
      </hl-form-item>
    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button type="primary" class="hover-style normal-width" style="margin-right: calc(var(--xxs) * 4);" @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="hover-style normal-width" @click="submit">确定</hl-button>
      </div>
    </template>

    <mb-location-selector
      v-if="mapDlgVisible"
      :map-bound="mapBound"
      :center="areaCenter"
      :location="form.lnglat[0] && form.lnglat[1] ? [+form.lnglat[0], +form.lnglat[1]] : []"
      @cancel="mapDlgVisible=false"
      @ok="markPoint"
    />
  </hl-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch, computed, PropType } from 'vue';
import { FormInstance, HlMessage } from 'hongluan-ui';
import { GlobalAPI, loadMapboxComponents } from '@/common';
import { useMapLayer, useCurrentArea, useCurrentEvent } from '@/hooks';
import { validatorInglat } from '@/common';
import { apiSitePersonnelObj } from '@/apis/modules/site-personnel';
import type { IpostFindCommandCenterAssemblePointListSpace } from '@/apis/modules/site-personnel/model';

const { mapBound } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
const [MbLocationSelector] = loadMapboxComponents(['MbLocationSelector']);

const emit = defineEmits(['cancel', 'ok']);

const props = defineProps({
  formData: {
    type: Object as PropType<IpostFindCommandCenterAssemblePointListSpace.Data>,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'add'
  },
});
const { areaCode, areaCenter } = useCurrentArea();
const { currentEvent } = useCurrentEvent();
const { waitingRefreshLayerMarkers } = useMapLayer();

const title = computed(() => props.type === 'add' ? '创建集结点' : '编辑集结点');

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
const mapDlgVisible = ref(false);

const showMapDlg = () => {
  mapDlgVisible.value = true;
};
const markPoint = (result: Record<string, any>) => {
  mapDlgVisible.value = false;
  form.address = result.address;
  form.lnglat = [result.longitude, result.latitude];
};

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
      if (props.type === 'add') {
        await apiSitePersonnelObj.postAddCommandCenterAssemblePoint(params);
        HlMessage.success('创建成功');
      } else {
        await apiSitePersonnelObj.postModifyCommandCenterAssemblePoint(params);
        HlMessage.success('编辑成功');
      }
      emit('ok');
      waitingRefreshLayerMarkers.value = ['EventAssemblePoints'];
    } else {
      console.log('验证未通过---');
    }
  });
};

watch(() => props.formData, val => {
  if (val.id) {
    const { id, assembleTitle, assembleAddress, longitude, latitude } = val;
    form.id = id;
    form.assembleTitle = assembleTitle;
    form.address = assembleAddress;
    form.lnglat = [+longitude, +latitude];
  }
}, {
  immediate: true
});
</script>
<style lang="scss">
.create-assemble-point-dlg {
  .panel-header{
    background-image: url(@/assets/images/event-handling/right-2/site-personnel/create-assemble-point-dlg-header-bg.png) !important;
    background-size: 100% 100% !important;
  }
}
</style>
