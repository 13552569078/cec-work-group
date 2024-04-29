import { ref } from 'vue'

export interface PageOption {
  current: number
  pageSize: number
  total: number
  handleCurrentChange?: (current: number) => void // pageSize变化
  handleSizeChange?: (pageSize: number) => void // 页码变化触发
  [key: string]: any
}

export function usePagination(pageOption?: any) {
  // 分页配置参数
  const pagination = ref<PageOption>({
    current: 1,
    pageSize: 10,
    total: 0,
    handleCurrentChange: (current: number) => pageOption?.handleCurrentChange?.(current),
    handleSizeChange: (pageSize: number) => pageOption?.pageChange?.(pageSize),
    msg: 0,
    ...pageOption
  })
  // 更新分页配置
  const updatePageOption = (options = {}) => {
    Object.assign(pagination.value, options)
    // Object.keys(options).forEach(key => pageOption.value[key] = options[key])
    console.log(pagination.value, '更新分页配置')
  }

  return {
    pagination,
    updatePageOption
  }
}
