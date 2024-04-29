<!--
 * @Description: 数据资源-索引管理组件
 * @Author: renzhenggang
 * @Date: 2021-05-20
-->
<template>
  <div>
    <c-table :data="indexList" :class="isView?'disabled-new':''">
      <c-table-column type="index" label="" width="120"></c-table-column>
      <c-table-column label="索引类型" prop="indexType">
        <template slot="header">
          <div :class="{ 'title-required': !isView }"><label>索引类型</label></div>
        </template>
        <template slot-scope="scope">
          <c-select v-model="scope.row.indexType" :specific-suffix="true" size="small"
                    :disabled="isView" placeholder="请选择" @change="onInputBlur(scope,'indexType')">
            <c-option label="普通索引(index)" value="index"></c-option>
            <c-option label="不重复索引(unique)" value="unique"></c-option>
          </c-select>
          <div v-if="scope.row.hasErrorType" class="c-form-item__error">
            {{ scope.row.hasErrorType }}
          </div>
        </template>
      </c-table-column>
      <c-table-column label="索引字段" prop="indexField">
        <template slot="header">
          <div :class="{ 'title-required': !isView }"><label>索引字段</label></div>
        </template>
        <template slot-scope="scope">
          <c-select v-model="scope.row.indexFields" :specific-suffix="true" size="small"
                    :disabled="isView" multiple :placeholder="isView ? '' : '请选择'"
                    @change="onInputBlur(scope,'indexFields')">
            <c-option v-for="(item,index) in dataSource" :key="index" :label="item.attributeName"
                      :value="item.attributeCode">
            </c-option>
          </c-select>
          <div v-if="scope.row.hasErrorFields" class="c-form-item__error">
            {{ scope.row.hasErrorFields }}
          </div>
        </template>
      </c-table-column>
      <c-table-column label="索引名称" prop="indexName">
        <template slot="header">
          <div :class="{ 'title-required': !isView }"><label>索引名称</label></div>
        </template>
        <template slot-scope="scope">
          <c-input v-model="scope.row.indexName" size="small" :disabled="isView"
                   @blur="onInputBlur(scope,'indexName')">
          </c-input>
          <div v-if="scope.row.hasErrorName" class="c-form-item__error">
            {{ scope.row.hasErrorName }}
          </div>
        </template>
      </c-table-column>
      <c-table-column v-if="!isView" label="操作" width="70" fixed="right">
        <template slot-scope="scope">
          <c-button type="text" size="small" @click="onDelIndex(scope.row, scope.$index)">删除
          </c-button>
        </template>
      </c-table-column>
    </c-table>
  </div>
</template>
<script>
export default {
  props: {
    showBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    isView: {
      type: Boolean,
      default() {
        return false
      }
    },
    dataSource: {
      type: Array
    },
    indexList: {
      type: Array
    }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {
    onDelIndex(row, index) {
      this.indexList.splice(index, 1)
    },
    onInputBlur(scope, colName) {
      console.log(scope, colName, 'dddddd')
      if (colName === 'indexType') {
        if (!scope.row.indexType) {
          this.$set(scope.row, 'hasErrorType', '请选择索引类型')
        } else {
          this.$set(scope.row, 'hasErrorType', '')
        }
      } else if (colName === 'indexFields') {
        if (!scope.row.indexFields || scope.row.indexFields.length === 0) {
          this.$set(scope.row, 'hasErrorFields', '请选择索引字段')
        } else {
          this.$set(scope.row, 'hasErrorFields', '')
        }
      } else if (colName === 'indexName') {
        if (!scope.row.indexName) {
          this.$set(scope.row, 'hasErrorName', '请输入索引名称')
        } else if (this.indexList.some((item, index) => {
          return (index !== scope.$index && !!item.indexName && item.indexName === scope.row.indexName)
        })) {
          this.$set(scope.row, 'hasErrorName', '索引名称不能重复')
        } else {
          this.$set(scope.row, 'hasErrorName', '')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.create-btn {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  font-size: 14px;
  color: #404040;
}
.header-text {
  height: 42px;
  line-height: 42px;
}
.header-tools {
  margin-left: auto;
  i {
    margin-right: 8px;
  }
  .header-btn {
    margin-right: 20px;
  }
}
.header {
  display: flex;
}
.title-required:before {
  content: '*';
  color: #ed4931;
  margin-right: 4px;
}
</style>
