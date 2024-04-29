import { requestHelper } from "@/apis/base/mapper-helper";
import { IgetFindUsedEventTypeSpace,IpostModifyCommandSysUserPoolRoleSpace,IpostDeleteCommandSysUserPoolRoleSpace,IpostFindCommandSysUserPoolRolePageSpace,IpostAddCommandSysUserPoolRoleSpace,IpostFindCommandSysUserPoolRoleByIdSpace } from './model';
import { GlobalAPI } from '@/common';

/**
 * 数据访问，此类代码生成器生成
 */
class RoleManagementApi {
  data2Mock: boolean = false;

  // 角色管理-查询条件-事件类型|角色管理-查询条件-事件类型-角色管理
  getFindUsedEventType() {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/findUsedEventType`;
      return requestHelper.getRequestData<IgetFindUsedEventTypeSpace.Model>(url, 'ac530a8e-c5f1-4fbd-b3e2-e57d7b4439ec', this.data2Mock);
  }
  // 角色管理-修改|角色管理-修改-角色管理
  postModifyCommandSysUserPoolRole(params: IpostModifyCommandSysUserPoolRoleSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/modifyCommandSysUserPoolRole`;
      return requestHelper.postRequestData<IpostModifyCommandSysUserPoolRoleSpace.Model>(url, 'd7dfba01-9511-41b1-848f-71cac7cac3de', this.data2Mock, params);
  }
  // 角色管理-删除|角色管理-删除-角色管理
  postDeleteCommandSysUserPoolRole(ids:string[]) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/deleteCommandSysUserPoolRole`;
      return requestHelper.postRequestData<IpostDeleteCommandSysUserPoolRoleSpace.Model>(url, '04f4c6da-615b-4e57-9dc2-9e22e68a3d9d', this.data2Mock, {ids});
  }
  // 角色管理-分页列表|角色管理-分页列表-角色管理
  postFindCommandSysUserPoolRolePage(params: any) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/findCommandSysUserPoolRolePage`;
      return requestHelper.postRequestData<IpostFindCommandSysUserPoolRolePageSpace.Model>(url, '0672002f-95e9-4868-a1ce-6b9fc9e550cc', this.data2Mock, params);
  }
  // 角色管理-添加|角色管理-添加-角色管理
  postAddCommandSysUserPoolRole(params: IpostAddCommandSysUserPoolRoleSpace.RequestParams) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/addCommandSysUserPoolRole`;
      return requestHelper.postRequestData<IpostAddCommandSysUserPoolRoleSpace.Model>(url, 'c40a3ac3-57c4-49ea-8032-3acc7ff4a4a1', this.data2Mock, params);
  }
  // 角色管理-主键查询|角色管理-主键查询-角色管理
  postFindCommandSysUserPoolRoleById(id:string) {
      const url = `${GlobalAPI.config.BASE_URL}${GlobalAPI.config.API_PREFIX_SWAN_COMMAND_SYSTEM}/commandsystem/findCommandSysUserPoolRoleById`;
      return requestHelper.postRequestData<IpostFindCommandSysUserPoolRoleByIdSpace.Model>(url, 'c33740c6-ae65-48cf-b70d-dbd1b30c53d9', this.data2Mock, {id});
  }

}
export const apiRoleManagementObj = new RoleManagementApi();
