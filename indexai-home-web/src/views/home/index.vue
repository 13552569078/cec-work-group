<template>
  <div class="home-wrap">
    <!-- <div class="logo"></div> -->
    <div class="home-con-wrap">
      <!-- 左panel -->
      <div class="panel left">
        <panel-left1 class="left-item" />
        <panel-left2 class="left-item" />
        <panel-left3 class="left-item" />
        <panel-left4 class="left-item" />
      </div>

      <!-- 中panel -->
      <div class="panel center">
        <div class="banner">
          <banner />
        </div>
        <div class="robot">
          <robot />
          <!-- 机器人 -->
        </div>
      </div>

      <!-- 右panel -->
      <div class="panel right">
        <panel-right1 class="right-item" />
        <panel-right2 class="right-item" />
        <panel-right3 class="right-item" />
        <panel-right4 class="right-item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PanelLeft1,
  PanelLeft2,
  PanelLeft3,
  PanelLeft4,
  PanelRight1,
  PanelRight2,
  PanelRight3,
  PanelRight4
} from './panel/index'
import { Banner } from './components/index'
import robot from '../dashboard/Robot/index.vue'
</script>

<style lang="scss" scoped>
.home-wrap {
  width: 100%;
  height: 100%;
  background: #00183c;
  padding: 40px;
  // display: flex;
  // flex-direction: column;
  color: #ffffff;

  .logo {
    display: block;
    width: 100%;
    height: 80px;
    background: #00224f;
    border-radius: 10px;
    margin-bottom: 24px;
  }
}

.home-con-wrap {
  height: 100%;
  width: 100%;
  flex: 1;
  display: grid;
  gap: 20px;
  grid-template-columns: 518px 1fr 518px;
  grid-template-rows: repeat(4, 23.2%);
  grid-auto-flow: column;
  grid-template-areas:
    'a b c'
    'a b c'
    'a b c'
    'a b c';
}

.left {
  grid-area: a;
  background: #00224f;
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;

  .left-item {
    flex: 1;
  }
}

.center {
  grid-area: b;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right {
  grid-area: c;
  background: #00224f;
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;

  .right-item {
    flex: 1;
  }
}

.robot {
  // grid-area: b2;
  padding: 0 24px;
  background: url('../../assets/images/robot-bg.png') no-repeat 0 0 / 100% 100%;
  border-radius: 18px;
  flex: 1;
  overflow: auto;
}

.banner {
  height: 170px;
  // background: #00224F;
  border-radius: 18px;
  // grid-area: b1;
  // align-items: center;
  // display: grid;
}
</style>
