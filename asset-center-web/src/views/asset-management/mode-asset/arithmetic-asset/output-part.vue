<!--/*
* @Author: dingli
* @Desc: 输出参数组
* @Date: 2020-12-2
*/-->
<template>
  <div class="setting-box">
    <div class="box-top">
      <div class="title">
        输出参数设置
      </div>
    </div>
    <div class="content">
      <div class="flex-common table-title">
        <div class="btns flex-common">
          <div v-show="!isView" class="theme-create-btn theme-create-btn-1"
               @click="handleBtn('refer')">
            <span class="btn-text"><span class="margin-right-4px">参照输入参数</span>
              <i class="iconfont icon-add fontweight400" /></span>
          </div>
          <div v-show="!isView" class="theme-create-btn" @click="handleBtn('create')">
            <span class="btn-text"><span class="margin-right-4px">新增</span>
              <i class="iconfont icon-add fontweight400" /></span>
          </div>
        </div>
      </div>
      <div class="flex-common table-title no-border">
        <div v-for="item in tableTitle" :key="`title-${item}`" class="flex-item">
          <span v-show="item !== '操作'"
                :class="{'title-required': !isView && item !== '操作' && item !== '参数显示名称'}">{{ item }}</span>
        </div>
      </div>
      <div :style="{height: tableHeight}">
        <c-scrollbar v-if="outputParams.length" class="param-box">
          <c-form v-for="(itemRow, idx) in outputParams" :key="`form-${itemRow.id}`"
                  :ref="'_output-form-'+itemRow.id" :model="itemRow" :rules="itemRowRules"
                  label-width="0px" class="flex-common param-editor-item form-box"
                  @submit.native.prevent>
            <div v-for="item in tableTitle" :key="`form-item-${item}`" class="flex-item">
              <c-form-item v-if="item === '参数名称' && !isView" label=""
                           class="flex-item-input-wrapper" prop="name">
                <c-input v-model="itemRow.name" placeholder="不区分大小写" size="small"
                         @input="toLowerCase(itemRow, 'name')" />
              </c-form-item>

              <div v-if="item === '参数名称' && isView" class="flex-item-input-wrapper">
                <text-over-tooltip :input-disable="true" :content="itemRow.name"
                                   :add-padding-top="true" />
              </div>

              <c-form-item v-if="item === '参数显示名称' && !isView" label="" prop="desc"
                           class="flex-item-input-wrapper">
                <c-input v-model="itemRow.desc" placeholder="请输入" size="small" />
              </c-form-item>

              <div v-if="item === '参数显示名称' && isView" class="flex-item-input-wrapper">
                <text-over-tooltip :input-disable="true" :content="itemRow.desc"
                                   :add-padding-top="true" />
              </div>

              <c-form-item v-if="item === '参数类型'" label="" class="flex-item-input-wrapper"
                           prop="showType">
                <c-select v-model="itemRow.showType" :specific-suffix="true"
                          :placeholder="isView?'':'请选择'" size="small" :disabled="isView"
                          @change="changeShowType(itemRow, idx)">
                  <c-option v-for="typeItem in typeOptions" :key="typeItem.value"
                            :label="typeItem.label" :value="typeItem.value" />
                </c-select>
              </c-form-item>

              <c-form-item v-if="item === '长度' && (itemRow.showType === 'string' || !itemRow.showType)"
                           label="" prop="length">
                <c-input v-model="itemRow.length" :style="{width: '80%'}"
                         :placeholder="isView?'':'数字'" size="small" :disabled="isView" />
              </c-form-item>

              <c-form-item v-if="item === '长度' && (itemRow.showType === 'datetime' || itemRow.showType === 'int')"
                           label="">
                <c-input v-model="itemRow.length" :style="{width: '80%'}" placeholder=""
                         size="small" :disabled="true" />
              </c-form-item>

              <c-form-item v-if="item === '长度' && itemRow.showType === 'float'" label=""
                           prop="floatlength">
                <c-input v-model="itemRow.floatlength" :style="{width: '80%'}"
                         :placeholder="isView?'':'例:6,2'" size="small" :disabled="isView" />
              </c-form-item>

              <c-form-item v-if="item === '操作' && !isView">
                <div class="flex-common">
                  <span class=" icon-delete icon-to-text " :class="{'disable-del': disableDel}"
                        style="margin-left: -8px;" @click="gotoDel(idx, 2)">删除</span>
                </div>
              </c-form-item>
            </div>
          </c-form>
        </c-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import $bus from '@/utils/bus'
