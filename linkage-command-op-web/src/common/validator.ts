export const nonNegativeIntValidator = (rule: any, v: string, callback: (err?: Error) => void) => {
  const value = String(v);
  if (value) {
    if (Number.isNaN(+value) || value.indexOf('.') !== -1 || +value < 0) {
      callback(new Error(rule.message));
    } else {
      if (rule.maxValue && +value > +rule.maxValue) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    }
  } else {
    callback();
  }
};
export const nonNegativeFloatValidator = (rule: any, v:string, callback: (err?: Error) => void) => {
  const value = String(v);
  if (value) {
    const nums = value.split('.');
    if (Number.isNaN(+value) || (nums[1] && nums[1].length > rule.decimalLen) || +value < 0 || (rule.integerLen && nums[0].length > rule.integerLen)) {
      callback(new Error(rule.message));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
export const validatorInglat = (rule: any, v:string, callback: (err?: Error) => void) => {
  if (!v[0] || !v[1]) {
    callback(new Error('请选择地理坐标'));
  } else {
    if (Number.isNaN(+v[0]) || Number.isNaN(+v[1])) {
      callback(new Error('请正确填写地理坐标'));
    } else {
      callback();
    }
  }
};

export const validateCustomValue = (length: number, precision: number) => {
  return (_: any, value: string, callback: (err?: Error) => void) => {
    const val = +value;
    if (value === '') {
      callback();
      return;
    }
    if (isNaN(val)) {
      callback(new Error('值必须为数值类型'));
    } else if (val < 0) {
      callback(new Error('值必须为大于0'));
    } else {
      if (value.replace('.', '').length > length) {
        callback(new Error('最大长度为' + length + '位数'));
        return;
      }
      if (precision >= 0) {
        const p = value.split('.')[1]?.length ?? 0;
        if (p > precision) {
          callback(new Error('最大小数位数为' + precision + '位数'));
          return;
        }
      }
      callback();
    }
  };
};
