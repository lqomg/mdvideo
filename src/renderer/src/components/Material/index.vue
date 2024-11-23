<template>
  <div class="material">
    <div class="tools">
      <ElButton
        size="small"
        :type="display === 'partition' ? 'primary' : 'default'"
        @click="display = 'partition'"
      >
        <template #icon>
          <i class="iconfont icon-partition"></i>
        </template>
        列表</ElButton
      >
      <ElButton
        size="small"
        :type="display === 'appstore' ? 'primary' : 'default'"
        @click="display = 'appstore'"
      >
        <template #icon>
          <i class="iconfont icon-appstore"></i>
        </template>
        预览</ElButton
      >
    </div>
    <div class="bread-crumb">
      <ElBreadcrumb>
        <ElBreadcrumbItem
          v-for="item in breadcrumbs"
          :key="item.value"
          @click="goDirectores(item.value)"
          >{{ item.label }}</ElBreadcrumbItem
        >
      </ElBreadcrumb>
      <ElTooltip content="打开本地素材目录">
        <i class="iconfont icon-rank" @click="openFolder()"></i>
      </ElTooltip>
    </div>

    <div v-if="!isEmpty" v-loading="loading" element-loading-text="加载中..." class="material-list">
      <div
        v-for="item in directories"
        :key="item.name"
        class="dir"
        @click="goDirectores(item.path)"
      >
        <Icon name="wenjianjia1"></Icon>
        <span class="title">{{ item.name }}</span>
      </div>
      <template v-if="display === 'partition'">
        <div
          v-for="file in files"
          :key="file.name"
          class="file"
          @click="materialElementClick(file, directory)"
        >
          <Partition
            v-if="display === 'partition'"
            :ext="file.ext"
            :name="file.name"
            :path="file.path"
          ></Partition>
        </div>
      </template>
      <VueVirtualWaterfall
        v-else
        :items="files"
        :row-key="'path'"
        :virtual="true"
        :item-min-width="90"
        :gap="12"
        :calc-item-height="() => 120"
      >
        <template #default="{ item, index }">
          <div class="card" @click="materialElementClick(item, directory)">
            <ElImage v-if="isImage(item.ext) || isGif(item.ext)" :src="item.path" loading="lazy" />
            <video v-else-if="isVideo(item.ext)" :src="item.path"></video>
            <span v-else-if="isFont(item.ext)" class="font" :style="{ 'font-family': item.name }">
              <Icon :name="getIconByExt(item.ext)"></Icon>字体效果</span
            >
            <Icon v-else :name="getIconByExt(item.ext)"></Icon>
            <span class="title" :title="item.name">{{ item.name }}</span>
          </div>
        </template>
      </VueVirtualWaterfall>
    </div>
    <ElEmpty v-else description="没有相关资源，请在个人配置中选择资源路径">
      <ElButton type="primary" size="small" @click="() => router.push('/home/setting')"
        >个人配置</ElButton
      >
    </ElEmpty>
  </div>
</template>
<script lang="ts" setup>
import { IGetMaterial } from '@api/material';
import { useAppConfigStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { toRefs, ref, computed, watch, withDefaults, toRaw } from 'vue';
import VueVirtualWaterfall from '@renderer/components/VirtualWaterfall/index.vue';
import Partition from './partition.vue';
import { getIconByExt, isImage, isVideo, isFont, isGif } from './utils';
import { addMaterialElement } from './utils';
import { useRouter } from 'vue-router';

const router = useRouter();
const appConfigStore = useAppConfigStore();
const { resourcePath } = storeToRefs(appConfigStore);
const props = withDefaults(
  defineProps<{
    directory: string;
    defaultDisplayType: 'partition' | 'appstore';
    apply?: (v: any) => void | boolean;
  }>(),
  {
    directory: '',
    defaultDisplayType: 'partition'
  }
);
const isEmpty = computed(() => files.value.length === 0 && directories.value.length === 0);
const { directory, defaultDisplayType } = toRefs(props);
const emits = defineEmits<{
  (event: 'changeDirectory', v: string): void;
}>();
const files = ref<{ name: string; path: string; ext: string }[]>([]);
const directories = ref<{ name: string; path: string }[]>([]);
const display = ref('partition');
const loading = ref(false);
const openFolder = () => {
  window.invoke('openDirectory', props.directory);
};
const getMaterial = async (dir: string) => {
  dir = dir || resourcePath?.value;
  loading.value = true;
  const { data } = await window.invoke<IGetMaterial['req'], IGetMaterial['res']>('getMaterials', {
    payload: {
      directoryPath: dir || ''
    }
  });
  files.value = data.files;
  directories.value = data.directories;
  loading.value = false;
  return data;
};
const materialElementClick = async (item: any, directory: string) => {
  const c = props.apply && props.apply(toRaw(item));
  console.log(c);
  if (!c) {
    addMaterialElement(item, directory);
  }
};
const breadcrumbs = computed(() => {
  const dir = directory.value
    .replace(resourcePath?.value || '', '')
    .split(/\\|\/|\\\\/g)
    .filter((d) => d);
  const breadcrumbs: { label: string; value: string }[] = [];
  let path = resourcePath?.value || '';
  for (let i = 0; i < dir.length; i++) {
    const v = dir[i];
    path += '\\' + v;
    breadcrumbs.push({
      label: v,
      value: path
    });
  }
  breadcrumbs.unshift({ label: '资源包', value: resourcePath?.value || '' });
  return breadcrumbs;
});
watch(
  () => directory.value,
  (v) => {
    getMaterial(v);
  },
  {
    immediate: true
  }
);
watch(
  () => defaultDisplayType.value,
  (v) => (display.value = v),
  { immediate: true }
);

const goDirectores = (path: string) => {
  emits('changeDirectory', path);
};
</script>
<style lang="scss" scoped>
.material {
  height: 100%;
  & > div {
    padding: 0 6px;
  }

  .bread-crumb {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconfont {
      cursor: pointer;
    }
  }
  .el-breadcrumb__item {
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
  }
  :deep(.el-breadcrumb__separator) {
    margin: 0 4px;
  }

  .tools {
    margin: 8px 0;
    // padding-bottom: 6px;
    // border-bottom: 1px solid var(--el-border-color);
  }
  .el-breadcrumb {
    padding: 6px;
    padding-left: 0;
  }
  .material-list {
    padding: 0;
    margin-top: 2px;
    padding: 6px 0;
    border-top: 1px solid var(--el-border-color);
    overflow: auto;
    height: calc(100% - 80px);

    .dir,
    .file {
      cursor: pointer;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      font-size: 16px;
      padding: 0 12px;
      color: var(--el-text-color-primary);
      &:hover {
        background-color: var(--el-bg-color-page);
      }
      .title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
        padding-left: 6px;
        // direction: rtl;
        text-align: left;
      }
    }
    .card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid var(--el-border-color);
      padding: 4px;
      border-radius: 4px;
      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }
      cursor: pointer;
      .svg-icon {
        width: 90%;
        height: calc(100% - 30px);
      }
      .el-image {
        width: 100%;
        height: calc(100% - 20px);
      }
      video {
        width: 100%;
        height: calc(100% - 20px);
      }
      .font {
        width: 100%;
        height: calc(100% - 20px);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .svg-icon {
          width: 30px;
          height: 50px;
        }
      }
      .title {
        width: 100%;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: small;
        position: absolute;
        padding: 4px;
        bottom: 0px;
        text-align: center;
      }
    }
  }
}
</style>
