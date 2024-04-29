<template>
  <hl-group full dir="vertical" gap="var(--xxs)" class="property-editor-tab">
    <template v-if="dictionary && dictionary.length >0">
      <hl-icon size="md" class="delete-pos" type="primary" :disabled="!canEdit" @click="deleteMark">
        <two-delete />
      </hl-icon>
      <hl-form ref="form" :model="formData" :width="['col-24', 'col-24']" :label-position="['left', 'top']" :disabled="!canEdit">
        <hl-form-item
          v-for="(item, index) in dictionary"
          :key="index"
          :label="`${ item.key === 'opacity' ? '不透明度' : item.label}`"
        >
          <hl-color-picker v-if="item.type === 'color'" v-model="formData[item.key]" @change="handleChangeForm" />
          <hl-slider
            v-else-if="item.key === 'opacity'"
            v-model="formData[item.key]"
            :min="0.01"
            :max="1"
            :step="0.01"
            type="success"
            style="width: 100%; margin: 0 calc(var(--xs))"
            @change="handleChangeForm"
          />
          <hl-input-number
            v-else-if="item.type === 'number'"
            v-model="formData[item.key]"
            :type="item.type"
            :step="item.step"
            :min="item.min"
            :max="item.max"
            size="sm"
            block
            merge
            indent
            @change="handleChangeForm"
          />
          <hl-input v-else-if="item.key === 'image-url'" v-model="formData[item.key]" :native-type="item.type" rows="3" block @change="handleChangeForm" />
          <hl-input v-else-if="item.type === 'textArea'" v-model="formData[item.key]" native-type="textarea" rows="3" block @change="handleChangeForm"/>
          <hl-input v-else v-model="formData[item.key]" block @change="handleChangeForm" />
        </hl-form-item>
        <hl-button v-if="curVideoUrl && curVideoUrl.length > 0" class="video-link" type="link" @click="playVideo">
          播放视频
          <hl-icon type="primary" class="m-l-xxs">
            <FillPlay />
          </hl-icon>
        </hl-button>
      </hl-form>
    </template>
    <template v-else>
      <div class="no-data">
        <img src="@/assets/images/map/plotting/edit-board-no-data.png" alt="">
        <span class="text-secondary">请选择修改对应标绘图层</span>
      </div>
    </template>
  </hl-group>
</template>
<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { apiPlotInfoListObj } from '@/apis/modules/plotInfo-list';
import { useMapPlotting } from '@/hooks';

interface DicItem {
  key?: string
  label?: string
  type?: string
}

const { canEdit, currentPlottingInfo, modifyPlottingData, deletePlottingData } = useMapPlotting();

const propertyOriginData = {
  id: '',
  name: '',
  text: '',
  'text-color': '#00ffff',
  'text-size': 16,
  opacity: 0.01,
  'fill-color': '',
  'camera-url': '',
  description: ''
};
const formData = ref(cloneDeep(propertyOriginData));
const dictionary = ref<DicItem[]>([]);

const curVideoUrl = computed(() => formData.value['camera-url']);

const handleChangeForm = () => {
  Object.assign(currentPlottingInfo.curFeatureData.properties, formData.value);
  modifyPlottingData(currentPlottingInfo.curFeatureData);
};

const playVideo = () => {
  const url = curVideoUrl.value.indexOf('http') > -1 ? curVideoUrl.value : `https://${curVideoUrl.value}`;
  window.open(url, '视频资源');
};

const deleteMark = async() => {
  const id = currentPlottingInfo.curMarkVoListData.find(m => m.markOther!.indexOf(currentPlottingInfo.curFeatureData.id) > -1)!.id;
  await deletePlottingData(`${id}`);
  currentPlottingInfo.curFeatureData = {};
};

watchEffect(() => {
  if (!Object.keys(currentPlottingInfo.curFeatureData).length) {
    dictionary.value = [];
    formData.value = cloneDeep(propertyOriginData);
    return;
  }

  dictionary.value = currentPlottingInfo.curFeatureData.properties['properties-dictionary'];
  formData.value = { ...currentPlottingInfo.curFeatureData.properties };
  console.log(formData.value);
});

</script>
<style lang="scss" scoped>
.property-editor-tab {
  height: 100%;
  .delete-pos {
    position: absolute;
    right: 0;
    top: var(--xxs);
    cursor: pointer;
  }
  .video-link {
    &:link {
      color:#6d6d80;
    }
  }
  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: var(--font-md);
    font-weight: var(--font-weight);
    img {
      width: 50%;
    }
    span {
      margin-top: var(--lg);
    }
  }
  :deep(.hl-input-number) {
    .hl-button {
      --button-bg-color: rgba(0,158,247,0.12);
      --button-bg-color-hover: var(--button-bg-color);
      --button-bg-color-active: var(--button-bg-color);
      --button-border-color: rgba(0,158,247,0.24);
      --button-border-color-hover: var(--button-border-color);
      --button-border-color-active: var(--button-border-color);
    }
  }
  :deep(.hl-color-picker .picker-trigger) {
    padding: 0;
    border: none;
    width: calc(var(--xxs) * 14);
    height: calc(var(--xxs) * 8);
    .picker-icon {
      display: none;
    }
  }
  :deep(.hl-slider) {
    .slider-wrap {
      --slider-height: calc(var(--xxs) * 3);
      --slider-bg-color: rgba(0, 158, 247, 0.12);
    }
    .slider-bar {
      background: linear-gradient(270deg, #71F8FC 0%, rgba(6,137,150,0.5) 100%);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .slider-handle-wrap {
      width: calc(var(--xxs) * 5);
      height: calc(var(--xxs) * 5);
      background-image: url('@/assets/images/form-item/slider-icon.png');
      background-size: 100% 100%;
      background-position-x: calc(-0.5 * var(--xxs));
    }
  }
}
</style>
