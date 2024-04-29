import { ref } from 'vue'
import { usePagination } from './usePagination'
import { isString } from '/@/utils/is'
import request from '/@/utils/http/axios/interceptors'
import { ElMessage } from 'element-plus'

interface TableProps {
  hasForm?: Boolean
  hasPagination?: Boolean
}
export function useTable(props: TableProps = {}) {
  const tableData = ref([])
  const { pagination, updatePageOption } = usePagination()
  const loading = ref(false)
  const formRef = ref()
  const Fn = ref()
  const defaultParams = ref({})
  const multipleSelection = ref([])
  const hasForm = props?.hasForm !== undefined ? props?.hasForm : true
  const hasPagination = props?.hasPagination !== undefined ? props?.hasPagination : true

  //初始化接口
  const initFn = (val: any) => {
    Fn.value = val
  }
  // 初始化额外查询参数
  const initParams = (val: any) => {
    defaultParams.value = val
  }
  // 更新查询参数
  const updateParams = (val: any) => {
    defaultParams.value = Object.assign({}, defaultParams.value, val)
  }
  // 获取参数
  const getParams = () => {
    let params = defaultParams.value as any //获取自定义入参
    if (hasForm) {
      // 有查询表单才执行
      const formParams = formRef.value.getParams() // 获取参数
      params = { ...params, ...formParams }
    }
    // 去除为空入参
    Object.keys(params).forEach((item: any) => {
      if (params[item] === '') {
        params[item] = undefined
      } else {
        params[item] = params[item]
      }
    })

    if (hasPagination) {
      //考虑到无分页器的情况
      params.pageNum = pagination.value.current
      params.pageSize = pagination.value.pageSize
    }

    return params
  }
  //初始化数据(isRest重置与否，p是隐性查询条件入参)
  const initData = async (isRest = false) => {
    tableData.value = []
    if (isRest) {
      pagination.value.total = 0
      pagination.value.msg = 0
      pagination.value.current = 1
    }
    loading.value = true
    const params = getParams()
    // 获取结果
    if (!Fn.value || Fn.value == '') {
      ElMessage.warning('接口请求地址无效！')
      return
    }
    const res = isString(Fn.value)
      ? await request.post(Fn.value, params).finally(() => {
          loading.value = false // 停止loading
        })
      : await Fn.value(params).finally(() => {
          loading.value = false // 停止loading
        })
    // 如果有结果
    if (res) {
      tableData.value = res.data?.records || res.data?.list || res.data?.data || res.data || [] // 查询结果列表
      pagination.value.total = res.data.total //更新总查询条数
      pagination.value.msg = res.msg
    }
  }

  // 当前页面更新
  const handleCurrentChange = (current: number) => {
    pagination.value.current = current // 设置当前页面
    initData()
  }
  // 单页数据条数更新
  const handleSizeChange = (size: any) => {
    pagination.value.pageSize = size // 单页数据条数
    initData()
  }
  //复选框选择
  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
  }

  return {
    tableData, //列表数据
    pagination, // 分页数据
    updatePageOption, // 更新分页器选项
    formRef, // 查询表单的ref
    loading, // loading
    multipleSelection, //多选数据
    hasForm, //是否有查询条件，默认有
    hasPagination, //是否有分页面，默认有
    initFn, //初始化接口
    initData, //初始化数据
    initParams, // 初始化额外查询参数
    updateParams, // 更新查询参数
    handleCurrentChange, // 当前页面更新
    handleSizeChange, // 单页数据条数更新
    handleSelectionChange //复选框选择
  }
}
