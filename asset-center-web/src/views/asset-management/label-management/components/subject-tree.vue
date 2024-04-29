<!--
 * @Description:专题树
 * @Author: liugeng
 * @Date: 2021-05-06
-->
<template>
  <div class="subject-tree">
    <div
      class="add-wrap"
      @click="addTreeNode"
    >
      <i class="add-icon"></i>
      添加标签分类
    </div>
    <div
      id="tree-content"
      class="tree-content"
    >
      <div
        v-for="item in treeData"
        :key="item.groupId"
        :data-id="item.groupId"
        class="tree-item tag-tree-item"
        :class="'treeitem'+item.groupId"
        @mouseover="mouseover(item)"
        @mouseleave="mouseleave(item)"
        @click="changeGroup(item)"
      >
        <i
          v-if="item.selected || item.hover"
          class="selected-icon bg-move"
          style="background: url('./static/imgs/tag-selected.png')"
        />
        <i
          v-else
          class="item-icon"
        ></i>

        <span class="tag-group-name" :class="item.selected || item.hover?'selected':''">{{ item.groupName }}</span>

        <c-dropdown
          placement="bottom"
          szie="small"
          class="table-item-btn table-item-btn-last"
          @command="commondClick"
        >
          <i class="iconfont icon-c-more show-dropdown"></i>
          <c-dropdown-menu slot="dropdown">
            <template v-for="btn_item in dropdownBtns">
              <c-dropdown-item
                :key="item.groupId+btn_item"
                class="dropdown-menu-item"
                :command="{ item: btn_item, data: item }"
              >
                <span class="dropdown-item-text">{{ btn_item }}</span>
              </c-dropdown-item>
            </template>
          </c-dropdown-menu>
        </c-dropdown>
      </div>
    </div>
    <c-dialog
      :class="'dialog-center details-dialog-adjustpadding-1 '"
      :title="(editOrAdd === 0 ? '添加' : '编辑') + '标签分类'"
      width="480px"
      :visible.sync="dialogVisible"
    >
      <c-form
        v-if="dialogVisible"
        ref="ruleForm"
        :model="form"
        :rules="rules" @submit.native.prevent>
        <c-form-item
          label="标签类型"
          :label-width="formLabelWidth"
          prop="name"

        >
          <c-input
            v-model="form.name"
            size="small"
            maxlength="10"
            placeholder="请输入标签类型"
          />
        </c-form-item>
      </c-form>
      <div
        slot="footer"
        class="dialog-footer"
      >

        <c-button
          size="small" type="ordinary"
          @click="dialogVisible = false"
        >取消</c-button>
        <c-button
          type="gradual"
          size="small"
          @click="confirm"
        >确定</c-button>
      </div>
    </c-dialog>
  </div>
</template>
<script>
import { getRootTag, delTag, addTag, editTag } from '@/api/label-manage';

export default {
  name: 'SubjectTree',

  props: {
    currentGroupId: {
      type: [Number, String]
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
      rules: {
        name: [
          { required: true, message: '请输入标签类型', trigger: 'blur' }

        ]
      },
      dialogVisible: false,
      dropdownBtns: ['编辑', '删除'],
      editOrAdd: 0, // 0 add, 1:edit:
      treeData: []
    };
  },
  watch: {
    currentGroupId(n) {
      if (this.treeData.length) {
        this.changeGroup(this.treeData.find(item => item.groupId === n))
        document.querySelector('.treeitem' + n) && document.querySelector('.treeitem' + n).scrollIntoView()
      }
    },
    dialogVisible(n) {
      if (!n) {
        this.form.name = ''
      }
    }
  },
  created() {
    this.getList();
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
      this.treeData = this.treeData.map(item => {
        if (item.groupId === this.subCurrentGroupId) {
          item.selected = true
        } else {
          item.selected = false
        }
        return item
      })
      this.$emit('change-group', this.subCurrentGroupId);
    },
    commondClick(commond) {
      this.editCurrentTagGroup = commond;
      switch (commond.item) {
        case '添加':
          this.addTreeNode();
          break;
        case '编辑':
          this.editTreeNode(commond.data);
          break;
        case '删除':
          this.delTreeNode(commond.data);
          break;
      }
    },
    async getList(flag) {
      if (flag) { this.$emit('reload') }
      const rs = await getRootTag();
      if (rs.code === 0) {
        this.treeData = rs.data.map(item => {
          item.selected = false
          item.hover = false
          return item
        });
      }
    },
    addTreeNode() {
      this.editOrAdd = 0;
      this.dialogVisible = true;
    },
    editTreeNode(tag) {
      this.editOrAdd = 1;
      this.form.name = tag.groupName;
      this.dialogVisible = true;
    },
    delTreeNode(tag) {
      this.$confirm('请确认是否删除节点？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',

        type: 'warning'
      }).then(() => {
        this.deleteTag(tag);
      });
    },
    async deleteTag(tag) {
      const rs = await delTag(tag.groupId);
      if (rs.code === 0) {
        this.getList(true);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }
    },
    async editTagSave(tag, inputValue) {
      const rs = await editTag({ groupName: inputValue, groupId: tag.groupId });
      if (rs.code === 0) {
        this.$message.success(rs.msg);
        this.form.name = '';
        this.getList(true);
      }
    },
    async addTagSave(value) {
      const rs = await addTag({ parentId: 0, groupName: value });
      if (rs.code === 0) {
        this.$message.success(rs.msg);
        this.form.name = '';
        this.getList(true);
      }
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.dialogVisible = false;
        if (this.editOrAdd === 0) {
          this.addTagSave(this.form.name);
        } else {
          this.editTagSave(this.editCurrentTagGroup.data, this.form.name);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.selected{
  color: #36A4FF;
}
.tag-tree-item{
    &:hover {
    .show-dropdown {
       display: block;
    }
  }
}
.table-item-btn {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 20px;
  .show-dropdown {
    display: none;
  }
  &:hover {
    .show-dropdown {
       display: block;
    }
  }
}
.subject-tree {
  width: 296px;

  height: 100%;
  max-height: 912px;
  overflow: auto;
  background: url(~@/assets/svg/tag-tree-bg.png) no-repeat;
  background-size: 100%;
  padding: 16px 40px;
  .add-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: auto;
    margin-bottom: 10px;
    padding-left: 0;
    width: 216px;
    height: 48px;
    background: url(~@/assets/svg/tree-add-bg.png) no-repeat;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #36a4ff;
    cursor: pointer;
    .add-icon {
      width: 32px;
      height: 32px;
      background: url(~@/assets/svg/tree-add-icon.png) no-repeat;
      margin: 0 20px 0 24px;
    }
  }
  .tree-content {
    .tree-item {
      width: 230px;
      height: 64px;
      background: rgba(255, 255, 255, 0);
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
      color: #36a4ff;
    }
  }
  .selected-icon {
    margin-right: 24px;
    width: 32px;
    height: 32px;

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
.bg-move{
    animation: test_anim steps(51) 1s forwards;
  }
  @keyframes test_anim{
    0%{ background-position:0 0;}
    100%{ background-position: 0 -1632px;}
  }
</style>
