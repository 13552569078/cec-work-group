var loginUrlHostname = window.location.hostname

var wss, wsUrl

if (loginUrlHostname === 'localhost') {
  wss = 'wss://182.92.112.254:1014/audio'
  wsUrl = 'wss://182.92.112.254:1014/chatstream'
} else {
  wss = 'wss://172.26.60.86:8687/audio'
  wsUrl = 'wss://172.26.60.86:8687/chatstream'
}

const defaultSettings = {
  title: '小京决策助理',
  userName: 'admin',
  password: '21232f297a57a5a743894a0e4a801fc3',
  appId: 10000147,
  isFromOhterPlatform: true,
  menuDataFromInterface: false,
  loginUrl: '/',
  /*wsUrl: 'wss://10.32.132.80:9027/chatstream',*/
  // wsUrl: 'wss://39.106.32.124:1017/chatstream',
  wsToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjg3NTk5MTg0fQ.RZdx8GgESfFd4PZFSrmlFWZ9WIVDteWj70fcMZCDhkU",
  hasApi: false,// 是否开放api方式获取问答,
  wss: wss,
  wsUrl: wsUrl,
};


console.log('环境变量>>>>>>>>', defaultSettings);