<template>
  <hl-dialog class="urgency-dialog" v-model="visible" :width="'calc(var(--xl)* 19.2)'" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h2 class="panel-title">
        <slot name="title">
          <hl-group class="title-area" align="items-middle">
            <hl-group class="title-point" align="items-middle">
              <hl-group class="point-inner"></hl-group>
            </hl-group>
            <hl-group class="title-text m-l-xs">{{title}}</hl-group>
          </hl-group>
        </slot>
      </h2>
      <div class="panel-header-right m-r-md">
        <slot name="action"></slot>
      </div>
      <div class="close cursor-pointer" @click="handleClose">
        <img :src="closeButton" />
      </div>
    </template>
    <template #default>
      <hl-select style="width: calc(var(--xl) * 4.96);margin-bottom: calc(var(--xl) * 0.6);" @change="changeType"  v-model="selectedFlag" size="sm">
        <hl-option
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></hl-option>
      </hl-select>
      <event-list :list="list"></event-list>
    </template>
  </hl-dialog>
</template>

<script lang='ts' setup>
import { ref, withDefaults, computed } from 'vue';
import closeButton from '@/assets/images/dialog/close.png';
import { EventList } from '@/components';
import { apiIndexPagePendingObj } from '@/apis';
import { isEmpty } from 'lodash-es';
import { useGlobalState } from '@/hooks';
const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getAbnormalList();
  }
});

const selectedFlag = ref(1);
const options = [
  {
    label: '长期未处理',
    value: 1
  },
  {
    label: '超时',
    value: 2
  },
  {
    label: '调度异常',
    value: 3
  }
];

const emit = defineEmits(['close']);

const visible = ref(true);

const title = '异常事件';
const list = ref();

const getAbnormalList = async () => {
  const params = {
    type: selectedFlag.value,
    pageNum: 1,
    pageSize: 999,
  };
  const res = await apiIndexPagePendingObj.postAbnormalListPage(params);
  if (res.data.list.length) {
    list.value = res.data.list.map(e => ({
      id: e.id,
      title: e.title,
      time: e.eventTime,
      name: `${e.eventTypeLName ?? '--'}/${e.eventTypeMName ?? '--'}/${e.eventTypeName ?? '--'}`,
      address: e.address,
      showPosition: !isEmpty(e.coordx) && !isEmpty(e.coordy),
      value1: e.sourcePlatform,
      value2: e.destPlatform,
      overtimeList: [
        {
          name: '调度',
          value: e.dispatchOverTime,
        },
        {
          name: '处置',
          value: e.handleOverTime,
        },
        {
          name: '办结',
          value: e.endOverTime,
        },
      ]
    }));
  } else {
    list.value = [];
  }
};

getAbnormalList();

const changeType = () => {
  getAbnormalList();
};

const handleClose = () => {
  visible.value = false;
  emit('close');
};

</script>

<style lang="scss">
.urgency-dialog {
  top: 50% !important;
  transform: translate(0, -50%);
  margin: 0 auto!important;
  background-image: url('@/assets/images/dialog/dialog_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .panel-header {
    padding: 0 calc(var(--xl) * 0.6);
    min-height: calc(var(--xl) * 1.8) !important;
    max-height: calc(var(--xl) * 1.8);
    border-bottom: 0 none!important;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
    .title-area {
      .title-point {
        width: calc(var(--xl) * 0.26);
        height: calc(var(--xl) * 0.26);
        background: #FFE897;
        opacity: 0.32;
        .point-inner {
          width: calc(var(--xl) * 0.14);
          height: calc(var(--xl) * 0.14);
          background: #FFE897;
        }
      }
      .title-text{
        align-items: center;
        font-size: calc(var(--xl) * 0.6);
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #FFFFFF;
        background: linear-gradient(360deg, #FF4C15 0%, #FF7F17 30%, #FFDC52 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .panel-body {
    padding-top: 0!important;
  }
  .close {
    margin-bottom: calc(var(--xxl) * 0.22);
      img {
        width: calc(var(--xxl) * 0.672);
      }
    }
}
</style>
