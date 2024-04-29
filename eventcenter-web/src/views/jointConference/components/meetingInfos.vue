<template>
  <div class="infos-line">
    <common-title title="联席会议信息" />
    <div class="infos-content mt20">
      <div
        v-for="(item, index) in infosList"
        :key="index"
        placement="top"
        class="details-container"
      >
        <div :class="['content', item.collapse ? 'is-collapse' : 'is-expend']">
          <ul class="head">
            <li class="action">
              <span>关于{{ item.meetingTitle }}事件资源调度会</span>
            </li>
            <li class="icon-wrapper">
              <span class="meeting-time">{{ item.meetingTime }}</span>
              <span>会议详情</span>
              <i class="el-icon-arrow-down" @click.stop="_collapse(item)" />
            </li>
          </ul>
          <div v-show="!item.collapse" class="expend">
            <ul class="meeting-content-details ">
              <!-- 单行 -->
              <li :class="['base-item', {'two-column': item.whistleLevel}]">
                <label class="label">会议描述</label>
                <div class="value">{{ item.meetingDesc || '-' }}</div>
              </li>
              <li class="base-item two-column">
                <label class="label">组织单位</label>
                <div class="value">{{ item.meetingOrgName || '-' }}</div>
              </li>
              <li class="base-item two-column">
                <label class="label">会议发起人</label>
                <div class="value">{{ item.meetingUserName || '-' }}</div>
              </li>
              <li class="base-item two-column">
                <label class="label">参会单位</label>
                <div class="value">{{ item.meetingAttendOrgName || '-' }}</div>
              </li>
              <li class="base-item two-column">
                <label class="label">参会人员</label>
                <div class="value">{{ item.meetingAttendUserName || '-' }}</div>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
    <el-image-viewer
      v-if="showPreview"
      :url-list="imgList"
      :on-close="() => showPreview = false"
    />
    <!-- 视频播放弹窗 -->
    <video-dialog
      :visible.sync="videoDialog"
      :src="videoSrc"
      :type="videoType"
    />
  </div>
</template>
<script>
import ElImageViewer from 'ccxd-ux/packages/image/src/image-viewer'

export default {
  name: 'ProcessTimeLine',
  filters: {
    filtersPath(val) {
      if (val) {
        return val.split('?')[0]
      }
    }
  },
  components: {
    ElImageViewer
  },
  props: {
    infosList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showPreview: false
    }
  },

  watch: {
    infosList: {
      handler(val) {
        if (val) {
          // val.map((item, index) => {
          //   if (index === 0) {
          //     item.collapse = false
          //   } else {
          //     item.collapse = true
          //   }
          // })
        }
      },
      immediate: true
    }
  },
  methods: {
    _collapse(item) {
      this.$set(item, 'collapse', !item.collapse)
    }

  }
}
</script>
<style lang="scss" scoped>
.infos-line {
  padding: 20px;
  ::v-deep {
    .el-timeline-item {
      .custom-node {
        display: flex;
        font-size: 14px;
        color: #4B4B4B;
        .icon-circle {
          width: 14px;
          height: 14px;
          border-radius: 100%;
          background: #FFFFFF;
          border: 3px solid #8A8A8A;
          margin-left: -1px;
          margin-right: 9px;
        }
        &.is-active {
          .icon-circle {
            border-color: #36a4ff;
          }
        }
        .event-statue {
          margin-right: 8px;
        }
      }
      .el-timeline-item__content {
        margin-top: 23px;
        color: #4B4B4B;

      }
    }
  }
  .infos-content{
    .head {
      display: flex;
      align-items: center;
      .action{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #202020;
        font-weight: 500;
      }
      .meeting-time{
font-family: PingFangSC-Regular;
font-size: 14px;
color: #4B4B4B;
text-align: right;
font-weight: 400;
      margin-right: 24px;
      }
     .icon-wrapper {
        margin-left: auto;
        .el-icon-arrow-down {
          margin-left: 8px;
          color: #BDBDBD;
          cursor: pointer;
        }
      }
    }
    .details-container{
    padding: 16px;
    background: #F7F9FC;
    margin-bottom: 16px;
   }
   ::v-deep{
     .el-icon-arrow-down{
       font-weight: 900;
     }
   }
  }

  .content {
          .expend {
            .comment {
              .title {
                color: #8A8A8A;
              }
            }
          }
          &.is-expend {
            .head {
              padding-bottom: 10px;
              .el-icon-arrow-down {
                transform: rotate(180deg);
                color: #36a4ff;
              }
            }
          }
          .custorm-header-row, .custorm-row,  .custorm-header-row th, .el-table__empty-block{
            background: #F1F3F8;
          }
          .custorm-header-row {
            th .cell {
              color: #8A8A8A;
            }
          }
        }
  .media-list {
    .title {
      color: #8A8A8A;
    }
    .media-wrapper {
      display: flex;
      flex-wrap: wrap;
      margin: 16px 0;
    }
    .media-item {
        position: relative;
        width: 120px;
        height: 120px;
        margin-right: 16px;
        .video,
        .audio {
          width: 100%;
          height: 100%;
        }
        &:hover {
          .hover {
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
          }
          .hover-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            .icon {
              width: 24px;
              height: 24px;
              background-repeat: no-repeat;
              cursor: pointer;
              margin-right: 16px;
            }
            .icon-radio {
              background-image: url(~@/assets/icon-radio-play-hover.png);
            }
            .icon-video {
              background-image: url(~@/assets/icon-video-play-hover.png);
            }
            .icon-search {
              background-image: url(~@/assets/icon-search.png);
            }
            .icon-download {
              background-image: url(~@/assets/icon-download.png);
            }
          }
        }
      }
  }
   .meeting-content-details {
    display: flex;
    flex-wrap: wrap;
    .base-item {
      width: 100%;
      margin-top: 20px;
      &.two-column {
        width: 50%;
      }
      .label {
        text-align: left;
        display: inline-block;
        color: #8a8a8a;
        margin-bottom: 8px;
      }
      .value {
        padding-right: 20px;
      }
      &.location-map {
        .value {
          display: flex;
          .icon {
            width: 140px;
            align-self: flex-start;
          }
        }
        .icon {
          cursor: pointer;
          background-image: url(~@/assets/查看地址.png);
          background-repeat: no-repeat;
          background-position: bottom right;
          color: #36A4FF;
          padding-right: 20px;
          padding-left: 20px;
        }
      }
    }
  }
}
</style>
