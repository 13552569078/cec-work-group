<template>
  <div class="header">
    <div class="title">
      <div class="icon"></div>
      <div class="title-con">{{ title }}</div>
    </div>
    <div class="con">
      <div class="btn-item ellipsis" v-for="item in buttonList" :key="item.value"
        :class="{ active: modelValue === item.value }" @click="change(item.value)"><span>{{
          item.balel }}</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  title: {
    type: String,
    default: 'GDP及时评估指数'
  },
  modelValue: {
    type: String,
    default: '0'
  },
  buttonList: {
    type: [] as PropType<{ balel: string, value: string }[]>,
    default: () => {
      return [{
        balel: '排名变化',
        value: '0'
      }, {
        balel: '得分排名',
        value: '1'
      }, {
        balel: '考量维度',
        value: '2'
      }]
    }
  }
});


const change = (index: string) => {
  emit('update:modelValue', index);
}


</script>

<style lang="scss" scoped>
.header {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;

  .title {
    font-size: 18px;
    color: #ffffff;
    display: flex;
    align-items: center;
    font-weight: 600;

    .icon {
      height: 44px;
      width: 44px;
      background: url('/@/assets/images/home-page/arrow.png') no-repeat;
      background-size: cover;
    }

    .title-con {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .con {
    display: flex;
    align-items: center;

    .btn-item {
      font-size: 12px;
      width: 73px;
      height: 28px;
      background: url('/@/assets/images/home-page/btn-bg.png') no-repeat;
      background-size: cover;
      // display: flex;
      // align-items: center;
      // justify-content: center;
      text-align: center;
      line-height: 28px;
      color: #ffffff;
      cursor: pointer;

      &.active {
        background: url('/@/assets/images/home-page/btn-active-bg.png') no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>
