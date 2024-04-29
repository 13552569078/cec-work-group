<template>
  <div class="demo">
    <div class="not-open"></div>
    <div>暂未开放</div>
  </div>
</template>
<style lang="scss" scoped>
.demo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.not-open {
  width: 30.3%;
  height: 30.3%;
  background: url('/@/assets/images/common/not-open.svg') no-repeat;
  background-size: 100% 100%;
}
</style>
