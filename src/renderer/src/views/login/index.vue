<template>
  <div class="page page-login">
    <div class="login-page-inner">
      <p class="title">MD Video</p>
      <ElForm ref="loginForm" :model="formData" :rules="formRules" label-width="120px">
        <ElFormItem v-if="type === 'register'" prop="email" label="邮箱">
          <ElInput v-model="formData.email" autocomplete="off" placeholder="请输入邮箱">
            <template #prefix>
              <i class="iconfont icon-mail-copy"></i>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem v-if="type === 'register'" prop="username" label="用户名">
          <ElInput v-model="formData.username" name="userName" placeholder="请输入用户名">
            <template #prefix>
              <i class="iconfont icon-zhanghao"></i>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem v-if="type === 'login'" prop="loginName" label="用户名/邮箱">
          <ElInput
            v-model="formData.loginName"
            name="loginName"
            placeholder="请输入用户名或者邮箱登录"
          >
            <template #prefix>
              <i class="iconfont icon-zhanghao"></i>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem prop="password" label="密码">
          <ElInput
            v-model="formData.password"
            name="password"
            placeholder="请输入密码"
            type="password"
          >
            <template #prefix>
              <i class="iconfont icon-mima"></i>
            </template>
            <template #suffix>
              <i class="iconfont icon-yincangmima"></i>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem v-if="type === 'register'" prop="repassword" label="确认密码">
          <ElInput
            v-model="formData.repassword"
            name="repassword"
            placeholder="请再次输入密码"
            type="password"
          >
            <template #prefix>
              <i class="iconfont icon-mima"></i>
            </template>
            <template #suffix>
              <i class="iconfont icon-yincangmima"></i>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem>
          <ElButton v-loading="loading" class="btn-hover" type="primary" @click="doSubmit">{{
            type === 'login' ? '登 录' : '注 册'
          }}</ElButton>
        </ElFormItem>
      </ElForm>
      <div class="switch-do-type marginB20">
        <p class="" @click="switchType">
          <i class="iconfont icon-iconfontzhizuobiaozhun47"></i>
          <span>{{ type === 'login' ? '立即注册' : '马上登录' }}</span>
        </p>
      </div>
    </div>
    <div class="login-background">
      <loginBackground />
    </div>
  </div>
</template>

<script lang="ts" setup>
import loginBackground from './loginBack.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { axiosService } from '@renderer/service/axiosService';
import { useAppConfigStore } from '@renderer/store';
import { ElMessage, FormInstance } from 'element-plus';
const appConfigStore = useAppConfigStore();
const loading = ref(false);
const router = useRouter();
const type = ref('login');
const loginForm = ref<FormInstance>();
const formData = reactive({
  loginName: '',
  email: '',
  username: '',
  password: '',
  repassword: ''
});
const formRules = reactive({
  loginName: [{ required: true, message: '用户名/邮箱不能为空', trigger: 'blur' }],
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  repassword: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }]
});
onMounted(() => {});
const doSubmit = async () => {
  loginForm.value
    ?.validate()
    .then(async () => {
      const { email, password, username, loginName, repassword } = formData;

      if (type.value !== 'login' && repassword !== password) {
        ElMessage.warning('密码和确认密码不一致!');
        return;
      }
      loading.value = true;
      const url = type.value === 'login' ? '/auth/login' : '/auth/register';
      const response: any = await axiosService({
        url,
        method: 'post',
        data: {
          email,
          password,
          username,
          loginName
        }
      }).catch(() => (loading.value = false));
      const { data = {} } = response;

      if (data.access_token && data.userInfo) {
        const { email, username, speech = 0, totalSpeech = 0, voiceStr } = data.userInfo;
        appConfigStore.token = data.access_token;
        appConfigStore.userInfo = {
          email,
          username,
          speech,
          totalSpeech,
          voiceStr
        };
        router.push({ name: 'pageList' });
        loading.value = false;
        ElMessage.success(type.value === 'login' ? '登录成功!' : '注册成功，已为你自动登录!');
      }
      loading.value = false;
    })
    .catch((e) => console.error(e));
};

const switchType = () => {
  formData.email = '';
  formData.username = '';
  formData.password = '';
  formData.repassword = '';
  formData.loginName = '';
  if (type.value === 'login') {
    type.value = 'register';
  } else {
    type.value = 'login';
  }
};
</script>

<style lang="scss" scoped>
.page-login {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}
:deep(.el-form-item) {
  margin-bottom: 24px;
}
.page-login {
  height: 100%;
  width: 100%;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.login-page-inner {
  position: relative;
  z-index: 10;
  width: 460px;
  padding: 10px 20px;
  margin-top: -120px;
  border-radius: 4px;
  box-shadow: var(--el-box-shadow);
  .title {
    padding: 10px 0 30px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: var(--el-color-primary);
  }
  /**
      鼠标悬浮渐变
      */
  .btn-hover {
    cursor: pointer;
  }
}
.switch-do-type {
  font-size: 12px;
  text-align: right;
  color: var(--el-color-primary);
  cursor: pointer;
  p {
    display: inline-block;
  }
  i {
    font-size: 16px;
    font-weight: 600;
  }
  &:hover {
    color: var(--el-color-success);
  }
}
</style>
