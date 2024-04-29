
export const sendMsg = (type, data) => {
  window.parent.postMessage({
    type: type,
    info: data
  }, window.origin)
}

// 没有嵌套关系的窗口之间发送消息
export const sendMsgFromWindow = (type, data) => {
  window.opener.postMessage({
    type: type,
    info: data
  }, window.origin)
}
