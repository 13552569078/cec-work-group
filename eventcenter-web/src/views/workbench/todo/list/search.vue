<template>
  <div class="et-search">
    <div class="key-search">
      <el-input
        v-model="form.title"
        placeholder="请输入事件标题"
      >
        <template slot="append">
          <img
            src="@/assets/search.png"
            class="img"
            alt=""
            @click.stop="_search"
          >
        </template>
      </el-input>
      <div class="da-btn" @click="_toggleAdBtn">高级<i v-if="showAdvance" class="el-icon-caret-top" /><i v-if="!showAdvance" class="el-icon-caret-bottom" /></div>
    </div>
    <div v-show="showAdvance" class="advance-searchs">
      <div class="normal-search">
        <div class="ns-label">事件编码</div>
        <div class="ns-item">
          <el-input v-model="form.eventCode" placeholder="请输入" clearable />
        </div>
      </div>
      <div class="normal-search">
        <div class="ns-label">事件类型</div>
        <div class="ns-item">
          <event-type-cascader
            check-strictly
            :parent-type.sync="form.eventTypeLId"
            :middle-type.sync="form.eventTypeMId"
            :child-type.sync="form.eventTypeId"
            :node-name.sync="form.nodeName"
          />
        </div>
      </div>
      <div class="normal-search">
        <div class="ns-label">事件状态</div>
        <div class="ns-item">
          <el-select
            v-model="form.eventState"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in eventStateOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </div>
      </div>
      <div class="normal-search">
        <div class="ns-label">严重程度</div>
        <div class="ns-item">
          <el-select
            v-model="form.eventUrgent"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in eventUrgentOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </div>
      </div>
      <div class="normal-search">
        <div class="ns-label">事件地址</div>
        <div class="ns-item">
          <choose-area
            :dept-id.sync="form.gridId"
            :node-names.sync="form.nodeNames"
            :levels.sync="form.levels"
            @visible-change="visibleChange"
          />
        </div>
      </div>
      <div class="normal-search">
        <div class="ns-label">事件来源</div>
        <div class="ns-item">
          <el-select
            v-model="form.eventSrcId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in eventSrcIdOptions"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </div>
      </div>
      <div class="da-btns">
        <el-button class="cestc-button" @click="_reset(false)">重置</el-button>
        <el-button type="primary" class="cestc-button" @click="_search">查询</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import eventTypeCascader from '@/views/event/components/EventTypeCascader' // 普通的事件类型
import chooseArea from '@/views/event/components/EventAddress.vue'
import speTypeMixin from '@/mixin/speTypeMixin'

export default {
  name: 'EventcenterWebSearch',
  components: { eventTypeCascader, chooseArea },
  mixins: [speTypeMixin],
  props: {
    visibleChange: {
      type: Function,
      default: () => ({})
    }
  },
  data() {
    return {
      showAdvance: false,
      form: {
        title: '',
        eventCode: '',
        eventTypeLId: '',
        eventTypeMId: '',
        eventTypeId: '',
        nodeName: '',
        eventUrgent: '',
        eventState: '',
        gridId: '',
        nodeNames: [],
        levels: [],
        eventSrcId: ''
      }
    }
  },
  computed: {
    eventStateOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_state')
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    },
    eventSrcIdOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin')
    }
  },
  methods: {
    _toggleAdBtn() {
      this.showAdvance = !this.showAdvance
      // 非高级状态要不要删除高级的选项---待确定
      // if (!this.showAdvance) {
      //   this.form = {
      //     title: this.form.title,
      //     eventTypeLId: '',
      //     eventTypeMId: '',
      //     eventTypeId: '',
      //     nodeName: '',
      //     eventUrgent: '',
      //     eventState: '',
      //     gridId: '',
      //     nodeNames: [],
      //     levels: []
      //   }
      // }
    },
    _reset(noFetch) {
      this.form = {
        eventCode: '',
        eventTypeLId: '',
        eventTypeMId: '',
        eventTypeId: '',
        nodeName: '',
        eventUrgent: '',
        eventState: '',
        gridId: '',
        nodeNames: [],
        levels: [],
        eventSrcId: ''
      }
      !noFetch && this._search()
    },
    getParams() {
      const params = {}
      for (const key in this.form) {
        if (key !== 'nodeNames' && key !== 'levels' && this.form[key]) params[key] = this.form[key]
      }
      return params
    },
    _search() {
      this.$emit('search', this.getParams())
    }
  }
}
</script>

<style lang="scss" scoped>
.et-search {
    .key-search {
        display: flex;
        margin-bottom: 20px;
        ::v-deep{
            .el-input-group__append {
                width: 32px;
                height: 32px;
                background: #F9FAFE;
                border-radius: 0px 2px 2px 0px;
                border: 1px solid #E7E7E7;
                border-left: 0px;
                padding: 0;
                padding-left: 7.5px;
                cursor: pointer;
                img {
                    width: 16px;
                    height: 16px;
                }
            }
        }

        .da-btn {
            width: 68px;
            height: 32px;
            background: #EBF9FF;
            border-radius: 2px;
            color: #36A4FF;
            flex-shrink: 0;
            margin-left: 16px;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
            i.el-icon-caret-bottom{
                margin-left: 8px;
                font-size: 18px;
                position: relative;
                top: 1px;
            }
        }
    }
    .advance-searchs {
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #DDDDDD;
        margin-bottom: 20px;
        .normal-search {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            .ns-label {
                margin-right: 16px;
            }
            .ns-item {
                flex: 1;
                .el-cascader,.el-select{
                    width: 100%;
                }
            }
        }
        .da-btns {
            display: flex;
            justify-content: center;
            .el-button+.el-button{
                margin-left: 16px;
            }
        }
    }
}
</style>
