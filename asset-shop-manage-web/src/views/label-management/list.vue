<!--
 * @Description: 标签管理
 * @Author: liugeng
 * @Date: 2021-05-06
-->
<template>
  <div class="label-wrap">
    <subject-tree :group-type="groupType" :title="title" :current-group-id="currentGroupId" @change-group="changeCurrentGroupId" @reload="reload" />
    <main class="right-wrap">
      <search-header :group-type="groupType" :title="title" @reset="searchTag" @search="searchTag" />
      <div id="content" :style="{'height':contentHeight+'px'}">
        <ul class="tag-wrap">
          <li v-for="(item, index) in tagTreeList " :id="'tag-list-'+item.groupId" :key="`${item.parentId}-${item.groupId}`" class="tag-list"
              :style="'z-index:'+(tagTreeList.length-index)">
            <div
              class="list-header"
              :class="{'list-header-active':item.groupId === currentGroupId}"
              @click.stop="changeCurrentGroupId(item.groupId)">
              <span class="title-name">{{ item.groupName }}</span>
              <div v-if="item.readOnly!=1" class="cls-btn-add-wrap">
                <div class="tag-custom-add" @click="showInput(item);changeCurrentGroupId(item.groupId)">
                  <i class="c-icon-plus"></i>新增
                </div>
              </div>
            </div>
            <div class="list-content">
              <div :ref="'listcontent'" class="flex-box" :style="'height:'+item.height">

                <tagA v-for="(tag) in item.childList" :key="`${tag.parentId}-${tag.groupId}`" :editable="item.readOnly!=1" :tag="tag"
                      class="tag-margin" @deleteTag="handleClose" @editTag="(_tag)=>{editInputConfirm(_tag,tag)}" @dbclickTag="changeCurrentGroupId(item.groupId)" />
              </div>

            </div>
          </li>
        </ul>
      </div>
    </main>
    <dialogAdd
      :visible="dialogVisible"
      flag="add"
      :level="2"
      :label="labelMap[groupType]"
      @close="dialogVisible=false"
      @ok="handleInputConfirm" />
  </div>
