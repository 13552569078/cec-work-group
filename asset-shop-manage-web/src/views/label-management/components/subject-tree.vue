<!--
 * @Description:专题树
 * @Author: liugeng
 * @Date: 2021-05-06
-->
<template>
  <div class="subject-tree">
    <c-button type="primary" class="add-wrap" @click="addTreeNode">
      <i class="c-icon-edit-outline add-icon"></i>
      添加{{ title }}分类
    </c-button>
    <div id="tree-content" class="tree-content">
      <div
        v-for="item in treeData"
        :key="item.groupId"
        :data-id="item.groupId"
        class="tree-item tag-tree-item"
        :class="`treeitem${item.groupId} ${item.selected?'selected':''}`"
        @mouseover="mouseover(item)"
        @mouseleave="mouseleave(item)"
        @click="changeGroup(item)"
      >
        <i
          v-if="item.selected||item.hover"
          class="selected-icon bg-move"
          style="background-image:url('./static/imgs/tag-selected.png')"
        ></i>
        <span
          class="tag-group-name"
          :class="item.selected||item.hover?'selected':''"
        >{{ item.groupName }}</span>
        <div v-if="item.readOnly!=1" class="table-item-btn">
          <i class="c-icon-edit-outline icon-edit show-dropdown" @click.stop="commondClick({item:'编辑',data:item})"></i>
          <i class="c-icon-delete icon-del show-dropdown" @click.stop="commondClick({item:'删除',data:item})"></i>
        </div>
      </div>
    </div>
    <dialogAdd
      :visible="dialogVisible"
      :flag="editOrAdd"
      :level="1"
      :label="labelMap[groupType]"
      :init="form"
      @close="dialogVisible=false"
      @ok="confirm" />
  </div>
</template>
<script>
import { getRootTag, delTag, addTag, editTag } from '@/api/label-manage'
import dialogAdd from './dialog-add.vue'

export default {
  name: 'SubjectTree',
  components: { dialogAdd },
  props: {
    currentGroupId: {
      type: [Number, String]
    },
    groupType: {
      type: Number,
      require: true
    },
    title: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      subCurrentGroupId: 0,
      treeProps: {
        label: 'groupName'
      },
      formLabelWidth: '80px',

      form: {
        name: ''
      },
      labelMap: {
        1: '资源',
        2: '标签'
      },
      rules: {
        name: [
          {
            required: true,
            validator: (rule, val, cb) => {
              if (!val) {
                cb(`请输入${this.title}分类`)
              } else {
                cb()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      dropdownBtns: ['编辑', '删除'],
      editOrAdd: 'add',
      treeData: []
    }
  },
  watch: {
    currentGroupId(n) {
      console.log('-----111', n)
      if (this.treeData.length) {
        this.changeGroup(this.treeData.find((item) => item.groupId === n))
        document.querySelector('.treeitem' + n) &&
          document.querySelector('.treeitem' + n).scrollIntoView()
      }
    },
    dialogVisible(n) {
      if (!n) {
        this.form.name = ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    mouseover(item) {
      item.hover = true
    },
    mouseleave(item) {
      item.hover = false
    },
    changeGroup(node) {
      this.subCurrentGroupId = node.groupId
      this.treeData = this.treeData.map((item) => {
        if (item.groupId === this.subCurrentGroupId) {
          item.selected = true
        } else {
          item.selected = false
        }
        return item
      })
      this.$emit('change-group', this.subCurrentGroupId)
    },
    commondClick(commond) {
      this.editCurrentTagGroup = commond
      switch (commond.item) {
        case '添加':
          this.addTreeNode()
          break
        case '编辑':
          this.editTreeNode(commond.data)
          break
        case '删除':
          this.delTreeNode(commond.data)
          break
      }
    },
    async getList(flag) {
      if (flag) {
        this.$emit('reload')
      }
      const rs = await getRootTag({ groupType: this.groupType })
      if (rs.code === 0) {
        this.treeData = rs.data.map((item) => {
          item.selected = false
          item.hover = false
          return item
        })
      }
    },
    addTreeNode() {
      this.editOrAdd = 'add'
      this.dialogVisible = true
    },
    editTreeNode(tag) {
      this.editOrAdd = 'edit'
      this.form.name = tag.groupName
      this.dialogVisible = true
    },
    delTreeNode(tag) {
      this.$confirm('请确认是否删除节点？', '提示', {
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
        this.getList(true)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }
    },
    async editTagSave(tag, inputValue) {
      const rs = await editTag({ groupName: inputValue, groupId: tag.groupId })
      if (rs.code === 0) {
        this.$message.success(rs.msg)
        this.form.name = ''
        this.getList(true)
      }
    },
    async addTagSave(value) {
      const rs = await addTag({
        parentId: 0,
        groupName: value,
        groupType: this.groupType
      })
      if (rs.code === 0) {
        this.$message.success(rs.msg)
        this.form.name = ''
        this.getList(true)
      }
    },
    confirm(form) {
      this.dialogVisible = false
      if (this.editOrAdd === 'add') {
        this.addTagSave(form.name)
      } else {
        this.editTagSave(this.editCurrentTagGroup.data, form.name)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.selected {
  color: $primaryColor;
}
.tag-group-name.selected {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-tree-item {
  &:hover {
    .show-dropdown {
      display: inline-block;
    }
  }
  &.selected {
    border-radius: 4px;
    background: #F9FAFE;
    .show-dropdown {
      display: inline-block;
    }
  }
}
.table-item-btn {
  width: 48px;
  height: 16px;
  position: absolute;
  right: 16px;
  text-align: right;
  .icon-edit {
    margin-right: 16px;
  }
  .show-dropdown {
    width: 16px;
    height: 16px;
    color: $primaryColor;
    font-weight: bold;
    font-size: 16px;
    display: none;
  }
  &:hover {
    .show-dropdown {
      display: inline-block;
    }
  }
}
.subject-tree {
  width: 260px;
  height: 100%;
  max-height: 912px;
  overflow: auto;
  background: #FFFFFF;
  padding: 20px;
  .add-wrap {
    width: 220px;
    height: 40px;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;
    .add-icon {
      font-size: 18px;
      font-weight: bold;
    }
  }
  .tree-content {
    padding-top: 20px;
    .tree-item {
      width: 220px;
      height: 50px;
      padding: 0px 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4b4b4b;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      .item-icon {
        width: 8px;
        height: 2px;
        background: #2a2a2a;
        margin: 0 24px 0 16px;
      }
    }
    .tree-item-selected {
      color: $primaryColor;
    }
  }
  .selected-icon {
    margin-right: 16px;
    width: 20px;
    height: 20px;
    background-size: 20px 720px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
.bg-move {
  animation: test_anim steps(28) 0.5s forwards;
}
@keyframes test_anim {
  0% {
    background-position: 0 0px;
  }
  100% {
    background-position: 0 -700px;
  }
}
</style>
