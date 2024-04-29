<template>
  <div class="tool-box-content">
    <hl-group full="full-x" dir="vertical" gap="var(--sm)">
      <hl-button @click="mapToolHandle('SET_MAP:resetMap')" effect="light" equal>
        <template #icon>
          <hl-icon>
            <img src="@/assets/images/mapTool/reset.svg" />
          </hl-icon>
        </template>
      </hl-button>
      <hl-popover placement="left" :width="145" trigger="click" popper-style="--popover-bg-color:rgba(14,23,38,0.96);">
        <template #reference>
          <hl-button @click="mapToolHandle('legend')" effect="light" equal>
            <template #icon>
              <hl-icon>
                <img src="@/assets/images/mapTool/plus.svg" />
              </hl-icon>
            </template>
          </hl-button>
        </template>
        <hl-group dir="vertical" class="m-l-xs">
          <hl-group dir="vertical" width="calc(var(--xxs) * 36)">
            <hl-group
              ><span style="color: rgba(132, 164, 246, 0.4)">{{ systemName }}信息</span></hl-group
            >
            <hl-group dir="vertical">
              <hl-group v-for="(item, index) in mapWarningLends" :key="index" class="m-t-sm" align="items-middle">
                <hl-group>
                  <hl-thumb style="width: 20px; height: 20px" :src="item.iconUrl" fit="fit" />
                </hl-group>
                <hl-group class="m-l-md"> {{ item.label }}{{ systemName }} </hl-group>
              </hl-group>
            </hl-group>
          </hl-group>
          <hl-group dir="vertical" class="m-t-lg" width="calc(var(--xxs) * 36)">
            <hl-group><span style="color: rgba(132, 164, 246, 0.4)">监测要素</span></hl-group>
            <hl-group dir="vertical">
              <hl-group v-for="(item, index) in mapElementLends" :key="index" class="m-t-sm" align="items-middle">
                <hl-group>
                  <hl-thumb style="width: 20px; height: 20px" :src="item.iconUrl" fit="fit" />
                </hl-group>
                <hl-group class="m-l-md"> {{ item.label }} </hl-group>
              </hl-group>
            </hl-group>
          </hl-group>
        </hl-group>
      </hl-popover>
      <hl-button @click="mapToolHandle('SET_MAP:plusZoom')" effect="light" equal>
        <template #icon>
          <hl-icon>
            <img src="@/assets/images/mapTool/legend.svg" />
          </hl-icon>
        </template>
      </hl-button>
      <hl-button @click="mapToolHandle('SET_MAP:minusZoom')" effect="light" equal>
        <template #icon>
          <hl-icon>
            <img src="@/assets/images/mapTool/minus.svg" />
          </hl-icon>
        </template>
      </hl-button>
    </hl-group>
  </div>
  <!-- <div class="legend-box p-t-sm p-b-sm" v-if="isShow && showLegend">
    <hl-list>
      <hl-list-item
        v-for="item in legendData[globalData.scene]" :key="item">
        <img :src="`/map/icons/layer/${item}.png`" class="m-r-md"/>
        {{item}}
      </hl-list-item>
    </hl-list>
  </div> -->
</template>
<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { Emitter } from 'mitt';
import { mapWarningLends, mapElementLends } from './constant';

const defaultZoom = ref(16);
const defaultCenter = ref([112.58681, 37.84678]);
const $mitter = inject('$mitter') as Emitter;
const systemName = ref(inject('systemName'));
// eslint-disable-next-line no-undef
// const globalData = inject('globalData') as Indexable;
const showLegend = ref(true);
const mapToolHandle = (type: string) => {
  $mitter.emit(type);
};
</script>
<style lang="scss" scoped></style>
