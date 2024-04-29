import { GlobalAPI } from '../common';

function useIframeUrl() {
  // 判断iframe路径前缀
  function setIframeUrl(url: string): string {
    return process.env.NODE_ENV === 'production' ?
      `${GlobalAPI.config.PROD_PREFIX_PORJECT ? '/' + GlobalAPI.config.PROD_PREFIX_PORJECT : ''}${url}`
      :
      debugApp(url);
  }

  function debugApp(url: string) {
    if (url.indexOf('resource-management-web') > -1) return `http://localhost:8348${url}`;
    else if (url.indexOf('swan-event-reception') > -1) return `http://localhost:8345${url}`;
    else if (url.indexOf('linkage-command-event-handle-web') > -1) return `http://localhost:8348${url}`;
    else return url;
  }

  return {
    setIframeUrl,
  };
}

export { useIframeUrl };
