<!--
 * @description 全局事件详情 -- 城管处理轨迹
 * @date 2022-02-28
 * @author lism
-->
<template>
  <div class="process-time-line">
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
              <span class="event-statue">{{ item.actDefName }}</span>
              <span class="timestamp">{{ item.actionTime }}</span>
            </div>
          </template>
          <div :class="['content', item.collapse ? 'is-collapse' : 'is-expend']">
            <ul class="head">
              <li class="action">
                <i class="circle" />
                <span>{{ item.actionName || '未认领' }}</span>
              </li>
              <li class="name">{{ item.humanName }}</li>
              <li class="icon-wrapper">
                <span>处理内容</span>
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
                <p>{{ item.content }}</p>
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
  </div>
</template>
<script>
import videoDialog from './dialog/video'
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
    videoDialog,
    ElImageViewer
  },
  props: {
    processList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showPreview: false,
      videoDialog: false,
      videoSrc: '',
      videoType: 'video/mp4',
      imgList: [] // 图片预览集合
    }
  },

  methods: {
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
        .content {
          padding: 10px 16px;
          background: #F5F7FA;
          box-shadow: inset 0px 0px 30px 0px #DCE9F5;
          .head {
            display: flex;
            align-items: center;
            .action{
              font-weight: 500;
              color: #8DA5B8;
              background: #EAF5FF;
              font-size: 12px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              padding: 3px 8px;
              height: 20px;
              margin-right: 13px;
              .circle {
                width: 4px;
                height: 4px;
                background: #8DA5B8;
                border-radius: 100%;
                margin: 0 5px;
              }
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
          .expend {
            background: #F1F3F8;
            margin-top: 10px;
            .comment {
              .title {
                color: #8A8A8A;
              }
              margin: 16px 0 5px;
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
