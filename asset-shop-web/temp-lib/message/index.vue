<template>
  <div class="msg-page-warpper">
    <div class="sys-panel">
      <div v-for="(sys,index) in sysTree" :key="sys.projectCode" class="sys-item"
           :class="{'sys-is-active':index == activeSysIndex}" @click="handleClickSys(index)">
        <svg-icon icon-class="message-item" />
        <span>{{ sys.projectName }}</span>
      </div>
    </div>
    <div v-if="sysTree[activeSysIndex] && sysTree[activeSysIndex].child.length>0"
         class="subsys-panel">
      <div v-for="(subsys,index) in sysTree[activeSysIndex].child" :key="subsys.msgTypeCode"
           class="subsys-item" :class="{'sys-is-active':index == activeSubsysIndex}"
           @click="handleClickSubsys(index)">
        <span>{{ subsys.msgTypeName }}</span>
      </div>
    </div>
    <div class="msg-panel">
      <fixed-page background-color="#fff" padding="0" :header-height="76" :header-margin="0"
                  :footer-height="76" :footer-margin="0">
        <template v-slot:header>
          <msg-toolbar :unread-count="unreadCount" :read-flag="readFlag"
                       @status-change="handleStatusChange" @read-all="handleReadAll"
                       @clear-all="handleClearAll" @open-settings="handleOpenSettings" />
        </template>
        <div v-loading="loading" class="msg-panel-content">
          <template v-if="msgList && msgList.length>0">
            <msg-item v-for="(msgItem,index) in msgList" :key="msgItem.msgId"
                      :is-even="(index+1)%2 === 0" :content="msgItem.text"
                      :status="msgItem.readFlag" :date="msgItem.sendTime"
                      :detail-type="msgItem.detailType" @read="handleRead(msgItem)"
                      @delete="handleDelete(msgItem.msgId)" />
          </template>
          <template v-else>
            <empty class="in-center" width="500px" type="no-message" text="暂无相关消息" />
          </template>
        </div>
        <template v-slot:footer>
          <div class="msg-panel-footer">
            <c-pagination background :current-page="page.pageNum" :page-size="page.pageSize"
                          layout="total, prev, pager, next, jumper" :total="page.total"
                          @current-change="handleCurrentChange" />
          </div>
        </template>
      </fixed-page>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bus } from '@/utils'
