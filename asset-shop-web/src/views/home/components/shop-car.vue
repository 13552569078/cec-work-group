<script>
import ShopCarDetail from './shop-car-detail.vue'
export default {
  components: { ShopCarDetail },
  data() {
    return {
      show: false
    }
  },
  computed: {
    shopCarCount() {
      return this.$store.state?.shopCar?.shopCarCount || 0
    }
  },
  created() {
    this.$store.dispatch('shopCar/getCartInfo')
  },
  mounted() {
    // 解决图标跳动一下的问题
    setTimeout(() => {
      this.show = true
    }, 800)
  },
  methods: {
    showDialog() {
      this.$store.commit('shopCar/OPEN_CART_DIALOG')
    }
  }
}
</script>
<template>
  <div class="fixed top-2/4 right-[50px] z-10">
    <div v-if="show">
      <div class="absolute w-[18px] h-[18px] bg-[#FF4D4F] rounded-full z-50 top-[-3px] right-[-3px] text-center leading-[17px] text-white text-xs">
        {{ shopCarCount }}
      </div>
      <div class="relative bg-white w-11 h-11 rounded-full flex justify-center items-center shadow-shop-car" @click="showDialog">
        <img class="w-5 h-5" src="@/assets/imgs/shop-car.png">
      </div>
    </div>

    <ShopCarDetail />
  </div>
</template>
<style lang='scss' scoped>

</style>