import { TYPE_OPTIONS, TABLE_TITLE_TWO, GET_TYPE } from './config'
import { isArray } from '@/utils/type-judgment.js'
import textOverTooltip from '@l/components/text-over-tooltip'
export default {
  name: 'OutputPart',
  components: { textOverTooltip },
  props: {
    isView: {
      type: Boolean,
      default: () => false
    },
    params: {
      type: String,
      default: () => ''
    },
    inputcount: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    return {
      outputParams: [
        {
          id: 3,
          outname: '',
          desc: '',
          type: '',
          length: '',
          floatlength: '',
          showType: ''
        }
      ],
      itemRowRules: {
        name: {
          required: false,
          validator: (rule, val, cb) => {
            if (!val) {
              cb('请输入参数名');
            } else if (val.length > 20) {
              cb('最多输入20个字符');
            } else if (/(^(?![a-z]))|((?=[^a-z])(?=[^0-9])(?=[^_]))/i.test(val)) {
              if (/(^(?![a-z]))/.test(val)) {
                cb('开头须是字母')
              } else {
                cb('字母,数字,下划线组成')
              }
            } else {
              // 判断是否重复
              const flag = this.outputParams.filter(item => (val === item.name))
              if (flag.length > 1) {
                cb('参数名称不能重复')
              } else {
                cb()
              }
            }
          },
          trigger: 'blur'
        },
        desc: {
          validator: (rule, val, cb) => {
            if (!val) {
              cb();
            } else if (val.length > 20) {
              cb('最多输入20个字符');
            } else {
              // 判断是否重复
              const flag = this.outputParams.filter(item => (val === item.desc))
              if (flag.length > 1) {
                cb('参数显示名称不能重复')
              } else {
                cb()
              }
            }
          },
          trigger: 'blur'
        },
        showType: {
          required: false,
          validator: (rule, val, cb) => {
            if (!val) {
              cb('参数类型不能为空');
            } else {
              cb()
            }
          },
          trigger: 'change'
        },
        length: {
          required: false,
          validator: (rule, val, cb) => {
            if (!val) {
              cb('长度不能为空');
            } else if (!(/^\d+$/.test(val) && val > 0)) {
              cb('长度为正整数');
            } else {
              cb()
            }
          },
          trigger: 'blur'
        },
        floatlength: {
          required: false,
          validator: (rule, val, cb) => {
            if (!val) {
              cb('长度不能为空');
            } else {
              const arr = val.split(',')
              if (arr.length + '' === '' + 2 && (/^\d+$/.test(arr[0]) && arr[0] > 0) && (/^\d+$/.test(arr[1]) && arr[1] > 0)) {
                // 逗号前最多7，小数位最多为2 前边数大于后边的数
                if (arr[0].length > 7) {
                  cb('逗号前最多7位')
                } else if (arr[1].length > 2) {
                  cb('逗号后最多2位')
                } else if (parseInt(arr[0]) < parseInt(arr[1])) {
                  cb('逗号前需大于后')
                } else {
                  cb()
                }
              } else {
                cb('应为数字和,组成')
              }
            }
          },
          trigger: 'blur'
        }
      },
      typeOptions: TYPE_OPTIONS,
      tableTitle: TABLE_TITLE_TWO
    }
  },
  computed: {
    disableDel() {
      return this.outputParams.length <= 1 || this.isView
    },
    tableHeight() {
      return (244 * this.inputcount - 78) + 'px'
    }
  },
  watch: {
    params(val) {
      if (!val) return;
      const list = JSON.parse(this.params)
      if (!isArray(list)) return;
      const arr = []
      list.forEach((item, i) => {
        arr.push({
          id: Date.now() + 'params' + i,
          name: item.name,
          desc: item.desc,
          type: item.type,
          length: item.length,
          floatlength: item.showType === 'float' ? item.length : '',
          showType: item.showType
        })
      })
      this.outputParams = arr;
    }
  },
  created() {
    if (!this.isView) {
      $bus.$on('do-parameters-setting-validate', this.doParametersSettingValidate)
      $bus.$on('get-input-params', this.getInputParams)
    }
  },
  beforeDestroy() {
    $bus.$off('do-parameters-setting-validate', this.doParametersSettingValidate)
    $bus.$off('get-input-params', this.getInputParams)
  },
  methods: {
    clearContent() {
      if (this.outputParams.length) {
        this.outputParams = [
          {
            id: 3,
            outname: '',
            desc: '',
            type: '',
            length: '',
            floatlength: '',
            showType: ''
          }
        ]
      }
    },
    toLowerCase(obj, key) {
      if (/[A-Z]/.test(obj[key])) {
        setTimeout(() => {
          this.$set(obj, key, obj[key].toLowerCase());
        }, 300);
      }
    },
    // 输出参数点击“参照输入参数”按钮
    getInputParams(msg) {
      const arrMap = {}
      msg.input.parmas.forEach((p, j) => {
        if (!~(this.outputParams.findIndex(v => v.name + '' === '' + p.name))) {
          this.itemRowRules.name.validator(null, p.name, (m) => {
            if (!m) {
              arrMap[p.name] = {
                id: ('canzhao' + j + Date.now()),
                name: p.name,
                desc: '',
                type: '',
                length: p.showType === 'int' ? '11' : '',
                floatlength: '',
                showType: ''
              }
            }
          })
        }
      })
      if (Object.keys(arrMap).length) {
        this.outputParams = [...this.outputParams.filter(o => o.name), ...Object.values(arrMap)]
      }
    },
    doParametersSettingValidate() {
      // 监听参数设置的校验
      const { flag, output } = this.validate()
      $bus.$emit('parameters-setting-validate', {
        flag: !flag,
        type: 'output',
        output: flag ? '' : output
      })
    },
    validate() {
      let flag = false
      const output = []
      this.outputParams.forEach((item) => {
        this.$refs['_output-form-' + item.id][0].validate((valid) => {
          if (valid) {
            output.push({
              name: item.name,
              desc: item.desc,
              type: GET_TYPE(item.showType),
              length: item.showType === 'float' ? item.floatlength : (item.showType !== 'datetime' ? item.length : ''),
              showType: item.showType
            })
          } else {
            flag = true
          }
        })
      })
      return { flag, output }
    },
    handleBtn(type) {
      if (type === 'create') {
        this.outputParams.push({
          id: new Date().getTime(),
          name: '',
          desc: '',
          type: '',
          length: '',
          floatlength: '',
          showType: ''
        })
      } else if (type === 'refer') {
        // 借用输入参数  把输入参数名称与输出参数不同的赋值到输出侧
        $bus.$emit('do-get-input-params')
      }
    },
    gotoDel(index) {
      if (this.disableDel) return;
      this.outputParams.splice(index, 1)
    },
    changeShowType(item, index) {
      this.outputParams[index].length = ''
      this.outputParams[index].floatlength = ''
      if (item.showType === 'int') {
        this.outputParams[index].length = '11'
      }
      // 对长度校验规则重置
      this.$refs['_output-form-' + item.id][0].clearValidate(['length', 'floatlength'])
    }
  }
}
</script>
<style scoped lang="scss">
.btn-text {
  display: flex;
  align-items: center;
  .icon-add {
    width: 16px;
    height: 16px;
    background-image: url(~@/assets/application/icon-add.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  &:hover {
    .icon-add {
      background-image: url(~@/assets/application/icon-add-hover.png);
    }
  }
}
.fontweight400 {
  font-weight: 400;
  margin-right: 4px;
}
.setting-box {
  box-sizing: border-box;
  flex: 1;
  .box-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    background: #f9fafe;
    padding: 24px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #404040;
    }
  }
  .title-required:before {
    content: '*';
    color: #ed4931;
    margin-right: 4px;
  }
}
.margin-right-4px {
  margin-right: 4px;
}
.flex-common {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &.no-border {
    height: 30px;
    border: none;
    align-items: baseline;
  }
}
.setting-box-1 {
  border-right: 1px solid #ededed;
}
.theme-create-btn-1 {
  margin-right: 16px;
}
.table-title {
  height: 48px;
  padding: 0 24px;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  font-size: 14px;
  font-weight: 600;
  color: #9b9b9b;
}
.part-title {
  color: #404040;
  i {
    margin-left: 5px;
    vertical-align: middle;
    cursor: pointer;
  }
  input {
    height: 32px;
  }
  .cls-input-error {
    input {
      height: 32px;
      border-radius: 2px;
      border: 1px solid #ed4931;
    }
    > span {
      padding-left: 2px;
      font-size: 12px;
      font-weight: normal;
      color: #ed4931;
    }
  }
}
.flex-item {
  box-sizing: border-box;
  ::v-deep.c-form-item {
    margin-bottom: 20px;
  }
}
.flex-item-input-wrapper {
  width: 90%;
}

.flex-item:nth-child(1),
.flex-item:nth-child(2),
.flex-item:nth-child(3) {
  width: 25%;
}
.flex-item:nth-child(4) {
  width: 17%;
}
.flex-item:nth-child(5) {
  width: 8%;
}
.param-box {
  height: 100%;
  padding: 16px 24px 0;
  .icon-delete {
    cursor: pointer;
  }
  .disable-del {
    color: #ededed;
    cursor: not-allowed;
  }
}
.btns {
  justify-content: flex-end;
  width: 100%;
}
</style>
