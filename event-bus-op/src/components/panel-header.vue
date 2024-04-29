<template>
  <!-- 面板内容 begin-->
  <hl-col span="col-24" class="inline-title">
    <hl-group align="items-center items-middle" class="p-t-md p-b-md">
      <div class="panel-header-left">
        <hl-icon size="lg" class="m-r-xs">
          <svg viewBox="0 0 27 16" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" stroke-width="1" fill="#71b3f7" fill-rule="evenodd">
              <polygon points="23.6666667 0 27 0 19.3333333 16 16 16" />
              <polygon fill-opacity="0.7" points="15.6666667 0 19 0 11.3333333 16 8 16" />
              <polygon fill-opacity="0.4" points="7.66666667 0 11 0 3.33333333 16 5.69405634e-14 16" />
            </g>
          </svg>
        </hl-icon>
      </div>
      <h2 class="panel-title" style="font-size: var(--panel-title-font-size);">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
      <div class="panel-header-right">
        <slot name="action"></slot>
      </div>

    </hl-group>
  </hl-col>
  <!-- 面板内容 end-->
</template>

<script lang="ts" setup>
const props = defineProps({
  title: String
});
</script>

<style lang="scss" scoped>
.inline-title {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 2px solid #34435a;
  }
  &::after {
    content: "";
    position: absolute;
    right: 0;
    width: 24px;
    bottom: 0;
    border-top: 2px solid #dcf4ff;
  }
}
</style>
