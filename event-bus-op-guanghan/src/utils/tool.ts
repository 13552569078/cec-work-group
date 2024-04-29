/**
 * 字段转换
 * @param originObj 源对象
 * @param originField 源需要转换的字段数组
 * @param targetField 目标字段，需要和源字段数组一一对应
 */
const propertyTransfer = (originObj:any, originField:string[], targetField: string[]) => {
  originField.forEach((item, index) => {
    originObj[targetField[index] + ''] = originObj[item];
  });
  return originObj;
};

export {
  propertyTransfer
};
