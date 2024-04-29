<template>
  <div class="card-wrap">
    <div class="card" v-for="item in cardData.cardList" :key="item.name">
      <span class="value">{{ item.value }}</span>
      <span class="label">{{ item.name }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps(['cardData'])
</script>

<style lang="scss" scoped>
.card-wrap {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .card {
    padding: 16px 34px;
    background: #00224f;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-right: 10px;
    .value {
      font-size: 24px;
    }
    .label {
      font-size: 16px;
      margin-top: 8px;
    }
  }
}
</style>
