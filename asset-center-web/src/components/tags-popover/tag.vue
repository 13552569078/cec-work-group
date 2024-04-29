<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-08-30
-->
<template>
  <div class="item-tag item-tag-content">{{ tag }}</div>
</template>

<script>
export default {
  props: {
    tag: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.item-tag {
    display: inline-block;
    padding: 0px 4px;
    background: rgba(54, 164, 255, 0.1);
    border-radius: 2px;
    color: $primaryColor;
    font-size: 12px;
    line-height: 20px;
    margin-right: 10px;
}
</style>
