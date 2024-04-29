import { Validators } from 'fx-front-utils';

const validatorMobile = (rule: any, value: string, callback: any) => {
  const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
  if (!reg.test(value) && value) {
    callback(new Error('手机格式不正确'));
  } else {
    callback();
  }
}
const validatorFloat = (rule: any, value: string, callback: (err?: Error) => void) => {
  if (value) {
    Validators.floatValidator(rule, value, callback);
  } else {
    callback();
  }
};
const validatorInt = (rule: any, value: string, callback: (err?: Error) => void) => {
  if (value && `${value}` === '0') {
    callback();
  } else {
    if (value) {
      Validators.intValidator(rule, value, callback);
    } else {
      callback();
    }
  }
};
const validatorLongitude = (rule: any, value: string, callback: (err?: Error) => void) => {
  if (value) {
    Validators.longitudeValidator(rule, value, callback)
  } else {
    callback();
  }
}
const validatorLatitude = (rule: any, value: string, callback: (err?: Error) => void) => {
  if (value) {
    Validators.latitudeValidator(rule, value, callback)
  } else {
    callback();
  }
}


export {
  validatorMobile,
  validatorFloat,
  validatorInt,
  validatorLongitude,
  validatorLatitude
};
