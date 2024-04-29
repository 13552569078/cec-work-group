<template>
  <div class="login-box">
    <div class="login-logo">
      <h1>{{ title }}</h1>
    </div>
    <el-form layout="horizontal" :model="formInline">
      <el-form-item>
        <el-input v-model="formInline.username" size="large" placeholder="账号">
          <template #prefix
            ><el-icon><user /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.password"
          size="large"
          type="password"
          placeholder="密码"
          autocomplete="new-password"
        >
          <template #prefix
            ><el-icon><lock /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          html-type="submit"
          size="large"
          style="width: 100%"
          v-loading="loading"
          block
          @click="handleSubmit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="Login">
import { ElMessage } from 'element-plus'
import { useUserStore } from '/@/store/modules/user'
import { User, Lock } from '@element-plus/icons-vue'
import md5 from 'js-md5'

// 系统名称
const title = computed(() => defaultSettings.title)

const formInline = reactive({
  username: '',
  password: ''
})

const store = useUserStore()
const router = useRouter()

// 登录
const loading = ref(false)
const handleSubmit = async () => {
  let { username, password } = formInline
  password = md5(password)
  console.log(password)
  if (username.trim() == '' || password.trim() == '') {
    return ElMessage.warning('用户名或密码不能为空！')
  }
  // if (
  //   username.trim() !== defaultSettings.userName ||
  //   password.trim() !== defaultSettings.password
  // ) {
  //   return ElMessage.warning('用户名或密码错误！')
  // }
  loading.value = true
  const params = {
    username,
    password
  }
  // params.password = md5(password)
  const { code, msg } = await store.login(params).finally(() => {
    loading.value = false
  })

  if (code === 0) {
    ElMessage.success('登录成功！')
    router.push('/')
  } else {
    ElMessage.error(msg || '登录失败')
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  display: flex;
  width: 100vw;
  height: 100vh;
  padding-top: 240px;
  background: url('/@/assets/images/common/login.svg');
  background-size: 100%;
  flex-direction: column;
  align-items: center;

  .login-logo {
    display: flex;
    margin-bottom: 30px;
    align-items: center;

    img {
      height: 48px;
    }

    h1 {
      margin: 0;
      margin-left: 10px;
    }
  }

  :deep() {
    .el-form {
      width: 30.3%;
      .el-input {
        height: 40px;
      }
      .el-col {
        width: 100%;
      }

      .el-form-item-label {
        padding-right: 6px;
      }
    }

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px white inset;
      height: 38px;
      line-height: 38px;
    }
  }
}
</style>
