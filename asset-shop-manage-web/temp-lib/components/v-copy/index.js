export default {
  install(Vue) {
    const handlerManager = {}
    const eleManager = {}
    const generateId = ((id) => () => '$' + id++)(1)
    const copyFunc = function(value) {
      const cssText = 'position:fixed;pointer-events:none;z-index:-9999;opacity:0;'
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', '')
      textarea.style.cssText = cssText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    const handler = (value, copyBtn) => () => {
      copyFunc(value)
      copyBtn.textContent = ''
    }
    Vue.directive('copy', {
      bind(el, binding) {
        console.log({ el, binding }, '--bind')
        const handleId = generateId()
        const { value } = binding
        const cssText = 'position:absolute;top:0;right:0;left:0;bottom:0;cursor:pointer;'
        const copyBtn = document.createElement('span')
        copyBtn.textContent = ''
        copyBtn.style.cssText = cssText
        handlerManager[handleId] = handler(value, copyBtn)
        eleManager[handleId] = copyBtn
        copyBtn.addEventListener('click', handlerManager[handleId])
        el.appendChild(copyBtn)
        el.dataset.handleId = handleId
      },
      update(el, binding) {
        const { handleId } = el.dataset
        const { value, oldValue } = binding
        if (value === oldValue) {
          return
        }
        const copyBtn = eleManager[handleId]
        copyBtn.textContent = ''
        copyBtn.removeEventListener('click', handlerManager[handleId])
        handlerManager[handleId] = handler(value, copyBtn)
        copyBtn.addEventListener('click', handlerManager[handleId])
      },
      unbind(el) {
        console.log({ el }, '--unbind')
        const { handleId } = el.dataset
        const copyBtn = eleManager[handleId]
        copyBtn.removeEventListener('click', handlerManager[handleId])
      }
    })
  }
}