</template>
<script>
import { addTag, editTag, delTag, getTagList } from '@/api/label-manage'
import SearchHeader from './components/search-header'
import SubjectTree from './components/subject-tree'
import tagA from '@/components/tag-app'
import dialogAdd from './components/dialog-add.vue'
export default {
  name: 'LabelManagementList',
  components: { SearchHeader, SubjectTree, tagA, dialogAdd },
  props: {
    groupType: {
      type: Number,
      default: 2
    },
    title: {
      type: String,
      default: '标签'
    }
  },
  data() {
    return {
      labelMap: {
        1: '资源',
        2: '标签'
      },
      currentParentId: 0,
      dynamicTags: [
      ],
      tagTreeList: [],
      editForm: {
        editValue: ''
      },
      contentHeight: '400',
      addForm: {
        inputValue: ''
      },
      inputVisible: false,
      followAnimate: null,
      currentGroupId: '',
      searchName: '',
      dialogVisible: false
    }
  },
  created() {
    this.getTagTree()
    this.getContentHeight()
  },
  methods: {
    getContentHeight() {
      this.contentHeight = document.body.clientHeight - 64 - 128 - 56
    },
    changeUpDown(item) {
      item.up = !item.up
      if (item.up) {
        item.height = 'auto'
      } else {
        // item.height = '124px'
      }
    },
    getTagTree() {
      getTagList({ groupType: this.groupType }).then(res => {
        this.tagTreeList = res.data.map(item => {
          // item.height = '124px'
          item.showMore = false
          item.up = false
          item.inputVisible = false
          item.childList = item.childList.map(_item => {
            _item.selected = false
            _item.status = 0
            return _item
          })
          return item
        })

        if (this.tagTreeList.length === 0) return

        this.$nextTick(() => {
          // this.tagTreeList = this.tagTreeList.map((item, index) => {
          //   item.showMore = this.$refs['listcontent'][index].scrollHeight > 135
          //   return item
          // })
          if (!$('.sliding-block-align-move').length) { this.initAnimate() }
          if (this.followAnimate) {
            this.followAnimate.init()
          }
          setTimeout(() => {
            let groupId = this.currentGroupId
            if (this.tagTreeList.findIndex(item => item.groupId === this.currentGroupId) === -1) {
              groupId = this.tagTreeList[0].groupId
            }
            this.changeCurrentGroupId(groupId)
          }, 100)
        })
      })
    },
    // 初始化特效
    initAnimate() {
      setTimeout(() => {
        $('#content').SlidingBlockAlign({
          slider_left: -4
        })
        this.initFollowAnimate()
      }, 0)
    },
    initFollowAnimate() {
      const that = this
      setTimeout(() => {
        that.followAnimate = window.simpleNavFollow({
          parentElement: '#content', // 内容类的父元素
          nav: '.tree-item', // 导航类
          page: '.tag-list', // 内容类
          leaveTop: 20, // 离父类距离
          initTo: 0, // 初始跳转
          animation: 1000, // 动画时间
          followCallBack: function(groupId) {
          },
          navCallBack: function(groupId) {
            // console.log(groupId, 'navCallBack')
            // that.changeCurrentGroupId(groupId)
          }
        })
      }, 0)
    },
    changeCurrentGroupId(groupId) {
      this.currentGroupId = groupId
      $(`#tag-list-${groupId}`).trigger('click9')
    },
    searchTag(name) {
      this.searchName = name
      this.filterTree()
    },
    filterTree() {
      this.tagTreeList = this.tagTreeList.map(item => {
        item.childList = item.childList.map(_item => {
          if (this.searchName && new RegExp(this.searchName, 'ig').test(_item.groupName)) {
            _item.selected = true
          } else {
            _item.selected = false
          }
          return _item
        })
        return item
      })
    },
    reload() {
      this.getTagTree()
    },

    editTag(tag) {
      tag.status = 1
      this.$nextTick(_ => {
        this.editForm.editValue = tag.groupName
        document.getElementById('editTagInput').focus()
      })
    },
    async editInputConfirm(tag, item) {
      const rs = await editTag({ groupName: tag.groupName, groupId: tag.groupId })
      if (rs.code === 0) {
        item.groupName = tag.groupName
        this.$message.success(rs.msg)
        this.getTagTree()
      }
    },
    handleClose(tag) {
      this.$confirm('是否确认删除？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',

        type: 'warning'
      }).then(() => {
        this.deleteTag(tag)
      })
    },
    async deleteTag(tag) {
      const rs = await delTag(tag.groupId)
      if (rs.code === 0) {
        this.getTagTree()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }
    },
    showInput(item) {
      this.currentItem = item
      this.dialogVisible = true
    },
    async handleInputConfirm(addForm) {
      const inputValue = addForm.name
      const item = this.currentItem
      if (inputValue) {
        const rs = await addTag({ parentId: item.groupId, groupName: inputValue, groupType: this.groupType })
        if (rs.code === 0) {
          this.addForm.inputValue = ''
          this.dialogVisible = false
          this.$message.success(rs.msg)
          this.getTagTree()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.label-wrap {
  height: 100%;
  display: flex;
  .right-wrap {
    padding-left: 20px;
    flex: 1;
    ::v-deep .edit-tag-form .c-form-item {
      margin-bottom: 0;
      .c-form-item__content {
        line-height: 32px;
      }
    }
    .edit-tag-form {
      display: inline-block;
    }
    #content {
      margin-top: 20px;
      overflow: auto;
    }
    .tag-wrap {
      position: relative;
      .tag-list {
        margin-bottom: 20px;
        padding-left: 40px;
        position: relative;
        width: 100%;
        background: #FFFFFF;
        border-left: 4px solid #C7EDFF;
        .list-header {
          height: 70px;
          font-size: 16px;
          font-weight: 500;
          color: #3F4254;
          .title-name {
            display: inline-block;
            line-height: 70px;
          }
        }
        .cls-btn-add-wrap {
          position: absolute;
          right: 24px;
          top: 20px;
        }
        .tag-custom-add {
          width: 66px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #36a4ff;
          text-align: center;
          cursor: pointer;
          z-index: 10;
          &:hover {
            background: #EBF9FF;
          }
        }
        .list-content {
          max-height: 104px;
          overflow: hidden;
          width: 100%;
          position: relative;
          .zindex-1 {
            z-index: -1;
          }
          .flex-box {
            width: 100%;
            flex-wrap: wrap;
            display: flex;
            overflow: hidden;
          }
          .line-bottom {
            position: absolute;
            height: 8px;
            background: #ffffff;
            width: 100%;
            left: 0;
            bottom: 0;
          }
        }
        .tag-margin {
          margin: 0px 24px 20px 0;
        }
      }
      .tag-list.active {
        .list-content {
          max-height: none;
          height: auto;
        }
      }
      .c-tag + .c-tag {
        margin-left: 10px;
      }
      .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
    }
  }
}
</style>

<style lang="scss" >
.sliding-block-align {
  background-color: #36a4ff;
  z-index: 10;
}
</style>
