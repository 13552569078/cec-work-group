<template>
  <div class="process-time-line">
    <common-title title="事件流程" />
    <div class="content mt20">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in processList"
          :key="index"
          placement="top"
        >
          <!-- dot -->
          <template slot="dot">
            <div :class="['custom-node', {'is-active': index === 0}]">
              <i class="icon-circle" />
              <span class="event-statue">{{ item.activityName }}</span>
              <!-- 先取结束时间，如果没有，则取开始时间 -->
              <span class="timestamp">{{ item.endTime || item.startTime }}</span>
              <!-- 如果有城管轨迹则显示 -->
              <span
                v-if="item.activityId==='handle' && showChengGuanProcess"
                class="cheng-guan"
                @click="_showChengGuan"
              >
                <span>城管处理轨迹</span>
                <span class="icon" />
              </span>
            </div>
          </template>
          <div :class="['content', item.collapse ? 'is-collapse' : 'is-expend']">
            <ul class="head">
              <li class="action">
                <i class="circle" />
                <span>{{ item.action || '未认领' }}</span>
              </li>
              <li class="name ellipsis" :title="_transformName(item)">{{ _transformName(item) }}</li>
              <li class="icon-wrapper">
                <span style="cursor: pointer;" @click.stop="_collapse(item)" />
                <i class="el-icon-arrow-down" @click.stop="_collapse(item)" />
              </li>
            </ul>
            <div v-show="!item.collapse" class="expend">
              <el-table
                v-if="formatRowTable(item).length"
                :data="formatRowTable(item)"
                style="width: 100%"
                row-class-name="custorm-row"
                header-row-class-name="custorm-header-row"
              >
                <el-table-column prop="schedulType" label="调度类型" />
                <el-table-column prop="deptName" label="调度组织" />
                <el-table-column prop="roleName" label="调度角色" />
              </el-table>
              <div class="comment">
                <label class="title">处理意见</label>
                <p class="value">{{ item.comment }}</p>
              </div>
              <!-- 多媒体 -->
              <div v-if="item.media && item.media.length" class="media-list">
                <label class="title">事件多媒体</label>
                <ul class="media-wrapper">
                  <li v-for="media in item.media" :key="media.id" class="media-item">
                    <video
                      v-if="
                        media &&
                          (media.mediaType.includes('video') ||
                            media.mediaType.includes('audio'))
                      "
                      :src="media.mediaPath"
                      class="video"
                    />
                    <el-image
                      v-else
                      style="width: 100%; height: 100%"
                      :src="media.mediaPath"
                    />
                    <!-- hover 操作 -->
                    <div class="hover">
                      <div class="hover-wrapper">
                        <span v-if="media.mediaType.includes('audio')" class="icon-radio icon" title="音频播放" @click.stop="_openDialog(media)" />
                        <span v-if="media.mediaType.includes('video')" class="icon-video icon" title="视频播放" @click.stop="_openDialog(media)" />
                        <span v-if="media.mediaType.includes('image')" class="icon-search icon" title="查看" @click.stop="_openDialog(media, item)" />
                        <span class="icon-download icon" title="下载" @click.stop="_download(media)" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
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
    <!-- 城管处理轨迹弹窗 -->
    <chengguan-dialog
      :visible.sync="chengguanDialog"
      :process-list="chengGuanList"
    />
  </div>
