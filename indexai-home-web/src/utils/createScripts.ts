/* eslint-disable */
function createScript(urls:Array<string>, fn:any) {
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];
    loadJS(url, fn);
  }
}

function loadJS(url:string, callback:any) {
  let script = document.createElement('script') as any,
    fn = callback || function () {
    };
  script.type = 'text/javascript';
  // IE
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    // 其他浏览器
    script.onload = function () {
      fn();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

// 用法
export default createScript;