import MsgToolbar from './components/msg-toolbar'
import MsgItem from './components/msg-item'
import Empty from '../components/empty'
import {
  batchMsgConfigIsRead, queryMsgNavitemTree,
  queryMsgList, delMsgById, updateReadState, batchDelMsg,
  getResourceUrlByCode
} from '../api/message'
export default {
  components: {
    MsgToolbar,
    MsgItem,
    Empty
  },
  data() {
    return {
      loading: false,
      readFlag: 2,
      sysTree: [],
      activeSysIndex: 0,
      activeSubsysIndex: 0,
      unreadCount: 0,
      page: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      msgList: []
    }
  },
  computed: {
    ...mapGetters(['userId', 'token']),
    activeSysCode() {
      let code = ''
      if (!this.sysTree[this.activeSysIndex]) {
        return code
      }
      if (this.sysTree[this.activeSysIndex].child && this.sysTree[this.activeSysIndex].child.length > 0) {
        code = this.sysTree[this.activeSysIndex].child[this.activeSubsysIndex].projectCode
      } else {
        code = this.sysTree[this.activeSysIndex].projectCode
      }
      return code
    },
    activeTypeCode() {
      let code = ''
      if (!this.sysTree[this.activeSysIndex]) {
        return code
      }
      if (this.sysTree[this.activeSysIndex].child && this.sysTree[this.activeSysIndex].child.length > 0) {
        code = this.sysTree[this.activeSysIndex].child[this.activeSubsysIndex].msgTypeCode
      } else {
        code = this.sysTree[this.activeSysIndex].msgTypeCode
      }
      return code
    }
  },
  mounted() {
    this.getSysTree()
  },
  methods: {
    async getSysTree() {
      try {
        const sysTree = await queryMsgNavitemTree(this.userId)
        this.sysTree = sysTree.data
        this.getMsg()
      } catch (e) {
        console.log('Error:queryMsgNavitemTree--' + e.message)
      }
    },
    async getMsg() {
      try {
        this.loading = true
        const queryParams = {
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum,
          senderId: this.userId,
          readFlag: this.readFlag,
          msgTypeCode: this.activeTypeCode,
          projectCode: this.activeSysCode,
          terminalCodeList: ['PC']
        }
        const msgList = await queryMsgList(queryParams)
        this.msgList = msgList.data.list
        this.page.total = msgList.data.count
        this.unreadCount = msgList.data.unReadNum
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log('Error:queryMsgList--' + e.message)
      }
    },
    resetQueryParams() {
      this.readFlag = 2
      this.page.pageNum = 1
    },
    handleClickSys(index) {
      if (index === this.activeSysIndex) {
        return
      }
      this.activeSysIndex = index
      this.activeSubsysIndex = 0
      this.resetQueryParams()
      this.getMsg()
    },
    handleClickSubsys(index) {
      if (index === this.activeSubsysIndex) {
        return
      }
      this.activeSubsysIndex = index
      this.resetQueryParams()
      this.getMsg()
    },
    handleCurrentChange(pageNum) {
      this.page.pageNum = pageNum
      this.getMsg()
    },
    async handleRead(msg) {
      try {
        if (msg.detailType === 1) {
          window.open(msg.detailUrl)
        } else if (msg.detailType === 2) {
          const paras = [
            { 'key': 'embed', 'value': '1' },
            { 'key': 'eventId', 'value': msg.bizId },
            { 'key': 'token', 'value': this.token }
          ]
          const urlData = await getResourceUrlByCode({
            resourceCode: msg.resourceCode,
            paras: paras
          })
          window.open(urlData.data.showUrl)
        }
        if (msg.readFlag === 0) {
          await updateReadState(msg.msgId, 1, this.userId)
          this.getMsg()
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    async handleDelete(msgId) {
      await this.$confirm('将要删除本消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonIsLeft: true,
        type: 'warning',
        iconClass: 'c-ioc-icon-warning'
      })
      try {
        await delMsgById(msgId, this.userId)
        this.getMsg()
      } catch (e) {
        console.log(e.message)
      }
    },
    async handleReadAll() {
      try {
        await batchMsgConfigIsRead(1, this.userId, this.activeSysCode, this.activeTypeCode)
        this.resetQueryParams()
        this.getMsg()
      } catch (e) {
        console.log(e.message)
      }
    },
    async handleClearAll() {
      await this.$confirm('将要清空当前全部消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonIsLeft: true,
        type: 'warning',
        iconClass: 'c-ioc-icon-warning'
      })
      try {
        await batchDelMsg(this.userId, this.readFlag, this.activeSysCode, this.activeTypeCode)
        this.getMsg()
      } catch (e) {
        console.log(e.message)
      }
    },
    handleOpenSettings() {
      bus.$emit('openSettings')
    },
    handleStatusChange(status) {
      this.readFlag = status
      this.page.pageNum = 1
      this.getMsg()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.msg-page-warpper {
  display: flex;
  height: 100%;
  background: #f4f4f4;
}
.sys-panel {
  flex: 0 0 256px;
  height: 100%;
  padding: 26px 32px;
  overflow: auto;
  margin-right: 8px;
  background: #fff;
}
.subsys-panel {
  flex: 0 0 256px;
  height: 100%;
  padding: 26px 32px;
  overflow: auto;
  margin-right: 8px;
  background: #fff;
}
.subsys-item {
  color: #9b9b9b;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
}
.sys-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  color: #9b9b9b;
  font-size: 14px;
  cursor: pointer;
  & > svg {
    flex: 0 0 20px;
    font-size: 20px;
    margin-right: 10px;
  }
  & > span {
    flex: 1;
    text-align: left;
  }
}
.sys-item.sys-is-active {
  &::after {
    flex: 0 0 12px;
    display: block;
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: #ccc;
  }
}
.sys-is-active {
  background: #fafafa;
  color: $primaryColor;
}
.msg-panel {
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: #fff;
}
.msg-panel-content {
  position: relative;
  height: 100%;
  padding: 16px 32px 16px 16px;
}
.in-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.msg-panel-footer {
  display: flex;
  height: 100%;
  padding: 0 32px;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #f4f4f4;
}
</style>
