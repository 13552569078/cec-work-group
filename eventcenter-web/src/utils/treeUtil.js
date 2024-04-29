/**
 * 处理tree相关工具类
 */
// data：要遍历的数据， val：查找目标， result用于装查找结果的数组
export function findParent(data, val, result = [], key = 'id') {
  for (const item of data) {
    if (item[key] === val) {
      // 将查找到的目标数据加入结果数组中
      // 可根据需求unshift(item[key])或unshift(item)
      result.unshift(item[key])
      return true
    }
    if (item.children && item.children.length > 0) {
      // 根据查找到的结果往上找父级节点
      const isFind = findParent(item.children, val, result)
      if (isFind) {
        result.unshift(item[key])
        return true
      }
    }
  }
  // 走到这说明没找到目标
  return false
}

/**
 * 递归已有tree 将对应节点置顶
 * @param {*} tree
 * @param {*} ids 父子节点数组
 */
export function setTopNode(tree, ids) {
  tree.forEach((item, index) => {
    if (ids[Number(item.level) - 1] === item.id) {
      // 找到，当前置顶
      tree.unshift(tree.splice(index, 1)[0])
      // 循环子
      if (item.children && item.children.length > 0) setTopNode(item.children, ids)
    }
  })
}

// 循环tree 删除指定id的节点
export function disabledNode(tree) {
  tree.forEach((item) => {
    item.disabled = item.status === 1
    if (item.children && item.children.length > 0) {
      disabledNode(item.children)
    }
  })
}

// 循环tree 总计多少节点
export function countNodeTree(tree) {
  let count = 0
  tree.forEach((item) => {
    count++
    if (item.children && item.children.length > 0) {
      count += countNodeTree(item.children)
    }
  })
  return count
}
