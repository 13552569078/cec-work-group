<!--
 * @Description: 标签管理
 * @Author: liugeng
 * @Date: 2021-05-06
-->
<template>
  <div class="label-wrap">
    <main class="right-wrap">
      <search-header @reset="searchTag" @search="searchTag"></search-header>
      <div id="content" :style="'height:calc(100% - 90px)'">

        <ul class="tag-wrap">

          <li v-for="item,index in tagTreeList " :id="'tag-list-'+item.groupId" :key="item.treeId"
              class="tag-list" :style="'z-index:'+(tagTreeList.length-index)">
            <div class="list-header" :class="{'list-header-active':item.groupId === currentGroupId}" @click="changeCurrentGroupId(item.groupId)">{{ item.groupName }}
            </div>
            <div class="list-content">
              <div :ref="'listcontent'" class="flex-box" :style="'height:'+item.height">
                <c-form v-if="item.inputVisible" class="edit-tag-form" :model="addForm" @submit.native.prevent>
                  <c-form-item prop="inputValue">
                    <c-input
                      :ref="item.treeId" v-model="addForm.inputValue"
                      style="width: 200px;margin:0;" maxlength="10" class="input-new-tag"
                      size="small" @keydown.enter.native="handleInputConfirm(item)"
                      @blur="handleInputConfirm(item)">
                    </c-input>
                  </c-form-item>
                </c-form>
                <div v-else class="tag-custom-add">
                  <div class="btn-content" @click="showInput(item);changeCurrentGroupId(item.groupId)">
                    <span class="tag-add"></span>
                    <span class="line"></span>
                    <span class="tag-content">新增标签</span>
                  </div>
                </div>

                <tagA v-for="(tag) in item.childList" :key="tag.treeId" :editable="true" :tag="tag"
                      class="tag-margin" @deleteTag="handleClose" @editTag="(_tag)=>{editInputConfirm(_tag,tag)}" @dbclickTag="changeCurrentGroupId(item.groupId)" />
                <div v-if="item.showMore" class="more-icon " :class="item.up?'down':'up'"
                     @click="changeUpDown(item)"></div>
                <div v-if="item.up" class="line-bottom"></div>
              </div>

            </div>
          </li>
        </ul>
      </div>
    </main>
    <subject-tree :current-group-id="currentGroupId" @change-group="changeCurrentGroupId" @reload="reload"></subject-tree>
  </div>
