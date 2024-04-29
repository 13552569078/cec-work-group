import { requestHelper } from "@/apis/base/mapper-helper";
import {
  IpostTaskTypeTreeSpace,
  IpostAddTaskInfoSpace,
  IpostFindListByEventIdSpace,
  IpostFindTaskInfoByIdSpace,
  IpostFindTaskDynamicReplyPageSpace,
  IpostFindTaskDynamicReplyPageByEventIdSpace,
  IgetFindTaskTypeByNameSpace,
  IpostFindTaskTypeConfigByIdSpace,
} from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class TaskApi {
  data2Mock: boolean = false;

  // 任务类型表-列表|任务类型表-列表-任务类型表
  postTaskTypeTree(params: any = {}) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/taskType/tree`;
    return requestHelper.postRequestData<IpostTaskTypeTreeSpace.Model>(url, 'c2ef9c83-b1d0-4dcb-8bf5-ecbda461e03d', this.data2Mock, params);
  }

  // 任务表-添加|任务表-添加-任务表
  postAddTaskInfo(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/addTaskInfo`;
    return requestHelper.postRequestData<IpostAddTaskInfoSpace.Model>(url, 'f25be195-d1ae-4af1-b7a6-a5f1a7d4876b', this.data2Mock, params);
  }
  // 任务表-根据关联事件及状态查询任务列表
  postFindListByEventId(params: IpostFindListByEventIdSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/findListByEventId`;
    return requestHelper.postRequestData<IpostFindListByEventIdSpace.Model>(url, 'd86caedb-6d65-4c74-9f31-b65ef9bf219a', this.data2Mock, params);
  }

  // 任务中心看板-总体进展|任务中心看板-总体进展-任务中心看板
  postProcess(eventInfoId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/process`;
    return requestHelper.postRequestData<any>(url, '650d4955-dc27-4338-a93e-7a904e188ece', this.data2Mock, { eventInfoId });
  }

  postOneKeySupervision(taskId: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/oneKeySupervision`;
    return requestHelper.postRequestData<any>(url, 'a7058965-2af9-4685-83ac-63b53e72d615', this.data2Mock, { taskId });
  }

  // 任务表-主键查询|任务表-主键查询-任务表 详情
  postFindTaskInfoById(id: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/findTaskInfoById`;
    return requestHelper.postRequestData<IpostFindTaskInfoByIdSpace.Model>(url, '46118755-543b-41a6-938f-db3f56eeda60', this.data2Mock, { id });
  }

  getFileDownload(id: string) {
    const url = `${GlobalAPI.config.FILE_SERVICE_HTTP}/${id}/download`;
    return requestHelper.getRequestData<any>(url, 'bc96569f-c5ba-4195-9fc7-3f56fef6ba9b', this.data2Mock);
  }

  // 任务附件表-删除|任务附件表-删除-任务附件表
  postRefTask(id: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/refTask`;
    return requestHelper.postRequestData<any>(url, 'c4d506ed-29cf-4832-8f6c-71be03a10d8d', this.data2Mock, { id });
  }

  // 任务动态及回复表-列表|任务动态及回复表-列表-任务动态及回复表
  postFindTaskDynamicReplyPage(params: IpostFindTaskDynamicReplyPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/findTaskDynamicReplyPage`;
    return requestHelper.postRequestData<IpostFindTaskDynamicReplyPageSpace.Model>(url, '33851fad-b2e1-405e-80f4-97a51c77f691', this.data2Mock, params);
  }

  // 任务动态及回复表-列表
  postFindTaskDynamicReplyPageByEventId(params: IpostFindTaskDynamicReplyPageByEventIdSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/findTaskDynamicReplyPageByEventId`;
    return requestHelper.postRequestData<IpostFindTaskDynamicReplyPageByEventIdSpace.Model>(url, 'd86caedb-6d65-4c74-9f31-b65ef9bf219a', this.data2Mock, params);
  }
  // 任务类型表-根据模块名称查询任务类型|任务类型表-根据模块名称查询任务类型-任务类型表
  getFindTaskTypeByName(taskTypeName: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/findTaskTypeByName?taskTypeName=${taskTypeName}`;
    return requestHelper.getRequestData<IgetFindTaskTypeByNameSpace.Model>(url, 'a62b71c4-94c0-4261-a646-59f3bdfbc0a0', this.data2Mock);
  }
  // 任务类型配置表-主键查询|任务类型配置表-主键查询-任务类型配置表
  postFindTaskTypeConfigById(id: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/findTaskTypeConfigById`;
    return requestHelper.postRequestData<IpostFindTaskTypeConfigByIdSpace.Model>(url, '714acbd8-ad1f-411a-8014-45639a197333', this.data2Mock, { id });
  }
}
export const apiTaskObj = new TaskApi();
