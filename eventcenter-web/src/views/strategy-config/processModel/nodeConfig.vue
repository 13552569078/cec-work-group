<!--
 * @description 流程模型管理--节点配置
 * @date 2020-09-10
 * @author lism
-->
<template>
  <div class="node-config">
    <div class="top p20">
      <ul class="innter-box">
        <li class="info">
          <div class="info-bg mr10" />
          <div class="info-title">
            <span class="title fw-b">{{ params.name || params.bpmName }}</span>
            <span class="code fs12 mt5">{{ params.key || params.bpmKey }}</span>
          </div>
        </li>
        <li class="version fs14">
          <span>· 版本号</span>
          <span class="ml32">{{ params.version }}</span>
        </li>
      </ul>
    </div>
    <div class="bottom mt20">
      <div class="bottom-left mr20">
        <left-tree :node-data="leftData" @nodeChange="_nodeChange" />
      </div>
      <div class="bottom-right p20">
        <div class="head mb20">
          <el-button
            type="text"
            :class="{ 'is-current': currentAction === 'button' }"
            @click.stop="_tabChange('button')"
          >按钮配置</el-button>
          <el-button
            type="text"
            :class="{ 'is-current': currentAction === 'role' }"
            @click.stop="_tabChange('role')"
          >角色配置</el-button>
          <el-button
            type="text"
            :class="{ 'is-current': currentAction === 'remind' }"
            @click.stop="_tabChange('remind')"
          >提醒配置</el-button>
          <div class="add-button">
            <el-button
              v-if="currentAction === 'button'"
              type="primary"
              class="add-btn common-action-btn"
              icon="custom-add common-icon"
              @click.stop="_handleAddAction('button')"
            >新增按钮</el-button>
            <el-button
              v-if="currentAction === 'role'"
              type="primary"
              class="add-btn common-action-btn"
              icon="custom-add common-icon"
              @click.stop="_handleAddAction('role')"
            >角色配置</el-button>
          </div>
        </div>
        <button-list
          v-if="currentAction === 'button'"
          key="button"
          :table-data="tableData"
          :currentnode="currentNode"
          @update="getTableList"
        />
        <role-list
          v-if="currentAction === 'role'"
          key="role"
          :table-data="tableData"
          :currentnode="currentNode"
          @update="getTableList"
        />
        <remind-list
          v-if="currentAction === 'remind'"
          key="role"
          :table-data="tableData"
          :currentnode="currentNode"
          @update="getTableList"
        />
      </div>
    </div>
    <!-- 按钮新增、编辑表单 -->
    <button-dialog
      v-if="buttonDialogVisible"
      :visible.sync="buttonDialogVisible"
      :mode="buttonDialogType"
      :currentnode="currentNode"
      @update="getTableList"
    />
    <!-- 角色新增、编辑表单 -->
    <role-dialog
      v-if="roleDialogVisible"
      :visible.sync="roleDialogVisible"
      :mode="roleDialogType"
      :currentnode="currentNode"
      @update="getTableList"
    />
  </div>
</template>
<script>
import leftTree from './leftTree'
import buttonList from './buttonList'
import buttonDialog from './buttonDialog'
import roleList from './roleList'
import roleDialog from './roleDialog'
import moduleSrv from '@/api/dispatch'
import { mapGetters } from 'vuex'
import RemindList from '@/views/strategy-config/processModel/remindList'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'NodeConfig',
  components: {
    RemindList,
    leftTree,
    buttonList,
    buttonDialog,
    roleList,
    roleDialog
  },
  data() {
    return {
      leftData: [],
      currentNode: null,
      currentAction: 'button',
      tableData: [],
      buttonDialogVisible: false,
      buttonDialogType: 'add',
      roleDialogVisible: false,
      roleDialogType: 'add'
    }
  },
  computed: {
    ...mapGetters(['getConfig']),
    params() {
      return this.$route.query
    },
    orgType() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('org_type')
    }
  },
  watch: {
    currentNode(val) {
      this.getTableList()
    }
  },
  provide() {
    return {
      _formatter: this._formatter
    }
  },
  async created() {
    await this.getProcessTaskList() // 先获取左侧流程
  },
  methods: {
    // 表格内容格式化
    _formatter(_row, _column, cellValue) {
      if (cellValue === 0) {
        return cellValue
      }
      return cellValue || '--'
    },
    getProcessTaskList() {
      const params = {
        ...this.params
      }
      moduleSrv.getProcessTaskList(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { list = [] } = res.data
          this.leftData = list
        } else {
          console.warn('getProcessTaskList 接口报错')
        }
      })
    },
    getTableList() {
      // 根据当前 tab 进行不同接口查询
      const tab = this.currentAction
      const { modelKey = '', id = '' } = this.currentNode
      const params = {
        modelKey: modelKey,
        usertaskId: id
      }
      // 先把数据清空
      this.tableData = []
      if (tab === 'button') {
        moduleSrv.getProcessTaskButtons(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.tableData = res.data || []
          } else {
            console.warn('getProcessTaskButtons===报错')
          }
        })
      }
      if (tab === 'role') {
        moduleSrv.getProcessTaskRoles(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.tableData = res.data || []
            this.tableData.forEach((item) => {
              const match = this.orgType.filter(
                (subItem) => subItem.dictValue === item.orgType
              )
              try {
                if (match && match[0]) {
                  item.orgTypeText = match[0].dictDesc
                }
              } catch (e) {
                console.log('match error', e)
              }
            })
          } else {
            console.warn('getProcessTaskRoles===报错')
          }
        })
      }
      if (tab === 'remind') {
        moduleSrv.getRemindList(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.tableData = res.data || []
          } else {
            console.warn('getProcessTaskButtons===报错')
          }
        })
      }
    },
    // node change 触发
    _nodeChange(node) {
      this.currentNode = node
    },
    // tab 切换
    _tabChange(tab) {
      if (tab === this.currentAction) return
      this.currentAction = tab
      this.getTableList()
    },
    // button 新增、role 新增
    _handleAddAction(type) {
      if (type === 'button') {
        this.buttonDialogVisible = true
      } else {
        this.roleDialogVisible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.node-config {
  display: flex;
  flex-direction: column;
  .top {
    flex: 0 0 112px;
    background-color: $white;
    .innter-box {
      background-color: $menuBg;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 16px 20px;
      .info {
        display: flex;
        align-items: center;
        min-width: 360px;
        &::after {
          content: '';
          width: 1px;
          background-color: #ededed;
          margin-left: auto;
          height: 40px;
        }
        &-bg {
          width: 40px;
          height: 40px;
          background-image: url('~@/assets/liucheng.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        &-title {
          display: flex;
          flex-direction: column;
          .title {
            color: #2b2b2b;
          }
          .code {
            color: #8a8a8a;
          }
        }
      }
      .version {
        margin-left: 70px;
        color: #8a8a8a;
        &:last-child {
          color: #4b4b4b;
        }
      }
    }
  }
  .bottom {
    flex: 1;
    display: flex;
    height: calc(100% - 132px);
    &-left {
      flex: 0 0 272px;
      background-color: $white;
    }
    &-right {
      flex: 1;
      width: calc(100% - 292px);
      background-color: $white;
      .head {
        display: flex;
        ::v-deep {
          .el-button--text {
            color: #4b4b4b;
            height: 32px;
            margin-left: 0;
            &+.el-button--text {
              margin-left: 16px;
            }
            &.is-current {
              color: #36a4ff;
              span{
                display: inline-block;
                border-bottom: 2px solid #36a4ff;
                padding-bottom: 5px;
              }
            }
          }
        }
        .add-button {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
