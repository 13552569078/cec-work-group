// 全局配置：包含地图、应用 code 等
window.GLOBAL_CONFIG = {
    // 二维地图底图、中心点、默认显示层级配置
    erwei: {
        addressUrl: 'https://10.25.10.84:8090/iserver/services/addressmatch-XXpoi/restjsr/v1/address',
        mapUrl: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        darkMapUrl: 'https://10.32.132.200:8090/iserver/services/map-ugcv5-dalimergefinal/rest/maps/17',
        isSuperMap: false,
        center: [35.5916508924689, 109.22926655039194],
        AmapSearch: true, // 是否使用高德搜索服务
        city: '', // 城市名（中文或中文全拼）、citycode、adcode； 主要用来限制搜索范围, 默认全国
        zoom: 16,
        minZoom: 10,
        maxZoom: 18
    },
    mapcoordinate: '10', // 目前只支持两个坐标系，10-火星坐标系   50-84坐标系
    platformTitle: '事件调度中心',
    pageTitle: '一网通管', // 浏览器标题
    rzt: {
        meetingUrl:'https://10.32.141.213:6443',
        server: 'https://10.32.141.213:6443',
        wsServer: 'wss://10.32.141.213:6443/wss/',
        sipServer:'wss://10.32.141.213:7443',
        defaultPwd:'12aa34zz'
    },
    isShzl:false,
    clientId: 'shzl', // 用来跳转统一登陆标识
}

window._AMapSecurityConfig = {
    securityJsCode:'792212ce507d2f3074186597b1bcae11',
}