<!--
 * @Description: 数据资源-索引管理组件
 * @Author: renzhenggang
 * @Date: 2021-05-07
-->
<template>
  <div>
    <c-dialog :class="'dialog-center'"
              :visible="showDialog"
              width="50%"
              title="索引管理"
              @close="close">
      <div v-if="!isView" class="dialog-header">
        <div class="header-tools">
          <span class="create-btn" @click="onAddIndex"><i class="mr8 iconfont icon-c-add"></i>新建</span>
        </div>
      </div>
      <c-table
        :data="indexList"
        height="380"
      >
        <c-table-column type="index" label="" width="120"></c-table-column>
        <c-table-column label="索引类型" prop="indexType">
          <template slot-scope="scope">
            <c-select v-model="scope.row.indexType" :specific-suffix="true" size="medium" :disabled="isView" placeholder="请选择">
              <c-option label="普通索引(index)" value="index"></c-option>
              <c-option label="不重复索引(unique)" value="unique"></c-option>
            </c-select>
          </template>
        </c-table-column>
        <c-table-column label="索引字段" prop="indexField">
          <template slot-scope="scope">
            <c-select v-model="scope.row.indexField"
                      :specific-suffix="true"
                      size="medium"
                      :disabled="isView"
                      placeholder="请选择">
              <c-option
                v-for="(item,index) in dataSource"
                :key="index"
                :label="item.attributeName"
                :value="item.attributeCode">
              </c-option>
            </c-select>
          </template>
        </c-table-column>
        <c-table-column label="索引名称" prop="indexName">
          <template slot-scope="scope">
            <c-input
              v-model="scope.row.indexName"
              size="medium"
              :disabled="isView">
            </c-input>
          </template>
        </c-table-column>
      </c-table>
      <span slot="footer" class="dialog-footer">
        <c-button
          v-if="!isView"
          size="small" type="ordinary"
          @click="onCancel">取消</c-button>
        <c-button
          type="gradual"
          size="small"
          @click="onOk">确定</c-button>
      </span>
    </c-dialog>
  </div>
</template>
<script>
export default {
  props: {
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
    },
    showIndexWin: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    showDialog() {
      return !!this.showIndexWin
    }
  },
  methods: {
    onOk() {
      this.$emit('on-ok', {
        indexList: this.indexList
      })
    },
    onCancel() {
      this.$emit('on-cancel')
    },
    onAddIndex() {
      this.indexList.push({
        indexType: '',
        indexName: '',
        indexField: ''
      })
    },
    close() {
      this.$emit('on-cancel')
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
.dialog-header {
  display: flex;
}
</style>
