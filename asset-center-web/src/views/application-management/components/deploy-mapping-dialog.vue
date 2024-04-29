<!--/*
* @Author:
* @Desc: 应用部署弹框
* @Date:
*/-->
<template>
  <c-dialog
    class="dialog-center asset-post"
    width="900px"
    :visible.sync="dialogVisible"
    :before-close="close"
    append-to-body>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="close">取消</c-button>
      <c-button type="gradual" size="small" @click="handleOk">确定</c-button>
    </div>
    <span slot="title">字段映射配置
      <c-tooltip placement="top" popper-class="cls-form-label-tip">
        <span slot="content" class="hahah" v-html="tipTitle">
        </span>
        <i class="cls-icon-info" style="margin-left:4px"></i>
      </c-tooltip>
    </span>
    <div>
      <c-table :data="tableData" height="500">
        <c-table-column :label="newColTitle">
          <c-table-column label="对象字段" prop="tName" />
          <c-table-column label="字段类型" prop="tType" />
        </c-table-column>
        <c-table-column :label="oldColTitle">
          <c-table-column label="对象字段" prop="sType">
            <template slot-scope="scope">
              <c-select
                v-model="scope.row.sourceColumnId"
                clearable
                filterable
                :specific-suffix="false"
                @change="selectChange(scope.row.sourceColumnId, scope.$index)"
              >
                <c-option
                  v-for="d in selectOptions"
                  :key="d.id"
                  :value="d.id"
                  :label="d.label"></c-option>
              </c-select>
            </template>
          </c-table-column>
          <c-table-column label="字段类型" prop="sType" />
        </c-table-column>
      </c-table>
    </div>
  </c-dialog>
</template>
<script>
import { appDeployModelColumns } from '@/api'
import { columsMap } from './config'
export default {
  name: 'DeployMappingDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      selectOptions: [],
      columsMap,
      primaryKeys: ['CREATE_TIME', 'CREATED', 'OPERATE_TIME', 'OPERATED', 'PERMISSION_LEVEL_CODE', 'DEPT_ID', 'STATION_ID', 'ID', 'TENANT_ID'],
      tipTitle: `<div>温馨提示，系统会根据新版本对象字段来修改数据表结构，修改规则如下：
        <br>· 对于下面建立映射关系的字段，系统会按照对象的新版本来修改字段的名称、中文名称、数据类型和字段长度。
        <br>· 对于下面没有建立映射关系 且 在新版本中出现的字段，系统会自动将这些字段添加到数据表中。
        <br>· 对于下面没有建立映射关系 且 在旧版本中出现的字段，系统会自动删除该列，所以请务必构建好映射关系。</div>`
    };
  },
  computed: {
    newColTitle() {
      return this.data && this.data.newVersion ? `新版本(${this.data.newVersion})` : '新版本'
    },
    oldColTitle() {
      return this.data && this.data.oldVersion ? `旧版本(${this.data.oldVersion})` : '旧版本'
    }
  },
  watch: {
    visible(nv) {
      this.dialogVisible = this.visible
      if (nv) {
        this.init()
      } else {
        this.tableData = []
        this.selectOptions = []
      }
    }
  },
  methods: {
    init() {
      this.getTabelData()
    },
    selectChange(val, index) {
      const data = [...this.tableData]
      if (val) {
        const d = this.selectOptions.find(d => d.id === val)
        data[index].sourceColumnId = d.id
        const typeName = columsMap[d.type] && columsMap[d.type].name || d.type
        data[index].sType = d.length ? `${typeName}(${d.length})` : typeName
        data[index].sName = `${d.comment}/${d.filedName}`
      } else {
        data[index].sourceColumnId = ''
        data[index].sType = ''
        data[index].sName = ''
      }
    },
    async getTabelData() {
      try {
        const params = {
          assetCode: this.data.assetCode,
          newVersion: this.data.newVersion,
          oldVersion: this.data.oldVersion
        }
        const res = await appDeployModelColumns(params)
        const newColumns = res.data.newColumns.filter(d => {
          return this.primaryKeys.findIndex(i => i === d.filedName) === -1
        })
        const oldColumns = res.data.oldColumns
        this.selectOptions = [].concat({ label: '无', id: '' }, oldColumns.map(d => ({ ...d, label: d.comment ? `${d.comment}/${d.filedName}` : d.filedName })))
        let tableData = this.data.fieldMappings
        if (!(tableData && tableData.length)) {
          tableData = newColumns.map(d => {
            const old = oldColumns.find(o => o.filedName === d.filedName)
            const typeName = columsMap[d.type] && columsMap[d.type].name || d.type
            const item = {
              sourceColumnId: '', // 旧的
              targetColumnId: d.id, // 新的
              tName: d.comment ? `${d.comment}/${d.filedName}` : d.filedName,
              tType: d.length ? `${typeName}(${d.length})` : typeName,
              sType: '',
              sName: ''
            }
            if (old) {
              const typeName = columsMap[old.type] && columsMap[old.type].name || d.type
              item.sourceColumnId = old.id
              item.sName = old.comment ? `${old.comment}/${old.filedName}` : old.filedName
              item.sType = old.length ? `${typeName}(${old.length})` : typeName
            }
            return item
          })
        }
        this.tableData = tableData
      } catch (e) {
        console.error(e)
      }
    },
    async handleOk() {
      try {
        const arr = []
        this.selectOptions.forEach(d => {
          if (d.id) {
            const index = this.tableData.findIndex(i => i.sourceColumnId === d.id)
            const i = this.primaryKeys.findIndex(p => p === d.filedName)
            if (index === -1 && i === -1) {
              arr.push(d.comment || d.filedName)
            }
          }
        })
        if (arr.length) {
          const str = `旧版本的 ${arr.join('、')} 没有建立映射关系，系统部署后会将数据表中对应列删除，对应列存储数据也将丢失，是否继续？`
          await this.$confirm(str, '温馨提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
        this.$emit('ok', this.tableData)
      } catch (e) {
        console.error(e)
      }
    },
    close() {
      this.$emit('close')
    }
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables.scss';
</style>
