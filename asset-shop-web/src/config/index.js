/**
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-24
 */

export const applyTypeList = [
  { value: 1, label: '资源下载' },
  { value: 2, label: '订阅申请' },
  {
    value: 3,
    label: '权限分配'
  },
  // {
  //   value: 4,
  //   label: '独立部署'
  // }
]
export const applyTypeListMap = new Map(applyTypeList.map(d => [d.value, d.label]))
export const applyTypeTipsMap = {
  3: '默认为所选的联系人开通账号权限，申请成功后，可在【我的申请】中查看授权信息进行应用访问和使用。',
  4: '为您自动创建部署该应用至开发中心，部署成功后可在【我的申请】查看部署信息，也可在开发中心查看应用。',
  1: '只能通过开发中心完成解析，支持在开发中心选择该下载资源创建新应用，也可在【我的申请】中查看下载软件包。',
  '1_buildChannel2': '资源下载申请成功后，可在【我的申请】中查看下载软件包，支持在本地修改部署后使用。'
}
export const applyObjectList = [{ value: '1', label: '资源' }, { value: '2', label: '应用' }]
export const applyStatusList = [
  { value: '0', label: '审核中' },
  { value: '1', label: '已通过' },
  { value: '2', label: '已驳回' }
]
