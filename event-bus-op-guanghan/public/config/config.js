const loginUrlHostname = window.location.hostname;
const version = '1.0.1';

window.serverConfig = {
  PROD_PREFIX: 'onepic',
  BASE_URL: '/',
  API_PREFIX_OP: 'api/bus',
  TIANDITU_TOKEN: 'b8ed92ff9b64aebcb0110acca15e478f',
  MAP_CONFIG: '{"center":[104.273754, 30.985835],"areaName":"广汉市","areaCode":"510681", "lightWMTS": "http://10.74.115.103:9337/GuangHanDark3857", "darkWMTS": "http://10.74.115.103:9337/GuangHanDark3857", "imgWMTS": "http://10.74.115.103:9337/imgmap", "token":"152E20D88AB6890B" , "maxzoom": 18, "minzoom": 4, "zoom": 14, "zoomHideAggregate": 11}',
  DAHUA_VIDEO_CONFIG: '{"loginIp": "10.255.251.253", "loginPort": "7902", "userName": "spdj", "userPwd": "Admin@123", "https": 1}',
  HY_LOGIN_CONFIG: '{"hostname":"59.213.91.238","host":"59.213.91.238:443","userName":"guanghanOP","loginName":"guanghanOP","strUserDomainCode":"fa163e3bc4e2"}',
  HY_CALLED_INFO: '[[{"strUserDomainCode":"fa163e3bc4e2","strUserID":"6073","strUserName":"李鹏","nDevType": 1},{"strUserDomainCode":"fa163e3bc4e2","strUserID":"2091","strUserName":"刘景华","nDevType": 1}]',
  UPLOAD_URL: loginUrlHostname === '10.255.144.70' || 'localhost' ? '/api/bs/oss/govern/upload' : '/api/bs/oss/service-bus/upload',
  DEFAULT_USER: '{"id": "24477aa", "username": "byztest"}',
  LINKAGE_URL: 'http://10.74.115.103:10004/linkage-command-op-web/overview',
  LOGINOUT_URL: 'https://10.74.115.103:9111/', // 广汉登出地址
  SECONDARY: 'open',
  DISPLAY_MODE: '{"isFooterNav": "true", "isHeaderStat": "true" }'
};
