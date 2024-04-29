import request from '/@/utils/http/axios/interceptors'

enum Api {
  chat = '/robot/chat',
  getRelatedIndex = '/base/index/manage/getRelatedIndex',
  searchIndex = '/base/index/manage/searchIndex',
  searchIndexDetail = '/base/index/manage/searchIndexDetail',
  getSearchList = '/base/index/manage/searchContent',
  getHomeNature1 = '/home/service/api/zrzskycsqqpm',
  getHomeNature2 = '/home/service/api/zrzskycsqqpmtop10cs',
  getHomeNature3 = '/home/service/api/zrzskycspjmx',
  getHomeBusiness1 = '/home/service/api/yshjzsqgpm',
  getHomeBusiness2 = '/home/service/api/yshjzsqgpmtop20',
  getHomeBusiness3 = '/home/service/api/yshjfxzbmc',
  getHomeSmart1 = '/home/service/api//zhcszsqqpm',
  getHomeSmart2 = '/home/service/api/zhcszsqqpmtop20cs',
  getHomeSmart3 = '/home/service/api/zhcszspjpm',
  getHomeTraffic1 = '/home/service/api/csjkjtzspm',
  getHomeTraffic2 = '/home/service/api/csjtjkzspmtop20cs',
  getHomeTraffic3 = '/home/service/api/csjtyxzspjmx',
  getHomeTalent1 = '/home/service/api/qqcsrcnxzspm',
  getHomeTalent2 = '/home/service/api/qqcsrcnxzspmtop10cs',
  getHomeTalent3 = '/home/service/api/qqcsrcnxzspjmx',
  getHomeEducation1 = '/home/service/api/zgjyzsqgpm',
  getHomeEducation2 = '/home/service/api/zgjyzsqgpmtop10cs',
  getHomeEducation3 = '/home/service/api/zgjyzspjmx',
}
const moduleSrv = {
  /**
   * @description: 机器人对话
   */
  chat: (params: any) => request.post(Api.chat, params),
  getRelatedIndex: (params: any) => request.post(Api.getRelatedIndex, params),
  searchIndex: (params: any) => request.post(Api.searchIndex, params),
  searchIndexDetail: (params: any) => request.post(Api.searchIndexDetail, params),
  getSearchList: (params: any) => request.post(Api.getSearchList, params),
  getHomeNature1: () => request.get(Api.getHomeNature1),
  getHomeNature2: (params: any) => request.get(Api.getHomeNature2, params),
  getHomeNature3: (params: any) => request.get(Api.getHomeNature3, params),
  getHomeBusiness1: () => request.get(Api.getHomeBusiness1),
  getHomeBusiness2: (params: any) => request.get(Api.getHomeBusiness2, params),
  getHomeBusiness3: (params: any) => request.get(Api.getHomeBusiness3, params),
  getHomeSmart1: () => request.get(Api.getHomeSmart1),
  getHomeSmart2: (params: any) => request.get(Api.getHomeSmart2, params),
  getHomeSmart3: (params: any) => request.get(Api.getHomeSmart3, params),
  getHomeTraffic1: () => request.get(Api.getHomeTraffic1),
  getHomeTraffic2: (params: any) => request.get(Api.getHomeTraffic2, params),
  getHomeTraffic3: (params: any) => request.get(Api.getHomeTraffic3, params),
  getHomeTalent1: () => request.get(Api.getHomeTalent1),
  getHomeTalent2: (params: any) => request.get(Api.getHomeTalent2, params),
  getHomeTalent3: (params: any) => request.get(Api.getHomeTalent3, params),
  getHomeEducation1: () => request.get(Api.getHomeEducation1),
  getHomeEducation2: (params: any) => request.get(Api.getHomeEducation2, params),
  getHomeEducation3: (params: any) => request.get(Api.getHomeEducation3, params)
}

export default moduleSrv
