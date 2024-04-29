import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetFindCommandSysOrgTreeSpace,IpostFindStrategyCommandGroupTreeSpace,IpostFindCommandSysUserPageSpace,IpostFindStrategyCommandUserPageSpace,
  IpostJudgeSpace,IpostFindStrategyCommandOrgPageSpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class AddExecutorApi {
  data2Mock: boolean = false;

  // 组织机构-查询树|组织机构-查询树-机构人员池-机构

   // 策略指挥体系组-树|策略指挥体系组-树-策略指挥体系组z
   postFindStrategyCommandGroupTree(params: any) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findCommandGroupTree`;
    return requestHelper.postRequestData<IpostFindStrategyCommandGroupTreeSpace.Model>(url, 'add1d98f-06b2-4541-84c0-3d73999e62a9', this.data2Mock, params);
  }
   // 组织机构查人员
   postFindCommandSysUserPage(params: IpostFindCommandSysUserPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/findCommandSysUserPage`;
    return requestHelper.postRequestData<IpostFindCommandSysUserPageSpace.Model>(url, '2180192a-aa0b-4667-8a7a-dfdb4c335632', this.data2Mock, params);
  }
   //  组织机构查人员
   postFindStrategyCommandUserPage(params: IpostFindStrategyCommandUserPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findStrategyCommandUserPage`;
    return requestHelper.postRequestData<IpostFindStrategyCommandUserPageSpace.Model>(url, '3243dc7d-e1ec-484e-8d55-7f3ead929ede', this.data2Mock, params);
  }
  // 任务表-校验重复执行人)|任务表-校验重复执行人)-任务表-v4.15已删除
  postJudge(taskOrganInfoAddParams: any[], taskUserInfoAddParams: any[]) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_TASK_CENTER}/task/judge`;
    return requestHelper.postRequestData<IpostJudgeSpace.Model>(url, '4ab09d70-ab72-40cc-bb2f-451084306497', this.data2Mock, { taskOrganInfoAddParams, taskUserInfoAddParams });
  }
  // 策略指挥体系机构-列表|策略指挥体系机构-列表-策略指挥体系机构
  postFindStrategyCommandOrgPage(params: IpostFindStrategyCommandOrgPageSpace.RequestParams) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findStrategyCommandOrgPage`;
    return requestHelper.postRequestData<IpostFindStrategyCommandOrgPageSpace.Model>(url, '1ffd7acd-661f-4a00-9cf8-42ae0ac6ef3b', this.data2Mock, params);
  }
  // 策略指挥体系组-策略指挥体系组-选择分组
  postFindByGroupId(eventId: string, groupId: string, strategyInfoId: string,keyWord: string) {
    const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_OP_SERVER}/strategy/findByGroupId`;
    return requestHelper.postRequestData<any>(url, '97909ef7-5e44-47f1-9dde-68c49fdcb3b5', this.data2Mock, { eventId, groupId, strategyInfoId,keyWord });
  }
}
export const apiAddExecutorObj = new AddExecutorApi();
