const loginUrlHostname = window.location.hostname;
const version = '1.0.1';

window.serverConfig = {
  PROD_PREFIX: '',
  BASE_URL: '/',
  API_PREFIX_OP: 'api/bus',
  TIANDITU_TOKEN: 'b8ed92ff9b64aebcb0110acca15e478f',
  MAP_CONFIG: '{"center":[104.402397818, 31.1311396527],"areaName":"德阳市","areaCode":"510681", "darkMap": "http://59.213.91.243:8590/iserver/services/map-dy-Shi-3/rest/maps/map1026/tileImage.png?prjCoordSys=%7B%22epsgCode%22:4326%7D&width=256&height=256&redirect=false&transparent=true&cacheEnabled=true&origin=%7B%22x%22%3A-180%2C%22y%22%3A90%7D&overlapDisplayed=false&scale={scale}&x={x}&y={y}", "token":"152E20D88AB6890B" , "maxzoom": 18, "minzoom": 4, "zoom": 14, "zoomHideAggregate": 11, "aggregatePointSize": 5, "lineWidth": 18, "lineColor": "#faad14" }',
  DAHUA_VIDEO_CONFIG: '{"loginIp": "10.255.251.253", "loginPort": "7902", "userName": "spdj", "userPwd": "Admin@123", "https": 1}',
  HY_LOGIN_CONFIG: '{"hostname":"59.213.91.238","host":"59.213.91.238:443","userName":"guanghanOP","loginName":"guanghanOP","strUserDomainCode":"fa163e3bc4e2"}',
  HY_CALLED_INFO: '[[{"strUserDomainCode":"fa163e3bc4e2","strUserID":"6073","strUserName":"李鹏","nDevType": 1},{"strUserDomainCode":"fa163e3bc4e2","strUserID":"2091","strUserName":"刘景华","nDevType": 1}]',
  UPLOAD_URL: loginUrlHostname === '10.255.144.70' || loginUrlHostname === 'localhost' ? '/api/bs/oss/govern/upload' : '/api/bs/oss/service-bus/upload',
  DEFAULT_USER: '{"id": "24477aa", "username": "byztest"}',
  LINKAGE_URL: 'http://10.74.115.103:10004/linkage-command-op-web/overview',
  LOGINOUT_URL: 'https://10.74.115.103:9111/', // 广汉登出地址
  SECONDARY: 'open',
  DISPLAY_MODE: '{"isFooterNav": "true", "isHeaderStat": "true" }',
  LOOP_SECONDS: 30,
  LIST_SCROOL_STEP_BIG: 15,
  LIST_SCROOL_STEP_NORMAL: 3,
  YUSHI_VIDEO_CONFIG: '{"username":"sjfwzx","password":"Sjfwzx123", "ipaddr": "59.213.91.180"}',
  VIDEO_FUSION_COMMUNICATION_URL: 'http://59.213.91.243:8590/linkage-video-fusion-communication/index.html'
};
