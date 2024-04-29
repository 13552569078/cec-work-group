<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-09-09
-->

<template>
  <div>
    <div class="tag-item" :class="n_tag.selected?'tag-item-select':''">
      <div v-if="!editable||n_tag.status === 0" class="tag-custom"
           :class="editable?'cursor-pointer':''"
           @dblclick="editable?editTag(n_tag):''">
        <span class="tag-content">{{ n_tag.groupName }}</span>
        <template v-if="editable">
          <span class="line"></span>
          <i class="c-icon-close tag-delete" @click="handleClose(n_tag)"></i>
        </template>
      </div>
      <c-form v-else class="edit-tag-form" :model="editForm" @submit.native.prevent="()=>false">
        <c-form-item prop="editValue">
          <c-input id="editTagInput" ref="editTagInput" v-model="editForm.editValue"
                   style="width: 200px" class="input-new-tag" maxlength="10"
                   size="small" @keyup.enter.native="editInputConfirm"
                   @blur="editInputConfirm">
          </c-input>
        </c-form-item>
      </c-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tag: {
      type: Object,
      default() {
        return {}
      }
    },
    editable: { // 是否可以编辑
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editForm: {
        editValue: ''
      },
      n_tag: JSON.parse(JSON.stringify(this.tag))
    }
  },
  watch: {
    'tag.selected'() {
      this.n_tag = JSON.parse(JSON.stringify(this.tag))
    },
    'tag.groupName'() {
      this.n_tag = JSON.parse(JSON.stringify(this.tag))
    }
  },
  methods: {
    editTag() {
      this.$emit('dbclickTag', this.n_tag)
      this.n_tag.status = 1
      this.$nextTick(_ => {
        this.editForm.editValue = this.n_tag.groupName
        this.$refs.editTagInput.focus()
      })
    },
    handleClose() {
      this.$emit('deleteTag', this.n_tag)
    },
    editInputConfirm(e) {
      const inputValue = this.editForm.editValue
      if (e.keyCode === 13) {
        this.n_tag.status = 0
        return
      }

      if (inputValue) {
        if (inputValue !== this.n_tag.groupName) {
          this.editForm.editValue = ''
          this.n_tag.status = 0
          this.$emit('editTag', { groupName: inputValue, groupId: this.n_tag.groupId })
        } else {
          this.editForm.editValue = ''
          this.n_tag.status = 0
        }
      } else {
        this.n_tag.status = 0
        this.$message.warning('标签内容不允许为空！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-item {
  display: inline-block;
  height: 32px;
  &:last-child {
    margin-right: 0px;
  }
  .tag-custom {
    padding: 6px 12px 6px 15px;
    background: #F9FAFE;
    border-radius: 2px;
    border: 1px solid #E4E8EB;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3F4254;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .line {
    width: 1px;
    height: 12px;
    background: #E4E9ED;
    margin: 0 8px 0 16px;
    display: block;
  }
  .tag-delete {
    width: 12px;
    height: 12px;
    line-height: 12px;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    color: #8A8A8A;
    cursor: pointer;
  }
}
.cursor-pointer{
  cursor: pointer;
}
.tag-item-select ,.tag-item:hover{
  .tag-custom {
    background: #EBF9FF;
    border-color: #36A4FF;
  }
}
</style>
