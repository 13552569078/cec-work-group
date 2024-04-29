import dayjs from 'dayjs';
import { EChartUtils } from 'fx-front-framework';
import { Constants } from 'fx-front-utils';
import { GlobalAPI } from './global-api';

export const echartsFontSize = (size: number): number => EChartUtils.echartsFontSize(size, 1080);

export const scaleSizeRadio = (num: number, uiHeight = 1080) => {
  return num * window.innerHeight / uiHeight;
};

export const getPrjRoot = () => {
  return `${document.location.origin}/${GlobalAPI.config.PROD_PREFIX}/`;
};

export const getRemoteFilePath = (url: string) => {
  if (url.startsWith('http:') || url.startsWith('https:')) {
    return GlobalAPI.config.FILE_VIEW + url.substring(url.indexOf('/minio') + 6);
  } else {
    return url.startsWith('/') ? GlobalAPI.config.FILE_VIEW + url : GlobalAPI.config.FILE_VIEW + '/' + url;
  }
};

export const isVideo = (url: string) => {
  return Constants.VIDEO_FILES.includes(url?.substring(url?.lastIndexOf('.'))?.toLowerCase());
};
export const isImage = (url: string) => {
  return Constants.PIC_FILES.includes(url?.substring(url?.lastIndexOf('.'))?.toLowerCase());
};
