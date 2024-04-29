import { getFxAxios, getRequest, requestHelper } from 'fx-front-framework';
import { GlobalAPI } from '@/common';
import { notTranslateEmpty, noLoadingUrls, arrayBufferUrls, formDataUrls, showMsgUrls } from './http-config';

(GlobalAPI.config as any).swanUrl = `${document.location.origin}/swan-gateway/serverconfig/swan`;

const fxAxios = getFxAxios({
  serverConfig: process.env.NODE_ENV === 'production' ? GlobalAPI.config : undefined,
  arrayBufferUrls,
  noLoadingUrls,
  formDataUrls,
});

const axiosRequest = getRequest({
  showMsgUrls,
  arrayBufferUrls,
  notTranslateEmpty,
  serverObj: fxAxios
});

requestHelper.setMapperHelper({ axiosRequest, enableFilterEmptyUrl: true });

export { requestHelper, fxAxios, axiosRequest };
