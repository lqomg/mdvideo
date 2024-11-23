<template>
  <div class="search-lib">
    <div class="header">
      <label>{{ allSourceMap[props.type] }}</label>
      <i class="close iconfont icon-close" @click="emits('close')"></i>
    </div>
    <ElInput v-model="keyword" placeholder="关键字查询" @keydown.enter="searchSource()">
      <template #append>
        <el-button :icon="Search" @click="searchSource()" />
      </template>
    </ElInput>
    <VideoTypes v-if="type !== 'audios'" v-model:vertical="vertical"></VideoTypes>
    <ElScrollbar
      v-if="resourceList.length > 0"
      v-loading="loading"
      class="list"
      height="calc(100% - 120px)"
      always
    >
      <div
        v-for="item in resourceList"
        :key="item._id"
        :class="type !== 'audios' ? 'item' : 'audio-item'"
      >
        <ElImage
          v-if="type !== 'audios'"
          :src="item.cover || item.filePath"
          :style="{ width: '126px', height: (!vertical ? 80 : 160) + 'px' }"
          fit="cover"
          @click="addSourceElement(item)"
        />
        <template v-else>
          <div class="icon" @click.stop="playAudio(item)">
            <i
              :class="[
                'iconfont',
                playAudioInfo.id === item._id ? 'icon-pause-circle' : 'icon-play-circle'
              ]"
            ></i>
          </div>
          <div class="info">
            <span class="name"> {{ item.fileName }}</span>
            <span class="duration">
              <ElTag size="small" effect="plain">类别：{{ item.className }}</ElTag>
              <ElTag size="small">时长: {{ item.duration?.toFixed?.(1) || 'N/A' }}s</ElTag>
            </span>
          </div>
        </template>
      </div>
    </ElScrollbar>
    <ElEmpty v-else></ElEmpty>
  </div>
</template>
<script lang="ts" setup>
import { IGetSources } from '@api/resource';
import { useEditorStore } from '@renderer/store';
import { onMounted, ref, watch, nextTick, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { allSourceMap } from './contanst';
import { storeToRefs } from 'pinia';
import { addSourceElement } from './utils';
import VideoTypes from './VideoTypes.vue';
const editorStore = useEditorStore();
const bgType = ref('bgs');
const props = defineProps<{ type: string; className: string }>();
const emits = defineEmits(['close']);
const { projectInfo } = storeToRefs(editorStore);
const vertical = ref(projectInfo.value.height > projectInfo.value.width);
const resourceList = ref<any>([]);
const keyword = ref('');
const loading = ref(true);
const playAudioInfo = reactive({
  id: '',
  src: ''
});
onMounted(async () => {
  const list = await getResouces();
  resourceList.value = list;
});

watch([vertical, bgType], () => {
  getResouces().then((list) => {
    resourceList.value = list;
  });
});
watch(
  () => props.className,
  (v) => {
    keyword.value = v || '';
  },
  { immediate: true }
);
const searchSource = () => {
  getResouces().then((list) => {
    resourceList.value = list;
  });
};
const getResouces = async () => {
  loading.value = true;
  try {
    const { data } = await window.invoke<IGetSources['req'], IGetSources['res']>('getSources', {
      payload: {
        vertical: vertical.value,
        keyword: keyword.value,
        type: props.type
      }
    });
    loading.value = false;
    return data.data;
  } catch (error) {
    console.error(error);
    loading.value = false;
    return [];
  }
};
const Audios = ref(new Audio());
const playAudio = (item: any) => {
  const { _id, filePath } = item;
  Audios.value.src = filePath;
  if (playAudioInfo.id === _id) {
    playAudioInfo.src = '';
    playAudioInfo.id = '';
    Audios.value.pause();
    return;
  }
  playAudioInfo.src = filePath;
  playAudioInfo.id = _id;
  Audios.value.load();
  nextTick(() => {
    Audios.value.play();
  });
};
</script>
<style lang="scss" scoped>
.search-lib {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: var(--el-bg-color);
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    color: var(--el-text-color-secondary);
    i {
      cursor: pointer;
    }
  }
  :deep(.el-input) {
    padding: 0 10px;
  }
  :deep(.v-types) {
    padding: 10px;
  }

  .list {
    margin-top: 10px;
    :deep(.el-scrollbar__view) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
    .item {
      flex: 1;
      margin: 10px 6px;
      // box-shadow: var(--el-box-shadow);
    }
  }
  .audio-item {
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;
    border-bottom: var(--el-border);
    padding: 6px 0;
    cursor: pointer;
    &:hover {
      background-color: var(--el-bg-color-page);
    }
    .className {
      position: absolute;
    }
    .icon {
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-grow: 1;
      color: var(--el-text-color-secondary);
      i {
        font-size: 28px;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      flex-grow: 1;
      .name {
        width: 200px;
        overflow: hidden;
        white-space: pre;
        display: inline-block;
        text-overflow: ellipsis;
        padding-bottom: 4px;
        color: var(--el-text-color-secondary);
      }
      .duration {
        :deep(.el-tag) {
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
