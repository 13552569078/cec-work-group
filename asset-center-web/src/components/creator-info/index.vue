<template>
  <div class="creator-info">
    <div class="creator-bg">

      <div class="img-box">
        <img src="@/assets/imgs/creater-icon.png" alt="">
        <div class="info">
          <span class="name">{{ formData.createUserName }}</span>
          <span class="title">创建人</span>
        </div>
        <div class="time-box">
          <span class="time">{{ formData.createTime }}</span>
          <span class="title">创建时间</span>
        </div>
      </div>
      <div v-if="formData.status===1" class="img-box">
        <img src="@/assets/imgs/creater-icon-1.png" alt="">
        <div class="info">
          <span class="name">{{ formData.updateUserName }}</span>
          <span class="title">更新人</span>
        </div>
        <div class="time-box">
          <span class="time">{{ formData.updateTime }}</span>
          <span class="title">更新时间</span>
        </div>
      </div>
      <div v-else class="img-box">
        <img src="@/assets/imgs/creater-icon-1.png" alt="">
        <div class="info">
          <span class="name">{{ formData.updateUserName }}</span>
          <span class="title">发布人</span>
        </div>
        <div class="time-box">
          <span class="time">{{ formData.updateTime }}</span>
          <span class="title">发布时间</span>
        </div>
      </div>
      <div class="img-box">
        <img src="@/assets/imgs/creater-icon-2.png" alt="">
        <div class="info">
          <span class="name">{{ formData.tenantName }}</span>
          <span class="title">所属租户</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
