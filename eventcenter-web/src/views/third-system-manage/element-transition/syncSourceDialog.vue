<template>
  <cestc-dialog v-bind="$attrs" title="一键同步来源配置" width="960px" :show-close="false" :append-to-body="false" v-on="$listeners" @confirm="_confirm">
    <el-alert
      :title="`同步警告！【${tableData.map(item => { return item.thisSysEventTypeCode}).join('、')}】事件类型有多个来源配置`"
      type="warning"
      show-icon
      :closable="false"
    />
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px; margin-top: 20px;"
      row-key="id"
      tooltip-effect="light"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="thisSysEventTypeFullName" label="本系统类型名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.thisSysEventTypeFullName || scope.row.thisSysEventTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="thisSysEventTypeCode" label="本系统类型编码" width="180" />
      <el-table-column prop="disposeSysEventTypeName" label="处置系统类型名称" width="300">
        <template slot-scope="scope">
          <!-- <el-radio-group v-model="scope.row.firstDisposeSysEventTypeCode" @change="((value)=>{handleChange(value, scope.row, 1)})">
            <el-radio v-for="item in scope.row.disposeEventTypeVOList" :key="item.disposeSysEventTypeId" :label="item.disposeSysEventTypeCode">
              {{ item.disposeSysEventTypeName }}
            </el-radio>
          </el-radio-group> -->
          <el-cascader
            v-model="scope.row.secondDisposeSysEventTypeIds"
            :options="getOptionsList(scope.row.disposeEventTypeVOList)"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择其他类型名称"
            style="width: 100%"
            popper-class="custom-cascader"
            @change="((value)=>{handleChange(value, scope.row, 2)})"
          />
        </template>
      </el-table-column>
      <el-table-column prop="disposeSysEventTypeCode" label="处置系统类型编码" width="200">
        <template slot-scope="scope">
          <span>{{ getDisposeSysEventTypeCode(scope.row) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </cestc-dialog>

</template>
<script>
import moduleSrv from '@/api/dispatchWhh'
import { findParent, setTopNode } from '@/utils/treeUtil'

export default {
  name: 'SyncSourceDialog',
  props: {
    sourceSystemCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [],
      tableData: []
    }
  },
  async mounted() {
    await this.getOptions()
    await this.getTableList()
  },
  methods: {
    getOptionsList(disposeEventTypeVOList) {
      // this.disableRadio(this.options, disposeEventTypeVOList.map(item => { return item.disposeSysEventTypeCode }))

      const _options = JSON.parse(JSON.stringify(this.options))
      const _disposeEventTypeVOList = JSON.parse(JSON.stringify(disposeEventTypeVOList))
      // 1、获取所有节点的 父子节点
      const parentMap = new Map()
      _disposeEventTypeVOList.reverse().forEach(item => {
        const result = []
        findParent(_options, item.disposeSysEventTypeId, result, 'id')
        parentMap.set(item.disposeSysEventTypeId, result)
      })
      console.log(parentMap, 'parentMap')
      // 2、遍历parentMap 获取对应的节点
      parentMap.forEach((val, key) => {
        console.log(val, key)
        setTopNode(_options, val)
      })
      console.log(_options, 'options')

      return _options
    },

    getDisposeSysEventTypeCode(row) {
      if (row.firstDisposeSysEventTypeCode) {
        return row.firstDisposeSysEventTypeCode
      } else {
        return row.secondDisposeSysEventTypeCode && Array.isArray(row.secondDisposeSysEventTypeCode) ? row.secondDisposeSysEventTypeCode[row.secondDisposeSysEventTypeCode.length - 1] : row.secondDisposeSysEventTypeCode
      }
    },
    _confirm() {
      console.log('123')
      // 保存冲突配置
      const params = {
        disposeSystemCode: this.sourceSystemCode,
        disposeConfirmRelation: this.tableData.map(item => {
          return {
            thisSysEventTypeId: item.thisSysEventTypeId,
            disposeSysEventTypeId: item.disposeSysEventTypeId,
            disposeSysEventTypeName: item.disposeSysEventTypeName,
            disposeSysEventTypeCode: item.disposeSysEventTypeCode
          }
        })
      }
      console.log(params, 'params')
      moduleSrv.saveSyncConfDisposeSys(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.$emit('cancle')
          }
        })
    },
    // 查找tree节点
    getTreeNode(findId, array, findKey) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        if (element[findKey] === findId) { return element } else if (element.children && element.children.length) {
          const result = this.getTreeNode(findId, element.children, findKey)
          // 在没有返回值的情况下才进行递归
          if (result) { return result }
        }
      }
      return null
    },
    handleChange(val, row, index) {
      console.log(92, val)
      if (index === 1) { // 单选
        const selectItem = row.disposeEventTypeVOList.filter(item => { return item.disposeSysEventTypeCode === val })[0]
        row.secondDisposeSysEventTypeCode = ''
        row.disposeSysEventTypeId = selectItem.disposeSysEventTypeId
        row.disposeSysEventTypeName = selectItem.disposeSysEventTypeName
        row.disposeSysEventTypeCode = selectItem.disposeSysEventTypeCode
      } else { // 树选
        const selectItem = this.getTreeNode(val[val.length - 1], this.options, 'id')
        row.firstDisposeSysEventTypeCode = ''
        // 通过options code找id
        // console.log(this.getTreeNode(val[val.length - 1], this.options, 'code'))
        row.disposeSysEventTypeId = selectItem?.id
        row.disposeSysEventTypeName = selectItem?.name
        row.disposeSysEventTypeCode = selectItem?.code
        row.secondDisposeSysEventTypeCode = selectItem?.code
      }
      console.log(row.disposeSysEventTypeId, 'disposeSysEventTypeId')
    },
    async getOptions() {
      const params = {
        sourceSystemCode: this.sourceSystemCode
      }
      const { data } = await moduleSrv.getThirdTypeList(params)
      this.options = data
    },
    getCodes(data, val) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].code === val) {
          return [data[i].code]
        }
        if (data[i] && data[i].children) {
          const d = this.getCodes(data[i].children, val)
          if (d) {
            return d.concat(data[i].code)
          }
        }
      }
    },
    // 禁用单选
    disableRadio(data, codes) {
      data.forEach(item => {
        if (codes.includes(item.code)) item.disabled = true
        if (item.children && item.children.length > 0) {
          this.disableRadio(item.children, codes)
        }
      })
    },
    async getTableList() {
      const params = {
        disposeSystemCode: this.sourceSystemCode
      }
      console.log(params, 99)
      const { data } = await moduleSrv.getSyncConfDisposeSysList(params)
      console.log(100, data)
      // 默认选中第一个
      data.forEach(item => {
        // const firstDisposeEvenetType = item.disposeEventTypeVOList[0]
        // const codes = this.getCodes(this.options, firstDisposeEvenetType.disposeSysEventTypeCode)
        // console.log(codes?.reverse())
        // item.firstDisposeSysEventTypeCode = firstDisposeEvenetType.disposeSysEventTypeCode
        // item.disposeSysEventTypeId = firstDisposeEvenetType.disposeSysEventTypeId
        // item.secondDisposeSysEventTypeCode = []

        // // 处理name code
        // item.disposeSysEventTypeName = firstDisposeEvenetType.disposeSysEventTypeName
        // item.disposeSysEventTypeCode = firstDisposeEvenetType.disposeSysEventTypeCode

        const secondDisposeEvenetType = item.disposeEventTypeVOList[0]
        const secondDisposeSysEventTypeId = secondDisposeEvenetType.disposeSysEventTypeId
        const codes = []
        findParent(this.options, secondDisposeSysEventTypeId, codes, 'id')
        console.log(this.options, secondDisposeSysEventTypeId, codes, 'id', 210)
        item.secondDisposeSysEventTypeIds = codes
        item.disposeSysEventTypeId = secondDisposeEvenetType.disposeSysEventTypeId
        item.secondDisposeSysEventTypeCode = secondDisposeEvenetType.disposeSysEventTypeCode

        item.disposeSysEventTypeName = secondDisposeEvenetType.disposeSysEventTypeName
        item.disposeSysEventTypeCode = secondDisposeEvenetType.disposeSysEventTypeCode
      })
      // 处理返回
      this.tableData = data
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep {
  .el-alert--warning.is-light {
    width: 904px;
    height: 48px;
    background: rgba(254,204,85,0.1);
    border-radius: 2px;
    border: 1px solid #FECC55;
  }
  .el-alert__icon {
    margin-top: 6px;
  }
  .el-alert__title {
    line-height: 30px;
    font-size: 14px;
    color: #4B4B4B;
  }
}
</style>
