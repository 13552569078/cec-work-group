const clientWidth = document.documentElement.clientWidth || document.body.clientWidth

const basicPX = (clientWidth / 1920).toFixed(2)

const isObject = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
const defaultAttributes = ['lineHeight', 'margin', 'fontSize', 'left', 'right', 'top', 'bottom', 'padding', 'itemWidth', 'itemHeight', 'itemGap', 'symbolSize', 'width', 'height', 'barMaxWidth', 'barWidth', 'gridSize']

function useResponsiveChart() {

  const updateOptionToResponsive = (option: any, keyArr: string[] = defaultAttributes) => {
    if (typeof option !== 'object') return
    for (const key in option) {
      if (option.hasOwnProperty(key)) {
        const element = option[key]
        const type = typeof element

        if (keyArr.includes(key)) {
          switch (type) {
            case 'number':
              option[key] = element * basicPX
              break
            // array
            case 'object':
              option[key] = element.map(item => typeof item !== 'number' ? item : item * basicPX)
              break
            default:
              break
          }
        } else if (isObject(element)) {
          updateOptionToResponsive(element, keyArr)
        } else if (Array.isArray(element)) {
          element.forEach(ele => updateOptionToResponsive(ele, keyArr))
        }
      }
    }
  }

  return {
    updateOptionToResponsive,
    defaultAttributes,
  }
}

export { useResponsiveChart }
