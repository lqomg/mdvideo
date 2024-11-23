<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="page-home">
    <div class="home-side-bar">
      <ElMenu :default-active="activePath" router>
        <ElMenuItem index="/home/page-list">
          <template #title>
            <i class="el-icon-mobile"></i>
            <span>工作台</span>
          </template>
        </ElMenuItem>

        <ElMenuItem index="/home/template">
          <template #title>
            <i class="el-icon-document"></i>
            <span>模板市场</span>
          </template>
        </ElMenuItem>

        <ElMenuItem index="/home/setting">
          <template #title>
            <i class="el-icon-document"></i>
            <span>配置/资源</span>
          </template>
        </ElMenuItem>

        <ElMenuItem disabled>
          <template #title>
            <i class="el-icon-document"></i>
            <span>创意模板(暂不支持)</span>
          </template>
        </ElMenuItem>
      </ElMenu>
      <ElDivider />
      <div class="code">
        <div class="info" v-html="appConfigStore.versionInfo || ''"></div>
        <ElImage
          v-if="appConfigStore.imageUrl"
          :src="`${appConfigStore.imageUrl}?t=${new Date().getTime()}`"
        >
          <template #error>
            <div class="image-slot">
              <ElImage :src="CodeImage" />
            </div>
          </template>
        </ElImage>
      </div>
    </div>
    <div class="clearfix my-page-list">
      <RouterView ew class="sub-page" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CodeImage from './code.jpg';
import { useAppConfigStore } from '@renderer/store';
const route = useRoute();
const activePath = computed(() => route.path);
const appConfigStore = useAppConfigStore();
</script>

<style lang="scss" scoped>
.page-home {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--el-bg-color);
  .code {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pre {
      margin: 0;
    }
    .info {
      width: 100%;
      padding: 0 20px;
      color: var(--el-text-color-secondary);
    }
  }
  .home-side-bar {
    width: 280px;
    background-color: var(--el-bg-color-page);
    border-right: var(--el-border);
    z-index: 2;
    :deep(.el-menu) {
      border-right: none;
      background-color: var(--el-bg-color-page);
    }
    :deep(.el-menu-item.is-active) {
      background-color: var(--el-bg-color);
    }
  }
  .my-page-list {
    flex: 1;
    height: 100%;
    .sub-page {
      height: 100%;
    }
  }
}
</style>