</template>
<script>
import { addTag, editTag, delTag } from '@/api/label-manage'
import { tagTree } from '@/api'
import SearchHeader from './components/search-header'
import SubjectTree from './components/subject-tree'
import tagA from '@/components/tag-app'
export default {
  name: 'LabelManagement',
  components: { SearchHeader, SubjectTree, tagA },
  data() {
    return {
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
      searchName: ''
    }
  },
  created() {
    this.getTagTree()
    this.getContentHeight()
  },
  methods: {
    getContentHeight() {
      this.contentHeight = document.body.clientHeight - 64 - 128 - 50
    },
    changeUpDown(item) {
      item.up = !item.up
      if (item.up) {
        item.height = 'auto'
      } else {
        item.height = '124px'
      }
    },
    getTagTree() {
      tagTree().then(res => {
        this.tagTreeList = res.data.map(item => {
          item.height = '124px'
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

        if (this.tagTreeList.findIndex(item => item.groupId === this.currentGroupId) === -1) {
          this.changeCurrentGroupId(this.tagTreeList[0].groupId)
        }
        this.$nextTick(() => {
          // $refs&&$refs['listcontent'+index].scrollHeight > 124
          this.tagTreeList = this.tagTreeList.map((item, index) => {
            item.showMore = this.$refs['listcontent'][index].scrollHeight > 135
            return item
          })
          if (!$('.sliding-block-align-move').length) { this.initAnimate() }
          if (this.followAnimate) {
            setTimeout(() => {
              this.followAnimate.init()
            }, 100)
          }
        })
      })
    },
    // 初始化特效
    initAnimate() {
      setTimeout(() => {
        $('#content').SlidingBlockAlign({
          slider_left: 188
        });
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
          followCallBack: function (groupId) {
          },
          navCallBack: function (groupId) {
            // console.log(groupId, 'navCallBack')
            // that.changeCurrentGroupId(groupId)
          }
        });
      }, 0)
    },
    changeCurrentGroupId(groupId) {
      this.currentGroupId = groupId
      $('#tag-list-' + groupId).trigger('click9')
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
        });
      }
    },

    showInput(item) {
      item.inputVisible = true
      this.$nextTick(_ => {
        this.$refs[item.treeId][0].focus()
      })
    },

    async handleInputConfirm(item) {
      const inputValue = this.addForm.inputValue
      if (inputValue) {
        const rs = await addTag({ parentId: item.groupId, groupName: inputValue })
        if (rs.code === 0) {
          this.addForm.inputValue = ''
          this.inputVisible = false
          this.$message.success(rs.msg)
          this.getTagTree()
        }
      } else {
        item.inputVisible = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.label-wrap {
  height: 100%;
  // padding: 0 0 0 16px;
  background: #fff;
  display: flex;
  .right-wrap {
    border-left: 1px solid #ededed;
    flex: 1;
    ::v-deep .edit-tag-form .c-form-item {
      margin-bottom: 0;
      .c-form-item__content {
        line-height: 32px;
      }
    }
    .edit-tag-form {
      margin-right: 10px;
      display: inline-block;
      margin: 10px 10px 10px 0;
    }
    #content {
      padding: 0px 24px 0;
      overflow: auto;
    }
    .tag-wrap {
      position: relative;
      .tag-list {
        display: flex;
        height: 124px;
        margin-bottom: 8px;
        position: relative;
        width: 100%;
        .list-header {
          padding-left: 20px;
          background: #f1f3f8;
          color: #8a8a8a;
          border-right: 4px solid #def0ff;
          height: 100%;
          vertical-align: middle;
          width: 192px;
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          &::after {
            content: '';
            display: block;
            position: absolute;
            width: 4px;
            height: 8px;
            background: #fff;
            bottom: -8px;
            right: -4px;
            z-index: 19;
          }
        }
        .list-header-active{
          font-weight: 500;
          color: #36A4FF;
        }
        .list-content {
          width: calc(100% - 192px);
          height: 124px;
          position: relative;
          .zindex-1 {
            z-index: -1;
          }
          .flex-box {
            padding: 10px 24px 20px 20px;
            position: absolute;
            background: rgba(249, 250, 254, 0.9);
            height: 124px;
            width: 100%;
            flex-wrap: wrap;
            display: flex;
            overflow: hidden;
          }
          .more-icon {
            width: 24px;
            height: 24px;
            position: absolute;
            right: 4px;
            bottom: 12px;
            cursor: pointer;
            background: url(~@/assets/application/icon-updown.png) no-repeat;
            &:hover {
              background: url(~@/assets/application/icon-updown-hover.png)
                no-repeat;
            }
          }
          .down {
            transform: rotate(180deg);
            // background:url(~@/assets/application/icon-updown-hover.png) no-repeat;
          }
          .line-bottom{
            position: absolute;
            height: 8px;
            background: #FFFFFF;
            width: 100%;
            left: 0;
            bottom: 0;
          }
        }
        .tag-margin {
          margin: 10px 10px 10px 0;
        }
      }
      .tag-custom-add {
        width: 121px;
        height: 32px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #36a4ff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4b4b4b;
        display: inline-block;
        margin: 10px 10px 10px 0;
        .btn-content {
          display: flex;
          align-items: center;
          height: 100%;
          width: 100%;
          padding-left: 20px;
          cursor: pointer;
          color: #36a4ff;
        }
        .line {
          width: 1px;
          height: 12px;
          background: #e7e7e7;

          margin: 0 8px 0 8px;
          display: block;
        }
        .tag-add {
          width: 16px;
          height: 16px;
          display: inline-block;
          background: url(../../../assets/svg/tag-add.svg);
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
