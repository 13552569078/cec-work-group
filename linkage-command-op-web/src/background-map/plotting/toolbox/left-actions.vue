<template>
  <div class="left-actions">
    <div class="self-grow">
      <div class="top">
        <div class="action" @click="changeShape('draw_text')">
          <img src="@/assets/images/map/plotting/action-icons/text.png" />
          <span class="txt font-sm">文本</span>
        </div>
        <hl-popover popper-class="draw-tool-popper" trigger="hover" placement="left" :show-arrow="false">
          <template #reference>
            <div class="action">
              <img src="@/assets/images/map/plotting/action-icons/line.png" />
              <span class="txt font-sm">线条</span>
            </div>
          </template>
          <div class="item-list line-list">
            <div class="item" @click="changeShape('draw_line_string')">
              <img src="@/assets/images/map/plotting/lines/1.png" />
              <span class="font-sm">折线</span>
            </div>
            <div class="item" @click="changeShape('draw_curve')">
              <img src="@/assets/images/map/plotting/lines/2.png" />
              <span class="font-sm">曲线</span>
            </div>
            <div class="item" @click="changeShape('draw_arc')">
              <img src="@/assets/images/map/plotting/lines/3.png" />
              <span class="font-sm">弧线</span>
            </div>
          </div>
        </hl-popover>
        <hl-popover popper-class="draw-tool-popper" trigger="hover" placement="left" :show-arrow="false">
          <template #reference>
            <div class="action">
              <img src="@/assets/images/map/plotting/action-icons/area.png" />
              <span class="txt font-sm">面状</span>
            </div>
          </template>
          <div class="item-list area-list">
            <div class="item" @click="changeShape('draw_polygon')">
              <img src="@/assets/images/map/plotting/areas/1.png" />
              <span class="font-sm">多边形</span>
            </div>
            <div class="item" @click="changeShape('draw_circle')">
              <img src="@/assets/images/map/plotting/areas/2.png" />
              <span class="font-sm">圆圈</span>
            </div>
            <div class="item" @click="changeShape('draw_ellipse')">
              <img src="@/assets/images/map/plotting/areas/3.png" />
              <span class="font-sm">椭圆</span>
            </div>
            <div class="item" @click="changeShape('draw_rectangle')">
              <img src="@/assets/images/map/plotting/areas/4.png" />
              <span class="font-sm">矩形</span>
            </div>
            <div class="item" @click="changeShape('draw_sector')">
              <img src="@/assets/images/map/plotting/areas/5.png" />
              <span class="font-sm">扇形</span>
            </div>
            <div class="item" @click="changeShape('draw_lune')">
              <img src="@/assets/images/map/plotting/areas/6.png" />
              <span class="font-sm">圆弧</span>
            </div>
            <div class="item" @click="changeShape('draw_closed_curve')">
              <img src="@/assets/images/map/plotting/areas/7.png" />
              <span class="font-sm">闭合曲面</span>
            </div>
          </div>
        </hl-popover>
        <hl-popover popper-class="draw-tool-popper" trigger="hover" placement="left" :show-arrow="false">
          <template #reference>
            <div class="action">
              <img src="@/assets/images/map/plotting/action-icons/arrow.png" />
              <span class="txt font-sm">箭头</span>
            </div>
          </template>
          <div class="item-list arrow-list">
            <div class="item" @click="changeShape('draw_fine_arrow')">
              <img src="@/assets/images/map/plotting/arrows/1.png" />
              <span class="font-sm">细直箭头</span>
            </div>
            <div class="item" @click="changeShape('draw_assault_direction')">
              <img src="@/assets/images/map/plotting/arrows/2.png" />
              <span class="font-sm">突击方向</span>
            </div>
            <div class="item" @click="changeShape('draw_double_arrow')">
              <img src="@/assets/images/map/plotting/arrows/3.png" />
              <span class="font-sm">双箭头</span>
            </div>
            <div class="item" @click="changeShape('draw_attack_arrow')">
              <img src="@/assets/images/map/plotting/arrows/4.png" />
              <span class="font-sm">直箭头</span>
            </div>
            <div class="item" @click="changeShape('draw_tailed_attack_arrow')">
              <img src="@/assets/images/map/plotting/arrows/5.png" />
              <span class="font-sm">燕尾箭头</span>
            </div>
          </div>
        </hl-popover>
        <div class="action long" @click="changeShape('measure_distance')">
          <img src="@/assets/images/map/plotting/action-icons/measure-d.png" />
          <span class="txt font-sm">测量距离</span>
        </div>
        <div class="action long" @click="changeShape('measure_area')">
          <img src="@/assets/images/map/plotting/action-icons/measure-a.png" />
          <span class="txt font-sm">面积计算</span>
        </div>
      </div>
      <div class="line"></div>
      <div class="bottom">
        <div class="action long" @click="changeShape('draw_camera')">
          <img src="@/assets/images/map/plotting/action-icons/video.png" />
          <span class="txt font-sm">上传视频</span>
        </div>
        <div class="action long" @click="changeShape('set_common_view')">
          <img src="@/assets/images/map/plotting/action-icons/view.png" />
          <span class="txt font-sm">同步视野</span>
        </div>
        <div class="action" @click="changeShape('download_map')">
          <img src="@/assets/images/map/plotting/action-icons/download.png" />
          <span class="txt font-sm">下载</span>
        </div>
        <!-- <div class="action long" @click="stop">
          <img src="@/assets/images/map/plotting/action-icons/end.png" />
          <span class="txt font-sm">结束编辑</span>
        </div> -->
      </div>
    </div>
    <div class="collapse" @click="$emit('collapse-detail')">
      <hl-icon><TwoChevronsRight /></hl-icon>
      收起
    </div>
  </div>
