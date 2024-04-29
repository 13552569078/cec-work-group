<template>
  <div class="track-route-line">
    <ul v-if="listData.length" class="route-timeline">
      <el-scrollbar style="height: 100%">
        <li v-for="(item, index) in listData" :key="index" class="timeline-item">
          <div
            v-if="index < listData.length - 1"
            class="item-tail"
          />
          <div class="item-node" :class="{ 'bg-color': index == 0 }" />
          <div class="item-title">
            <span class="state" :class="{ 'state-active': index == 0 }">{{ item.stateName }}</span><span class="time">{{ item.createTime }}</span><br>
            <div class="desc"><span class="u-name">{{ item.userName }}</span>，{{ item.dealtDesc }}</div>
          </div>
        </li>
      </el-scrollbar>
    </ul>
    <div v-else class="no-route-data">
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.track-route-line {
  margin-top: 16px;
  .route-timeline {
    height: 100%;
    width: 100%;
    padding-left: 0;
    .el-scrollbar {
      border: none;
      box-shadow: none;
    }
    .timeline-item {
      font-size: 16px;
      position: relative;
      padding-bottom: 18px;
      .item-tail {
        position: absolute;
        left: 16px;
        height: calc(100% - 12px);
        top: 18px;
        border-left: 2px dashed #36A4FF;
      }
      .item-node {
        position: absolute;
        border: 2px solid #36A4FF;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 10px;
        top: 5px;
        width: 14px;
        height: 14px;
      }
      .item-icon {
        width: 20px;
        height: 20px;
        position: absolute;
        left: 0;
        top: 0;
      }
      .bg-color {
        background: #36A4FF;
      }
      .item-title {
        padding-left: 32px;
        font-size: 12px;
        color: #8A8A8A;
        padding-top: 4px;
        .state {
            font-size: 14px;
            color: #4B4B4B;
            &.state-active {
                color: #36A4FF;
            }
        }
        .time {
            padding-left: 26px;
            color: #8A8A8A;
        }
        .desc {
            padding-top: 8px;
            .u-name {
              color: #4B4B4B;
            }
        }
      }
      .title-active {
        span {
          font-size: 13px;
        }
        span {
          color: #35beff;
          font-weight: bold;
        }
      }
    }
  }
  .no-route-data {
    width: 180px;
    height: 180px;
    margin-top: 20px;
    div {
      text-align: center;
      color: #a4d2ff;
      font-size: 16px;
      padding-top: 20px;
    }
  }
}
</style>
