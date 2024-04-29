<!--/*
* @Author: dingli
* @Desc: 输入参数组
* @Date: 2020-12-2
*/-->
<template>
  <div class="param-part-content">
    <div class="flex-common table-title">
      <div class="flex-item part-title">
        <div v-show="partParams.isEdit" :class="{ 'cls-input-error': !!partParams.isError }">
          <input v-model="partParams.name" @change="partNameChange" @blur="partNameChange"
                 @keyup="toLowerCase(partParams, 'name')" />
          <span>{{ partParams.isError }}</span>
        </div>
        <span v-show="!partParams.isEdit">{{ partParams.name
        }}<i v-if="!isView" class="operate-icon operate-icon-edit update-hover-color"
             @click="partParams.isEdit = true" /></span>
      </div>
      <div class="btns">
        <div v-show="!isView" class="theme-create-btn" @click="handleBtn">
          <span class="icon-color btn-text update-hover-color">
            <span class="margin-right-4px">新增</span>
            <i class="iconfont fontweight400 update-hover-color-icon"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="flex-common table-title no-border">
      <div v-for="item in tableTitle" :key="item" class="flex-item">
        <span v-show="item !== '操作'" :class="{
          'title-required':
            !isView && (item === '参数名称' || item === '参数类型')
        }">{{ item }}</span>
      </div>
    </div>
    <c-scrollbar class="param-box">
      <c-form v-for="(itemRow, index) in partParams.params" :key="itemRow.id"
              :ref="'_form-' + itemRow.id" :model="itemRow" :rules="itemRowRules" label-width="0px"
              class="flex-common param-editor-item form-box" :class="isView ? 'disabled-new' : ''"
              @submit.native.prevent>
        <div v-for="item in tableTitle" :key="item" class="flex-item">
          <c-form-item v-if="item === '参数名称' && !isView" label="" prop="name"
                       class="flex-item-input-wrapper">
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
                      :placeholder="isView ? '' : '请选择'" size="small" :disabled="isView">
              <c-option v-for="typeItem in typeOptions" :key="typeItem.value"
                        :label="typeItem.label" :value="typeItem.value" />
            </c-select>
          </c-form-item>

          <c-form-item v-if="item === '允许为空'" label="">
            <span v-if="isView">{{ itemRow.nullable }}</span>
            <c-checkbox v-else v-model="itemRow.nullable" :disabled="isView" />
          </c-form-item>

          <c-form-item v-if="item === '操作' && !isView">
            <div class="flex-common">
              <span class=" icon-delete icon-to-text " style="margin-left: -8px;"
                    :class="{ 'disable-del': disableDel }" @click="gotoDel(index, 1)">删除</span>
            </div>
          </c-form-item>
        </div>
      </c-form>
    </c-scrollbar>
  </div>