</template>
<script lang="ts" setup>
import { HlMessageBox } from 'hongluan-ui';
import { useMapPlotting } from '@/hooks';
import { PlottingContext } from '../types';

const { stopPlotting, currentPlottingInfo } = useMapPlotting();

const changeShape = (shape: string) => {
  currentPlottingInfo.drawShape = shape;
  currentPlottingInfo.shapeCount++;
};

const stop = async() => {
  await HlMessageBox.confirm('确认结束编辑吗？');
  stopPlotting();
};
</script>
<style lang="scss" scoped>
.left-actions {
  width: calc(var(--xxs) * 20);
  border-right: 1px solid #2F5787;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top, .bottom {
    display: flex;
    flex-direction: column;
    // row-gap: calc(var(--xxs) * 4);
    justify-content: center;
    align-items: center;
    .action {
      padding: calc(var(--xxs) * 2) var(--px20);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      row-gap: var(--xxs);
      cursor: pointer;
      img {
        width: calc(var(--xxs) * 6);
        height: calc(var(--xxs) * 6);
      }
      &:hover {
        background-color: rgba(0, 158, 247, 0.16);
      }
      &.long {
        padding: calc(var(--xxs) * 2) var(--xxs);
      }
    }
  }
  .top {
    padding-top: calc(var(--xxs) * 4);
  }
  .line {
    width: 100%;
    height: 1px;
    background: #2F5787;
    margin-top: var(--px20);
    margin-bottom: var(--px20);
  }
  .collapse {
    height: calc(var(--xxs) * 11);
    border-top: 1px solid #2F5787;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.hl-popover.draw-tool-popper {
  --popover-padding-y: 0px;
  --popover-padding-x: 0px;
  width: calc(var(--xxs) * 30);
  background-color: rgba(16, 51, 91, 0.90);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: calc(var(--xxs) * 2);
  padding-bottom: calc(var(--xxs) * 2);
  padding-left: 0;
  padding-right: 0;
  .item-list {
    img {
      width: calc(var(--xxs) * 6);
      height: calc(var(--xxs) * 6);
    }
    .item {
      cursor: pointer;
      display: flex;
      column-gap: calc(var(--xxs) * 2);
      align-items: center;
      padding-left: calc(var(--xxs) * 3);
      height: calc(var(--xxs) * 8);
      &:hover {
        background-color: rgba(0, 158, 247, 0.16);
      }
    }
  }
}
</style>
