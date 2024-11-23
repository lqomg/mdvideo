<template>
  <div class="editor">
    <div class="editor-left" :style="{ width: sideOpen ? '360px' : '72px' }">
      <div class="menu-list">
        <div
          v-for="(item, index) in sidebarMenus"
          :key="item.value"
          :class="{
            item: true,
            active: index === activeLibIndex
          }"
          @click="changeMenu(item, index)"
        >
          <i :class="item.icon + ' iconfont'"></i>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
      <div v-if="sideOpen" :class="'lib animate__animated animate__fadeIn'">
        <component :is="libCom"></component>
      </div>
      <!-- <div class="operation operation-lib" @click="() => (sideOpen = !sideOpen)">
        <i v-if="sideOpen" class="iconfont icon-arrow-left"></i>
        <i v-else class="iconfont icon-arrow-right"></i>
      </div> -->
    </div>
    <div class="editor-main"><Control></Control></div>
    <div
      class="editor-attr"
      :style="{ width: attrOpen ? '280px' : '0', padding: attrOpen ? '0 10px ' : '0px' }"
    >
      <div v-if="attrOpen" class="attr animate__animated animate__fadeIn"><Attr /></div>
<!-- 
      <div class="operation operation-attr" @click="() => (attrOpen = !attrOpen)">
        <i v-if="attrOpen" class="iconfont icon-arrow-right"></i>
        <i v-else class="iconfont icon-arrow-left"></i>
      </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from 'vue';
import Control from './control/index.vue';
import Attr from './attr/index.vue';
import { sidebarMenus, IMDSiderbarMenu } from './config';
import { useEditorStore } from '@renderer/store';
import { useRoute } from 'vue-router';
import { IGetPage } from '@api/page';
import { ElMessageBox } from 'element-plus';
import { useSideBarStore } from '@renderer/store/modules/sideBar';
import { storeToRefs } from 'pinia';
const sideBarStore = useSideBarStore();
const { sideOpen, attrOpen } = storeToRefs(sideBarStore);
const libCom = ref<IMDSiderbarMenu['com']>(sidebarMenus[0].com);
const activeLibIndex = ref(0);
const editorStore = useEditorStore();
const route = useRoute();

onMounted(async () => {
  const id = route.params.id as string;
  editorStore.activeElementUUID = '';
  if (id === 'markdown' || id === 'template') {
    console.log(editorStore);
  } else if (id && id !== 'none') {
    const data = await getPage(id);
    const { projectInfo, scenes } = data;
    if (projectInfo && scenes) {
      editorStore.id = id;
      editorStore.projectInfo = projectInfo;
      editorStore.projectScenes = scenes || [];
      editorStore.activeSceneUUID = scenes[0]?.uuid || '';
    } else {
      ElMessageBox.alert('未找到相关视频数据');
      editorStore.createNewProject();
    }
  } else {
    editorStore.createNewProject();
  }
  editorStore.curSceneDuration = 0;
  editorStore.clearHistoryCache();
});
const getPage = async (id: string) => {
  const { data } = await window.invoke<IGetPage['req'], IGetPage['res']>('getPage', {
    payload: {
      _id: id
    }
  });
  return data.data[0] || {};
};
const changeMenu = (item: IMDSiderbarMenu, index: number) => {
  libCom.value = item.com;
  activeLibIndex.value = index;
  editorStore.activeElementUUID = '';
  sideOpen.value = true;
};
</script>

<style scoped lang="scss">
.editor {
  display: flex;
  // height: calc(100vh - 42px);
  height: 100%;
  overflow-y: auto;
  .operation {
    position: absolute;
    z-index: 10;
    font-size: 20px;
    color: var(--el-color-primary);
    background: var(--el-fill-color-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 40%;
    height: 50px;
    border-radius: 3px;
    box-shadow: var(--el-box-shadow-lighter);
    &.operation-lib {
      right: -16px;
    }

    &.operation-attr {
      left: -16px;
      width: 14px;
    }
  }

  .editor-left {
    width: 360px;
    height: calc(100% - 30px);
    display: flex;
    flex-shrink: 0;
    position: relative;
    border-right: var(--el-border);
    .menu-list {
      width: 72px;
      background-color: var(--el-bg-color-page);
      color: var(--el-text-color-primary);
      height: 100%;
      .item {
        height: 70px;
        text-align: center;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        i.iconfont {
          font-size: 28px;
          color: var(--el-text-color-regular);
        }
        .label {
          color: var(--el-text-color-regular);
          font-size: 12px;
          padding-top: 2px;
        }
        &.active {
          i.iconfont {
            color: var(--el-color-primary);
          }
          .label {
            color: var(--el-color-primary);
          }
          background-color: var(--el-bg-color-overlay);
          // border-top-right-radius: 6px;
          // border-bottom-right-radius: 6px;
        }
      }
    }
    .lib {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    .operation-lib {
      right: -16px;
    }
  }
  .editor-main {
    flex-grow: 1;
    min-width: 200px;
  }
  .editor-attr {
    width: 280px;
    height: calc(100% - 48px);
    flex-shrink: 0;
    border-left: var(--el-border);
    position: relative;
    .attr {
      height: 100%;
    }
    :deep(h4) {
      margin-top: 8px;
      margin-bottom: 6px;
      font-size: small;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
