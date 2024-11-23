<template>
  <div class="markdown-core">
    <KeepAlive> </KeepAlive>
    <MdPreview
      v-for="item in markdownList"
      :key="item.id"
      :id="'markdown-' + item.id"
      v-model="item.markdownDoc"
    ></MdPreview>
  </div>
</template>
<script lang="ts" setup>
import { MainWinSendToMarkdownWin, MarkdownWinSendToMainWin } from '@api/index';
import { MdPreview } from '@renderer/components/Markdown';
import { ref, onMounted, reactive, toRaw, nextTick } from 'vue';
import { useAppConfigStore } from '@renderer/store';
import { IGetStoreConfig } from '@api/store';
import { updateStoreConfig } from '@renderer/api/updateStoreConfig';
import { ats2json } from './core/ats2json';
import { EStatus, MarkdownProps } from '../markdown/core/MarkdownManager';
import { sleep } from '@renderer/utils';
const videoInfo = reactive({ width: 1920, height: 1080 });
const loading = ref(false);
const appConfigStore = useAppConfigStore();
const markdownList = ref<any>([]);
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
};
let loadingScene = false;
const listening = () => {
  window.on(MainWinSendToMarkdownWin, async (_event, args: any = {}) => {
    const { markdowns = [], projectInfo = {} } = args;
    videoInfo.height = projectInfo.height || 1080;
    videoInfo.width = projectInfo.width || 1920;
    if (loadingScene) {
      return;
    }
    markdownList.value = markdowns.map((d: any) => {
      const { id, markdownDoc } = d;
      const m = markdownList.value.find((i) => i.id === id);
      if (m && m.markdownDoc?.trim() === markdownDoc?.trim()) {
        return m;
      }
      return d;
    });
    await sleep(200);
    await nextTick(() => {});
    dealNode(markdowns);
  });
};
const dealNode = async (markdowns: MarkdownProps[]) => {
  loading.value = true;
  for (let i = 0; i < markdowns.length; i++) {
    const { markdownDoc, id } = markdowns[i];
    const node = document.querySelector(`#markdown-${id} .md-editor-preview`) as any;
    if (node) {
      const { elements, sceneConfig, errorMsgs } = await ats2json({
        text: markdownDoc,
        docDom: node,
        width: videoInfo.width,
        height: videoInfo.height
      });
      window.invoke(
        MarkdownWinSendToMainWin,
        JSON.stringify({
          id,
          elements,
          sceneConfig,
          errorMsgs,
          status: EStatus.SUCCESS
        })
      );
    }
  }
  loading.value = false;
  loadingScene = false;
};

onMounted(() => {
  listening();
  getAppConfigStore();
  appConfigStore.$subscribe(() => {
    updateStoreConfig({
      ...toRaw(appConfigStore.$state)
    });
  });
});
</script>
<style lang="scss" scoped>
.markdown-core {
  width: 100%;
  height: 100%;
  :deep(.md-editor-preview-wrapper) {
    width: 100%;
  }
  .md-editor-previewOnly {
    overflow-y: auto;
    height: 100%;
    :deep(pre),
    :deep(ol),
    :deep(ul) {
      position: absolute;
      width: auto;
    }
  }
}
</style>
