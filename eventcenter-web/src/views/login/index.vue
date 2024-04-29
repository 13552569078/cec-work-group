<template>
  <div class="login-container" :style="`background-image: url(${bgImg});`">
    <div class="center-wrapper" :style="`background-image: url(${centerImg});`">
      <div class="plat-title">
        <img :src="loginLogo" alt="">
      </div>
      <div class="login-wrapper">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <svg-icon slot="prefix" icon-class="账号" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="请输入密码"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="密码" />
              <svg-icon
                slot="suffix"
                :icon-class="passwordType === 'password' ? '隐藏' : '显示'"
                @click.stop="showPwd"
              />
            </el-input>
          </el-form-item>
          <div class="remember">
            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
          </div>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="handleLogin"
          >登 录</el-button>
        </el-form>
      </div>
    </div>
    <div class="companyinfo">{{ companyInfo }}</div>
    <!-- 角色切换 -->
    <select-org-role-dialog :visible.sync="showSelectOrgRole" :next-url="nextUrl" from="login" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import selectOrgRoleDialog from '@/components/page-wrapper/selectOrgRoleDialog.vue'
import bgImg from '@/assets/login/bg@2x.png'
import centerImg from '@/assets/login/bgCenter@2x.png'
import loginLogo from '@/assets/login/logo@2x.png'
/* eslint-disable */
export default {
  name: 'Login',
  components: {
    selectOrgRoleDialog
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      rememberPassword: false,
      showSelectOrgRole: false,
      nextUrl: ''
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
    async orgRoleList(nVal) {
      if (nVal.length < 1) {
        this.$router.push({ path: this.redirect || '/' });
      } else if (nVal.length == 1) {
        // 不用选择机构角色
        await this.$store.dispatch('user/switchOrgRole', nVal[0])
        this.$router.push({ path: this.redirect || '/' });
      } else {
        this.nextUrl = this.redirect || '/'
        this.showSelectOrgRole = true
      }
    }
  },
  computed: {
    ...mapGetters(['orgRoleList', 'systemConfiglist']),
    companyInfo() {
      return this.getSysConfigData('shzlCompanyInfo').value
    },
    bgImg() {
      return this.getSysConfigData('shzlBgImg').value || bgImg
    },
    centerImg() {
      return this.getSysConfigData('shzlCenterImg').value || centerImg
    },
    loginLogo() {
      return this.getSysConfigData('shzlLogo').value || loginLogo
    }
  },
  created() {
    if (this.getCookie('username')) {
      this.loginForm.username = window.atob(this.getCookie('username'));
      this.loginForm.password = window.atob(this.getCookie('password'));
      this.rememberPassword = true;
    }
    // this.$store.dispatch('user/systemConfiglist')
  },
  methods: {
    getSysConfigData(code) {
      return this.systemConfiglist.find(val => {
        if (val.code === code) {
          return val
        }
      }) || {}
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.rememberPassword
                ? this.saveCredential()
                : this.clearCredential();
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 保存登录信息
    saveCredential() {
      const exdate = new Date();
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * 7); // 默认保存一星期
      window.document.cookie = `username=${window.btoa(
        this.loginForm.username
      )};path=/;expires=${exdate.toGMTString()}`;
      window.document.cookie = `password=${window.btoa(
        this.loginForm.password
      )};path=/;expires=${exdate.toGMTString()}`;
    },
    clearCredential() {
      window.document.cookie = `username=;path=/;expires=-1`;
      window.document.cookie = `password=;path=/;expires=-1`;
    },
    // 获取Cookie
    getCookie(name) {
      let arg = name + '=';
      let alen = arg.length;
      let clen = document.cookie.length;
      let i = 0;
      while (i < clen) {
        let j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
          return this.getCookieVal(j);
        }
        i = document.cookie.indexOf(' ', i) + 1;
        if (i == 0) break;
      }
      return null;
    },
    // 获取Cookie
    getCookieVal(offset) {
      let endstr = document.cookie.indexOf(';', offset);
      if (endstr == -1) {
        endstr = document.cookie.length;
      }
      return unescape(document.cookie.substring(offset, endstr));
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .center-wrapper {
    width: 1290px;
    height: 480px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    .plat-title {
      width: 635px;
      height: 82px;
      margin-left: 100px;
      margin-top: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .login-wrapper {
      position: relative;
      width: 436px;
      height: 436px;
      display: flex;
      margin-right: 25px;
      margin-top: 25px;
      margin-left: auto;
      justify-content: center;
      align-items: center;
    }
    .login-form {
      width: 345px;
      margin-top: 40px;
      .el-input {
        height: 56px;
        .el-input__inner {
          height: 100%;
        }
      }
      .remember {
        .el-checkbox {
          color: inherit;
        }
      }
      ::v-deep {
        .el-form-item:nth-of-type(1) {
          margin-bottom: 40px;
        }
        .el-input--small .el-input__inner {
          height: 56px;
          padding: 0 40px;
          border-color: #36a4ff;
          border-radius: 4px;
        }
        .el-input__suffix,
        .el-input__prefix {
          line-height: 65px;
          background: none;
          border: none;
        }
        .el-input__prefix {
          left: 14px;
        }
        .el-input__suffix-inner {
          display: inline-block;
          height: 100%;
          padding-right: 8px;
          cursor: pointer;
        }
        .svg-icon {
          width: 20px;
          height: 20px;
        }
      }
    }
    .el-button {
      margin-top: 38px;
      height: 56px;
      font-weight: 600;
      color: #ffffff;
      font-size: 22px;
      border: none;
      background-image: linear-gradient(135deg, #78C2FF 0%, #36A4FF 100%);
      box-shadow: 10px 10px 36px 0 rgba(54,164,255,0.40);
      border-radius: 4px;
    }
  .companyinfo {
    position: absolute;
    bottom: 20px;
    left: 50%;
    width: 300px;
    margin-left: -150px;
    font-weight: bold;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
</style>
