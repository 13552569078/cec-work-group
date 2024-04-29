import './index.css'

export default {
  install(Vue) {
    function handleClick(e) {
      if (e.target.className === 'v-compare-pop') {
        const tip = e.target.childNodes[0]
        if (tip.style.display === 'none') {
          tip.style.display = 'block'
        } else {
          tip.style.display = 'none'
        }
      }
    }
    document.addEventListener('click', (e) => {
      if (e.target.className !== 'v-compare-tip' && e.target.className !== 'v-compare-pop') {
        const tips = document.querySelectorAll('.v-compare-tip')
        tips.forEach(tip => {
          tip.style.display = 'none'
        })
      }
    }, true)
    Vue.directive('compare', {
      componentUpdated(el, binding, vnode) {
        const { value, oldValue, arg } = binding
        if (!oldValue && value) {
          const lastModel = vnode.data.model.value
          const beforeModel = value[arg]
          if (lastModel !== beforeModel) {
            const pop = document.createElement('div')
            pop.className = 'v-compare-pop'
            const tip = document.createElement('div')
            tip.className = 'v-compare-tip'
            tip.style.display = 'none'
            tip.textContent = beforeModel
            pop.addEventListener('click', handleClick, true)
            pop.appendChild(tip)
            el.appendChild(pop)
            el.__pop__ = pop
          }
        }
      },
      unbind(el) {
        const pop = el.__pop__
        if (pop) {
          pop.removeEventListener('click', handleClick)
        }
      }
    })
  }
}
