<template>
  <div class="tree">
    <el-input v-model="filterText" class="tree-input" placeholder="请输入" clearable>
      <template slot="append">
        <img src="../../../assets/search.png">
      </template>
    </el-input>
    <div class="person">
      <div class="person-header" @click="personClick({ id: '' })">
        <i v-if="personStatus" class="el-icon-caret-bottom" />
        <i v-else class="el-icon-caret-right" />
        <div class="title" :class="{'title-default' : !defaultClickNode.id}">个人通讯录</div>
        <i class="el-icon-circle-plus-outline" @click.stop="addGroup()" />
      </div>
      <div v-if="personStatus" class="person-list">
        <ul class="list-ul">
          <li v-if="clickType === 'add'">
            <el-input
              v-model="input"
              autofocus="autofocus"
              placeholder="请输入内容"
              @blur.native.capture="saveOrEdit"
            />
          </li>
          <li v-for="(item, index) in filterpersonList" :key="index">
            <el-input
              v-if="clickType === 'edit' && item.id === clickNode"
              v-model="input"
              autofocus="autofocus"
              placeholder="请输入内容"
              @blur.native.capture="saveOrEdit"
            />
            <span
              v-else
              class="person-item"
              :class="{ 'default-click': defaultClickNode.id === item.id }"
              @click="personClick(item)"
            >{{ item.groupName }}</span>
            <div class="more" @click.stop="">
              <el-dropdown
                v-show="item.id !== clickNode"
                trigger="click"
                class="grop-drowp"
                placement="bottom"
                @command="handleCommand(...arguments)"
              >
                <i class="el-icon-more" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="commandValue('a', item)"
                    class="edit-btn"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item
                    :command="commandValue('b', item)"
                    class="remove-btn"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-tree
      ref="tree"
      v-loading="treeLoad"
      :data="deptTree"
      node-key="id"
      :default-expanded-keys="defaultKeys"
      icon-class-fold="el-icon-caret-right"
      icon-class-unfold="el-icon-caret-bottom"
      :props="treeProps"
      :highlight-current="true"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
    >
      <div slot-scope="{ node }" class="custom-tree-node">
        <span class="cus-label">{{ node.label }}</span>
      </div>
    </el-tree>
  </div>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'ContactTree',
  data() {
    return {
      treeLoad: false,
      defaultKeys: ['0'],
      filterText: '',
      personList: [],
      deptTree: [
        {
          name: '公共通讯录',
          id: '1',
          children: []
        }
      ],
      treeProps: {
        label: 'name'
      },
      input: '',
      clickType: '',
      clickNode: '',
      personStatus: true, // false关闭
      filterpersonList: [],
      defaultClickNode: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
      this.filterpersonList = this.personList.filter((item) => {
        return item.groupName.indexOf(val) !== -1
      })
    }
  },
  created() {
    this.getDepts()
    this.getPersonGroupList()
  },
  methods: {
    commandValue(type, command) {
      return {
        type: type,
        command: command
      }
    },
    getPersonGroupList() {
      moduleSrv.getAllGroup().then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.personList = res.data || []
          // this.defaultClickNode = this.personList[0]
          this.filterpersonList = res.data || []
        }
      })
    },
    nodeClick(data) {
      this.defaultClickNode = { id: data.id }
      this.$emit('nodeClick', data)
    },
    personClick(data) {
      if (!data.id) this.openOrcloseTree() // 判断是否为根节点
      this.defaultClickNode = data
      this.$emit('personClick', data)
    },
    getDepts() {
      moduleSrv.getAddrbookDepts({}).then((res) => {
        this.deptTree[0].children = res.data // 公共通讯录
      })
    },
    // 新增分组
    addGroup() {
      this.clickType = 'add'
      this.input = ''
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    handleCommand({ type, command }) {
      if (type === 'a') {
        this.clickType = 'edit'
        this.input = command.groupName
        this.clickNode = command.id
      }
      if (type === 'b') {
        this.clickType = 'remove'
        this.removeNode(command)
      }
    },
    // 保存新增节点
    saveOrEdit() {
      const addrBookGroupVO = {
        groupName: this.input
      }
      let temp
      if (this.clickType === 'add') {
        if (!this.input) {
          this.clearBlur()
          return
        }
        temp = moduleSrv.saveAddrbookgroup(addrBookGroupVO)
      } else if (this.clickType === 'edit') {
        addrBookGroupVO.id = this.clickNode
        temp = moduleSrv.editRbookgroup(addrBookGroupVO)
      }
      temp
        .then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              type: 'success',
              message: res.message || '操作成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message || '操作失败'
            })
          }
        })
        .finally(() => {
          this.clearBlur()
        })
    },
    // 删除节点
    removeNode(node) {
      moduleSrv
        .deleteGroup([node.id])
        .then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              type: 'success',
              message: res.message || '操作成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message || '操作失败'
            })
          }
        })
        .finally(() => {
          this.clearBlur()
        })
    },
    clearBlur() {
      this.clickType = ''
      this.clickNode = ''
      this.getPersonGroupList()
    },
    openOrcloseTree() {
      this.personStatus = !this.personStatus
    }
  }
}
</script>
<style lang="scss" scoped>
.tree {
  height: calc(100% - 40px);
  overflow-y: auto;
  font-size: 14px;
  color: #4b4b4b;
  padding: 20px;
  .tree-input {
    margin-bottom: 20px;
    ::v-deep {
      .el-input__inner {
        border-color: #e7e7e7;
        &:focus {
          border-color: #36a4ff;
        }
      }
      .el-input-group__append {
        border-left: 0;
        padding: 0 7.5px;
        background: $inputAppendBg;
        border: 1px solid #e7e7e7;
        border-radius: 0 2px 2px 0;
        border-left: none;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .person {
    padding-left: 6px;
    &-header {
      display: flex;
      cursor: pointer;
      .el-icon-caret-bottom,
      .el-icon-circle-plus-outline {
        cursor: pointer;
        &:hover,
        &:active {
          color: #36a4ff;
        }
      }
      .el-icon-circle-plus-outline {
        display: none;
      }
      .el-icon-caret-right {
        color: #c0c4cc;
        font-size: 12px;
      }
      .el-icon-caret-bottom {
        color: #4b4b4b;
        font-size: 12px;
        pointer-events: none;
      }
      .title {
        padding: 0 0 0 4px;
        width: 100%;
      }
      .title-default {
        color: #36a4ff;
      }
      &:hover {
        .el-icon-circle-plus-outline {
          display: inline-block;
        }
      }
    }
    &-list {
      padding: 10px 0 0 20px;
      .list-ul {
        li {
          // margin-top: 10px;
          display: flex;
          justify-content: space-between;
          line-height: 40px;
          height: 40px;
          padding-left: 20px;
          &:hover {
            background: #f9fafe;
            .more {
              display: inline-block;
            }
          }
          .more {
            display: none;
            i {
              cursor: pointer;
              transform: rotate(90deg);
              color: #bdbdbd;
              font-size: 12px;
              &:hover {
                color: #36a4ff;
              }
            }
            .grop-drowp {
              .edit-btn,
              .remove-btn {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #4b4b4b;
                font-weight: 400;
                &:hover {
                  color: #36a4ff;
                }
              }
            }
          }
          .person-item {
            cursor: pointer;
          }
          .default-click {
            color: #36a4ff;
          }
        }
      }
    }
  }
  .el-tree {
    height: 100%;
    .custom-tree-node {
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      width: 100%;
      .cus-label {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
    }
  }
}
</style>
