<!--/*
* @Author:
* @Desc:
* @Date:
*/-->
<template>
  <div class="img-preview-wrap">
    <CardItem :item="item" :isview="true" class="card-item" />
    <div>
      <p>封面主题色</p>
      <p class="source">
        <i
          v-for="(d, i) in bgList" :key="i"
          class="source-item"
          :style="`background:${d}`"
          @click.stop="clickBg(i)"></i>
      </p>
      <p>透明度</p>
      <c-slider v-model="opacity" @change="opacityChange"></c-slider>
      <div class="selected-bg">
        <i :style="`background:${bgList[selectedIndex]}`"></i>
        <span>{{ opacity }}%</span>
      </div>
    </div>
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import CardItem from '@/views/template-app/components/card-item.vue'
export default {
  name: '',
  components: { CardItem },
  props: {
    item: {
      type: Object,
      default: () => ({
        packName: '应用名称',
        packVersion: 'v1.0.0',
        packSceneName: '场景标签',
        packDesc: '资源介绍信息',
        appStatus: 1
      })
    },
    img: [String]
  },
  data() {
    return {
      opacity: 100,
      selectedIndex: 0,
      bgList: [
        'linear-gradient(90deg, #0F205A 0%, rgba(15,32,90,0.05) 99%)',
        'linear-gradient(270deg, rgba(66,137,247,0.14) 0%, rgba(66,137,247,0.95) 100%)',
        'linear-gradient(270deg, rgba(16,43,121,0.02) 4%, #5C71FD 99%)',
        'linear-gradient(270deg, rgba(227,156,31,0.06) 0%, #FFA200 99%)'
      ]
    }
  },
  watch: {
    img: {
      handler(nv, ov) {
        if (nv !== ov) {
          this.coverImg(nv)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.cnangeImgMask()
  },
  methods: {
    init(initData) {
      if (!initData) return
      const data = JSON.parse(initData)
      this.opacity = data.opacity
      this.selectedIndex = data.index
      this.cnangeImgMask()
      this.coverImg()
    },
    opacityChange() {
      this.cnangeImgMask()
    },
    clickBg(i) {
      this.selectedIndex = i
      this.cnangeImgMask()
    },
    cnangeImgMask() {
      const style = []
      style.push(`background:${this.bgList[this.selectedIndex]};`)
      style.push(`opacity:${this.opacity / 100};`)
      document.querySelector('.img-filter').style = style.join('')
      this.emitData()
    },
    emitData() {
      const style = []
      style.push(`background:${this.bgList[this.selectedIndex]};`)
      style.push(`opacity:${this.opacity / 100};`)
      const obj = {
        path: this.img,
        opacity: this.opacity,
        index: this.selectedIndex,
        bgmask: this.bgList[this.selectedIndex],
        style: style.join('')
      }
      this.$emit('change', JSON.stringify(obj))
    },
    coverImg(path) {
      let style = ''
      if (path) {
        style = `background-image:url(${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/${path})`
      }
      const dom = document.querySelector('.img')
      if (dom) {
        document.querySelector('.img').style = style
        this.emitData()
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.img-preview-wrap {
  background: #F3F4FB;
  padding: 24px 20px;
  width: 540px;
  display: flex;
  line-height: 22px;
}
.source {
  margin-top: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  width: 160px;
  .source-item {
    width: 32px;
    height: 32px;
    border-radius: 2px;
    border: 2px solid #FFFFFF;
    cursor: pointer;
    &:first-child {
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        background: url(~@/assets/imgs/jian.svg);
        position: absolute;
        top: -10px;
        right: -10px;
      }
    }
  }
}
.selected-bg {
  padding-left: 8px;
  width: 71px;
  height: 30px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  background: #FFFFFF;
  font-size: 12px;
  color: #8A8A8A;
  i {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    border: 2px solid #FFFFFF;
    border-radius: 2px;
  }
}
.card-item {
  margin-right: 20px;
  position: relative;
  margin-bottom: 24px;
  flex-shrink: 0;
  width: 305px;
  height: 236px;
  background-color: white;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}
</style>
