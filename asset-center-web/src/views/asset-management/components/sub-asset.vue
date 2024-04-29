<template>
  <div>
    <div class="tab-list-little">
      <c-radio-group v-model="type" size="small">
        <c-radio-button label="1">接口资源</c-radio-button>
        <c-radio-button label="3">体征资源</c-radio-button>
        <c-radio-button label="4">模型资源</c-radio-button>
        <c-radio-button label="2">支撑应用</c-radio-button>

      </c-radio-group>
      <!-- <c-menu :default-active="type" active-text-color="#36A4FF" text-color="#4b4b4b"
              class="c-menu-download" mode="horizontal" @select="handleSelect">
        <c-menu-item index="1">接口</c-menu-item>
        <component :is="'c-menu-item'" popper-class="c-menu-download-sub"
                   :index="'2'">
          <template slot="title">支撑应用</template>

        </component>
      </c-menu> -->
      <div v-show="pageStatus!='detail'" class="add-btn" @click="add">
        <i class="c-icon-plus"></i> 新增
      </div>
    </div>
    <c-table v-if="type==='1'||type==='3'||type==='4'" :key="type"
             :data="list"
             :max-height="330" class="table-expand-own"
             style="width: 100%;line-height: 1;">
      <c-table-column type="index" label="" fit :width="60" />

      <c-table-column label="" width="70">

        <template slot-scope="scope">
          <i v-if="(scope.row.referVersionStatus===2)" class="algin-center">
            <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
              <i class="alert-update" @click.stop="" />
            </c-tooltip>
          </i>
          <i v-if="(scope.row.referVersionStatus===3)" class="algin-center"
             @click.stop="">
            <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
              <i class="alert-invalid" @click.stop="" />
            </c-tooltip>
          </i>
        </template>
      </c-table-column>
      <c-table-column width="30"></c-table-column>

      <c-table-column show-overflow-tooltip fit prop="assetName" label="资源名称"
                      min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="assetCode" align="left"
                      label="资源编码" min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="version" align="left"
                      label="资源版本号" min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="assetTypeLabel" align="left"
                      label="资源类型" min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="assetDesc" align="left"
                      label="资源描述" min-width="95" />
      <c-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <div class="oprete-list">
            <span class="icon-to-text icon-operate"
                  :class="pageStatus !== 'detail'?'has-split':''"
                  @click="goDetail2(scope.row)">查看</span>
            <span v-if="pageStatus !== 'detail' && scope.row.subtype +''!=='27'"
                  class="icon-to-text icon-operate "
                  @click="deleteRefer2(scope.row)">取消引用</span>
          </div>
        </template>
      </c-table-column>
    </c-table>
    <c-table v-if="type==='2'" :key="type"
             :data="list"
             :max-height="330" class="table-expand-own"
             style="width: 100%;line-height: 1;">
      <c-table-column type="index" label="" fit :width="60" />
      <c-table-column label="" width="70">
        <template slot-scope="scope">
          <i v-if="(scope.row.referVersionStatus===2)" class="algin-center">
            <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
              <i class="alert-update" @click.stop="" />
            </c-tooltip>
          </i>
          <i v-if="(scope.row.referVersionStatus===3)" class="algin-center"
             @click.stop="">
            <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
              <i class="alert-invalid" @click.stop="" />
            </c-tooltip>
          </i>
        </template>
      </c-table-column>
      <c-table-column :type="'expand'" width="30">
        <template slot-scope="props">
          <!-- 二级 -->
          <div class="c-tabs--border-card tabs-card-box">
            <span v-for="checkItem,index in props.row.children" :key="checkItem.apiId"
                  class="check-box">
              <i v-if="(checkItem.referVersionStatus===2)" class="alert-box"
                 @click.stop="">
                <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
                  <i class="icon-alert-update" @click.stop="" />
                </c-tooltip>
              </i>
              <i v-else-if="(checkItem.referVersionStatus===3)" class="alert-box"
                 @click.stop="">
                <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                  <i class="icon-alert-invalid" @click.stop="" />
                </c-tooltip>
              </i>
              <i v-else class="alert-box"></i>
              <span class="name">{{ checkItem.bizKey }}</span>
              <span v-if="pageStatus !== 'detail'" class="icon-to-text icon-operate"
                    @click="deleteRefer2(props.row,index)">取消引用</span>
            </span>
          </div>
        </template>

      </c-table-column>

      <c-table-column show-overflow-tooltip fit prop="assetName" label="资源名称"
                      min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="assetCode" align="left"
                      label="资源编码" min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="version" align="left"
                      label="资源版本号" min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="assetTypeLabel" align="left"
                      label="资源类型" min-width="95" />
      <c-table-column show-overflow-tooltip fit prop="assetDesc" align="left"
                      label="资源描述" min-width="95" />
      <c-table-column label="操作" width="160">
        <template slot-scope="scope">
          <div class="oprete-list">
            <span class="icon-to-text icon-operate"
                  @click="goDetail2(scope.row)">查看</span>
            <span v-if="pageStatus !== 'detail' && scope.row.subtype +''!=='27'"
                  class="icon-to-text icon-operate "
                  @click="deleteRefer2(scope.row)">取消引用</span>
          </div>
        </template>
      </c-table-column>
    </c-table>
  </div>
</template>

<script>
export default {
  props: {
    pageStatus: {
      type: String,
      default: ''
    },
    provide: {
      type: Boolean,
      default: false
    },
    showList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      type: this.provide ? '2' : '1'
    }
  },
  computed: {
    list() {
      return this.showList.filter(item => {
        if (this.type === '1') {
          return item.subtype + '' === '22'
        } else if (this.type === '2') {
          return item.subtype + '' === '27'
        } else if (this.type === '3') {
          return item.subtype + '' === '14'
        } else if (this.type === '4') {
          return item.subtype + '' === '72'
        }
        // item.subtype + '' === (this.type === '1' ? '22' : '27')
      }).map(item => {
        if (this.pageStatus !== 'detail') return item
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            if (!item[key])item[key] = '--'
          }
        }
        return item
      })
    }
  },
  watch: {
    type() {
      this.$nextTick(() => {
        this.$refs.multipleTable && this.$refs.multipleTable.doLayout()
      })
    }
  },
  methods: {
    handleSelect(list) {
      this.type = list
    },
    goDetail2(row) {
      this.$emit('goDetail', row)
    },
    deleteRefer2(row, subIndex) {
      this.$emit('deleteRefer', { row, subIndex })
    },
    add(row) {
      this.$emit('add', row)
    }
  }
}
</script>

<style lang="scss" scoped>

.tab-list-little {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 20px;
  &::v-deep {
    .c-radio-button__inner {
      font-size: 14px;
    }
    .c-radio-button__orig-radio:checked + .c-radio-button__inner {
      background-color: #fff;
      border: 1px solid #36a4ff;
    }
  }
}
.icon-operate {
  cursor: pointer;
  margin-right: 8px;
  padding-right: 8px;
}
.add-btn {
  cursor: pointer;
  &:hover {
    color: #36a4ff;
  }
}
</style>
