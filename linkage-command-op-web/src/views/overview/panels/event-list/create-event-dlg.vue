<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 150)"
    append-to-body
    title="创建事件"
    class="create-event-dlg"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <hl-form
      ref="eventFormRef"
      :model="form"
      :rules="rules"
      :label-position="['left', 'top']"
      class="event-form"
    >
      <hl-form-item label="事件类型" prop="eventTypeCode">
         <hb-tree-selector
          v-model="form.eventTypeCode"
          :tree-props="treeProps"
          placeholder="请选择类型"
          clearable
          block
          popper-class="event-type-tree"
        >
        </hb-tree-selector>
      </hl-form-item>
      <hl-form-item label="事件标题" prop="name">
        <hl-input v-model="form.name" placeholder="请输入" block :maxlenght="20" clearable />
      </hl-form-item>
      <hl-form-item label="地理坐标" class="is-required" prop="lnglat">
        <hl-group merge indent full>
          <hl-input v-model="form.lnglat" placeholder="请点击右侧图标选择坐标" clearable />
          <hl-button class="static btn-point btn-map-point" equal @click="showMapDlg"></hl-button>
        </hl-group>
      </hl-form-item>
      <hl-form-item label="事件地点" class="is-required" prop="address">
        <hl-group gap="var(--sm)" full>
          <area-cascader
            :model-data="form.mainAreaCode"
            @change="onAreaCascaderChange"
          />
          <hl-input v-model="form.mainAddress" placeholder="请输入" :maxlenght="50" clearable />
        </hl-group>
      </hl-form-item>
      <hl-form-item label="发生时间" prop="happenTime">
        <hl-date-picker  v-model="form.happenTime"
          type="datetime"
          placeholder="选择日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          block
          :disabled-date="disableFutureDate"
        >
          <template  #icon>
            <hl-icon><TwoCalendar/></hl-icon>
          </template>
        </hl-date-picker>
      </hl-form-item>
      <hl-form-item label="事件描述" prop="desc">
        <hl-input v-model="form.desc" native-type="textarea" :rows="5" block show-word-limit :maxlength="1000"/>
      </hl-form-item>
      <hl-form-item label=" ">
        <hl-checkbox v-model="form.drill" :true-label = "1" :false-label="0" @change="handleTitle">演练事件</hl-checkbox>
      </hl-form-item>
    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button class="normal-width m-r-lg" @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="hover-style normal-width" @click="createEvent">确定</hl-button>
      </div>
    </template>
    <mb-location-selector
      v-if="mapDlgVisible"
      :map-bound="mapBound"
      :center="areaCenter"
      :location="form.longitude && form.latitude ? [+form.longitude, +form.latitude] : []"
      show-location-tip
      @cancel="mapDlgVisible=false"
      @ok="markPoint"
    />
  </hl-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { FormInstance } from 'hongluan-ui';
import { CommonUtils } from 'fx-front-utils';
import { EVENT_HANDLING, GlobalAPI, loadMapboxComponents } from '@/common';
import { useCurrentArea, useMapLayer } from '@/hooks';
import { AreaCascader, AreaChangeEvent } from '@/components';
import { apiEventListObj } from '@/apis/modules/event-list';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { IpostAreaTreeAreaSpace } from '@/apis/modules/user-center/model';
import { apiCreateEventObj } from '@/apis/modules/event-create';
import { apiEventConditionObj } from '@/apis/modules/event-condition';

const DRILLED_TITLE = '演练_';
const { mapBound } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
const { disableFutureDate } = CommonUtils;

const [MbLocationSelector] = loadMapboxComponents(['MbLocationSelector']);

const emit = defineEmits(['ok', 'cancel']);

const { areaCode, areaCenter } = useCurrentArea();
const { waitingRefreshLayerMarkers } = useMapLayer();

const mapDlgVisible = ref(false);
const eventFormRef = ref<FormInstance>();
const form = reactive({
  eventTypeCode: '',
  name: '',
  mainAreaCode: '',
  mainAreaName: '',
  mainAddress: '',
  latitude: '',
  longitude: '',
  lnglat: '',
  happenTime: '',
  desc: '',
  drill: 0,
  eventLevelCode: '',
});

const rules = {
  eventTypeCode: [{ required: true, message: '请选择事件类型' }],
  name: [
    { required: true, message: '请填写事件标题' },
    { max: 20, message: '不超过20字' }
  ],
  address: [
    {
      validator: (_: any, __: any, callback: any) => {
        if (!form.mainAreaCode || !form.mainAddress) {
          callback(new Error('请添加事件地点'));
        } else {
          callback();
        }
      }
    },
    { max: 50, message: '字数不能超过50' }
  ],
  lnglat: [{
    validator: (_: any, __: any, callback: any) => {
      if (!form.lnglat) {
        callback(new Error('请选择地理坐标'));
      } else {
        const points = form.lnglat.split(',');
        if (Number.isNaN(+points[0]) || Number.isNaN(+points[1])) {
          callback(new Error('请正确填写地理坐标'));
        } else {
          callback();
        }
      }
    }
  }],
  happenTime: [{ required: true, message: '请选择发生时间' }],
  desc: [{ required: true, message: '请填写事件描述' }],
};

const treeProps = reactive<Record<string, any>>({
  nodeKey: 'code',
  checkStrictly: true,
  showCheckbox: false,
  data: [],
  defaultExpandedKeys: [],
  props: {
    children: 'children',
    label: 'name',
  },
});

const showMapDlg = () => {
  if (form.lnglat) {
    form.longitude = form.lnglat.split(',')[0];
    form.latitude = form.lnglat.split(',')[1];
  }
  mapDlgVisible.value = true;
};
const markPoint = (result: Record<string, any>) => {
  mapDlgVisible.value = false;
  form.mainAddress = result.address;
  form.lnglat = `${result.longitude},${result.latitude}`;
};

const handleTitle = () => {
  if (form.drill && !form.name.startsWith(DRILLED_TITLE)) {
    form.name = DRILLED_TITLE + form.name;
  }
  if (!form.drill && form.name.startsWith(DRILLED_TITLE)) {
    form.name = form.name.replace(DRILLED_TITLE, '');
  }
};

const createEvent = () => {
  eventFormRef.value?.validate(async valid => {
    if (valid) {
      const points = form.lnglat.split(',');
      form.longitude = points[0];
      form.latitude = points[1];
      const res = await apiCreateEventObj.postAddEventInfo(form);
      await apiCreateEventObj.postModifyEventInfo({ id: res.data, eventState: 'HANDLING' });
      waitingRefreshLayerMarkers.value = [EVENT_HANDLING];
      emit('ok');
    }
  });
};

const onAreaCascaderChange = (data: AreaChangeEvent) => {
  const { id, name } = data;
  form.mainAreaCode = id || '';
  form.mainAreaName = name;
};

onMounted(async() => {
  const result = await apiEventConditionObj.getEventTypeTree();
  treeProps.data = result.data;

  treeProps.data.forEach((d: any) => {
    treeProps.defaultExpandedKeys.push(d.code);
  });
});
</script>

<style lang="scss" scoped>
.btn-point {
  margin-left: calc(var(--xxs) * 2.5) !important;
}
</style>
<style lang="scss">
.create-event-dlg {
  .panel-header {
    background-image: url(@/assets/images/overview/left-2/create-event-dlg.png) !important;
  }
}
</style>
