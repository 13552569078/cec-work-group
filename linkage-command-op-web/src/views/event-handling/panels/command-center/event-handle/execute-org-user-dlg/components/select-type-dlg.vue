<template>
  <hl-dialog
    :model-value="true"
    title="选择新增方式"
    :close-on-click-modal="false"
    width="calc(var(--xxs) * 128.75)"
    padding="var(--xl)"
    @close="$emit('cancel')"
  >
    <hl-group class="p-x-lg p-y-md" dir="vertical" gap="var(--md)" full>
      <hl-row gap="var(--lg)">
        <hl-col span="col-24">
          <hl-radio v-model="accountType" label="2" class="w-full display-block" custom :class="{'is-active': accountType==='2'}">
            <div class="btn-item">
              <img src="@/assets/images/event-handling/left-2/add-user-type-system-icon.png" alt="">
              <span>添加系统用户-用户中心</span>
            </div>
          </hl-radio>
        </hl-col>
        <hl-col span="col-24">
          <hl-radio v-model="accountType" label="1" class="w-full display-block" custom :class="{'is-active': accountType==='1'}">
            <div class="btn-item">
              <img src="@/assets/images/event-handling/left-2/add-user-type-temporary-icon.png" alt="">
              <span>添加临时处置人员</span>
            </div>
          </hl-radio>
        </hl-col>
        <hl-col span="col-24">
          <hl-radio v-model="accountType" label="0" class="w-full display-block" custom :class="{'is-active': accountType==='0'}">
            <div class="btn-item">
              <img src="@/assets/images/event-handling/left-2/add-user-type-temporary-icon.png" alt="">
              <span>添加专家-应急资源</span>
            </div>
          </hl-radio>
        </hl-col>
      </hl-row>
    </hl-group>
    <template #footer>
      <span class="dialog-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="m-l-md" @click="confirm">确定</hl-button>
      </span>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['cancel', 'confirm']);

const accountType = ref('2');

const confirm = () => {
  emit('confirm', accountType.value);
};
</script>
<style scoped lang="scss">
:deep(.hl-radio){
  width: calc(var(--xxs) * 100.25) !important;
  height: calc(var(--xxs) * 32.75);
  padding: calc(var(--xxs) * 1.25);
  .btn-item{
    width: 100%;
    height: 100%;
    background-image: url(@/assets/images/event-handling/left-2/add-user-type-bg.png);
    background-size: 100% 100%;
    padding-left: var(--xs);
    display: flex;
    align-items: center;
    img{
      height: calc(var(--xxs) * 30.25);
      margin-right: var(--md);
    }
    span{
      font-size: var(--font-xl);
    }
  }
  &.is-active{
    padding: 0;
    .btn-item{
      background-image: url(@/assets/images/event-handling/left-2/add-user-type-checked-bg.png);
    }
  }
}

</style>
