<template>
  <div>
    <div class="header-wrap">
      <div class="header-item-index"></div>
      <div class="header-item" v-for="(item, index) in cols" :key="index">
        {{ item.label }}
      </div>
    </div>
    <vue-seamless-scroll
      :data="tableData"
      class="con-warp"
      :class-option="defaultOption"
      :style="{ height }"
      v-if="tableData && tableData.length"
    >
      <div class="data-wrap">
        <div class="data-item m-t-xxs" v-for="(item, index) in tableData" :key="index">
          <hl-group class="data-item-index h-100" align="items-center items-middle">{{
            index + 1
          }}</hl-group>
          <hl-group
            :class="[
              'data-item-col',
              'h-100',
              'ellipsis',
              cursorKeys.includes(keys) ? 'data-item-cursor' : '',
            ]"
            align="items-left items-middle"
            v-for="(keys, index) in colsKey"
            :key="index"
            @click="clickCursorNum(item, keys)"
            >
            <slot v-if="getkeysItem(keys).slot" :name="getkeysItem(keys).slot" :row="item" class="ellipsis"></slot>
            <span v-else class="ellipsis">{{ item[keys] }}</span>
            </hl-group
          >
        </div>
      </div>
    </vue-seamless-scroll>
    <hl-group :style="{ height }" align="items-center items-middle" v-else class="full-x"
      >暂无数据</hl-group
    >
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import vueSeamlessScroll from 'vue-seamless-scroll/src';

interface TableItem {
  [key: string]: string | number;
}

const props = defineProps({
  cols: {
    type: Array as PropType<TableItem[]>,
    default: () => [],
  },
  tableData: {
    type: Array as PropType<TableItem[]>,
    default: () => {
      return [];
    },
  },
  height: {
    type: String,
    default: 'calc(var(--xl) * 2.58)',
  },
  cursorKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(['clickCursorNum']);

const defaultOption = {
  step: window.innerHeight > 3000 ? 5 : 0.5,
  limitMoveNum: 3,
};

const colsKey = computed(() => {
  return props.cols.map(item => {
    return item.key;
  });
});

const getkeysItem = (keys:string) => {
  return props.cols.filter((item:any) => {
    return item.key === keys;
  })[0];
};

const clickCursorNum = (item: TableItem, keys: string) => {
  emit('clickCursorNum', {
    clickCol: keys,
    ...item,
  });
  // if (props.cursorKeys.includes(keys)) {
  //   emit('clickCursorNum', {
  //     clickCol: keys,
  //     ...item,
  //   });
  // }
};
</script>

<style lang="scss">
.header-wrap {
  height: calc(var(--xl) * 1.2);
  // background: url("@/assets/images/eventCenter/ghleft/table-even.png") no-repeat;
  // background-size: cover;
  // background-position: bottom;
  background: rgba(0,126,203,0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-size: calc(var(--xxs) * 14/4);
  line-height: calc(var(--xl) * 1.2);
  .header-item-index {
    width: calc(var(--xl) * 2);
    text-align: center;
  }
  .header-item {
    flex: 1;
    text-align: left;
  }
}
.data-wrap {
  .data-item {
    cursor: pointer;
    height: calc(var(--xl) * 1.2);
    display: flex;
    justify-content: space-between;
    flex: 1;
    gap: var(--xxs);
    color: #DDF2FF;
    font-size: calc(var(--xxs) * 14/4);
    &:nth-child(odd) {
      // background: url("@/assets/images/eventCenter/ghleft/table-even.png") no-repeat;
      background-size: 100% 100%;
      background: rgba(71,132,255,0.1);
    }
    &:nth-child(even) {
      background: rgba(0,11,32,0.15);
      background-size: 100% 100%;
    }
    text-align: left;
  }
  .data-item-index {
    width: calc(var(--xl) * 2);
    text-align: center;
    color: #d0deee;
  }
  .data-item-col {
    flex: 1;
  }
  .data-item-cursor {
    cursor: pointer;
  }
}

.con-warp {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}
</style>