</template>
<script>
import $bus from '@/utils/bus';
import { TYPE_OPTIONS, TABLE_TITLE_ONE, GET_TYPE } from './config';
import { isArray } from '@/utils/type-judgment.js';
import textOverTooltip from '@l/components/text-over-tooltip';
export default {
  name: 'InputPart',
  components: { textOverTooltip },
  props: {
    isView: {
      type: Boolean,
      default: () => false
    },
    allparams: {
      type: String,
      default: () => ''
    },
    paramindex: {
      type: Number,
      default: () => 0
    },
    inputcount: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    return {
      partParams: {
        name: 'part',
        isError: '',
        isEdit: false,
        params: [
          {
            id: 1,
            name: '',
            desc: '',
            type: '',
            nullable: false,
            showType: ''
          }
        ]
      },
      itemRowRules: {
        name: {
          required: false,
          validator: (rule, val, cb) => {
            if (!val) {
              cb('请输入参数名');
            } else if (val.length > 20) {
              cb('最多输入20个字符');
            } else if (
              /(^(?![a-z]))|((?=[^a-z])(?=[^0-9])(?=[^_]))/i.test(val)
            ) {
              if (/(^(?![a-z]))/.test(val)) {
                cb('开头须是字母');
              } else {
                cb('字母,数字,下划线组成');
              }
            } else {
              // 判断是否重复
              const flag = this.partParams.params.filter(
                item => val === item.name
              );
              if (flag.length > 1) {
                cb('参数名称不能重复');
              } else {
                cb();
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
              const flag = this.partParams.params.filter(
                item => val === item.desc
              );
              if (flag.length > 1) {
                cb('参数显示名称不能重复');
              } else {
                cb();
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
              cb();
            }
          },
          trigger: 'change'
        }
      },
      limit: 1,
      paramsAll: [],
      typeOptions: TYPE_OPTIONS,
      tableTitle: TABLE_TITLE_ONE
    };
  },
  computed: {
    disableDel() {
      return this.limit >= this.partParams.params.length || this.isView;
    }
  },
  watch: {
    limit(nv) {
      if (nv > this.partParams.params.length) {
        this.partParams.params.push({
          id: Date.now(),
          name: '',
          desc: '',
          type: '',
          nullable: false,
          showType: ''
        });
      }
    },
    inputcount: {
      handler(nv) {
        if (+nv === 1) {
          this.limit = 2;
        } else {
          this.limit = 1;
        }
      },
      deep: true
    }
  },
  created() {
    this.initParams();
    if (!this.isView) {
      $bus.$on(
        'do-parameters-setting-validate',
        this.doParametersSettingValidate
      );
      $bus.$on('do-get-input-params', this.doGetInputParams);
      $bus.$on('change-input-params-partname', this.changePartName);
    }
  },
  beforeDestroy() {
    $bus.$off(
      'do-parameters-setting-validate',
      this.doParametersSettingValidate
    );
    $bus.$off('do-get-input-params', this.doGetInputParams);
    $bus.$off('change-input-params-partname', this.changePartName);
  },
  methods: {
    clearContent() {
      console.log('smdksdkdkksd');
      if (
        this.partParams &&
        this.partParams.params &&
        this.partParams.params.length
      ) {
        this.partParams.params = [
          {
            id: 1,
            name: '',
            desc: '',
            type: '',
            nullable: false,
            showType: ''
          }
        ];
      }
    },
    toLowerCase(obj, key) {
      if (/[A-Z]/.test(obj[key])) {
        setTimeout(() => {
          this.$set(obj, key, obj[key].toLowerCase());
        }, 300);
      }
    },
    initParams() {
      const arr = [1, 2, 3, 4, 5].map(v => {
        const item = {
          name: `part${v}`,
          limitCount: v === 1 ? 2 : 1,
          params: [
            {
              id: 1,
              name: '',
              desc: '',
              type: '',
              nullable: false,
              showType: ''
            }
          ]
        };
        if (item.limitCount === 2) {
          item.params.push({
            id: 2,
            name: '',
            desc: '',
            type: '',
            nullable: false,
            showType: ''
          });
        }
        return item;
      });
      if (this.allparams) {
        const data = JSON.parse(this.allparams);
        const keys = Object.keys(data);
        keys.forEach((k, i) => {
          arr[i].name = k;
          arr[i].limitCount = keys.length === 1 && i === 0 ? 2 : 1;
          if (isArray(data[k])) {
            arr[i].params = [];
            let num = 100000 * i;
            data[k].forEach(item => {
              num++;
              arr[i].params.push({
                id: Date.now() + num,
                name: item.name,
                desc: item.desc,
                type: item.type,
                nullable: item.nullable,
                showType: item.showType
              });
            });
          }
        });
      }
      this.paramsAll = arr;
      Object.assign(this.partParams, this.paramsAll[this.paramindex]);
      this.limit = this.paramsAll[this.paramindex].limitCount;
    },
    doParametersSettingValidate() {
      // 监听参数设置的校验
      const { flag, input } = this.validate();
      this.getResult(flag, input);
    },
    doGetInputParams() {
      // 输出参数点击“参照输入参数”按钮时触发的事件
      const { flag, input } = this.validate('onlyName');
      $bus.$emit('get-input-params', {
        flag: !flag,
        input: input
      });
    },
    // 校验数据
    validate(onlyName) {
      let flag = false;
      if (this.partParams.isEdit || this.partParams.isError) {
        flag = true;
        return { flag, input: '' };
      }
      const input = {
        parmas: [],
        index: this.paramindex,
        name: this.partParams.name
      };
      this.partParams.params.forEach(item => {
        this.$refs['_form-' + item.id][0].validate(valid => {
          if (valid) {
            input.parmas.push({
              name: item.name,
              desc: item.desc,
              type: GET_TYPE(item.showType),
              nullable: item.nullable,
              showType: item.showType
            });
          } else {
            flag = true;
            if (onlyName && item.name) {
              input.parmas.push({
                name: item.name,
                desc: item.desc,
                type: '',
                nullable: '',
                showType: ''
              });
            }
          }
        });
      });
      return { flag, input };
    },
    getResult(flag, input) {
      $bus.$emit('parameters-setting-validate', {
        flag: !flag,
        type: 'input',
        input: flag ? '' : input
      });
    },
    // 修改分组名称
    partNameChange() {
      const val = this.partParams.name;
      if (!val) {
        this.partParams.isError = '请输入参数组名';
        return;
      }
      let isRepeat = false;
      for (let i = 0; i < +this.inputcount; i++) {
        if (i !== this.paramindex && val === this.paramsAll[i].name) {
          isRepeat = true;
          break;
        }
      }
      if (val.length > 20) {
        this.partParams.isError = '最多输入20个字符';
      } else if (/(^(?![a-z]))|((?=[^a-z])(?=[^0-9])(?=[^_]))/i.test(val)) {
        if (/(^(?![a-z]))/.test(val)) {
          this.partParams.isError = '开头须是字母';
        } else {
          this.partParams.isError = '字母,数字,下划线组成';
        }
      } else if (isRepeat) {
        this.partParams.isError = '参数组名已存在';
      } else {
        this.partParams.isError = '';
        this.partParams.isEdit = false;
        // 更新参数名时通知其他输入组件
        this.paramsAll[this.paramindex].name = val;
        $bus.$emit('change-input-params-partname', {
          index: this.paramindex,
          paramsAll: this.paramsAll,
          name: val
        });
      }
    },
    // 更新参数名时通知其他输入组件
    changePartName(msg) {
      Object.assign(this.paramsAll[msg.index], { name: msg.name });
    },
    // 点击新增参数
    handleBtn() {
      this.partParams.params.push({
        id: Date.now(),
        name: '',
        desc: '',
        type: '',
        nullable: false,
        showType: ''
      });
    },
    // 删除参数
    gotoDel(index) {
      if (!this.disableDel) {
        this.partParams.params.splice(index, 1);
      }
    },
    // 参数名称校验
    nameValidator(val, cb, name) {
      if (!val) {
        cb('请输入参数名');
      } else if (val.length > 20) {
        cb('最多输入20个字符');
      } else if (/(^(?![a-z]))|((?=[^a-z])(?=[^0-9])(?=[^_]))/i.test(val)) {
        if (/(^(?![a-z]))/.test(val)) {
          cb('开头须是字母');
        } else {
          cb('字母,数字,下划线组成');
        }
      } else {
        // 判断是否重复
        const flag = this.partParams.params.filter(item => val === item[name]);
        if (flag.length > 1) {
          cb('参数名称不能重复');
        } else {
          cb();
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables.scss';
.update-hover-color-icon {
  background: url('~@/assets/application/icon-add.png') no-repeat 0 0 / 100%
    100%;
  color: #4b4b4b !important;
  width: 16px;
  height: 16px;
}
.update-hover-color {
  color: #4b4b4b !important;
  &:hover {
    color: $primaryColor !important;
    .update-hover-color-icon {
      color: $primaryColor !important;
      background: url('~@/assets/application/icon-add-hover.png') no-repeat 0 0 /
        100% 100%;
    }
  }
}
.margin-right-4px {
  margin-right: 4px;
}
.btn-text {
  display: flex;
  align-items: center;
}
.fontweight400 {
  font-weight: 400;
  margin-right: 4px;
}
.param-part-content {
  .title-required:before {
    content: '*';
    color: #ed4931;
    margin-right: 4px;
  }
  .flex-common {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    justify-content: space-between;
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
    width: calc(100% - 100px) !important;
    color: #4b4b4b;
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
    width: 15%;
  }
  .flex-item:nth-child(5) {
    width: 10%;
  }
  .param-box {
    height: 166px;
    padding: 16px 24px 0;
    .icon-delete {
      cursor: pointer;
    }
    .disable-del {
      color: #ededed;
      cursor: not-allowed;
    }
  }
  .icon-color {
    color: $primaryColor;
    user-select: none;
  }
}
</style>
