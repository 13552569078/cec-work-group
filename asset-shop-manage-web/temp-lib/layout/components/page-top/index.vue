<!--/*
* @Author: dingli
* @Desc: layout 头部
* @Date: 2021-8-20
*/-->
<template>
  <div class="navbar">
    <div class="navbar-left">
      <logo v-if="showLogo" class="logo" />
    </div>
    <tools :user-name="userName" :avatar="avatar" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tools from './tools'
import Logo from './logo.vue'

export default {
  components: {
    Tools,
    Logo
  },
  props: {
    showLogo: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'userName'])
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout', this.$route.fullPath)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.navbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $navbarHeight;
  background-image: url('../../../assets/frame/navbar-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-bottom: 1px solid #f4f4f4;
}
.navbar-left {
  display: flex;
  align-items: center;
}
</style>
