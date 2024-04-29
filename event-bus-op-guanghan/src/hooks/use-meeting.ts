import { computed, ref } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { GlobalAPI } from '@/common';

type UserInfo = {
  id: string;
  username: string;
}
type NewUserInfo = {
  strUserDomainCode: string;
  strUserID: string;
  strUserName: string;
  nDevType: number;
}

const showHyDlg = ref(false);
// let calledUserList = ref<any>([]);

// 会议主体
let meeting:any;
// 是否开启接收会议（暂时不开启）
const isAcceptMeeting = false;

// 怀业sdk所需第三方包
const hyFlieNameList = [
  {
    id: 'img64JS',
    path: '/hySdk/js/img64.js',
    defer: false,
    async: false,
  },
  {
    id: 'jqueryJS',
    path: '/hySdk/js/jquery.js',
    defer: true,
    async: false,
  },
  {
    id: 'adapterJS',
    path: '/hySdk/js/adapter.min.js',
    defer: false,
    async: false,
  },
  {
    id: 'queryBlockUIJS',
    path: '/hySdk/js/jquery.blockUI.min.js',
    defer: true,
    async: false,
  },
  {
    id: 'bootstrapMinJS',
    path: '/hySdk/js/bootstrap.min.js',
    defer: true,
    async: false,
  },
  {
    id: 'bootboxMinJS',
    path: '/hySdk/js/bootbox.min.js',
    defer: false,
    async: false,
  },
  {
    id: 'spinMinJS',
    path: '/hySdk/js/spin.min.js',
    defer: false,
    async: false,
  },
  {
    id: 'toastrMinJS',
    path: '/hySdk/js/toastr.min.js',
    defer: false,
    async: false,
  },
  {
    id: 'janusJS',
    path: '/hySdk/js/janus.js',
    defer: false,
    async: false,
  },
  // {
  //   id: 'hlsMinJS',
  //   path: '/hySdk/js/hls.min.js',
  //   defer: true,
  //   async: false,
  // },
  {
    id: 'hysdkJS',
    path: '/hySdk/js/hysdk.js',
    defer: false,
    async: false,
  }
];

// @ts-ignore
window.globalSdk = {};
function useMeeting() {
  // @ts-ignore
  const isOnline = computed(() => window.globalSdk?.sie && window.globalSdk?.sie?.userStatus === 1);
  const isHandleQuit = ref(false);

  const initHySdkWs = (userInfo?:UserInfo) => {
    let mac = window.localStorage.getItem('HY_MAC') as string;
    if (mac) {
      console.log(mac);
    } else {
      mac = new Date().getDate() + '';
      window.localStorage.setItem('HY_MAC', mac);
    }
    // @ts-ignore
    window.globalSdk = new window.HY_SDK_WS();
    // @ts-ignore
    window.globalSdk.mac = window.localStorage.getItem('HY_MAC');
    // @ts-ignore
    console.log(window.globalSdk, 1111);
    hyLogin(userInfo);
  };
  const hyLogin = (userInfo?:UserInfo) => {
    const { hostname, host, userName, loginName, } = JSON.parse(GlobalAPI.config.HY_LOGIN_CONFIG);
    const loginOpts = {
      'url': `wss://${host}/sie`,
      'svrIp': hostname,
      'sieStreamUrl': `wss://${host}/stream`,
      'svrPort': 9001,
      'webrtcUrl': `https://${host}/janus`,
      'iceServers': [{ 'urls': `stun:${hostname}:3478` }],
      loginName: userInfo?.id + '',
      userName: userInfo?.username + ''
    };
    const opt = {
      ...loginOpts,
      loginSuccess: function(msg: any) {
        if (msg.nResultCode === 0) {
          console.log('登录成功！');
          // @ts-ignore
          window.startSieOperate && window.startSieOperate();
        } else {
          // @ts-ignore
          window.globalSdk.kickOut({
            strUserTokenID: msg.strUserTokenID,
          });
        }
        // @ts-ignore
        window.globalSdk.initWebRtc();
        // 如果需要接收会议邀请功能， 复写接收会议邀请
        isAcceptMeeting && acceptMeeting()
      },
      connectFailed: function() {
        HlMessage.warning('会议服务连接失败，请刷新页面或重新登录');
      },
      log: true,
    };
    // @ts-ignore
    window.globalSdk.init(opt);
  };

  const createMeeting = (meetingInfo: any) => {
    if (!isOnline.value) {
      HlMessage.warning('通信账号未登录！');
      return;
    }
    isHandleQuit.value = false;
    console.log(meetingInfo, 93333)
    // @ts-ignore
    meeting = window.globalSdk.callMeeting({
      'pnode': 'meetingPlayer',
      'userPanel': 'meetingUser',
      meetingInfo: meetingInfo,
    });
    
    // @ts-ignore
    meeting.start(function(res: any, backTalk: any) {
      if (res.code === 0) {
      } else {
        // @ts-ignore
      }
    });
  };
  // 开始会议
  const startMeeting = () =>  meeting && meeting.start()
  // 退出会议
  const quitMeeting = () =>  meeting && meeting.quitMeeting()
  // 结束会议
  const stopMeeting = () => {
    meeting && meeting.stopMeeting(()=> {
      HlMessage.success('会议已关闭');
    })
  }
  // 邀请其他人员
  const inviteNewUser = (user:NewUserInfo) => {
    meeting && meeting.inviteNewUser(user);
    HlMessage.success(`已向${user.strUserName}发送参会邀请`);
  }

  // 接收会议
  const acceptMeeting = ()=> {
    // @ts-ignore
    window.globalSdk.drawCalledPanel = function (calledMt:any) {
      let _this = this;
      calledMt.opt.pnode='meetingPlayer';
      calledMt.opt.userPanel='meetingUser';
      // @ts-ignore
      $("#"+calledMt.opt.userPanel).empty();
      // @ts-ignore
      calledMt.playPanel = $("#meetingPlayer").empty();
      calledMt.playPanel.show();
      calledMt.calledStart();
      // @ts-ignore
      calledMt.createMeetBtn = $("#createMeetBtn");
      // @ts-ignore
      calledMt.quitMeetBtn = $("#quitMeetBtn");
      // @ts-ignore
      calledMt.stopMeetBtn = $("#stopMeetBtn");
      calledMt.createMeetBtn.hide();
      calledMt.quitMeetBtn.show().bind("click", function(){
        calledMt.quitMeeting();
      });
      //复写会议退出回调方法
      calledMt.quitMeetAction = function(){
      };
    }
  }

  const destoryHySdk = () => {
    // @ts-ignore
    if (window.globalSdk) {
      try {
        // @ts-ignore
        window.globalSdk.destory();
        meeting = null;
      } catch (e) {
        console.error(e);
      }
    }
  };
  return {
    showHyDlg,
    createMeeting,
    startMeeting,
    quitMeeting,
    stopMeeting,
    inviteNewUser,
    hyFlieNameList,
    initHySdkWs,
    destoryHySdk,
  };
}
export {
  useMeeting
};
