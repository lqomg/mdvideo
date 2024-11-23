<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="layout">
    <ElConfigProvider :locale="locale">
      <div class="header">
        <ElBreadcrumb separator="/">
          <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
          <ElBreadcrumbItem v-if="breadcrumbLabel">{{ breadcrumbLabel }}</ElBreadcrumbItem>
        </ElBreadcrumb>
        <div v-html="infoHtml"></div>
        <ElSpace>
          <TaskList />
          <!-- <div style="margin-left: 40px">
            <ElDropdown v-if="appConfigStore.token && appConfigStore.userInfo.email">
              <span type="success">
                {{ appConfigStore.userInfo.username }}<i class="iconfont icon-down"></i>
              </span>

              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem @click="router.push('/home/setting')">个人信息</ElDropdownItem>
                  <ElDropdownItem @click="loginOut()">退出登录</ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>

            <ElButton v-else type="text" @click="router.push({ name: 'login' })">
              登录/注册
            </ElButton>
          </div> -->
        </ElSpace>
      </div>
      <router-view class="layout-content" />
    </ElConfigProvider>
    <PlayVideo><div style="position: absolute; left: -100000000000px"></div></PlayVideo>
  </div>
</template>
<script setup lang="ts">
import { ElConfigProvider, ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import locale from 'element-plus/lib/locale/lang/zh-cn'; //中文
import PlayVideo from '@renderer/components/PlayVideo/index.vue';
import { computed, onMounted, ref, toRaw } from 'vue';
import { useAppConfigStore, useCommonStore } from '@renderer/store';
import { IGetStoreConfig } from '@api/store';
import { updateStoreConfig } from '@renderer/api/updateStoreConfig';
import { SendTaskList } from '@api/page';
import { useTaskStore } from '@renderer/store/modules/task';
import TaskList from './TaskList.vue';
import axiosService from '@renderer/service/axiosService';
const route = useRoute();
const appConfigStore = useAppConfigStore();
const taskStore = useTaskStore();
const commonStore = useCommonStore();

const breadcrumbLabel = computed(() => route.meta.label);
const getAppConfigStore = async () => {
  const { data } = await window.invoke<IGetStoreConfig['req'], IGetStoreConfig['res']>(
    'getStoreConfig',
    {
      payload: {}
    }
  );
  appConfigStore.$patch({
    ...data,
    aiVioces: data.aiVioces?.sort() || []
  });
  console.log(data.resourcePath)
  if (data.resourcePath) {
    commonStore.resourceBasePath = data.resourcePath;
  }
};

const infoHtml = ref('');

const getInfoHtml = async () => {
  const ip = await window.invoke('getIp', {});
  axiosService({
    url: '/get/info',
    method: 'post',
    data: {
      ip,
      userId: appConfigStore.userInfo.id
    }
  })
    .then((res: any) => {
      const data = res?.data || {};
      const html = data.html || '';
      const userId = data.userId || '';
      const allTotalSpeech = data.allTotalSpeech || 10000;
      appConfigStore.userInfo.allTotalSpeech = allTotalSpeech;
      appConfigStore.updateUrl = data.updateUrl || '';
      appConfigStore.imageUrl = data.imageUrl || '';
      appConfigStore.versionInfo = data.versionInfo || '';
      if (appConfigStore.userInfo.id !== userId) {
        appConfigStore.userInfo.id = userId;
      }
      infoHtml.value = html || '';
    })
    .catch((err) => {
      console.error(err);
    });
};

const loginOut = () => {
  appConfigStore.$reset();
  ElMessage.success('退出登录成功!');
};
const getTasks = () => {
  window.on?.(SendTaskList, (_event, tasks) => {
    taskStore.tasks = tasks;
    // console.log(tasks);
  });
};
onMounted(() => {
  getAppConfigStore();
  appConfigStore.$subscribe(() => {
    updateStoreConfig({
      ...toRaw(appConfigStore.$state)
    });
  });
  getInfoHtml();
  getTasks();
});
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color);
  .layout-content {
    height: calc(100% - 60px);
  }
  .header {
    padding: 10px;
    padding-right: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--el-border);
  }
  :deep(.el-badge__content.is-fixed) {
    transition: all 2s ease-in;
  }
}
</style>
