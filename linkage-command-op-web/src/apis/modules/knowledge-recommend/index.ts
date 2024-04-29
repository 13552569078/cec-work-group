import { requestHelper } from "@/apis/base/mapper-helper";
import { IpostFindKnowledgeEventTreeSpace, IgetMSDSDetailByIdSpace, IpostMSDSPageSpace, IpostKnowledgeFolderFileEventTotalSpace,IpostFindKnowledgeEventPageSpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class KnowledgeRecommendApi {
  data2Mock: boolean = false;

  // 事件下知识文件统计|事件下知识文件统计-知识文档
  postKnowledgeFolderFileEventTotal(eventTypeName:string) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_KNOWLEDGE_MANAGEMENT}/search/knowledgeFolderFileEventTotal`;
      return requestHelper.postRequestData<IpostKnowledgeFolderFileEventTotalSpace.Model>(url, 'cedd5fe0-89ed-492e-8b20-a1985d469963', this.data2Mock, {eventTypeName});
  }
  // 事件下知识文档-列表|事件下知识文档-列表-知识文档
  postFindKnowledgeEventPage(params: IpostFindKnowledgeEventPageSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_KNOWLEDGE_MANAGEMENT}/search/findKnowledgeEventPage`;
      return requestHelper.postRequestData<IpostFindKnowledgeEventPageSpace.Model>(url, 'e62baeb7-40f5-4773-bf5d-f1b13040be3f', this.data2Mock, params);
  }

  // 事件下知识文档-知识图谱|事件下知识文档-知识图谱-知识文档
  postFindKnowledgeEventTree(params: IpostFindKnowledgeEventTreeSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_KNOWLEDGE_MANAGEMENT}/search/findKnowledgeEventTree`;
    return requestHelper.postRequestData<IpostFindKnowledgeEventTreeSpace.Model>(url, '4b1eef97-18cf-487b-85a2-e1403172785f', this.data2Mock, params);
  }

  // 知识文件-下载|知识文件-下载-知识文件
  getDownload(knowledgeFileId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_KNOWLEDGE_MANAGEMENT}/file/download/${knowledgeFileId}`;
    return requestHelper.getRequestData<any>(url, 'eac384d4-b4fa-42ab-a284-1f1103633417', this.data2Mock);
  }

  postMSDSPage(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_KNOWLEDGE_MANAGEMENT}/msdsKnowledge/knowledgeMSDSList`;
    return requestHelper.postRequestData<IpostMSDSPageSpace.Model>(url, '99104c32-6378-43de-a0b3-cdc15f865619', this.data2Mock, params);
  }

  getMSDSDetailById(id: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_KNOWLEDGE_MANAGEMENT}/msdsKnowledge/detail/${id}`;
    return requestHelper.getRequestData<IgetMSDSDetailByIdSpace.Model>(url, '99104c32-6378-43de-a0b3-cdc15f865619', this.data2Mock);
  }
}
export const apiKnowledgeRecommendObj = new KnowledgeRecommendApi();
