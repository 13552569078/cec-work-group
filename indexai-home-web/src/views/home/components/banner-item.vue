<template>
  <div class="banner-item">
    <div class="icon-wrap">
      <div class="icon"></div>
      <div class="icon-con">
        <div class="value-wrap">
          <div class="value">
            {{ data?.value }}<span class="unit"> {{ data?.unit }}</span>
          </div>
        </div>
        <div class="desc ellipsis"> {{ data?.desc }}</div>
      </div>
    </div>
    <div class="bottom-wrap">
      <div class="bottom-item">
        <div class="bottom-label">风险</div>
        <div class="bottom-value-red"> {{ data?.dangerValue }}</div>
      </div>
      <div class="bottom-item">
        <div class="bottom-label">正常</div>
        <div class="bottom-value-green"> {{ data?.normalValue }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => { }
  }
});

</script>

<style lang="scss" scoped>
.banner-item {
  font-family: PingFangSC-Regular, PingFang SC;
  width: 236px;
  height: 170px;
  background: url('/@/assets/images/home-page/banner-bg.png') no-repeat;
  background-size: cover;
  padding: 27px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .icon-wrap {
    display: flex;

    .icon {
      height: 61px;
      width: 61px;
      background: url('/@/assets/images/home-page/banner-icon.png') no-repeat;
      background-size: contain;
    }

    .icon-con {
      margin-left: 10px;
      display: flex;
      flex-direction: column;

      .value-wrap {

        .value {
          font-size: 32px;
          font-family: Impact;
        }

        .unit {
          font-size: 14px;
          margin-left: 6px;
        }
      }

      .desc {
        width: 116px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
  }

  .bottom-wrap {
    display: flex;

    .bottom-item {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .bottom-label {
      font-size: 16px;
    }

    .bottom-value-red {
      font-size: 24px;
      font-family: Impact;
      color: #FD6161;
      margin-left: 10px;
    }

    .bottom-value-green {
      font-size: 24px;
      font-family: Impact;
      color: rgba(114, 245, 172, 1);
      margin-left: 10px;
    }
  }
}
</style>