</template>
<script>
import videoDialog from './dialog/video'
import chengguanDialog from './dialog/chengguan'
import ElImageViewer from 'ccxd-ux/packages/image/src/image-viewer'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

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
    videoDialog,
    chengguanDialog,
    ElImageViewer
  },
  props: {
    processList: {
      type: Array,
      default: () => []
    },
    eventInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showPreview: false,
      videoDialog: false,
      chengguanDialog: false,
      chengGuanList: [],
      videoSrc: '',
      videoType: 'video/mp4',
      imgList: [] // 图片预览集合
    }
  },
  computed: {
    // 只有 event.taskNum 且 process 对象中的activityId === 'handle' 就认为是有城管轨迹查询
    showChengGuanProcess() {
      try {
        return this.eventInfo.taskNum
      } catch (error) {
        return false
      }
    }
  },
  methods: {
    // 打开城管轨迹
    _showChengGuan() {
      const params = {
        eventId: this.eventInfo.id
      }
      moduleSrv.getProcessListFromChengguan(params).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.chengGuanList = res.data.process || []
          this.chengguanDialog = true
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 视频弹窗
    _openDialog(item, info) {
      if (item.mediaType.includes('video') || item.mediaType.includes('audio')) {
        this.videoSrc = item.mediaPath
        this.videoType = item.mediaType
        this.videoDialog = true
      } else {
        try {
          this.imgList = info.media.map(media => {
            let path = media.mediaPath
            !path.includes('http') && (path = `${window.location.origin}/${path}`)
            if (media.mediaType.includes('image')) {
              // 对 path 进行处理
              if (path) path = path.split('?')[0]
              return path
            }
          })
        } catch (error) {
          console.log('_openDialog--error', error)
        }
        this.showPreview = true
      }
    },
    _download(item) {
      let url = item.mediaPath
      if (url) {
        const arr = url.split('?filename=')
        if (arr.length >= 1) {
          const filename = arr[1]
          if (/&amp;|fm=/g.test(filename)) {
            const str = 'img_dowm'
            url = arr[0] + '?filename=' + str
          }
        }
      }
      let a = document.createElement('a')
      let event = new MouseEvent('click')
      a.download = item.mediaName
      a.href = url
      a.dispatchEvent(event)
      a = null
      event = null
    },
    // 流程名称拼接
    _transformName(item) {
      let str = ''
      if (item.deptName) {
        str += item.deptName + '-'
      }
      if (item.roleName) {
        str += item.roleName + '-'
      }
      if (item.userName) {
        str += item.userName
      }
      return str.replace(/^\-+|\-+$/g, '')
    },
    _collapse(item) {
      this.$set(item, 'collapse', !item.collapse)
    },

    // 格式化面板数据
    formatRowTable(row) {
      const flowsList =
        row.flowsList?.map((item) => {
          return {
            ...item,
            schedulType: '协办'
          }
        }) || []
      const notifyList =
        row.notifyList?.map((item) => {
          return {
            ...item,
            schedulType: '知会'
          }
        }) || []
      const list = [...flowsList, ...notifyList]
      if (list.length) {
        this.hasMsg = true
      } else {
        this.hasMsg = false
      }
      return list
    }
  }
}
</script>
<style lang="scss" scoped>
.process-time-line {
  padding: 20px;
  background: #ffffff;
  ::v-deep {
    .el-timeline-item {
      .custom-node {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #4B4B4B;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        .icon-circle {
          width: 14px;
          height: 14px;
          border-radius: 100%;
          background: #FFFFFF;
          border: 3px solid #8A8A8A;
          margin-left: -1px;
          margin-right: 10px;
        }
        &.is-active {
          .icon-circle {
            border-color: #36a4ff;
          }
        }
        .event-statue {
          margin-right: 12px;
          padding-left: 18px;
          padding-right: 18px;
          min-width: 60px;
          height: 26px;
          line-height: 26px;
          background: url('~@/assets/eventInfo/process-label-bg.png') no-repeat;
          background-size: 100% 100%;
          color: #FFFFFF;
        }
        .timestamp {
          color: #8A8A8A;
        }
        .cheng-guan {
          margin-left: 40px;
          color: #36A4FF;
          cursor: pointer;
          display: flex;
          align-items: center;
          z-index: 2;
          .icon {
            margin-left: 5px;
            width: 11px;
            height: 13px;
            background-image: url(~@/assets/shuangjiantou.png);
          }
        }
      }
      .el-timeline-item__tail {
        left: 5px;
        top: 10px;
      }
      .el-timeline-item__content {
        margin-top: 35px;
        color: #4B4B4B;
        .content {
          background: #F9FAFE;
          .head {
            display: flex;
            align-items: center;
            padding: 10px 12px;
            .action{
              font-weight: 500;
              color: #8A8A8A;
              background: #EAF5FF;
              font-size: 12px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              padding: 3px 8px;
              height: 20px;
              margin-right: 13px;
              flex-shrink: 0; // 不缩放
              .circle {
                width: 4px;
                height: 4px;
                background: #8A8A8A;
                border-radius: 100%;
                margin: 0 5px;
              }
            }
            .name {
              margin-right: 10px;
            }
            .icon-wrapper {
              margin-left: auto;
              flex-shrink: 0;
              .el-icon-arrow-down {
                margin-left: 8px;
                color: #BDBDBD;
                cursor: pointer;
              }
            }
          }
          .expend {
            background: #F9FAFE;
            .comment {
              padding: 16px 12px;
              .title {
                color: #8A8A8A;
              }
              .value {
                margin-bottom: 0;
                margin-top: 10px;
              }
            }
          }
          &.is-expend {
            .head {
              border-bottom: 1px solid #EDEDED;
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
      }
    }
  }
  .media-list {
    padding: 0 12px;
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
}
</style>
