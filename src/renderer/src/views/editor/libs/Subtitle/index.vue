<template>
  <div class="source-lib">
    <div class="source-add">
      <div class="lib" @click="editorStore.addElement('md-subtitle')">
        <i class="iconfont icon-05xiabiao"></i>
        <span>添加字幕</span>
      </div>
      <div class="lib" @click="editorStore.addElement('md-audio')">
        <i class="iconfont icon-audio"></i>
        <span>添加音频</span>
      </div>
    </div>
    <ElDivider />
    <div class="search">
      <ElInput
        v-model="keyword"
        :suffix-icon="Search"
        size="small"
        placeholder="输入关键字搜索，按Enter搜索"
        @keydown.enter="enterKeyword"
      >
        <template #prepend>
          <ElSelect v-model="className" style="width: 80px">
            <ElOption v-for="item in classNames" :key="item" :label="item" :value="item"></ElOption>
          </ElSelect>
        </template>
      </ElInput>
    </div>
    <div class="source-list">
      <ElScrollbar v-loading="loading" class="lib-list" always>
        <div
          v-for="item in resouceLists"
          :key="item._id"
          class="audio-item"
          @click="addAudio(item)"
        >
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
        </div>
      </ElScrollbar>
    </div>
    <EmptySource v-if="isEmpty(resouceLists)"></EmptySource>
  </div>
</template>
<script lang="ts" setup>
import { IGetSources } from '@api/resource';
import { useEditorStore } from '@renderer/store';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { groupBy, isEmpty } from 'lodash';
import EmptySource from '../EmptySource.vue';
const editorStore = useEditorStore();
const sourceType = ref('audios');
const resouceLists = ref<{ duration: number; [k: string]: any }[]>([]);
const classNames = ref<string[]>([]);
const keyword = ref('');
const className = ref('全部');
const loading = ref(false);
const playAudioInfo = reactive({
  id: '',
  src: ''
});
onMounted(async () => {
  const list = await getBgsouces();
  resouceLists.value = list;
  classNames.value = ['全部'].concat(Object.keys(groupBy(list, 'className')));
});
watch(
  () => [sourceType.value, className.value],
  () => {
    getBgsouces().then((list) => {
      resouceLists.value = list;
    });
  }
);
const enterKeyword = () => {
  getBgsouces().then((list) => {
    resouceLists.value = list;
  });
};
const addAudio = (item: any) => {
  editorStore.addElement(
    'md-audio',
    {},
    {
      src: item.filePath,
      totalDuration: item.duration
    }
  );
};
const getBgsouces = async () => {
  const { data } = await window.invoke<IGetSources['req'], IGetSources['res']>('getSources', {
    payload: {
      keyword: keyword.value,
      className: className.value === '全部' ? '' : className.value,
      type: sourceType.value
    }
  });
  return data.data;
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
.source-lib {
  height: 100%;
  .source-add {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    .lib {
      width: 46%;
      height: 100px;
      text-align: center;
      border: var(--el-border);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      &:hover {
        border-color: var(--el-color-primary);
      }
      i {
        font-size: 34px;
        color: var(--el-color-primary-light-3);
      }
      span {
        margin-top: 6px;
        color: var(--el-text-color-secondary);
        font-size: 13px;
      }
    }
  }

  .search {
    margin: 0 6px;
    margin-bottom: 6px;
    :deep(.el-input-group__prepend) {
      background-color: var(--el-fill-color-blank);
    }
  }

  .source-list {
    height: calc(100% - 150px);
    .bg-types {
      padding: 10px;
    }
    .v-types {
      padding: 10px;
    }
    .lib-list {
      margin-bottom: 10px;
      height: calc(100% - 66px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      color: var(--el-text-color-secondary);
      :deep(.el-scrollbar__wrap) {
        width: 100%;
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
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-shrink: 0;
          flex-grow: 1;
          i {
            font-size: 24px;
          }
        }
        .info {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          flex-grow: 1;
          .name {
            width: 220px;
            overflow: hidden;
            white-space: pre;
            display: inline-block;
            text-overflow: ellipsis;
            padding-bottom: 4px;
          }
          .duration {
            :deep(.el-tag) {
              margin-right: 6px;
            }
          }
        }
      }
    }
  }
}
</style>
