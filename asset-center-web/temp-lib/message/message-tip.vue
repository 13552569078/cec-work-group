<!--/*
* @Author:
* @Desc: 消息提示
* @Date:
*/-->
<template>
  <c-popover
    placement="bottom"
    width="400"
    trigger="hover"
    :visible-arrow="false"
    class="msg-wrap"
    popper-class="message-wrap"
    @show="getMessageList">
    <div class="msg-box">
      <h4 class="msg-header"></h4>
      <ul class="msg-content-wrap">
        <div v-if="messageList.length==0" class="empty">暂无消息</div>
        <li v-for="(item, i) in messageList" :key="i" :class="{gray:item.readStatus!='unread'}">
          <div class="flex-between">
            <h6 class="msg-title" @click="seeItem(item)">{{ item.messageTitle }}</h6>
            <c-tag size="small" :type="item.readStatus!='unread'?'info':''">{{ item.appName }}</c-tag>
          </div>
          <span class="msg-content-text" v-html="item.messageContent"></span>
          <div class="flex-between msg-send-wrap">
            <span class="msg-name">发起人：{{ item.senderName }}</span>
            <span class="msg-time">{{ item.sendTime }}</span>
          </div>
        </li>
      </ul>
      <div v-if="messageCount > 10" class="msg-buttom">
        <c-button type="text" @click="seeMore()">点击查看全部消息</c-button>
      </div>
    </div>
    <c-badge slot="reference" :value="messageCount" :hidden="messageCount==0" :max="9" class="item msg-badge">
      <i class="message-icon"></i>
    </c-badge>
  </c-popover>
</template>
<script>
import { getToken, service, createSocket } from '@/utils'
export default {
  name: 'MessagePop',
  components: {},
  data() {
    return {
      messageCount: 0,
      messageList: [],
      websocket: null,
      APPCODE: window.MESSAGE_CONFIG.appcode,
      messagePath: window.MESSAGE_CONFIG.pagePath,
      socketUrl: window.MESSAGE_CONFIG.socketUrl,
      listApi: window.MESSAGE_CONFIG.listApi
    };
  },
  mounted() {
    this.init()
  },
  unmounted() {
    this.websocket && this.websocket.close();
  },
  methods: {
    init() {
      if (!getToken()) return
      this.getMessageList();
      this.websocket = createSocket(`${this.socketUrl}?token=${getToken()}`, (e) => {
        this.getMessageList();
        const data = JSON.parse(e.data);
        if (data.msgType !== 'MESSAGE_NOTIFY') return;

        const message = JSON.parse(data.body);
        this.$notify({
          title: `新消息【${message.messageTitle}】`,
          dangerouslyUseHTMLString: true,
          message: message.messageContent,
          duration: 10000
        });
      }, { token: getToken(), checkTime: 5 * 60 * 1000 });
    },
    seeMore() {
      const params = [
        'redirect=InBox',
        `fromAppCode=${this.APPCODE}`,
        'readStatus=unread'
      ]
      window.open(`${this.messagePath}?${params.join('&')}`)
    },
    seeItem(row) {
      const params = [
        'redirect=Details',
        `fromAppCode=${this.APPCODE}`,
        `id=${row.id}`,
        `messageId=${row.messageId}`,
        'sendTimeOrderFlag=0',
        'updatedAtFlag=0',
        'type=received'
      ]
      window.open(`${this.messagePath}?${params.join('&')}`)
    },
    async getMessageList() {
      try {
        const res = await service.post(this.listApi, {
          'readStatus': 'unread',
          'page': -1,
          'size': 10,
          'sendTimeOrderFlag': 0,
          'updatedAtFlag': 0,
          'keyWord': ''
        })
        if (+res.code !== 0) {
          this.$message.error(res.tips || '请求消息失败')
        }
        const data = res.data
        console.log(data, '----message-data')
        this.messageList = data.list
        this.messageCount = data.totalRow
      } catch (e) {
        console.error(e)
        // this.$message.error('请求消息失败')
      }
    }
  }
};
</script>
<style scoped lang="scss">
.msg-badge{
  &::v-deep{
    .c-badge__content.is-fixed{
      right: 0px;
    }
    .c-badge__content{
      height: 20px;
    line-height: 20px;
    border:0px;
    }
  }
}
.msg-wrap {
  width: 19px;
  height: 19px;
  margin-right: 16px;
  .msg-box {
    display: flex;
    flex-direction: column;
  }
}
.message-icon {
  display: inline-block;
  width: 19px;
  height: 19px;
  background: url('~@/assets/imgs/msg-icon.png') no-repeat 0 0 / 100% 100%;
  cursor: pointer;
}
.msg-content-text {
  margin-top: 4px;
  margin-bottom: 6px;
  line-height: 22px;
  color: #8A8A8A;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  &::v-deep{
    a{
      color: #36A4FF !important;
    }
  }

}
.msg-header {
  width: 400px;
  height: 80px;
  background: url('~@/assets/imgs/msg-header.png') no-repeat 0 0 / 100% 100%;
}
.msg-content-wrap {
  padding: 32px 28px;
  max-height: 354px;
  overflow: auto;
  .msg-title {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
    color: #202020;
    cursor: pointer;
  }
  .gray {
    .msg-title, .msg-content-text, .msg-name, .msg-time {
      color: #BDBDBD;
    }
  }
}
.msg-buttom {
  height: 64px;
  line-height: 64px;
  text-align: center;
  border-top: 1px solid #E4E9ED;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.msg-send-wrap {
  margin-bottom: 20px;
}
.msg-name {
  color: #4B4B4B;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.msg-time {
  flex-shrink: 0;
  color: #8A8A8A;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.empty {
  text-align: center;
  color: #8A8A8A;
}
</style>
