import * as enums from '@/utils/enum'
export const referAssetTypeObj = enums.ASSET_TYPE
export const ASSET_SUBTYPE = enums.ASSET_SUBTYPE

export const asseTypeFormat = function(type, subType, s = '-') {
  if (+type === 99) return '应用资源'
  // 模型、流程只展示一级菜单
  if (+type === 7 || +type === 5) {
    return referAssetTypeObj[type]
  }
  const arr = []
  referAssetTypeObj[type] && arr.push(referAssetTypeObj[type])
  ASSET_SUBTYPE[subType] && arr.push(ASSET_SUBTYPE[subType])
  return arr.join(s)
}
