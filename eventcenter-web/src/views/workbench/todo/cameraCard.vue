<template>
  <div class="camera-card">
    <div class="c-head">
      <span>摄像头</span>
      <i class="el-icon-close" @click.stop="closeCameraCard" />
    </div>
    <div class="c-con">
      <div class="cc-item">
        <div class="cc-label">部件名称</div>
        <div class="cc-val">{{ vobj.deviceName || '-' }}</div>
      </div>
      <div class="cc-item">
        <div class="cc-label">所属网格</div>
        <div class="cc-val ellipsis2">{{ vobj.orgName || '-' }}</div>
      </div>
      <div class="cc-item">
        <div class="cc-label">联系人</div>
        <div class="cc-val">{{ vobj.contact || '-' }}</div>
      </div>
      <div class="cc-item">
        <div class="cc-label">联系方式</div>
        <div class="cc-val">{{ vobj.contactTel || '-' }}</div>
      </div>
    </div>
    <div class="c-foot">
      <div class="ccc-btn" @click="viewCamera">查看视频</div>
    </div>
    <video-live
      v-if="videoLiveVisible"
      :visible.sync="videoLiveVisible"
      :video-obj="vobj"
    />
  </div>
</template>

<script>
import videoLive from './videoLive.vue'

export default {
  name: 'EventcenterWebGridmanCard',
  components: { videoLive },
  props: {
    vobj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      videoLiveVisible: false
    }
  },

  mounted() {

  },

  methods: {
    viewCamera() {
      this.videoLiveVisible = true
    },
    closeCameraCard() {
      this.$emit('update:vobj', null)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .camera-card {
      width: 320px;
      height: 281px;
      background: rgba(255,255,255,0.9);
      box-shadow: 0px 3px 10px 0px rgba(121,126,137,0.3);
      border-radius: 4px;
      position: absolute;
      right: 20px;
      top: 32px;
      z-index: 2;
      .c-head {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        height: 46px;
        border-bottom: 1px solid #DDDDDD;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        i {
            cursor: pointer;
        }
    }
    .c-con {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 20px 0;
        border-bottom: 1px solid #DDDDDD;
        .cc-item{
            height: 70px;
            width: calc(50% - 10px);
            &:nth-child(odd) {
                margin-right: 10px;
            }
            &:nth-child(even) {
                margin-left: 10px;
            }
            .cc-label {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #8A8A8A;
                margin-bottom: 10px;
            }
        }
    }
    .c-foot {
        padding: 20px 20px 0;
        .ccc-btn {
            background: #EBF9FF;
            border-radius: 2px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
            color: #36A4FF;
        }
    }
  }
  </style>

